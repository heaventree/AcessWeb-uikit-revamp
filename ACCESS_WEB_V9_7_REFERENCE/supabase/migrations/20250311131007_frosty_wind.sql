/*
  # Add Help Articles Schema
  
  1. New Tables
    - help_articles
      - Stores help documentation and guides
      - Supports categories, tags, and search
    - help_categories
      - Organizes help articles into categories
    - help_article_tags
      - Manages article tags for better organization
  
  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for admin write access
*/

-- Help Categories Table
CREATE TABLE IF NOT EXISTS help_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Help Articles Table
CREATE TABLE IF NOT EXISTS help_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  category_id uuid REFERENCES help_categories(id),
  is_published boolean DEFAULT false,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Help Article Tags Table
CREATE TABLE IF NOT EXISTS help_article_tags (
  article_id uuid REFERENCES help_articles(id) ON DELETE CASCADE,
  tag text NOT NULL,
  PRIMARY KEY (article_id, tag)
);

-- Enable RLS
ALTER TABLE help_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_article_tags ENABLE ROW LEVEL SECURITY;

-- Policies for help_categories
CREATE POLICY "Public can view help categories"
  ON help_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage help categories"
  ON help_categories
  FOR ALL
  TO authenticated
  USING (auth.role() = 'admin')
  WITH CHECK (auth.role() = 'admin');

-- Policies for help_articles
CREATE POLICY "Public can view published help articles"
  ON help_articles
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Admins can manage help articles"
  ON help_articles
  FOR ALL
  TO authenticated
  USING (auth.role() = 'admin')
  WITH CHECK (auth.role() = 'admin');

-- Policies for help_article_tags
CREATE POLICY "Public can view help article tags"
  ON help_article_tags
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage help article tags"
  ON help_article_tags
  FOR ALL
  TO authenticated
  USING (auth.role() = 'admin')
  WITH CHECK (auth.role() = 'admin');

-- Create indexes
CREATE INDEX help_articles_category_id_idx ON help_articles(category_id);
CREATE INDEX help_articles_slug_idx ON help_articles(slug);
CREATE INDEX help_articles_search_idx ON help_articles USING GIN (to_tsvector('english', title || ' ' || content));