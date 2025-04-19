/*
  # Integration Settings and Functions

  1. New Tables
    - `integration_settings`: Store integration configurations
      - `id` (uuid, primary key)
      - `type` (text, check constraint)
      - `settings` (jsonb)
      - `api_key` (text, unique)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Create policies for user and admin access
    - Add helper functions for integrations

  3. Functions
    - validate_integration_api_key: Validate integration API keys
    - start_wordpress_scan: Start WordPress site scan
    - start_shopify_scan: Start Shopify theme scan
    - get_shopify_fixes: Get auto-fixable issues
*/

-- Create integration_settings table
CREATE TABLE IF NOT EXISTS integration_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('wordpress', 'shopify')),
  settings jsonb NOT NULL DEFAULT '{}',
  api_key text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE integration_settings ENABLE ROW LEVEL SECURITY;

-- Create policies with unique names
CREATE POLICY "integration_settings_users_manage_own_20240320"
  ON integration_settings
  FOR ALL
  TO authenticated
  USING (auth.uid() = (settings->>'user_id')::uuid)
  WITH CHECK (auth.uid() = (settings->>'user_id')::uuid);

CREATE POLICY "integration_settings_admins_manage_all_20240320"
  ON integration_settings
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Create functions
CREATE OR REPLACE FUNCTION validate_integration_api_key(p_api_key text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM integration_settings 
    WHERE api_key = p_api_key 
    AND settings->>'status' = 'active'
  );
END;
$$;

CREATE OR REPLACE FUNCTION start_wordpress_scan(p_api_key text, p_url text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_scan_id uuid;
BEGIN
  -- Validate API key
  IF NOT validate_integration_api_key(p_api_key) THEN
    RAISE EXCEPTION 'Invalid API key';
  END IF;

  -- Create scan record
  INSERT INTO scans (
    url,
    integration_type,
    status,
    settings
  ) VALUES (
    p_url,
    'wordpress',
    'pending',
    jsonb_build_object(
      'api_key', p_api_key
    )
  ) RETURNING id INTO v_scan_id;

  -- Return scan ID
  RETURN v_scan_id;
END;
$$;

CREATE OR REPLACE FUNCTION start_shopify_scan(p_shop text, p_theme_id text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_scan_id uuid;
BEGIN
  -- Create scan record
  INSERT INTO scans (
    url,
    integration_type,
    status,
    settings
  ) VALUES (
    p_shop || '.myshopify.com',
    'shopify',
    'pending',
    jsonb_build_object(
      'shop', p_shop,
      'theme_id', p_theme_id
    )
  ) RETURNING id INTO v_scan_id;

  -- Return scan ID
  RETURN v_scan_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_shopify_fixes(p_scan_id uuid)
RETURNS TABLE (
  asset_key text,
  fixed_content text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sr.nodes->>'asset_key' as asset_key,
    sr.nodes->>'fixed_content' as fixed_content
  FROM scan_results sr
  WHERE sr.scan_id = p_scan_id
  AND sr.auto_fixable = true;
END;
$$;