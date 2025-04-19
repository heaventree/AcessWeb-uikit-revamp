/*
  # Subscription and Monitoring Schema Update

  1. New Tables
    - subscription_features: Track feature limits and usage
    - subscription_usage: Track detailed usage history
    - monitoring_configs: Real-time monitoring settings
    - monitoring_alerts: Alert history and status
    - usage_alerts: Usage limit notifications

  2. Security
    - RLS enabled on all tables
    - User access limited to own data
    - Admin access for management
*/

DO $$ 
BEGIN

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS subscription_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  max_value integer,
  current_value integer NOT NULL DEFAULT 0,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(subscription_id, feature_key)
);

CREATE TABLE IF NOT EXISTS subscription_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  usage_count integer NOT NULL DEFAULT 0,
  usage_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(subscription_id, feature_key, usage_date)
);

CREATE TABLE IF NOT EXISTS monitoring_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE,
  url text NOT NULL,
  interval integer NOT NULL DEFAULT 300,
  enabled boolean NOT NULL DEFAULT true,
  last_check timestamptz,
  notification_threshold integer NOT NULL DEFAULT 80,
  failure_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS monitoring_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  monitor_id uuid REFERENCES monitoring_configs(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('error', 'warning', 'info')),
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  acknowledged_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS usage_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('warning', 'critical')),
  acknowledged boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscription_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_alerts ENABLE ROW LEVEL SECURITY;
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
  
  -- monitoring_configs policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own monitoring configs') THEN
    DROP POLICY "Users can manage own monitoring configs" ON monitoring_configs;
  END IF;
  
  -- monitoring_alerts policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own monitoring alerts') THEN
    DROP POLICY "Users can view own monitoring alerts" ON monitoring_alerts;
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
    subscription_id IN (
      SELECT id FROM subscriptions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "subscription_usage_view_own_20240320"
  ON subscription_usage
  FOR SELECT
  TO authenticated
  USING (
    subscription_id IN (
      SELECT id FROM subscriptions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "monitoring_configs_manage_own_20240320"
  ON monitoring_configs
  FOR ALL
  TO authenticated
  USING (
    subscription_id IN (
      SELECT id FROM subscriptions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "monitoring_alerts_view_own_20240320"
  ON monitoring_alerts
  FOR SELECT
  TO authenticated
  USING (
    monitor_id IN (
      SELECT id FROM monitoring_configs WHERE subscription_id IN (
        SELECT id FROM subscriptions WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "usage_alerts_view_own_20240320"
  ON usage_alerts
  FOR SELECT
  TO authenticated
  USING (
    subscription_id IN (
      SELECT id FROM subscriptions WHERE user_id = auth.uid()
    )
  );

-- Create functions
CREATE OR REPLACE FUNCTION check_subscription_status(p_subscription_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result jsonb;
  v_features jsonb;
  v_usage jsonb;
BEGIN
  -- Get subscription features
  SELECT jsonb_object_agg(
    feature_key,
    jsonb_build_object(
      'max_value', max_value,
      'current_value', current_value,
      'is_enabled', is_enabled
    )
  )
  INTO v_features
  FROM subscription_features
  WHERE subscription_id = p_subscription_id;

  -- Get usage statistics
  WITH daily_usage AS (
    SELECT
      feature_key,
      usage_count as daily
    FROM subscription_usage
    WHERE subscription_id = p_subscription_id
    AND usage_date = CURRENT_DATE
  ),
  monthly_usage AS (
    SELECT
      feature_key,
      SUM(usage_count) as monthly
    FROM subscription_usage
    WHERE subscription_id = p_subscription_id
    AND usage_date >= date_trunc('month', CURRENT_DATE)
    GROUP BY feature_key
  ),
  total_usage AS (
    SELECT
      feature_key,
      SUM(usage_count) as total
    FROM subscription_usage
    WHERE subscription_id = p_subscription_id
    GROUP BY feature_key
  )
  SELECT jsonb_object_agg(
    feature_key,
    jsonb_build_object(
      'daily', COALESCE(d.daily, 0),
      'monthly', COALESCE(m.monthly, 0),
      'total', COALESCE(t.total, 0)
    )
  )
  INTO v_usage
  FROM subscription_features sf
  LEFT JOIN daily_usage d USING (feature_key)
  LEFT JOIN monthly_usage m USING (feature_key)
  LEFT JOIN total_usage t USING (feature_key)
  WHERE subscription_id = p_subscription_id;

  -- Build result
  SELECT jsonb_build_object(
    'status', s.status,
    'plan', s.plan_id,
    'features', v_features,
    'usage', v_usage
  )
  INTO v_result
  FROM subscriptions s
  WHERE id = p_subscription_id;

  RETURN v_result;
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
AS $$
DECLARE
  v_feature subscription_features%ROWTYPE;
  v_new_value integer;
BEGIN
  -- Get feature
  SELECT *
  INTO v_feature
  FROM subscription_features
  WHERE subscription_id = p_subscription_id
  AND feature_key = p_feature_key;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Check if feature is enabled
  IF NOT v_feature.is_enabled THEN
    RETURN false;
  END IF;

  -- Calculate new value
  v_new_value := v_feature.current_value + p_increment;

  -- Check against limit
  IF v_feature.max_value IS NOT NULL AND v_new_value > v_feature.max_value THEN
    RETURN false;
  END IF;

  -- Update usage
  UPDATE subscription_features
  SET current_value = v_new_value,
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

  -- Check if we should create an alert
  IF v_feature.max_value IS NOT NULL THEN
    IF v_new_value >= v_feature.max_value THEN
      INSERT INTO usage_alerts (
        subscription_id,
        feature_key,
        message,
        type
      )
      VALUES (
        p_subscription_id,
        p_feature_key,
        'Usage limit reached for ' || p_feature_key,
        'critical'
      );
    ELSIF v_new_value >= (v_feature.max_value * 0.8) THEN
      INSERT INTO usage_alerts (
        subscription_id,
        feature_key,
        message,
        type
      )
      VALUES (
        p_subscription_id,
        p_feature_key,
        'Approaching usage limit for ' || p_feature_key,
        'warning'
      );
    END IF;
  END IF;

  RETURN true;
END;
$$;

END $$;