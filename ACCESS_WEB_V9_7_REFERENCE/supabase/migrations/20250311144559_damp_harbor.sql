/*
  # Complete Database Schema

  This migration creates the entire database schema from scratch, including:
  - Core user and subscription management
  - API and webhook infrastructure  
  - Monitoring and alerts system
  - Content management
  - All necessary indexes and policies

  1. Tables
    - Core user management
    - Subscription system
    - API infrastructure
    - Monitoring system
    - Content management

  2. Security
    - Row Level Security (RLS) enabled on all tables
    - Granular access policies
    - Secure functions and triggers
*/

-- Drop existing tables if they exist
DO $$ 
BEGIN
  -- Drop tables in reverse dependency order
  DROP TABLE IF EXISTS realtime_alerts CASCADE;
  DROP TABLE IF EXISTS realtime_monitors CASCADE;
  DROP TABLE IF EXISTS monitoring_logs CASCADE;
  DROP TABLE IF EXISTS monitoring_alerts CASCADE;
  DROP TABLE IF EXISTS monitoring_configs CASCADE;
  DROP TABLE IF EXISTS subscription_usage CASCADE;
  DROP TABLE IF EXISTS subscription_features CASCADE;
  DROP TABLE IF EXISTS notification_preferences CASCADE;
  DROP TABLE IF EXISTS payment_history CASCADE;
  DROP TABLE IF EXISTS subscriptions CASCADE;
  DROP TABLE IF EXISTS api_logs CASCADE;
  DROP TABLE IF EXISTS api_keys CASCADE;
  DROP TABLE IF EXISTS webhooks CASCADE;
  DROP TABLE IF EXISTS articles CASCADE;
  DROP TABLE IF EXISTS article_categories CASCADE;
  DROP TABLE IF EXISTS users CASCADE;
EXCEPTION 
  WHEN OTHERS THEN 
    NULL;
END $$;

-- Create tables in dependency order
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

CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  email_notifications boolean DEFAULT true,
  usage_alerts boolean DEFAULT true,
  renewal_reminders boolean DEFAULT true,
  payment_notifications boolean DEFAULT true,
  threshold_warnings integer DEFAULT 80,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id)
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

CREATE TABLE IF NOT EXISTS monitoring_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id uuid REFERENCES monitoring_configs(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status = ANY (ARRAY['success'::text, 'error'::text, 'warning'::text])),
  issues_found integer DEFAULT 0,
  scan_duration integer,
  error_message text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS realtime_monitors (
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

CREATE TABLE IF NOT EXISTS realtime_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  monitor_id uuid REFERENCES realtime_monitors(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type = ANY (ARRAY['error'::text, 'warning'::text, 'info'::text])),
  message text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  acknowledged_at timestamptz
);

