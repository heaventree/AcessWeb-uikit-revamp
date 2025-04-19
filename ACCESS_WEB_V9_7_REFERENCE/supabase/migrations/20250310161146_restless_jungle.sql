/*
  # API Schema Update

  1. New Tables
    - api_keys: API key management
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - name (text)
      - key (text)
      - scopes (text[])
      - last_used (timestamptz)
      - expires_at (timestamptz)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - api_logs: API request logging
      - id (uuid, primary key)
      - api_key_id (uuid, references api_keys)
      - endpoint (text)
      - method (text)
      - status_code (integer)
      - response_time (integer)
      - created_at (timestamptz)

    - webhooks: Webhook configuration
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - url (text)
      - events (text[])
      - secret (text)
      - is_active (boolean)
      - last_triggered (timestamptz)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Row Level Security (RLS) enabled on all tables
    - Custom policies for data access control
    - API key validation functions

  3. Indexes
    - Performance optimized queries
    - API key lookup
    - Webhook event filtering
*/

-- API Keys Table
CREATE TABLE api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  key text NOT NULL UNIQUE,
  scopes text[] NOT NULL DEFAULT '{}',
  last_used timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- API Logs Table
CREATE TABLE api_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id uuid REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  method text NOT NULL,
  status_code integer NOT NULL,
  response_time integer NOT NULL, -- in milliseconds
  created_at timestamptz DEFAULT now()
);

-- Webhooks Table
CREATE TABLE webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  url text NOT NULL,
  events text[] NOT NULL DEFAULT '{}',
  secret text NOT NULL,
  is_active boolean DEFAULT true,
  last_triggered timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

-- API Keys Policies
CREATE POLICY "Users can manage own API keys"
  ON api_keys
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all API keys"
  ON api_keys
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- API Logs Policies
CREATE POLICY "Users can view own API logs"
  ON api_logs
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1
    FROM api_keys
    WHERE api_keys.id = api_logs.api_key_id
    AND api_keys.user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all API logs"
  ON api_logs
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Webhooks Policies
CREATE POLICY "Users can manage own webhooks"
  ON webhooks
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all webhooks"
  ON webhooks
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Create indexes for better query performance
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key ON api_keys(key);
CREATE INDEX idx_api_logs_api_key_id ON api_logs(api_key_id);
CREATE INDEX idx_api_logs_created_at ON api_logs(created_at);
CREATE INDEX idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX idx_webhooks_events ON webhooks USING gin(events);

-- Add API-related functions
CREATE OR REPLACE FUNCTION validate_api_key(api_key text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  key_id uuid;
BEGIN
  -- Find and validate API key
  SELECT id INTO key_id
  FROM api_keys
  WHERE key = api_key
  AND (expires_at IS NULL OR expires_at > now())
  AND is_active = true;

  IF key_id IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired API key';
  END IF;

  -- Update last used timestamp
  UPDATE api_keys
  SET last_used = now(),
      updated_at = now()
  WHERE id = key_id;

  RETURN key_id;
END;
$$;

-- Add column to track API key status
ALTER TABLE api_keys ADD COLUMN is_active boolean DEFAULT true;

-- Add function to generate secure API keys
CREATE OR REPLACE FUNCTION generate_api_key()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  key_base text;
  full_key text;
BEGIN
  -- Generate a random base using UUID
  key_base := replace(gen_random_uuid()::text, '-', '');
  
  -- Combine with timestamp and random bytes for uniqueness
  full_key := 'pk_' || key_base || encode(gen_random_bytes(8), 'hex');
  
  RETURN full_key;
END;
$$;

-- Add function to log API requests
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

-- Add function to trigger webhooks
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
  -- Update last_triggered for matching webhooks
  UPDATE webhooks
  SET last_triggered = now(),
      updated_at = now()
  WHERE user_id = p_user_id
    AND is_active = true
    AND p_event = ANY(events);
  
  -- Note: Actual webhook dispatch would be handled by the application server
END;
$$;