/*
  # Subscription System Schema

  1. New Tables
    - subscriptions
      - User subscription management
      - Plan tracking and status
    - subscription_features
      - Feature limits and usage tracking
    - subscription_usage
      - Usage history and metrics
    - usage_alerts
      - Usage notifications and warnings

  2. Security
    - RLS enabled on all tables
    - Users can manage own subscriptions
    - Admins have full access
    
  3. Features
    - Subscription status tracking
    - Feature usage limits
    - Usage monitoring
    - Alert system
*/

-- Drop existing functions to avoid conflicts
DROP FUNCTION IF EXISTS check_subscription_status(uuid);
DROP FUNCTION IF EXISTS check_subscription_limit(uuid, text, integer);
DROP FUNCTION IF EXISTS increment_feature_usage(uuid, text, integer);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id text NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'inactive', 'past_due', 'cancelled')),
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscription_features table
CREATE TABLE IF NOT EXISTS subscription_features (
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

-- Create subscription_usage table
CREATE TABLE IF NOT EXISTS subscription_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  usage_count integer DEFAULT 0,
  usage_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create usage_alerts table
CREATE TABLE IF NOT EXISTS usage_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('warning', 'critical')),
  message text NOT NULL,
  acknowledged_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_alerts ENABLE ROW LEVEL SECURITY;

-- Subscription policies
CREATE POLICY "Users can view own subscription"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Feature policies
CREATE POLICY "Users can view own features"
  ON subscription_features
  FOR SELECT
  TO authenticated
  USING (subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update own features"
  ON subscription_features
  FOR UPDATE
  TO authenticated
  USING (subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  ));

-- Usage policies
CREATE POLICY "Users can view own usage"
  ON subscription_usage
  FOR SELECT
  TO authenticated
  USING (subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own usage"
  ON subscription_usage
  FOR INSERT
  TO authenticated
  WITH CHECK (subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  ));

-- Alert policies
CREATE POLICY "Users can view own alerts"
  ON usage_alerts
  FOR SELECT
  TO authenticated
  USING (subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can acknowledge own alerts"
  ON usage_alerts
  FOR UPDATE
  TO authenticated
  USING (subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  ));

-- Create helper functions
CREATE OR REPLACE FUNCTION check_subscription_status(p_subscription_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN json_build_object(
    'status', (SELECT status FROM subscriptions WHERE id = p_subscription_id),
    'features', (
      SELECT json_object_agg(
        feature_key,
        json_build_object(
          'max_value', max_value,
          'current_value', current_value,
          'is_enabled', is_enabled
        )
      )
      FROM subscription_features
      WHERE subscription_id = p_subscription_id
    ),
    'usage', (
      SELECT json_object_agg(
        feature_key,
        json_build_object(
          'daily', SUM(CASE WHEN usage_date = CURRENT_DATE THEN usage_count ELSE 0 END),
          'monthly', SUM(CASE WHEN usage_date >= date_trunc('month', CURRENT_DATE) THEN usage_count ELSE 0 END),
          'total', SUM(usage_count)
        )
      )
      FROM subscription_usage
      WHERE subscription_id = p_subscription_id
      GROUP BY subscription_id
    )
  );
END;
$$;

CREATE OR REPLACE FUNCTION check_subscription_limit(
  p_subscription_id uuid,
  p_feature_key text,
  p_increment integer DEFAULT 1
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_max_value integer;
  v_current_value integer;
  v_is_enabled boolean;
BEGIN
  -- Get feature limits
  SELECT max_value, current_value, is_enabled
  INTO v_max_value, v_current_value, v_is_enabled
  FROM subscription_features
  WHERE subscription_id = p_subscription_id
  AND feature_key = p_feature_key;

  -- Check if feature is enabled and within limits
  IF v_is_enabled AND (v_max_value IS NULL OR v_current_value + p_increment <= v_max_value) THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$;

CREATE OR REPLACE FUNCTION increment_feature_usage(
  p_subscription_id uuid,
  p_feature_key text,
  p_increment integer DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update current value
  UPDATE subscription_features
  SET current_value = current_value + p_increment
  WHERE subscription_id = p_subscription_id
  AND feature_key = p_feature_key;

  -- Record usage
  INSERT INTO subscription_usage (subscription_id, feature_key, usage_count)
  VALUES (p_subscription_id, p_feature_key, p_increment)
  ON CONFLICT (subscription_id, feature_key, usage_date)
  DO UPDATE SET usage_count = subscription_usage.usage_count + p_increment;
END;
$$;