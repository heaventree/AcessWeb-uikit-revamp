/*
  # Create scans and scan_results tables

  1. New Tables
    - `scans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `url` (text)
      - `status` (text)
      - `scan_date` (timestamptz)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `scan_results`
      - `id` (uuid, primary key)
      - `scan_id` (uuid, references scans)
      - `type` (text)
      - `impact` (text)
      - `description` (text)
      - `nodes` (jsonb)
      - `wcag_criteria` (text[])
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to manage their own scans
    - Add policies for admins to manage all scans
*/

-- Scans table
CREATE TABLE IF NOT EXISTS scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  url text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  scan_date timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Scan results table
CREATE TABLE IF NOT EXISTS scan_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id uuid REFERENCES scans(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('issue', 'warning', 'pass')),
  impact text CHECK (impact IN ('critical', 'serious', 'moderate', 'minor')),
  description text NOT NULL,
  nodes jsonb NOT NULL DEFAULT '[]'::jsonb,
  wcag_criteria text[] NOT NULL DEFAULT '{}'::text[],
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;

-- Policies for scans
CREATE POLICY "Users can manage own scans"
  ON scans
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all scans"
  ON scans
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Policies for scan results
CREATE POLICY "Users can read own scan results"
  ON scan_results
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM scans
    WHERE scans.id = scan_results.scan_id
    AND scans.user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all scan results"
  ON scan_results
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');