/*
  # Real-time Monitoring System

  1. New Tables
    - `realtime_monitors`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `url` (text)
      - `interval` (integer) - seconds between checks
      - `enabled` (boolean)
      - `last_check` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `realtime_alerts`
      - `id` (uuid, primary key)
      - `monitor_id` (uuid, references realtime_monitors)
      - `type` (text)
      - `message` (text)
      - `data` (jsonb)
      - `created_at` (timestamptz)
      - `acknowledged_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for user access control
    - Add policies for admin access
*/

-- Create realtime_monitors table
CREATE TABLE IF NOT EXISTS realtime_monitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  url text NOT NULL,
  interval integer NOT NULL CHECK (interval >= 60), -- Minimum 60 seconds
  enabled boolean DEFAULT true,
  last_check timestamptz,
  notification_threshold integer DEFAULT 3, -- Number of consecutive failures before alerting
  failure_count integer DEFAULT 0,
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
  created_at timestamptz DEFAULT now(),
  acknowledged_at timestamptz
);

-- Enable RLS
ALTER TABLE realtime_monitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtime_alerts ENABLE ROW LEVEL SECURITY;

-- Policies for realtime_monitors
CREATE POLICY "Users can view own monitors"
  ON realtime_monitors
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own monitors"
  ON realtime_monitors
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for realtime_alerts
CREATE POLICY "Users can view own alerts"
  ON realtime_alerts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM realtime_monitors
      WHERE realtime_monitors.id = monitor_id
      AND realtime_monitors.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can acknowledge own alerts"
  ON realtime_alerts
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM realtime_monitors
      WHERE realtime_monitors.id = monitor_id
      AND realtime_monitors.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM realtime_monitors
      WHERE realtime_monitors.id = monitor_id
      AND realtime_monitors.user_id = auth.uid()
    )
  );

-- Indexes for better performance
CREATE INDEX idx_realtime_monitors_user_id ON realtime_monitors(user_id);
CREATE INDEX idx_realtime_monitors_enabled ON realtime_monitors(enabled);
CREATE INDEX idx_realtime_alerts_monitor_id ON realtime_alerts(monitor_id);
CREATE INDEX idx_realtime_alerts_created_at ON realtime_alerts(created_at);
CREATE INDEX idx_realtime_alerts_acknowledged_at ON realtime_alerts(acknowledged_at);

-- Function to update realtime_monitors updated_at
CREATE OR REPLACE FUNCTION update_realtime_monitors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_realtime_monitors_updated_at
  BEFORE UPDATE ON realtime_monitors
  FOR EACH ROW
  EXECUTE FUNCTION update_realtime_monitors_updated_at();

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

  -- Update monitor failure count
  IF p_type = 'error' THEN
    UPDATE realtime_monitors
    SET failure_count = failure_count + 1
    WHERE id = p_monitor_id;
  ELSE
    UPDATE realtime_monitors
    SET failure_count = 0
    WHERE id = p_monitor_id;
  END IF;

  RETURN v_alert_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;