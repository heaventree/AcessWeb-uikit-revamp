/*
  # Fix help_articles table schema

  1. Changes
    - Add category column
    - Add published column
    - Add proper indices
    - Add RLS policies
    - Add metadata columns

  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for admin management
*/

-- Add category and published columns
ALTER TABLE help_articles 
  ADD COLUMN IF NOT EXISTS category text NOT NULL,
  ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT false;

-- Add indices for performance
CREATE INDEX IF NOT EXISTS help_articles_category_idx ON help_articles(category);
CREATE INDEX IF NOT EXISTS help_articles_published_idx ON help_articles(published);
CREATE INDEX IF NOT EXISTS help_articles_created_at_idx ON help_articles(created_at DESC);

-- Enable RLS
ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;

-- Public can view published articles
CREATE POLICY "Public can view published help articles"
  ON help_articles
  FOR SELECT
  TO public
  USING (published = true);

-- Admins can manage all articles
CREATE POLICY "Admins can manage all help articles"
  ON help_articles
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);