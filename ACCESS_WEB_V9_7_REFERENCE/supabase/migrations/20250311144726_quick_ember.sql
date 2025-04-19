/*
  # Complete Database Schema

  1. Core Tables
    - Users and authentication
    - Subscriptions and billing
    - API and webhooks
    - Monitoring and alerts
    - Content management

  2. Security
    - RLS enabled on all tables
    - Granular access policies
    - Secure functions
*/

-- Drop existing policies to avoid conflicts
DO $$ 
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Users can manage own API keys" ON api_keys;
  DROP POLICY IF EXISTS "Users can manage own webhooks" ON webhooks;
  DROP POLICY IF EXISTS "Users can view own alerts" ON monitoring_alerts;
  DROP POLICY IF EXISTS "Users can manage own monitoring configs" ON monitoring_configs;
  DROP POLICY IF EXISTS "Users can view own subscription features" ON subscription_features;
  DROP POLICY IF EXISTS "Users can view own subscription usage" ON subscription_usage;
EXCEPTION 
  WHEN OTHERS THEN 
    NULL;
END $$;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  full_name text,
  role text DEFAULT 'user'::text CHECK (role = ANY (ARRAY['user'::text, 'admin'::text])),
  company text,
  subscription_tier text DEFAULT 'free'::text CHECK (subscription_tier = ANY (ARRAY['free'::text, 'basic'::text, 'professional'::text, 'enterprise'::text])),
  subscription_status text DEFAULT 'active'::text CHECK (subscription_status = ANY (ARRAY['active'::text, 'inactive'::text, 'pending'::text, 'cancelled'::text])),
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  plan_id text NOT NULL CHECK (plan_id = ANY (ARRAY['basic'::text, 'professional'::text, 'enterprise'::text])),
  status text NOT NULL CHECK (status = ANY (ARRAY['active'::text, 'past_due'::text, 'canceled'::text, 'incomplete'::text])),
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS subscription_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  usage_count integer DEFAULT 1,
  usage_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (subscription_id, feature_key, usage_date)
);

CREATE TABLE IF NOT EXISTS payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount integer NOT NULL,
  currency text DEFAULT 'usd'::text NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['succeeded'::text, 'failed'::text, 'pending'::text, 'refunded'::text])),
  payment_method text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  key text NOT NULL UNIQUE,
  scopes text[] DEFAULT '{}'::text[],
  last_used timestamptz,
  expires_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS api_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id uuid REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  method text NOT NULL,
  status_code integer NOT NULL,
  response_time integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  url text NOT NULL,
  events text[] DEFAULT '{}'::text[],
  secret text NOT NULL,
  is_active boolean DEFAULT true,
  last_triggered timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS monitoring_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  url text NOT NULL,
  interval integer NOT NULL CHECK (interval >= 60),
  enabled boolean DEFAULT true,
  last_check timestamptz,
  notification_threshold integer DEFAULT 3,
  failure_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS monitoring_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type = ANY (ARRAY['error'::text, 'warning'::text, 'info'::text])),
  message text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  acknowledged_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS article_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES article_categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  content text NOT NULL,
  author_id uuid REFERENCES users(id) ON DELETE SET NULL,
  status text DEFAULT 'draft'::text CHECK (status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])),
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
DO $$ 
BEGIN
  EXECUTE 'ALTER TABLE users ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE subscription_features ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE monitoring_configs ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE monitoring_alerts ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE articles ENABLE ROW LEVEL SECURITY';
END $$;

-- Create policies with unique names
DO $$ 
BEGIN
  -- Users
  EXECUTE 'CREATE POLICY "users_admin_manage_all_20240320" ON users FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "users_manage_own_20240320" ON users FOR ALL TO authenticated USING (auth.uid() = id)';

  -- API Keys
  EXECUTE 'CREATE POLICY "api_keys_admin_manage_all_20240320" ON api_keys FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "api_keys_user_manage_own_20240320" ON api_keys FOR ALL TO authenticated USING (user_id = auth.uid())';

  -- API Logs
  EXECUTE 'CREATE POLICY "api_logs_admin_manage_all_20240320" ON api_logs FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "api_logs_user_view_own_20240320" ON api_logs FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM api_keys WHERE api_keys.id = api_key_id AND api_keys.user_id = auth.uid()))';

  -- Webhooks
  EXECUTE 'CREATE POLICY "webhooks_admin_manage_all_20240320" ON webhooks FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "webhooks_user_manage_own_20240320" ON webhooks FOR ALL TO authenticated USING (user_id = auth.uid())';

  -- Monitoring
  EXECUTE 'CREATE POLICY "monitoring_configs_admin_manage_all_20240320" ON monitoring_configs FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "monitoring_configs_user_manage_own_20240320" ON monitoring_configs FOR ALL TO authenticated USING (user_id = auth.uid())';

  -- Alerts
  EXECUTE 'CREATE POLICY "monitoring_alerts_admin_manage_all_20240320" ON monitoring_alerts FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "monitoring_alerts_user_manage_own_20240320" ON monitoring_alerts FOR ALL TO authenticated USING (user_id = auth.uid())';

  -- Articles
  EXECUTE 'CREATE POLICY "articles_admin_manage_all_20240320" ON articles FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "articles_author_manage_own_20240320" ON articles FOR ALL TO authenticated USING ((auth.uid() = author_id) OR ((auth.jwt() ->> ''role''::text) = ''admin''::text))';
  EXECUTE 'CREATE POLICY "articles_public_view_published_20240320" ON articles FOR SELECT TO public USING (status = ''published''::text)';

  -- Categories
  EXECUTE 'CREATE POLICY "article_categories_admin_manage_20240320" ON article_categories FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "article_categories_public_view_20240320" ON article_categories FOR SELECT TO public USING (true)';

  -- Subscriptions
  EXECUTE 'CREATE POLICY "subscriptions_admin_manage_all_20240320" ON subscriptions FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "subscriptions_user_view_own_20240320" ON subscriptions FOR SELECT TO authenticated USING (user_id = auth.uid())';

  -- Features
  EXECUTE 'CREATE POLICY "subscription_features_admin_manage_all_20240320" ON subscription_features FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "subscription_features_user_view_own_20240320" ON subscription_features FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM subscriptions WHERE subscriptions.id = subscription_id AND subscriptions.user_id = auth.uid()))';

  -- Usage
  EXECUTE 'CREATE POLICY "subscription_usage_admin_manage_all_20240320" ON subscription_usage FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "subscription_usage_user_view_own_20240320" ON subscription_usage FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM subscriptions WHERE subscriptions.id = subscription_id AND subscriptions.user_id = auth.uid()))';

  -- Payments
  EXECUTE 'CREATE POLICY "payment_history_admin_manage_all_20240320" ON payment_history FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "payment_history_user_view_own_20240320" ON payment_history FOR SELECT TO authenticated USING (user_id = auth.uid())';
END $$;

-- Create functions
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

  RETURN true;
END;
$$;

-- Create triggers
CREATE OR REPLACE FUNCTION update_monitoring_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_monitoring_configs_updated_at
  BEFORE UPDATE ON monitoring_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_monitoring_configs_updated_at();