/*
  # Monitoring System Schema Update

  1. New Tables
    - monitoring_configs: Store monitoring settings per user
    - monitoring_alerts: Track monitoring alerts and notifications
    - monitoring_metrics: Store performance and availability metrics

  2. Security
    - RLS enabled on all tables
    - User access limited to own data
    - Secure functions for data access
*/

DO $$ 
BEGIN

-- Drop existing tables if they exist
DROP TABLE IF EXISTS monitoring_metrics;
DROP TABLE IF EXISTS monitoring_alerts;
DROP TABLE IF EXISTS monitoring_configs;

-- Create Monitoring Configs Table
CREATE TABLE monitoring_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id text NOT NULL,
  frequency text NOT NULL CHECK (frequency IN ('realtime', 'hourly', 'daily', 'weekly')),
  enabled boolean DEFAULT true,
  last_check timestamptz,
  notification_email text,
  notification_webhook text,
  excluded_paths text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create Monitoring Alerts Table
CREATE TABLE monitoring_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  monitor_id uuid REFERENCES monitoring_configs(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('error', 'warning', 'info')),
  message text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  acknowledged_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create Monitoring Metrics Table
CREATE TABLE monitoring_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  monitor_id uuid REFERENCES monitoring_configs(id) ON DELETE CASCADE,
  timestamp timestamptz DEFAULT now(),
  response_time integer,
  availability boolean,
  performance_score integer CHECK (performance_score BETWEEN 0 AND 100),
  error_count integer DEFAULT 0,
  warning_count integer DEFAULT 0
);

-- Enable RLS
ALTER TABLE monitoring_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_metrics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $policy$ 
BEGIN
  -- monitoring_configs policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own monitoring configs') THEN
    DROP POLICY "Users can view own monitoring configs" ON monitoring_configs;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own monitoring configs') THEN
    DROP POLICY "Users can manage own monitoring configs" ON monitoring_configs;
  END IF;

  -- monitoring_alerts policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own alerts') THEN
    DROP POLICY "Users can view own alerts" ON monitoring_alerts;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own alerts') THEN
    DROP POLICY "Users can manage own alerts" ON monitoring_alerts;
  END IF;

  -- monitoring_metrics policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own metrics') THEN
    DROP POLICY "Users can view own metrics" ON monitoring_metrics;
  END IF;
END $policy$;

-- Create new policies with unique names
CREATE POLICY "monitoring_configs_view_own_20240320"
  ON monitoring_configs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "monitoring_configs_manage_own_20240320"
  ON monitoring_configs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "monitoring_alerts_view_own_20240320"
  ON monitoring_alerts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM monitoring_configs
      WHERE id = monitor_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "monitoring_alerts_manage_own_20240320"
  ON monitoring_alerts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM monitoring_configs
      WHERE id = monitor_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM monitoring_configs
      WHERE id = monitor_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "monitoring_metrics_view_own_20240320"
  ON monitoring_metrics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM monitoring_configs
      WHERE id = monitor_id AND user_id = auth.uid()
    )
  );

-- Create or replace functions
CREATE OR REPLACE FUNCTION create_monitoring_alert(
  p_monitor_id uuid,
  p_type text,
  p_message text,
  p_data jsonb DEFAULT '{}'::jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_alert_id uuid;
BEGIN
  INSERT INTO monitoring_alerts (monitor_id, type, message, data)
  VALUES (p_monitor_id, p_type, p_message, p_data)
  RETURNING id INTO v_alert_id;
  
  RETURN v_alert_id;
END;
$$;

CREATE OR REPLACE FUNCTION aggregate_metrics(
  p_monitor_id uuid,
  p_start_time timestamptz,
  p_end_time timestamptz
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'avg_response_time', AVG(response_time),
    'availability', (COUNT(*) FILTER (WHERE availability = true)::float / COUNT(*)) * 100,
    'avg_performance', AVG(performance_score),
    'total_errors', SUM(error_count),
    'total_warnings', SUM(warning_count)
  )
  INTO v_result
  FROM monitoring_metrics
  WHERE monitor_id = p_monitor_id
  AND timestamp BETWEEN p_start_time AND p_end_time;
  
  RETURN v_result;
END;
$$;

-- Create or replace triggers
CREATE OR REPLACE FUNCTION update_monitoring_config_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_monitoring_config_timestamp ON monitoring_configs;
CREATE TRIGGER update_monitoring_config_timestamp
  BEFORE UPDATE ON monitoring_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_monitoring_config_timestamp();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_monitoring_alerts_monitor_id ON monitoring_alerts(monitor_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_alerts_created_at ON monitoring_alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_monitoring_metrics_monitor_id ON monitoring_metrics(monitor_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_metrics_timestamp ON monitoring_metrics(timestamp);

END $$;