/*
  # Integration System Setup

  1. New Tables
    - `integration_settings`: Stores plugin/app configurations
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `platform` (text) - wordpress/shopify
      - `site_url` (text)
      - `settings` (jsonb) - platform-specific settings
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `integration_scans`: Tracks platform-specific scans
      - `id` (uuid, primary key)
      - `integration_id` (uuid, references integration_settings)
      - `scan_type` (text) - manual/scheduled
      - `status` (text)
      - `results` (jsonb)
      - `started_at` (timestamptz)
      - `completed_at` (timestamptz)
    
    - `integration_fixes`: Records applied fixes
      - `id` (uuid, primary key)
      - `scan_id` (uuid, references integration_scans)
      - `issue_type` (text)
      - `fix_type` (text) - auto/manual
      - `original_code` (text)
      - `fixed_code` (text)
      - `status` (text)
      - `applied_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Create policies for user and admin access
    - Add helper functions for fix management

  3. Indexes
    - Add performance-optimized indexes
*/

-- Create Tables
CREATE TABLE IF NOT EXISTS integration_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('wordpress', 'shopify')),
  site_url TEXT NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS integration_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID NOT NULL REFERENCES integration_settings(id) ON DELETE CASCADE,
  scan_type TEXT NOT NULL CHECK (scan_type IN ('manual', 'scheduled')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  results JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS integration_fixes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID NOT NULL REFERENCES integration_scans(id) ON DELETE CASCADE,
  issue_type TEXT NOT NULL,
  fix_type TEXT NOT NULL CHECK (fix_type IN ('auto', 'manual')),
  original_code TEXT,
  fixed_code TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'applied', 'failed', 'reverted')),
  applied_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE integration_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_fixes ENABLE ROW LEVEL SECURITY;

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_integration_settings_user_id ON integration_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_integration_settings_platform ON integration_settings(platform);
CREATE INDEX IF NOT EXISTS idx_integration_scans_integration_id ON integration_scans(integration_id);
CREATE INDEX IF NOT EXISTS idx_integration_scans_status ON integration_scans(status);
CREATE INDEX IF NOT EXISTS idx_integration_fixes_scan_id ON integration_fixes(scan_id);
CREATE INDEX IF NOT EXISTS idx_integration_fixes_status ON integration_fixes(status);

-- Create Helper Functions
CREATE OR REPLACE FUNCTION apply_integration_fix(
  p_scan_id UUID,
  p_issue_type TEXT,
  p_original_code TEXT,
  p_fixed_code TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  fix_id UUID;
BEGIN
  INSERT INTO integration_fixes (
    scan_id,
    issue_type,
    fix_type,
    original_code,
    fixed_code,
    status
  )
  VALUES (
    p_scan_id,
    p_issue_type,
    CASE 
      WHEN p_issue_type IN ('alt-text', 'aria-label', 'color-contrast') THEN 'auto'
      ELSE 'manual'
    END,
    p_original_code,
    p_fixed_code,
    'pending'
  )
  RETURNING id INTO fix_id;
  
  RETURN fix_id;
END;
$$;

CREATE OR REPLACE FUNCTION revert_integration_fix(p_fix_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE integration_fixes
  SET 
    status = 'reverted',
    applied_at = now()
  WHERE id = p_fix_id;
  
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION schedule_integration_scan(
  p_integration_id UUID,
  p_scan_type TEXT DEFAULT 'scheduled'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  scan_id UUID;
BEGIN
  INSERT INTO integration_scans (
    integration_id,
    scan_type,
    status
  )
  VALUES (
    p_integration_id,
    p_scan_type,
    'pending'
  )
  RETURNING id INTO scan_id;
  
  RETURN scan_id;
END;
$$;

-- Create Policies
CREATE POLICY "Users can manage own integration settings"
  ON integration_settings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own integration scans"
  ON integration_scans
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM integration_settings
    WHERE integration_settings.id = integration_scans.integration_id
    AND integration_settings.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own integration fixes"
  ON integration_fixes
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM integration_scans
    JOIN integration_settings ON integration_settings.id = integration_scans.integration_id
    WHERE integration_scans.id = integration_fixes.scan_id
    AND integration_settings.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM integration_scans
    JOIN integration_settings ON integration_settings.id = integration_scans.integration_id
    WHERE integration_scans.id = integration_fixes.scan_id
    AND integration_settings.user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all integration settings"
  ON integration_settings
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admins can manage all integration scans"
  ON integration_scans
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admins can manage all integration fixes"
  ON integration_fixes
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);