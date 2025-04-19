/*
  # API System Tables Migration

  1. New Tables
    - api_keys: Store API keys for authentication
    - api_logs: Track API usage
    - webhooks: Manage webhook endpoints

  2. Security
    - RLS enabled on all tables
    - Policies for user and admin access
    - Secure functions for key management
*/

-- Create API Keys Table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key TEXT UNIQUE NOT NULL,
  scopes TEXT[] DEFAULT '{}',
  last_used TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create API Logs Table
CREATE TABLE IF NOT EXISTS api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  response_time INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Webhooks Table
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  events TEXT[] DEFAULT '{}',
  secret TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_triggered TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
CREATE INDEX IF NOT EXISTS idx_api_logs_api_key_id ON api_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON api_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_events ON webhooks USING gin (events);

-- Create RLS Policies
DO $$ BEGIN
  -- API Keys Policies
  CREATE POLICY "Users can manage own API keys"
    ON api_keys
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Admins can manage all API keys"
    ON api_keys
    FOR ALL
    TO authenticated
    USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
    WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

  -- API Logs Policies
  CREATE POLICY "Users can view own API logs"
    ON api_logs
    FOR SELECT
    TO authenticated
    USING (EXISTS (
      SELECT 1 FROM api_keys
      WHERE api_keys.id = api_logs.api_key_id
      AND api_keys.user_id = auth.uid()
    ));

  CREATE POLICY "Admins can view all API logs"
    ON api_logs
    FOR ALL
    TO authenticated
    USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

  -- Webhooks Policies
  CREATE POLICY "Users can manage own webhooks"
    ON webhooks
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Admins can manage all webhooks"
    ON webhooks
    FOR ALL
    TO authenticated
    USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
    WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;