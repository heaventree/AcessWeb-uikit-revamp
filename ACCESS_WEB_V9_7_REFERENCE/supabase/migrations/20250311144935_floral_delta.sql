/*
  # Help Articles Schema

  1. New Tables
    - help_categories
      - Basic category information
      - Public read access
    - help_articles
      - Article content and metadata
      - Public read for published articles
    - help_article_tags
      - Article tag associations

  2. Security
    - RLS enabled on all tables
    - Public read access for published content
    - Admin write access
*/

-- Create help categories table
CREATE TABLE IF NOT EXISTS help_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create help articles table
CREATE TABLE IF NOT EXISTS help_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  category_id uuid REFERENCES help_categories(id),
  is_published boolean DEFAULT false,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create help article tags table
CREATE TABLE IF NOT EXISTS help_article_tags (
  article_id uuid REFERENCES help_articles(id) ON DELETE CASCADE,
  tag text NOT NULL,
  PRIMARY KEY (article_id, tag)
);

-- Create search index
CREATE INDEX IF NOT EXISTS help_articles_search_idx ON help_articles 
USING gin(to_tsvector('english', title || ' ' || content));

-- Create category index
CREATE INDEX IF NOT EXISTS help_articles_category_id_idx ON help_articles(category_id);

-- Create slug index
CREATE INDEX IF NOT EXISTS help_articles_slug_idx ON help_articles(slug);

-- Enable RLS
ALTER TABLE help_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_article_tags ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage help categories"
  ON help_categories
  FOR ALL
  TO authenticated
  USING (role() = 'admin'::text)
  WITH CHECK (role() = 'admin'::text);

CREATE POLICY "Public can view help categories"
  ON help_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage help articles"
  ON help_articles
  FOR ALL
  TO authenticated
  USING (role() = 'admin'::text)
  WITH CHECK (role() = 'admin'::text);

CREATE POLICY "Public can view published help articles"
  ON help_articles
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Admins can manage help article tags"
  ON help_article_tags
  FOR ALL
  TO authenticated
  USING (role() = 'admin'::text)
  WITH CHECK (role() = 'admin'::text);

CREATE POLICY "Public can view help article tags"
  ON help_article_tags
  FOR SELECT
  TO public
  USING (true);