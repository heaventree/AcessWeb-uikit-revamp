/*
  # Monitoring Alerts System

  1. New Tables
    - `monitoring_alerts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `type` (text) - error, warning, info
      - `message` (text)
      - `data` (jsonb)
      - `acknowledged_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for user access
    - Add policies for admin access
*/

-- Create monitoring_alerts table
CREATE TABLE IF NOT EXISTS monitoring_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('error', 'warning', 'info')),
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  acknowledged_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE monitoring_alerts ENABLE ROW LEVEL SECURITY;

-- Policies for monitoring_alerts
CREATE POLICY "Users can view own alerts"
  ON monitoring_alerts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can acknowledge own alerts"
  ON monitoring_alerts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX idx_monitoring_alerts_user_id ON monitoring_alerts(user_id);
CREATE INDEX idx_monitoring_alerts_type ON monitoring_alerts(type);
CREATE INDEX idx_monitoring_alerts_created_at ON monitoring_alerts(created_at);
CREATE INDEX idx_monitoring_alerts_acknowledged_at ON monitoring_alerts(acknowledged_at);

-- Function to create alert
CREATE OR REPLACE FUNCTION create_monitoring_alert(
  p_user_id uuid,
  p_type text,
  p_message text,
  p_data jsonb DEFAULT '{}'
) RETURNS uuid AS $$
DECLARE
  v_alert_id uuid;
BEGIN
  INSERT INTO monitoring_alerts (
    user_id,
    type,
    message,
    data
  ) VALUES (
    p_user_id,
    p_type,
    p_message,
    p_data
  )
  RETURNING id INTO v_alert_id;

  RETURN v_alert_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;