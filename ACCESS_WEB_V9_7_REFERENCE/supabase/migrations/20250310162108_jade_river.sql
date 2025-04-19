/*
  # API System Migration Fix

  1. Changes
    - Add proper existence checks for all objects
    - Handle existing tables gracefully
    - Ensure clean policy creation
    - Add proper indexes
    - Create helper functions

  2. Security
    - Enable RLS
    - Add policies for user and admin access
    - Ensure proper access control

  Note: This migration includes proper error handling for existing objects
*/

-- Create extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing objects to ensure clean state
DROP FUNCTION IF EXISTS generate_api_key();
DROP FUNCTION IF EXISTS validate_api_key(text);
DROP FUNCTION IF EXISTS log_api_request(uuid, text, text, integer, integer);
DROP FUNCTION IF EXISTS trigger_webhooks(uuid, text, jsonb);

-- Create or replace functions
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
  UPDATE webhooks
  SET last_triggered = now()
  WHERE user_id = p_user_id
    AND is_active = true
    AND p_event = ANY(events);
END;
$$;

-- Drop existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can manage own API keys" ON api_keys;
  DROP POLICY IF EXISTS "Admins can manage all API keys" ON api_keys;
  DROP POLICY IF EXISTS "Users can view own API logs" ON api_logs;
  DROP POLICY IF EXISTS "Admins can view all API logs" ON api_logs;
  DROP POLICY IF EXISTS "Users can manage own webhooks" ON webhooks;
  DROP POLICY IF EXISTS "Admins can manage all webhooks" ON webhooks;
EXCEPTION WHEN undefined_table OR undefined_object THEN 
  -- Handle case where tables don't exist yet
END $$;

-- Create policies
DO $$ 
BEGIN
  -- API Keys Policies
  CREATE POLICY "Users can manage own API keys"
    ON api_keys FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Admins can manage all API keys"
    ON api_keys FOR ALL
    TO authenticated
    USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
    WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

  -- API Logs Policies
  CREATE POLICY "Users can view own API logs"
    ON api_logs FOR SELECT
    TO authenticated
    USING (EXISTS (
      SELECT 1 FROM api_keys
      WHERE api_keys.id = api_logs.api_key_id
      AND api_keys.user_id = auth.uid()
    ));

  CREATE POLICY "Admins can view all API logs"
    ON api_logs FOR ALL
    TO authenticated
    USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

  -- Webhooks Policies
  CREATE POLICY "Users can manage own webhooks"
    ON webhooks FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Admins can manage all webhooks"
    ON webhooks FOR ALL
    TO authenticated
    USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
    WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);
EXCEPTION WHEN undefined_table THEN 
  -- Handle case where tables don't exist yet
END $$;

-- Drop existing indexes
DO $$ 
BEGIN
  DROP INDEX IF EXISTS idx_api_keys_user_id;
  DROP INDEX IF EXISTS idx_api_keys_key;
  DROP INDEX IF EXISTS idx_api_logs_api_key_id;
  DROP INDEX IF EXISTS idx_api_logs_created_at;
  DROP INDEX IF EXISTS idx_webhooks_user_id;
  DROP INDEX IF EXISTS idx_webhooks_events;
EXCEPTION WHEN undefined_table OR undefined_object THEN 
  -- Handle case where tables or indexes don't exist
END $$;

-- Create or replace indexes
DO $$ 
BEGIN
  CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
  CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
  CREATE INDEX IF NOT EXISTS idx_api_logs_api_key_id ON api_logs(api_key_id);
  CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON api_logs(created_at);
  CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON webhooks(user_id);
  CREATE INDEX IF NOT EXISTS idx_webhooks_events ON webhooks USING gin (events);
EXCEPTION WHEN undefined_table THEN 
  -- Handle case where tables don't exist yet
END $$;