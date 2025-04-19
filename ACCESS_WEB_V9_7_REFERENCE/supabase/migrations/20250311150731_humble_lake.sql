/*
  # Subscription System

  1. Tables
    - subscriptions: User subscription records
    - subscription_features: Feature limits and usage tracking
    - subscription_usage: Usage history
    - usage_alerts: Usage alerts and notifications

  2. Security
    - Enable RLS on all tables
    - Drop existing policies to avoid conflicts
    - Create new policies with unique names

  3. Functions
    - Subscription status checking
    - Usage tracking
    - Alert generation
*/

-- Drop existing policies
DO $$ 
BEGIN
  -- Drop subscription policies
  DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
  DROP POLICY IF EXISTS "Users can view own subscription features" ON subscription_features;
  DROP POLICY IF EXISTS "Users can view own usage" ON subscription_usage;
  DROP POLICY IF EXISTS "Users can view own alerts" ON usage_alerts;
END $$;

-- Drop existing functions
DROP FUNCTION IF EXISTS check_subscription_status(uuid);
DROP FUNCTION IF EXISTS check_subscription_limit(uuid, text, integer);
DROP FUNCTION IF EXISTS increment_feature_usage(uuid, text, integer);
DROP FUNCTION IF EXISTS create_usage_alert(uuid, text, text, text);

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
  usage_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create usage_alerts table
CREATE TABLE IF NOT EXISTS usage_alerts (
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
CREATE FUNCTION check_subscription_status(p_subscription_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
  WHERE s.id = p_subscription_id
  AND s.user_id = auth.uid();

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
  v_max_value integer;
  v_current_value integer;
BEGIN
  SELECT max_value, current_value
  INTO v_max_value, v_current_value
  FROM subscription_features sf
  JOIN subscriptions s ON s.id = sf.subscription_id
  WHERE sf.subscription_id = p_subscription_id
  AND sf.feature_key = p_feature_key
  AND s.user_id = auth.uid();

  -- If no max value, feature is unlimited
  IF v_max_value IS NULL THEN
    RETURN true;
  END IF;

  -- Check if increment would exceed limit
  RETURN (v_current_value + p_increment) <= v_max_value;
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
  -- Verify user owns subscription
  IF NOT EXISTS (
    SELECT 1 FROM subscriptions
    WHERE id = p_subscription_id
    AND user_id = auth.uid()
  ) THEN
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
    usage_count
  ) VALUES (
    p_subscription_id,
    p_feature_key,
    p_increment
  );

  -- Create alerts if needed
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
  -- Verify user owns subscription
  IF NOT EXISTS (
    SELECT 1 FROM subscriptions
    WHERE id = p_subscription_id
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

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
        feature_key,
        type,
        message
      ) VALUES (
        p_subscription_id,
        p_feature_key,
        'warning',
        format('You have used %s%% of your %s limit', round(v_usage_percent), p_feature_key)
      )
      ON CONFLICT DO NOTHING;
    END IF;

    -- Create critical alert at 90%
    IF v_usage_percent >= 90 THEN
      INSERT INTO usage_alerts (
        subscription_id,
        feature_key,
        type,
        message
      ) VALUES (
        p_subscription_id,
        p_feature_key,
        'critical',
        format('You have used %s%% of your %s limit', round(v_usage_percent), p_feature_key)
      )
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
END;
$$;