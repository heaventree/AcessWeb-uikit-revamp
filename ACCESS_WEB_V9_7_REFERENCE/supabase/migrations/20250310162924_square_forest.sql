/*
  # Fix API Policies Migration

  1. Drop Existing Policies
    - Drop all existing policies for api_keys, api_logs, and webhooks tables
    - This prevents "policy already exists" errors

  2. Create New Policies
    - Recreate policies with proper names and conditions
    - Ensure proper access control for users and admins
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage own API keys" ON api_keys;
DROP POLICY IF EXISTS "Admins can manage all API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can view own API logs" ON api_logs;
DROP POLICY IF EXISTS "Admins can view all API logs" ON api_logs;
DROP POLICY IF EXISTS "Users can manage own webhooks" ON webhooks;
DROP POLICY IF EXISTS "Admins can manage all webhooks" ON webhooks;

-- Create API Keys Policies
CREATE POLICY "api_keys_users_manage_own"
  ON api_keys
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "api_keys_admins_manage_all"
  ON api_keys
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Create API Logs Policies
CREATE POLICY "api_logs_users_view_own"
  ON api_logs
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM api_keys
    WHERE api_keys.id = api_logs.api_key_id
    AND api_keys.user_id = auth.uid()
  ));

CREATE POLICY "api_logs_admins_manage_all"
  ON api_logs
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Create Webhooks Policies
CREATE POLICY "webhooks_users_manage_own"
  ON webhooks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "webhooks_admins_manage_all"
  ON webhooks
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);