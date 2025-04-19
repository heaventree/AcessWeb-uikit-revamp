/*
  # Add Backup System

  1. New Tables
    - `backups`
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamptz)
      - `data` (jsonb)
      - `type` (text)
      - `status` (text)
      - `metadata` (jsonb)

  2. Security
    - Enable RLS on `backups` table
    - Add policies for backup management
*/

-- Create backups table
CREATE TABLE IF NOT EXISTS backups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  data jsonb NOT NULL,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'completed',
  metadata jsonb DEFAULT '{}'::jsonb,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX backups_created_at_idx ON backups(created_at DESC);
CREATE INDEX backups_type_idx ON backups(type);
CREATE INDEX backups_status_idx ON backups(status);

-- Create backup policies
CREATE POLICY "Users can view own backups"
  ON backups
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create backups"
  ON backups
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own backups"
  ON backups
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own backups"
  ON backups
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create backup functions
CREATE OR REPLACE FUNCTION create_backup(
  p_name text,
  p_type text,
  p_data jsonb,
  p_metadata jsonb DEFAULT '{}'::jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_backup_id uuid;
BEGIN
  INSERT INTO backups (name, type, data, metadata, user_id)
  VALUES (p_name, p_type, p_data, p_metadata, auth.uid())
  RETURNING id INTO v_backup_id;
  
  RETURN v_backup_id;
END;
$$;

-- Function to restore from backup
CREATE OR REPLACE FUNCTION restore_from_backup(
  p_backup_id uuid
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_backup_data jsonb;
BEGIN
  -- Check if backup exists and belongs to user
  SELECT data INTO v_backup_data
  FROM backups
  WHERE id = p_backup_id
  AND user_id = auth.uid();
  
  IF v_backup_data IS NULL THEN
    RAISE EXCEPTION 'Backup not found or access denied';
  END IF;
  
  RETURN v_backup_data;
END;
$$;