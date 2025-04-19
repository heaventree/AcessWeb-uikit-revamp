/*
  # Recreate API System Tables Migration

  1. Drop Existing Tables
    - First drop existing tables if they exist
    - Drop in reverse order to handle dependencies
    - Drop related functions

  2. Create New Tables
    - api_keys: Store API keys for authentication
    - api_logs: Track API usage
    - webhooks: Manage webhook endpoints

  3. Security
    - Enable RLS
    - Create policies
    - Add indexes
*/

-- Drop existing tables and functions in reverse dependency order
DROP FUNCTION IF EXISTS trigger_webhooks(UUID, TEXT, JSONB);
DROP FUNCTION IF EXISTS log_api_request(UUID, TEXT, TEXT, INTEGER, INTEGER);
DROP FUNCTION IF EXISTS validate_api_key(TEXT);
DROP FUNCTION IF EXISTS generate_api_key();

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

-- Create Helper Functions
CREATE OR REPLACE FUNCTION generate_api_key()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  key TEXT;
  key_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate a secure random key
    key := encode(gen_random_bytes(32), 'hex');
    
    -- Check if key already exists
    SELECT EXISTS (
      SELECT 1 FROM api_keys WHERE api_keys.key = key
    ) INTO key_exists;
    
    -- Exit loop if key is unique
    EXIT WHEN NOT key_exists;
  END LOOP;
  
  RETURN key;
END;
$$;

CREATE OR REPLACE FUNCTION validate_api_key(api_key TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  key_id UUID;
BEGIN
  -- Find and validate API key
  SELECT id INTO key_id
  FROM api_keys
  WHERE key = api_key
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now());
    
  IF key_id IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired API key';
  END IF;
  
  -- Update last used timestamp
  UPDATE api_keys
  SET last_used = now()
  WHERE id = key_id;
  
  RETURN key_id;
END;
$$;

CREATE OR REPLACE FUNCTION log_api_request(
  p_api_key_id UUID,
  p_endpoint TEXT,
  p_method TEXT,
  p_status_code INTEGER,
  p_response_time INTEGER
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id UUID;
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
  p_user_id UUID,
  p_event TEXT,
  p_payload JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update last_triggered for matching webhooks
  UPDATE webhooks
  SET 
    last_triggered = now(),
    updated_at = now()
  WHERE 
    user_id = p_user_id
    AND is_active = true
    AND p_event = ANY(events);
END;
$$;