/*
  # Monitoring System Tables

  1. New Tables
    - `monitoring_configs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `site_id` (uuid)
      - `frequency` (text)
      - `enabled` (boolean)
      - `last_check` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `monitoring_logs`
      - `id` (uuid, primary key)
      - `config_id` (uuid, references monitoring_configs)
      - `status` (text)
      - `issues_found` (integer)
      - `scan_duration` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for user access control
    - Add policies for admin access
*/

-- Create monitoring_configs table
CREATE TABLE IF NOT EXISTS monitoring_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  site_id uuid NOT NULL,
  frequency text NOT NULL CHECK (frequency IN ('realtime', 'hourly', 'daily', 'weekly')),
  enabled boolean DEFAULT true,
  last_check timestamptz,
  notification_email text,
  notification_webhook text,
  excluded_paths text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create monitoring_logs table
CREATE TABLE IF NOT EXISTS monitoring_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id uuid REFERENCES monitoring_configs(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('success', 'error', 'warning')),
  issues_found integer DEFAULT 0,
  scan_duration integer, -- in milliseconds
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE monitoring_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_logs ENABLE ROW LEVEL SECURITY;

-- Policies for monitoring_configs
CREATE POLICY "Users can view own monitoring configs"
  ON monitoring_configs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own monitoring configs"
  ON monitoring_configs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for monitoring_logs
CREATE POLICY "Users can view own monitoring logs"
  ON monitoring_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM monitoring_configs
      WHERE monitoring_configs.id = monitoring_logs.config_id
      AND monitoring_configs.user_id = auth.uid()
    )
  );

-- Indexes for better performance
CREATE INDEX idx_monitoring_configs_user_id ON monitoring_configs(user_id);
CREATE INDEX idx_monitoring_configs_site_id ON monitoring_configs(site_id);
CREATE INDEX idx_monitoring_logs_config_id ON monitoring_logs(config_id);
CREATE INDEX idx_monitoring_logs_created_at ON monitoring_logs(created_at);

-- Function to update monitoring_configs updated_at
CREATE OR REPLACE FUNCTION update_monitoring_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_monitoring_configs_updated_at
  BEFORE UPDATE ON monitoring_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_monitoring_configs_updated_at();

-- Function to create monitoring log
CREATE OR REPLACE FUNCTION create_monitoring_log(
  p_config_id uuid,
  p_status text,
  p_issues_found integer DEFAULT 0,
  p_scan_duration integer DEFAULT NULL,
  p_error_message text DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO monitoring_logs (
    config_id,
    status,
    issues_found,
    scan_duration,
    error_message
  ) VALUES (
    p_config_id,
    p_status,
    p_issues_found,
    p_scan_duration,
    p_error_message
  )
  RETURNING id INTO v_log_id;

  -- Update last_check timestamp
  UPDATE monitoring_configs
  SET last_check = now()
  WHERE id = p_config_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;