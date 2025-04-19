/*
  # API System Migration Fix

  1. New Tables
    - api_keys: Store API keys for users
    - api_logs: Track API usage and requests
    - webhooks: Manage webhook configurations

  2. Security
    - Enable RLS on all tables
    - Add policies for user and admin access
    - Add proper indexes for performance

  3. Functions
    - Add helper functions for API key management
    - Add logging functions
    - Add webhook trigger functions
*/

-- Create API Keys Table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS api_keys (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    key text UNIQUE NOT NULL,
    scopes text[] DEFAULT '{}',
    last_used timestamptz,
    expires_at timestamptz,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Create API Logs Table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS api_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id uuid REFERENCES api_keys(id) ON DELETE CASCADE,
    endpoint text NOT NULL,
    method text NOT NULL,
    status_code integer NOT NULL,
    response_time integer NOT NULL,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Create Webhooks Table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS webhooks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    url text NOT NULL,
    events text[] DEFAULT '{}',
    secret text NOT NULL,
    is_active boolean DEFAULT true,
    last_triggered timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Enable Row Level Security
DO $$ BEGIN
  ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
  ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;
  ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create Policies
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

-- Create Indexes
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
  CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
  CREATE INDEX IF NOT EXISTS idx_api_logs_api_key_id ON api_logs(api_key_id);
  CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON api_logs(created_at);
  CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON webhooks(user_id);
  CREATE INDEX IF NOT EXISTS idx_webhooks_events ON webhooks USING gin (events);
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;

-- Helper Functions
CREATE OR REPLACE FUNCTION generate_api_key()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  key text;
  unique_key boolean;
BEGIN
  unique_key := false;
  WHILE NOT unique_key LOOP
    -- Generate a secure random key
    key := encode(gen_random_bytes(32), 'hex');
    -- Check if key exists
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
AS $$
DECLARE
  key_user_id uuid;
BEGIN
  -- Get user_id for API key if active and not expired
  SELECT user_id INTO key_user_id
  FROM api_keys
  WHERE key = api_key
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now());
    
  IF key_user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired API key';
  END IF;
  
  -- Update last_used timestamp
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
AS $$
BEGIN
  -- Update last_triggered for matching webhooks
  UPDATE webhooks
  SET last_triggered = now()
  WHERE user_id = p_user_id
    AND is_active = true
    AND p_event = ANY(events);
    
  -- Note: Actual webhook dispatch would be handled by the application server
END;
$$;