-- Enable RLS on all tables
DO $$ 
BEGIN
  EXECUTE 'ALTER TABLE users ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE articles ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE subscription_features ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE monitoring_configs ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE monitoring_alerts ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE monitoring_logs ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE realtime_monitors ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE realtime_alerts ENABLE ROW LEVEL SECURITY';
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
CREATE INDEX IF NOT EXISTS idx_api_logs_api_key_id ON api_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_articles_category_id ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_subscription_features_subscription_id ON subscription_features(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_usage_subscription_id ON subscription_usage(subscription_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_configs_user_id ON monitoring_configs(user_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_alerts_user_id ON monitoring_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_logs_config_id ON monitoring_logs(config_id);
CREATE INDEX IF NOT EXISTS idx_realtime_monitors_user_id ON realtime_monitors(user_id);
CREATE INDEX IF NOT EXISTS idx_realtime_alerts_monitor_id ON realtime_alerts(monitor_id);

-- Create RLS policies with unique names
DO $$ 
BEGIN
  -- Users
  EXECUTE 'CREATE POLICY "users_admin_manage_all_20240320" ON users FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "users_manage_own_20240320" ON users FOR ALL TO authenticated USING (auth.uid() = id)';

  -- Subscriptions
  EXECUTE 'CREATE POLICY "subscriptions_admin_manage_all_20240320" ON subscriptions FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "subscriptions_view_own_20240320" ON subscriptions FOR SELECT TO authenticated USING (user_id = auth.uid())';

  -- Payment History
  EXECUTE 'CREATE POLICY "payment_history_admin_manage_all_20240320" ON payment_history FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "payment_history_view_own_20240320" ON payment_history FOR SELECT TO authenticated USING (user_id = auth.uid())';

  -- API Keys
  EXECUTE 'CREATE POLICY "api_keys_admin_manage_all_20240320" ON api_keys FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "api_keys_user_manage_own_20240320" ON api_keys FOR ALL TO authenticated USING (user_id = auth.uid())';

  -- API Logs
  EXECUTE 'CREATE POLICY "api_logs_admin_manage_all_20240320" ON api_logs FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "api_logs_user_view_own_20240320" ON api_logs FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM api_keys WHERE api_keys.id = api_key_id AND api_keys.user_id = auth.uid()))';

  -- Webhooks
  EXECUTE 'CREATE POLICY "webhooks_admin_manage_all_20240320" ON webhooks FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "webhooks_user_manage_own_20240320" ON webhooks FOR ALL TO authenticated USING (user_id = auth.uid())';

  -- Article Categories
  EXECUTE 'CREATE POLICY "article_categories_admin_manage_20240320" ON article_categories FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "article_categories_public_read_20240320" ON article_categories FOR SELECT TO public USING (true)';

  -- Articles
  EXECUTE 'CREATE POLICY "articles_admin_manage_20240320" ON articles FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "articles_author_manage_own_20240320" ON articles FOR ALL TO authenticated USING ((auth.uid() = author_id) OR ((auth.jwt() ->> ''role''::text) = ''admin''::text))';
  EXECUTE 'CREATE POLICY "articles_public_read_published_20240320" ON articles FOR SELECT TO public USING (status = ''published''::text)';

  -- Subscription Features
  EXECUTE 'CREATE POLICY "subscription_features_admin_manage_all_20240320" ON subscription_features FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "subscription_features_view_own_20240320" ON subscription_features FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM subscriptions WHERE subscriptions.id = subscription_id AND subscriptions.user_id = auth.uid()))';

  -- Subscription Usage
  EXECUTE 'CREATE POLICY "subscription_usage_admin_manage_all_20240320" ON subscription_usage FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "subscription_usage_view_own_20240320" ON subscription_usage FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM subscriptions WHERE subscriptions.id = subscription_id AND subscriptions.user_id = auth.uid()))';

  -- Notification Preferences
  EXECUTE 'CREATE POLICY "notification_preferences_user_manage_own_20240320" ON notification_preferences FOR ALL TO authenticated USING (user_id = auth.uid())';

  -- Monitoring Configs
  EXECUTE 'CREATE POLICY "monitoring_configs_admin_manage_all_20240320" ON monitoring_configs FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "monitoring_configs_user_manage_own_20240320" ON monitoring_configs FOR ALL TO authenticated USING (user_id = auth.uid())';

  -- Monitoring Alerts
  EXECUTE 'CREATE POLICY "monitoring_alerts_admin_manage_all_20240320" ON monitoring_alerts FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "monitoring_alerts_user_manage_own_20240320" ON monitoring_alerts FOR ALL TO authenticated USING (user_id = auth.uid())';

  -- Monitoring Logs
  EXECUTE 'CREATE POLICY "monitoring_logs_admin_manage_all_20240320" ON monitoring_logs FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "monitoring_logs_user_view_own_20240320" ON monitoring_logs FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM monitoring_configs WHERE monitoring_configs.id = config_id AND monitoring_configs.user_id = auth.uid()))';

  -- Realtime Monitors
  EXECUTE 'CREATE POLICY "realtime_monitors_admin_manage_all_20240320" ON realtime_monitors FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "realtime_monitors_user_manage_own_20240320" ON realtime_monitors FOR ALL TO authenticated USING (user_id = auth.uid())';

  -- Realtime Alerts
  EXECUTE 'CREATE POLICY "realtime_alerts_admin_manage_all_20240320" ON realtime_alerts FOR ALL TO authenticated USING ((auth.jwt() ->> ''role''::text) = ''admin''::text)';
  EXECUTE 'CREATE POLICY "realtime_alerts_user_manage_own_20240320" ON realtime_alerts FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM realtime_monitors WHERE realtime_monitors.id = monitor_id AND realtime_monitors.user_id = auth.uid()))';
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

CREATE OR REPLACE FUNCTION update_realtime_monitors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_realtime_monitors_updated_at
  BEFORE UPDATE ON realtime_monitors
  FOR EACH ROW
  EXECUTE FUNCTION update_realtime_monitors_updated_at();