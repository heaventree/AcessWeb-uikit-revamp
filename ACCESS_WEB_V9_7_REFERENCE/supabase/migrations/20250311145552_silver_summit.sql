/*
  # Help Articles Schema

  1. New Tables
    - help_articles
      - Article content and metadata
      - Views and voting tracking
      - Public read access for published content

  2. Security
    - RLS enabled
    - Public read access for published articles
    - Admin management access
    
  3. Functions
    - View counter
    - Helpful/unhelpful voting
*/

-- Create help_articles table
CREATE TABLE IF NOT EXISTS help_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  author_id uuid REFERENCES auth.users(id),
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  views integer DEFAULT 0,
  helpful_votes integer DEFAULT 0,
  unhelpful_votes integer DEFAULT 0
);

-- Enable RLS
ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view published articles"
  ON help_articles
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage articles"
  ON help_articles
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE role = 'admin'
  ))
  WITH CHECK (auth.uid() IN (
    SELECT id FROM auth.users WHERE role = 'admin'
  ));

-- Create function to increment views
CREATE OR REPLACE FUNCTION increment_article_views(article_slug text)
RETURNS void AS $$
BEGIN
  UPDATE help_articles
  SET views = views + 1
  WHERE slug = article_slug;
END;
$$ LANGUAGE plpgsql;

-- Create function to handle votes
CREATE OR REPLACE FUNCTION vote_article_helpful(article_slug text, is_helpful boolean)
RETURNS void AS $$
BEGIN
  IF is_helpful THEN
    UPDATE help_articles
    SET helpful_votes = helpful_votes + 1
    WHERE slug = article_slug;
  ELSE
    UPDATE help_articles
    SET unhelpful_votes = unhelpful_votes + 1
    WHERE slug = article_slug;
  END IF;
END;
$$ LANGUAGE plpgsql;