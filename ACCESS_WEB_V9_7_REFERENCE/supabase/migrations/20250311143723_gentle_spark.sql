/*
  # Help Center Articles Schema

  1. New Tables
    - `help_articles`
      - Content management for help documentation
      - Supports categories, tags, and versioning
      - Tracks views and helpful votes
    
    - `help_categories` 
      - Organizes articles into categories
      - Supports hierarchical structure

  2. Security
    - Enable RLS on all tables
    - Public read access for published articles
    - Admin-only write access
*/

-- Create help_categories table
CREATE TABLE IF NOT EXISTS help_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  parent_id uuid REFERENCES help_categories(id),
  position integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create help_articles table
CREATE TABLE IF NOT EXISTS help_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES help_categories(id),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  description text,
  author_id uuid REFERENCES auth.users(id),
  published boolean DEFAULT false,
  published_at timestamptz,
  views integer DEFAULT 0,
  helpful_votes integer DEFAULT 0,
  unhelpful_votes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE help_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;

-- Policies for help_categories
CREATE POLICY "help_categories_public_read_20240320"
  ON help_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "help_categories_admin_manage_20240320"
  ON help_categories
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Policies for help_articles
CREATE POLICY "help_articles_public_read_20240320"
  ON help_articles
  FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "help_articles_admin_manage_20240320"
  ON help_articles
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Indexes for better performance
CREATE INDEX idx_help_articles_category ON help_articles(category_id);
CREATE INDEX idx_help_articles_published ON help_articles(published);
CREATE INDEX idx_help_articles_author ON help_articles(author_id);
CREATE INDEX idx_help_articles_created ON help_articles(created_at);
CREATE INDEX idx_help_categories_parent ON help_categories(parent_id);
CREATE INDEX idx_help_categories_position ON help_categories(position);

-- Function to increment article views
CREATE OR REPLACE FUNCTION increment_article_views(article_slug text)
RETURNS void AS $$
BEGIN
  UPDATE help_articles
  SET views = views + 1
  WHERE slug = article_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to vote on article helpfulness
CREATE OR REPLACE FUNCTION vote_article_helpful(
  article_slug text,
  is_helpful boolean
)
RETURNS void AS $$
BEGIN
  UPDATE help_articles
  SET 
    helpful_votes = CASE WHEN is_helpful THEN helpful_votes + 1 ELSE helpful_votes END,
    unhelpful_votes = CASE WHEN NOT is_helpful THEN unhelpful_votes + 1 ELSE unhelpful_votes END
  WHERE slug = article_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;