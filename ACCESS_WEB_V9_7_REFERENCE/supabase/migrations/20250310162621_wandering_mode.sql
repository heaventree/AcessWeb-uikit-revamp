/*
  # API System Tables Migration

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

  3. Functions
    - generate_api_key: Generate secure API keys
    - validate_api_key: Validate API key and permissions
    - log_api_request: Log API usage
    - trigger_webhooks: Send webhook notifications
*/

-- Create API Keys Table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'api_key_status') THEN
    CREATE TYPE api_key_status AS ENUM ('active', 'expired', 'revoked');
  END IF;
END $$;

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
DO $$ 
BEGIN
  -- API Keys Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'api_keys' AND policyname = 'Users can manage own API keys') THEN
    CREATE POLICY "Users can manage own API keys"
      ON api_keys
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'api_keys' AND policyname = 'Admins can manage all API keys') THEN
    CREATE POLICY "Admins can manage all API keys"
      ON api_keys
      FOR ALL
      TO authenticated
      USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
      WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);
  END IF;

  -- API Logs Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'api_logs' AND policyname = 'Users can view own API logs') THEN
    CREATE POLICY "Users can view own API logs"
      ON api_logs
      FOR SELECT
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM api_keys
        WHERE api_keys.id = api_logs.api_key_id
        AND api_keys.user_id = auth.uid()
      ));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'api_logs' AND policyname = 'Admins can view all API logs') THEN
    CREATE POLICY "Admins can view all API logs"
      ON api_logs
      FOR ALL
      TO authenticated
      USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);
  END IF;

  -- Webhooks Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'webhooks' AND policyname = 'Users can manage own webhooks') THEN
    CREATE POLICY "Users can manage own webhooks"
      ON webhooks
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'webhooks' AND policyname = 'Admins can manage all webhooks') THEN
    CREATE POLICY "Admins can manage all webhooks"
      ON webhooks
      FOR ALL
      TO authenticated
      USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
      WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);
  END IF;
END $$;

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
    
  -- Note: Actual webhook dispatch would be handled by edge functions
END;
$$;