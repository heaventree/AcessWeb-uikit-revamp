/*
  # Subscription Features Schema Update

  1. New Tables
    - subscription_features: Track feature limits and usage
    - subscription_usage: Track usage metrics
    - usage_alerts: Monitor and alert on usage thresholds

  2. Security
    - RLS enabled on all tables
    - User access limited to own subscription data
    - Secure functions for usage tracking
*/

DO $$ 
BEGIN

-- Drop existing tables if they exist
DROP TABLE IF EXISTS usage_alerts;
DROP TABLE IF EXISTS subscription_usage;
DROP TABLE IF EXISTS subscription_features;

-- Create Subscription Features Table
CREATE TABLE subscription_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  max_value integer,
  current_value integer DEFAULT 0,
  is_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (subscription_id, feature_key)
);

-- Create Subscription Usage Table
CREATE TABLE subscription_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  usage_count integer DEFAULT 0,
  usage_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (subscription_id, feature_key, usage_date)
);

-- Create Usage Alerts Table
CREATE TABLE usage_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  message text NOT NULL,
  type text CHECK (type IN ('warning', 'critical')),
  acknowledged boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscription_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_alerts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $policy$ 
BEGIN
  -- subscription_features policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own subscription features') THEN
    DROP POLICY "Users can view own subscription features" ON subscription_features;
  END IF;

  -- subscription_usage policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own subscription usage') THEN
    DROP POLICY "Users can view own subscription usage" ON subscription_usage;
  END IF;

  -- usage_alerts policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own usage alerts') THEN
    DROP POLICY "Users can view own usage alerts" ON usage_alerts;
  END IF;
END $policy$;

-- Create new policies with unique names
CREATE POLICY "subscription_features_view_own_20240320"
  ON subscription_features
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM subscriptions s
      WHERE s.id = subscription_id
      AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "subscription_usage_view_own_20240320"
  ON subscription_usage
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM subscriptions s
      WHERE s.id = subscription_id
      AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "usage_alerts_view_own_20240320"
  ON usage_alerts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM subscriptions s
      WHERE s.id = subscription_id
      AND s.user_id = auth.uid()
    )
  );

-- Create or replace functions
CREATE OR REPLACE FUNCTION check_subscription_limit(
  p_subscription_id uuid,
  p_feature_key text,
  p_increment integer DEFAULT 1
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_feature subscription_features%ROWTYPE;
BEGIN
  -- Get feature limits
  SELECT * INTO v_feature
  FROM subscription_features
  WHERE subscription_id = p_subscription_id
  AND feature_key = p_feature_key;

  -- Check if feature exists and is enabled
  IF NOT FOUND OR NOT v_feature.is_enabled THEN
    RETURN false;
  END IF;

  -- Check if incrementing would exceed limit
  IF v_feature.max_value IS NOT NULL AND 
     v_feature.current_value + p_increment > v_feature.max_value THEN
    RETURN false;
  END IF;

  -- Update usage
  UPDATE subscription_features
  SET current_value = current_value + p_increment,
      updated_at = now()
  WHERE id = v_feature.id;

  -- Record usage
  INSERT INTO subscription_usage (
    subscription_id,
    feature_key,
    usage_count
  )
  VALUES (
    p_subscription_id,
    p_feature_key,
    p_increment
  )
  ON CONFLICT (subscription_id, feature_key, usage_date)
  DO UPDATE SET
    usage_count = subscription_usage.usage_count + p_increment,
    updated_at = now();

  -- Create alert if needed
  IF v_feature.max_value IS NOT NULL THEN
    IF v_feature.current_value >= v_feature.max_value THEN
      INSERT INTO usage_alerts (
        subscription_id,
        feature_key,
        message,
        type
      )
      VALUES (
        p_subscription_id,
        p_feature_key,
        format(
          'Usage limit reached for %s (%s/%s)',
          p_feature_key,
          v_feature.current_value,
          v_feature.max_value
        ),
        'critical'
      );
    ELSIF v_feature.current_value >= (v_feature.max_value * 0.8) THEN
      INSERT INTO usage_alerts (
        subscription_id,
        feature_key,
        message,
        type
      )
      VALUES (
        p_subscription_id,
        p_feature_key,
        format(
          'Approaching usage limit for %s (%s/%s)',
          p_feature_key,
          v_feature.current_value,
          v_feature.max_value
        ),
        'warning'
      );
    END IF;
  END IF;

  RETURN true;
END;
$$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscription_features_subscription_id 
  ON subscription_features(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_usage_subscription_id 
  ON subscription_usage(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_usage_date 
  ON subscription_usage(usage_date);
CREATE INDEX IF NOT EXISTS idx_usage_alerts_subscription_id 
  ON usage_alerts(subscription_id);
CREATE INDEX IF NOT EXISTS idx_usage_alerts_created_at 
  ON usage_alerts(created_at);

END $$;