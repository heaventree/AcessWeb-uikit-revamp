/*
  # Subscription Features and Usage Tracking

  1. New Tables
    - `subscription_features`
      - Feature limits and current usage for subscriptions
      - Tracks max values, current values, and enabled status
      - Links to subscriptions table
    
    - `subscription_usage`
      - Daily usage tracking for subscription features
      - Stores historical usage data
      - Allows for usage analysis and reporting

  2. Security
    - Enable RLS on both tables
    - Add policies for user access
    - Add admin management policies

  3. Functions
    - check_subscription_limit: Validate and update feature usage
    - reset_subscription_usage: Reset monthly counters
    - check_subscription_status: Get detailed subscription status
*/

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
  UNIQUE(subscription_id, feature_key)
);

-- Create subscription_usage table
CREATE TABLE IF NOT EXISTS subscription_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  usage_count integer DEFAULT 0,
  usage_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(subscription_id, feature_key, usage_date)
);

-- Enable RLS
ALTER TABLE subscription_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;

-- Policies for subscription_features
CREATE POLICY "subscription_features_select_own_20240320"
  ON subscription_features
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM subscriptions
      WHERE id = subscription_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "subscription_features_admin_manage_20240320"
  ON subscription_features
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Policies for subscription_usage
CREATE POLICY "subscription_usage_select_own_20240320"
  ON subscription_usage
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM subscriptions
      WHERE id = subscription_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "subscription_usage_system_manage_20240320"
  ON subscription_usage
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'system')
  )
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'system')
  );

-- Function to check subscription limits
CREATE OR REPLACE FUNCTION check_subscription_limit(
  p_subscription_id uuid,
  p_feature_key text,
  p_increment integer DEFAULT 1
) RETURNS boolean AS $$
DECLARE
  v_max_value integer;
  v_current_value integer;
  v_subscription_status text;
BEGIN
  -- Check subscription status
  SELECT status INTO v_subscription_status
  FROM subscriptions
  WHERE id = p_subscription_id;

  IF v_subscription_status != 'active' THEN
    RETURN false;
  END IF;

  -- Get feature limits
  SELECT max_value, current_value 
  INTO v_max_value, v_current_value
  FROM subscription_features
  WHERE subscription_id = p_subscription_id
  AND feature_key = p_feature_key;

  -- Check if within limits
  IF v_max_value IS NULL OR v_current_value + p_increment <= v_max_value THEN
    -- Update usage
    INSERT INTO subscription_usage (
      subscription_id,
      feature_key,
      usage_count
    ) VALUES (
      p_subscription_id,
      p_feature_key,
      p_increment
    )
    ON CONFLICT (subscription_id, feature_key, usage_date)
    DO UPDATE SET
      usage_count = subscription_usage.usage_count + p_increment,
      updated_at = now();

    -- Update current value
    UPDATE subscription_features
    SET current_value = current_value + p_increment,
        updated_at = now()
    WHERE subscription_id = p_subscription_id
    AND feature_key = p_feature_key;

    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset usage counters
CREATE OR REPLACE FUNCTION reset_subscription_usage() RETURNS void AS $$
BEGIN
  -- Reset current values
  UPDATE subscription_features
  SET current_value = 0,
      updated_at = now()
  WHERE feature_key IN ('monthly_scans', 'monthly_api_calls');

  -- Archive usage data older than 12 months
  DELETE FROM subscription_usage
  WHERE usage_date < CURRENT_DATE - INTERVAL '12 months';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check subscription status
CREATE OR REPLACE FUNCTION check_subscription_status(
  p_subscription_id uuid
) RETURNS jsonb AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'status', s.status,
    'plan', s.plan_id,
    'features', (
      SELECT jsonb_object_agg(
        sf.feature_key,
        jsonb_build_object(
          'max_value', sf.max_value,
          'current_value', sf.current_value,
          'is_enabled', sf.is_enabled
        )
      )
      FROM subscription_features sf
      WHERE sf.subscription_id = s.id
    ),
    'usage', (
      SELECT jsonb_object_agg(
        su.feature_key,
        jsonb_build_object(
          'daily', SUM(CASE WHEN su.usage_date = CURRENT_DATE THEN su.usage_count ELSE 0 END),
          'monthly', SUM(CASE WHEN su.usage_date >= date_trunc('month', CURRENT_DATE) THEN su.usage_count ELSE 0 END),
          'total', SUM(su.usage_count)
        )
      )
      FROM subscription_usage su
      WHERE su.subscription_id = s.id
    )
  ) INTO v_result
  FROM subscriptions s
  WHERE s.id = p_subscription_id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;