/*
  # Create Subscription and Alerts System

  1. New Tables
    - subscriptions: Stores subscription records with plan info and status
    - subscription_features: Tracks feature limits and current usage
    - subscription_usage: Records detailed feature usage history
    - usage_alerts: Stores usage alerts and notifications

  2. Security
    - Enable RLS on all tables
    - Add policies for user access
    - Add policies for admin access
    - Add unique policy names with timestamps

  3. Functions
    - check_subscription_status: Get subscription status and usage
    - check_subscription_limit: Check feature usage limits
    - increment_feature_usage: Track feature usage
    - create_usage_alert: Generate usage alerts
*/

-- Drop existing objects if they exist
DO $$ 
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "subscription_user_select_20240311" ON subscriptions;
  DROP POLICY IF EXISTS "subscription_features_select_20240311" ON subscription_features;
  DROP POLICY IF EXISTS "subscription_usage_select_20240311" ON subscription_usage;
  DROP POLICY IF EXISTS "usage_alerts_select_20240311" ON usage_alerts;
  
  -- Drop existing functions
  DROP FUNCTION IF EXISTS check_subscription_status(uuid);
  DROP FUNCTION IF EXISTS check_subscription_limit(uuid, text, integer);
  DROP FUNCTION IF EXISTS increment_feature_usage(uuid, text, integer);
  DROP FUNCTION IF EXISTS create_usage_alert(uuid, text, text, text);
  
  -- Drop existing tables
  DROP TABLE IF EXISTS usage_alerts;
  DROP TABLE IF EXISTS subscription_usage;
  DROP TABLE IF EXISTS subscription_features;
  DROP TABLE IF EXISTS subscriptions;
END $$;

-- Create subscriptions table
CREATE TABLE subscriptions (
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

-- Create subscription_usage table
CREATE TABLE subscription_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  usage_count integer DEFAULT 1,
  usage_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create usage_alerts table
CREATE TABLE usage_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  type text NOT NULL CHECK (type IN ('warning', 'critical')),
  message text NOT NULL,
  acknowledged boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies with unique names
CREATE POLICY "subscription_user_select_20240311" 
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "subscription_features_select_20240311"
  ON subscription_features
  FOR SELECT
  TO authenticated
  USING (subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  ));

CREATE POLICY "subscription_usage_select_20240311"
  ON subscription_usage
  FOR SELECT
  TO authenticated
  USING (subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  ));

CREATE POLICY "usage_alerts_select_20240311"
  ON usage_alerts
  FOR SELECT
  TO authenticated
  USING (subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  ));

-- Create functions
CREATE OR REPLACE FUNCTION check_subscription_status(p_subscription_id uuid)
RETURNS json AS $$
DECLARE
  v_result json;
BEGIN
  SELECT json_build_object(
    'status', s.status,
    'plan', s.plan_id,
    'features', (
      SELECT json_object_agg(
        sf.feature_key,
        json_build_object(
          'max_value', sf.max_value,
          'current_value', sf.current_value,
          'is_enabled', sf.is_enabled
        )
      )
      FROM subscription_features sf
      WHERE sf.subscription_id = s.id
    ),
    'usage', (
      SELECT json_object_agg(
        su.feature_key,
        json_build_object(
          'daily', SUM(CASE WHEN su.usage_date = CURRENT_DATE THEN su.usage_count ELSE 0 END),
          'monthly', SUM(CASE WHEN su.usage_date >= date_trunc('month', CURRENT_DATE) THEN su.usage_count ELSE 0 END),
          'total', SUM(su.usage_count)
        )
      )
      FROM subscription_usage su
      WHERE su.subscription_id = s.id
      GROUP BY su.subscription_id
    )
  ) INTO v_result
  FROM subscriptions s
  WHERE s.id = p_subscription_id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION check_subscription_limit(
  p_subscription_id uuid,
  p_feature_key text,
  p_increment integer DEFAULT 1
)
RETURNS boolean AS $$
DECLARE
  v_max_value integer;
  v_current_value integer;
BEGIN
  SELECT max_value, current_value
  INTO v_max_value, v_current_value
  FROM subscription_features
  WHERE subscription_id = p_subscription_id
  AND feature_key = p_feature_key;

  -- If no max value, feature is unlimited
  IF v_max_value IS NULL THEN
    RETURN true;
  END IF;

  -- Check if increment would exceed limit
  RETURN (v_current_value + p_increment) <= v_max_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_feature_usage(
  p_subscription_id uuid,
  p_feature_key text,
  p_increment integer DEFAULT 1
)
RETURNS void AS $$
BEGIN
  -- Update current value
  UPDATE subscription_features
  SET current_value = current_value + p_increment
  WHERE subscription_id = p_subscription_id
  AND feature_key = p_feature_key;

  -- Record usage
  INSERT INTO subscription_usage (
    subscription_id,
    feature_key,
    usage_count
  ) VALUES (
    p_subscription_id,
    p_feature_key,
    p_increment
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION create_usage_alert(
  p_subscription_id uuid,
  p_feature_key text,
  p_type text,
  p_message text
)
RETURNS uuid AS $$
DECLARE
  v_alert_id uuid;
BEGIN
  INSERT INTO usage_alerts (
    subscription_id,
    feature_key,
    type,
    message
  ) VALUES (
    p_subscription_id,
    p_feature_key,
    p_type,
    p_message
  )
  RETURNING id INTO v_alert_id;

  RETURN v_alert_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;