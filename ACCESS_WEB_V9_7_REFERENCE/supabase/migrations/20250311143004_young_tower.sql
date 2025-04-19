/*
  # Help Center Tables

  1. New Tables
    - help_articles
      - Core article content and metadata
      - View tracking and voting
    - help_categories 
      - Article categorization
      - Hierarchical organization

  2. Security
    - RLS policies for public read access
    - Admin-only write access
    - Secure voting and view tracking

  3. Functions
    - View counter
    - Helpful/unhelpful vote tracking
*/

-- Create help_categories table
CREATE TABLE IF NOT EXISTS help_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text NOT NULL,
  slug text UNIQUE NOT NULL,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create help_articles table
CREATE TABLE IF NOT EXISTS help_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES help_categories(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  published boolean DEFAULT false,
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
CREATE POLICY "Public can view categories" ON help_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON help_categories
  FOR ALL USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Policies for help_articles
CREATE POLICY "Public can view published articles" ON help_articles
  FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage articles" ON help_articles
  FOR ALL USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- View tracking function
CREATE OR REPLACE FUNCTION increment_article_views(article_slug text)
RETURNS void AS $$
BEGIN
  UPDATE help_articles
  SET views = views + 1
  WHERE slug = article_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Vote tracking function
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
$$ LANGUAGE plpgsql SECURITY DEFINER;