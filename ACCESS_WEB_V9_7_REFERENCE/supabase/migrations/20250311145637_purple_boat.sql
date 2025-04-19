/*
  # Blog System Schema

  1. New Tables
    - article_categories
      - Category organization for blog articles
    - articles
      - Main blog content
      - Author tracking
      - Publishing workflow
    - help_articles  
      - Help center content
      - View tracking
      - Feedback system

  2. Security
    - RLS enabled on all tables
    - Public read access for published content
    - Author management access
    - Admin full access
    
  3. Features
    - Category management
    - Article publishing workflow
    - Help article feedback
    - View tracking
*/

-- Create article categories table
CREATE TABLE IF NOT EXISTS article_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES article_categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  content text NOT NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create help articles table
CREATE TABLE IF NOT EXISTS help_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  is_published boolean DEFAULT false,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  helpful_votes integer DEFAULT 0,
  unhelpful_votes integer DEFAULT 0
);

-- Enable RLS
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;

-- Article Categories Policies
CREATE POLICY "Public can read article categories"
  ON article_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage article categories"
  ON article_categories
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE role = 'admin'
  ))
  WITH CHECK (auth.uid() IN (
    SELECT id FROM auth.users WHERE role = 'admin'
  ));

-- Articles Policies
CREATE POLICY "Public can read published articles"
  ON articles
  FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Authors can manage own articles"
  ON articles
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = author_id OR
    auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin')
  )
  WITH CHECK (
    auth.uid() = author_id OR
    auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin')
  );

-- Help Articles Policies
CREATE POLICY "Public can read published help articles"
  ON help_articles
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Admins can manage help articles"
  ON help_articles
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE role = 'admin'
  ))
  WITH CHECK (auth.uid() IN (
    SELECT id FROM auth.users WHERE role = 'admin'
  ));

-- Create indexes
CREATE INDEX articles_status_idx ON articles (status);
CREATE INDEX articles_author_id_idx ON articles (author_id);
CREATE INDEX articles_category_id_idx ON articles (category_id);
CREATE INDEX articles_created_at_idx ON articles (created_at DESC);
CREATE INDEX help_articles_category_idx ON help_articles (category);
CREATE INDEX help_articles_created_at_idx ON help_articles (created_at DESC);

-- Create view tracking function
CREATE OR REPLACE FUNCTION increment_article_views(article_slug text)
RETURNS void AS $$
BEGIN
  UPDATE help_articles
  SET view_count = view_count + 1
  WHERE slug = article_slug;
END;
$$ LANGUAGE plpgsql;

-- Create voting function
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

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_article_categories_updated_at
  BEFORE UPDATE ON article_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_help_articles_updated_at
  BEFORE UPDATE ON help_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();