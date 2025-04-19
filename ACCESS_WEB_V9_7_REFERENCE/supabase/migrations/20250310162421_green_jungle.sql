/*
  # API System Migration

  1. New Tables
    - api_keys: Store API keys for authentication
      - id: UUID primary key
      - user_id: References auth.users
      - name: Key name/description
      - key: The actual API key
      - scopes: Array of permitted scopes
      - last_used: Last usage timestamp
      - expires_at: Optional expiration
      - is_active: Key status
      - created_at/updated_at: Timestamps
      
    - api_logs: Track API usage
      - id: UUID primary key
      - api_key_id: References api_keys
      - endpoint: Called endpoint
      - method: HTTP method
      - status_code: Response status
      - response_time: Request duration
      - created_at: Timestamp
      
    - webhooks: Manage webhook endpoints
      - id: UUID primary key
      - user_id: References auth.users
      - url: Webhook endpoint URL
      - events: Array of event types
      - secret: Webhook secret
      - is_active: Webhook status
      - last_triggered: Last trigger time
      - created_at/updated_at: Timestamps

  2. Security
    - RLS enabled on all tables
    - Policies for user and admin access
    - Secure functions for key management
*/

-- Drop existing objects if they exist
DO $$ BEGIN
  -- Drop tables if they exist
  DROP TABLE IF EXISTS api_logs;
  DROP TABLE IF EXISTS webhooks;
  DROP TABLE IF EXISTS api_keys;
  
  -- Drop functions if they exist
  DROP FUNCTION IF EXISTS generate_api_key();
  DROP FUNCTION IF EXISTS validate_api_key(text);
  DROP FUNCTION IF EXISTS log_api_request(uuid, text, text, integer, integer);
  DROP FUNCTION IF EXISTS trigger_webhooks(uuid, text, jsonb);
EXCEPTION
  WHEN others THEN
    NULL;
END $$;

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

-- Create Helper Functions
CREATE OR REPLACE FUNCTION generate_api_key()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  key text;
  unique_key boolean;
BEGIN
  unique_key := false;
  WHILE NOT unique_key LOOP
    key := encode(gen_random_bytes(32), 'hex');
    SELECT NOT EXISTS (
      SELECT 1 FROM api_keys WHERE api_keys.key = key
    ) INTO unique_key;
  END LOOP;
  RETURN key;
END;
$$;

CREATE OR REPLACE FUNCTION validate_api_key(api_key text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  key_user_id uuid;
BEGIN
  SELECT user_id INTO key_user_id
  FROM api_keys
  WHERE key = api_key
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now());
    
  IF key_user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired API key';
  END IF;
  
  UPDATE api_keys
  SET last_used = now()
  WHERE key = api_key;
  
  RETURN key_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION log_api_request(
  p_api_key_id uuid,
  p_endpoint text,
  p_method text,
  p_status_code integer,
  p_response_time integer
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO api_logs (
    api_key_id,
    endpoint,
    method,
    status_code,
    response_time
  )
  VALUES (
    p_api_key_id,
    p_endpoint,
    p_method,
    p_status_code,
    p_response_time
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

CREATE OR REPLACE FUNCTION trigger_webhooks(
  p_user_id uuid,
  p_event text,
  p_payload jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE webhooks
  SET last_triggered = now()
  WHERE user_id = p_user_id
    AND is_active = true
    AND p_event = ANY(events);
END;
$$;

-- Create RLS Policies
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