/*
  # Subscription Management System

  1. New Tables
    - subscription_features
      - Tracks feature limits and usage for each subscription
      - Stores max values and current usage
      - Enables/disables features
    
    - subscription_usage
      - Records detailed usage history
      - Tracks daily/monthly/total usage
      - Enables usage analytics
    
    - notification_preferences
      - Stores user notification settings
      - Controls email, usage alerts, renewal reminders
      - Configures threshold warnings

  2. Security
    - Enable RLS on all tables
    - Add policies for user access
    - Protect sensitive data

  3. Functions
    - check_subscription_status: Get current subscription status
    - check_subscription_limit: Verify feature availability
    - record_feature_usage: Track feature usage
    - get_usage_stats: Calculate usage statistics
*/

-- Create subscription_features table
CREATE TABLE IF NOT EXISTS subscription_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  max_value integer,
  current_value integer NOT NULL DEFAULT 0,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(subscription_id, feature_key)
);

-- Create subscription_usage table
CREATE TABLE IF NOT EXISTS subscription_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  usage_count integer NOT NULL DEFAULT 1,
  usage_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email_notifications boolean NOT NULL DEFAULT true,
  usage_alerts boolean NOT NULL DEFAULT true,
  renewal_reminders boolean NOT NULL DEFAULT true,
  payment_notifications boolean NOT NULL DEFAULT true,
  threshold_warnings integer NOT NULL DEFAULT 80,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE subscription_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own subscription features"
  ON subscription_features
  FOR SELECT
  TO authenticated
  USING (
    subscription_id IN (
      SELECT id FROM subscriptions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own subscription usage"
  ON subscription_usage
  FOR SELECT
  TO authenticated
  USING (
    subscription_id IN (
      SELECT id FROM subscriptions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own notification preferences"
  ON notification_preferences
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create function to check subscription status
CREATE OR REPLACE FUNCTION check_subscription_status(p_subscription_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_status jsonb;
  v_features jsonb;
  v_usage jsonb;
BEGIN
  -- Get subscription status
  SELECT jsonb_build_object(
    'status', s.status,
    'plan', s.plan_id
  )
  INTO v_status
  FROM subscriptions s
  WHERE s.id = p_subscription_id;

  -- Get features
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

  -- Get usage stats
  WITH daily_usage AS (
    SELECT
      feature_key,
      SUM(usage_count) as daily
    FROM subscription_usage
    WHERE subscription_id = p_subscription_id
    AND usage_date = CURRENT_DATE
    GROUP BY feature_key
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
  FROM subscription_features f
  LEFT JOIN daily_usage d USING (feature_key)
  LEFT JOIN monthly_usage m USING (feature_key)
  LEFT JOIN total_usage t USING (feature_key)
  WHERE f.subscription_id = p_subscription_id;

  RETURN jsonb_build_object(
    'status', v_status,
    'features', COALESCE(v_features, '{}'::jsonb),
    'usage', COALESCE(v_usage, '{}'::jsonb)
  );
END;
$$;

-- Create function to check subscription limits
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
  v_feature subscription_features%ROWTYPE;
  v_subscription subscriptions%ROWTYPE;
BEGIN
  -- Get subscription
  SELECT * INTO v_subscription
  FROM subscriptions
  WHERE id = p_subscription_id;

  -- Check if subscription is active
  IF v_subscription.status != 'active' THEN
    RETURN false;
  END IF;

  -- Get feature
  SELECT * INTO v_feature
  FROM subscription_features
  WHERE subscription_id = p_subscription_id
  AND feature_key = p_feature_key;

  -- Check if feature exists and is enabled
  IF v_feature IS NULL OR NOT v_feature.is_enabled THEN
    RETURN false;
  END IF;

  -- Check if incrementing would exceed limit
  IF v_feature.max_value IS NOT NULL AND 
     v_feature.current_value + p_increment > v_feature.max_value THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$;

-- Create function to record feature usage
CREATE OR REPLACE FUNCTION record_feature_usage(
  p_subscription_id uuid,
  p_feature_key text,
  p_usage_count integer DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update current value
  UPDATE subscription_features
  SET current_value = current_value + p_usage_count,
      updated_at = now()
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
    p_usage_count
  );
END;
$$;

-- Create function to get usage stats
CREATE OR REPLACE FUNCTION get_usage_stats(p_subscription_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_stats jsonb;
BEGIN
  WITH daily_stats AS (
    SELECT
      feature_key,
      SUM(usage_count) as daily_usage,
      COUNT(DISTINCT usage_date) as days_used
    FROM subscription_usage
    WHERE subscription_id = p_subscription_id
    AND usage_date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY feature_key
  ),
  monthly_stats AS (
    SELECT
      feature_key,
      SUM(usage_count) as monthly_usage,
      COUNT(DISTINCT usage_date) as active_days
    FROM subscription_usage
    WHERE subscription_id = p_subscription_id
    AND usage_date >= date_trunc('month', CURRENT_DATE)
    GROUP BY feature_key
  )
  SELECT jsonb_object_agg(
    feature_key,
    jsonb_build_object(
      'daily_avg', ROUND(COALESCE(daily_usage / NULLIF(days_used, 0), 0), 2),
      'monthly_total', COALESCE(monthly_usage, 0),
      'active_days', COALESCE(active_days, 0)
    )
  )
  INTO v_stats
  FROM subscription_features f
  LEFT JOIN daily_stats d USING (feature_key)
  LEFT JOIN monthly_stats m USING (feature_key)
  WHERE f.subscription_id = p_subscription_id;

  RETURN COALESCE(v_stats, '{}'::jsonb);
END;
$$;