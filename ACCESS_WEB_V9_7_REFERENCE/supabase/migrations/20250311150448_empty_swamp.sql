/*
  # Subscription System Setup

  1. New Tables
    - subscriptions
    - subscription_features 
    - subscription_usage
    - usage_alerts

  2. Security
    - Enable RLS on all tables
    - Drop existing policies to avoid conflicts
    - Create new policies with unique names
    
  3. Functions
    - Drop and recreate functions to avoid return type conflicts
*/

-- Drop existing policies
DO $$ 
BEGIN
  -- Drop subscription policies
  DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
  DROP POLICY IF EXISTS "Users can update own subscription" ON subscriptions;
  
  -- Drop feature policies
  DROP POLICY IF EXISTS "Users can view own features" ON subscription_features;
  DROP POLICY IF EXISTS "Users can update own features" ON subscription_features;
  
  -- Drop usage policies
  DROP POLICY IF EXISTS "Users can view own usage" ON subscription_usage;
  DROP POLICY IF EXISTS "Users can insert own usage" ON subscription_usage;
  
  -- Drop alert policies
  DROP POLICY IF EXISTS "Users can view own alerts" ON usage_alerts;
  DROP POLICY IF EXISTS "Users can acknowledge own alerts" ON usage_alerts;
END $$;

-- Drop existing functions
DROP FUNCTION IF EXISTS check_subscription_status(uuid);
DROP FUNCTION IF EXISTS check_subscription_limit(uuid, text, integer);
DROP FUNCTION IF EXISTS increment_feature_usage(uuid, text, integer);
DROP FUNCTION IF EXISTS get_usage_alerts(uuid);
DROP FUNCTION IF EXISTS create_usage_alert(uuid, text);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id text NOT NULL CHECK (plan_id IN ('basic', 'professional', 'enterprise')),
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
  usage_count integer DEFAULT 1,
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

-- Create new policies with unique names
CREATE POLICY "subscription_view_own_20240311"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "subscription_update_own_20240311"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "subscription_features_view_own_20240311"
  ON subscription_features FOR SELECT
  TO authenticated
  USING (subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  ));

CREATE POLICY "subscription_features_update_own_20240311"
  ON subscription_features FOR UPDATE
  TO authenticated
  USING (subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  ));

CREATE POLICY "subscription_usage_view_own_20240311"
  ON subscription_usage FOR SELECT
  TO authenticated
  USING (subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  ));

CREATE POLICY "subscription_usage_insert_own_20240311"
  ON subscription_usage FOR INSERT
  TO authenticated
  WITH CHECK (subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  ));

CREATE POLICY "usage_alerts_view_own_20240311"
  ON usage_alerts FOR SELECT
  TO authenticated
  USING (subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  ));

CREATE POLICY "usage_alerts_update_own_20240311"
  ON usage_alerts FOR UPDATE
  TO authenticated
  USING (subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  ));

-- Create functions
CREATE FUNCTION check_subscription_status(p_subscription_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_result json;
BEGIN
  -- Get user_id from subscription
  SELECT user_id INTO v_user_id
  FROM subscriptions
  WHERE id = p_subscription_id;

  -- Verify user has access
  IF v_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Get subscription status and features
  SELECT json_build_object(
    'status', s.status,
    'plan', s.plan_id,
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
  ) INTO v_result
  FROM subscriptions s
  WHERE s.id = p_subscription_id;

  RETURN v_result;
END;
$$;

CREATE FUNCTION check_subscription_limit(
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
  v_user_id uuid;
  v_max_value integer;
  v_current_value integer;
  v_is_enabled boolean;
BEGIN
  -- Get user_id from subscription
  SELECT user_id INTO v_user_id
  FROM subscriptions
  WHERE id = p_subscription_id;

  -- Verify user has access
  IF v_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Get feature limits
  SELECT 
    max_value,
    current_value,
    is_enabled
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

CREATE FUNCTION increment_feature_usage(
  p_subscription_id uuid,
  p_feature_key text,
  p_increment integer DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get user_id from subscription
  SELECT user_id INTO v_user_id
  FROM subscriptions
  WHERE id = p_subscription_id;

  -- Verify user has access
  IF v_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Update current value
  UPDATE subscription_features
  SET current_value = current_value + p_increment
  WHERE subscription_id = p_subscription_id
  AND feature_key = p_feature_key;

  -- Record usage
  INSERT INTO subscription_usage (
    subscription_id,
    feature_key,
    usage_count,
    usage_date
  )
  VALUES (
    p_subscription_id,
    p_feature_key,
    p_increment,
    CURRENT_DATE
  )
  ON CONFLICT (subscription_id, feature_key, usage_date)
  DO UPDATE SET usage_count = subscription_usage.usage_count + p_increment;

  -- Check if we need to create alerts
  PERFORM create_usage_alert(p_subscription_id, p_feature_key);
END;
$$;

CREATE FUNCTION create_usage_alert(
  p_subscription_id uuid,
  p_feature_key text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_feature record;
  v_usage_percent numeric;
BEGIN
  -- Get feature info
  SELECT * INTO v_feature
  FROM subscription_features
  WHERE subscription_id = p_subscription_id
  AND feature_key = p_feature_key;

  -- Calculate usage percentage
  IF v_feature.max_value IS NOT NULL AND v_feature.max_value > 0 THEN
    v_usage_percent := (v_feature.current_value::numeric / v_feature.max_value::numeric) * 100;

    -- Create warning alert at 80%
    IF v_usage_percent >= 80 AND v_usage_percent < 90 THEN
      INSERT INTO usage_alerts (
        subscription_id,
        type,
        message
      )
      VALUES (
        p_subscription_id,
        'warning',
        format('You have used %s%% of your %s limit', round(v_usage_percent), p_feature_key)
      )
      ON CONFLICT DO NOTHING;
    END IF;

    -- Create critical alert at 90%
    IF v_usage_percent >= 90 THEN
      INSERT INTO usage_alerts (
        subscription_id,
        type,
        message
      )
      VALUES (
        p_subscription_id,
        'critical',
        format('You have used %s%% of your %s limit', round(v_usage_percent), p_feature_key)
      )
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
END;
$$;