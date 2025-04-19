/*
  # API System Tables Migration V2

  1. New Tables
    - api_keys: Store API keys for authentication
      - id: UUID primary key
      - user_id: References auth.users
      - name: Key name/description
      - key: Unique API key string
      - scopes: Array of permitted scopes
      - last_used: Last usage timestamp
      - expires_at: Expiration date
      - is_active: Key status
      - created_at: Creation timestamp
      - updated_at: Last update timestamp

    - api_logs: Track API usage
      - id: UUID primary key
      - api_key_id: References api_keys
      - endpoint: Called endpoint
      - method: HTTP method
      - status_code: Response status
      - response_time: Request duration
      - created_at: Log timestamp

    - webhooks: Manage webhook endpoints
      - id: UUID primary key
      - user_id: References auth.users
      - url: Webhook endpoint URL
      - events: Array of event types
      - secret: Webhook secret
      - is_active: Webhook status
      - last_triggered: Last trigger timestamp
      - created_at: Creation timestamp
      - updated_at: Last update timestamp

  2. Security
    - RLS enabled on all tables
    - Policies for user and admin access
    - Secure indexes for performance
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS api_logs;
DROP TABLE IF EXISTS webhooks;
DROP TABLE IF EXISTS api_keys;

-- Create API Keys Table
CREATE TABLE api_keys (
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
CREATE TABLE api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  response_time INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Webhooks Table
CREATE TABLE webhooks (
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
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key ON api_keys(key);
CREATE INDEX idx_api_logs_api_key_id ON api_logs(api_key_id);
CREATE INDEX idx_api_logs_created_at ON api_logs(created_at);
CREATE INDEX idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX idx_webhooks_events ON webhooks USING gin (events);

-- Create RLS Policies
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