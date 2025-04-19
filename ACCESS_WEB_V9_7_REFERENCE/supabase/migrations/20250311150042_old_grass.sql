/*
  # Subscription System Migration
  
  1. Tables
    - subscriptions: Manage user subscriptions and plans
    - subscription_features: Track feature limits and usage
    - subscription_usage: Record usage history
    - usage_alerts: Handle usage notifications
    
  2. Functions
    - Drops existing functions first to avoid conflicts
    - Recreates with proper security and error handling
    
  3. Security
    - RLS policies for user data isolation
    - Secure function execution
*/

-- Drop existing functions to avoid conflicts
DROP FUNCTION IF EXISTS check_subscription_status(uuid);
DROP FUNCTION IF EXISTS check_subscription_limit(uuid, text, integer);
DROP FUNCTION IF EXISTS increment_feature_usage(uuid, text, integer);

-- Drop existing tables if they exist
DROP TABLE IF EXISTS usage_alerts CASCADE;
DROP TABLE IF EXISTS subscription_usage CASCADE;
DROP TABLE IF EXISTS subscription_features CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;

-- Create subscriptions table
CREATE TABLE subscriptions (
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
  type text NOT NULL CHECK (type IN ('warning', 'critical')),
  message text NOT NULL,
  acknowledged_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscription_features_subscription_id ON subscription_features(subscription_id);
CREATE INDEX idx_subscription_usage_subscription_id ON subscription_usage(subscription_id);
CREATE INDEX idx_usage_alerts_subscription_id ON usage_alerts(subscription_id);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own features"
  ON subscription_features FOR SELECT
  TO authenticated
  USING (subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update own features"
  ON subscription_features FOR UPDATE
  TO authenticated
  USING (subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view own usage"
  ON subscription_usage FOR SELECT
  TO authenticated
  USING (subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own usage"
  ON subscription_usage FOR INSERT
  TO authenticated
  WITH CHECK (subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view own alerts"
  ON usage_alerts FOR SELECT
  TO authenticated
  USING (subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can acknowledge own alerts"
  ON usage_alerts FOR UPDATE
  TO authenticated
  USING (subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  ));

-- Create Functions
CREATE FUNCTION check_subscription_status(p_subscription_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT 
    jsonb_build_object(
      'status', s.status,
      'features', COALESCE(f.features, '{}'::jsonb),
      'usage', COALESCE(u.usage, '{}'::jsonb)
    )
  INTO v_result
  FROM subscriptions s
  LEFT JOIN LATERAL (
    SELECT jsonb_object_agg(
      feature_key,
      jsonb_build_object(
        'max_value', max_value,
        'current_value', current_value,
        'is_enabled', is_enabled
      )
    ) AS features
    FROM subscription_features
    WHERE subscription_id = p_subscription_id
  ) f ON true
  LEFT JOIN LATERAL (
    SELECT jsonb_object_agg(
      feature_key,
      jsonb_build_object(
        'daily', SUM(CASE WHEN usage_date = CURRENT_DATE THEN usage_count ELSE 0 END),
        'monthly', SUM(CASE WHEN usage_date >= date_trunc('month', CURRENT_DATE) THEN usage_count ELSE 0 END),
        'total', SUM(usage_count)
      )
    ) AS usage
    FROM subscription_usage
    WHERE subscription_id = p_subscription_id
    GROUP BY subscription_id
  ) u ON true
  WHERE s.id = p_subscription_id;

  RETURN COALESCE(v_result, '{}'::jsonb);
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
  v_max_value integer;
  v_current_value integer;
  v_is_enabled boolean;
BEGIN
  SELECT max_value, current_value, is_enabled
  INTO v_max_value, v_current_value, v_is_enabled
  FROM subscription_features
  WHERE subscription_id = p_subscription_id
  AND feature_key = p_feature_key;

  RETURN v_is_enabled AND (v_max_value IS NULL OR v_current_value + p_increment <= v_max_value);
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
BEGIN
  -- Update current value
  UPDATE subscription_features
  SET 
    current_value = current_value + p_increment,
    updated_at = now()
  WHERE subscription_id = p_subscription_id
  AND feature_key = p_feature_key;

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
END;
$$;