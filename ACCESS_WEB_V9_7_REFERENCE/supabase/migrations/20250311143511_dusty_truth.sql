/*
  # Realtime Monitoring System

  1. New Tables
    - `realtime_monitors`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `url` (text)
      - `interval` (integer)
      - `enabled` (boolean)
      - `last_check` (timestamptz)
      - `notification_threshold` (integer)
      - `failure_count` (integer)
      - Timestamps (created_at, updated_at)
    
    - `realtime_alerts`
      - `id` (uuid, primary key)
      - `monitor_id` (uuid, foreign key)
      - `type` (text, check constraint)
      - `message` (text)
      - `data` (jsonb)
      - `acknowledged_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for user access control
    - Add policies for alert management

  3. Functions
    - create_realtime_alert: Create alerts and update failure count
*/

-- Create realtime_monitors table
CREATE TABLE IF NOT EXISTS realtime_monitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  url text NOT NULL,
  interval integer NOT NULL DEFAULT 300,
  enabled boolean NOT NULL DEFAULT true,
  last_check timestamptz,
  notification_threshold integer NOT NULL DEFAULT 3,
  failure_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create realtime_alerts table
CREATE TABLE IF NOT EXISTS realtime_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  monitor_id uuid REFERENCES realtime_monitors(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('error', 'warning', 'info')),
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  acknowledged_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE realtime_monitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtime_alerts ENABLE ROW LEVEL SECURITY;

-- Policies for realtime_monitors with unique names
CREATE POLICY "realtime_monitors_select_own_20240320"
  ON realtime_monitors
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "realtime_monitors_manage_own_20240320"
  ON realtime_monitors
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for realtime_alerts with unique names
CREATE POLICY "realtime_alerts_select_own_20240320"
  ON realtime_alerts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM realtime_monitors
      WHERE id = monitor_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "realtime_alerts_acknowledge_own_20240320"
  ON realtime_alerts
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM realtime_monitors
      WHERE id = monitor_id
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM realtime_monitors
      WHERE id = monitor_id
      AND user_id = auth.uid()
    )
  );

-- Indexes for better performance
CREATE INDEX idx_realtime_monitors_user_id ON realtime_monitors(user_id);
CREATE INDEX idx_realtime_monitors_enabled ON realtime_monitors(enabled);
CREATE INDEX idx_realtime_alerts_monitor_id ON realtime_alerts(monitor_id);
CREATE INDEX idx_realtime_alerts_type ON realtime_alerts(type);
CREATE INDEX idx_realtime_alerts_created_at ON realtime_alerts(created_at);

-- Function to create alert
CREATE OR REPLACE FUNCTION create_realtime_alert(
  p_monitor_id uuid,
  p_type text,
  p_message text,
  p_data jsonb DEFAULT '{}'
) RETURNS uuid AS $$
DECLARE
  v_alert_id uuid;
BEGIN
  INSERT INTO realtime_alerts (
    monitor_id,
    type,
    message,
    data
  ) VALUES (
    p_monitor_id,
    p_type,
    p_message,
    p_data
  )
  RETURNING id INTO v_alert_id;

  -- Update monitor failure count for errors
  IF p_type = 'error' THEN
    UPDATE realtime_monitors
    SET failure_count = failure_count + 1
    WHERE id = p_monitor_id;
  END IF;

  RETURN v_alert_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;