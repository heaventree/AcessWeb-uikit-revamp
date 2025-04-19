/*
  # Help Center Tables

  1. New Tables
    - help_categories
      - Basic category information
      - Icon and metadata
    - help_articles
      - Article content and metadata
      - Category relationship
      - View and vote tracking
    - help_article_votes
      - User voting history
      - Vote type tracking

  2. Security
    - Enable RLS on all tables
    - Public read access for published content
    - Admin management policies
    - User voting policies

  3. Functions
    - View increment function
    - Vote management function
*/

-- Create help_categories table
CREATE TABLE IF NOT EXISTS help_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
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
  is_published boolean DEFAULT false,
  views integer DEFAULT 0,
  helpful_votes integer DEFAULT 0,
  unhelpful_votes integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create help_article_votes table
CREATE TABLE IF NOT EXISTS help_article_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES help_articles(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  is_helpful boolean NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(article_id, user_id)
);

-- Create indices for performance
CREATE INDEX IF NOT EXISTS idx_help_articles_category ON help_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_help_articles_published ON help_articles(is_published);
CREATE INDEX IF NOT EXISTS idx_help_articles_created_at ON help_articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_help_article_votes_article ON help_article_votes(article_id);
CREATE INDEX IF NOT EXISTS idx_help_article_votes_user ON help_article_votes(user_id);

-- Enable RLS
ALTER TABLE help_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_article_votes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view help categories"
  ON help_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view published help articles"
  ON help_articles
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Admins can manage help articles"
  ON help_articles
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Authenticated users can vote on articles"
  ON help_article_votes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create helper functions
CREATE OR REPLACE FUNCTION increment_article_views(article_slug text)
RETURNS void AS $$
BEGIN
  UPDATE help_articles
  SET views = views + 1
  WHERE slug = article_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION vote_article_helpful(article_slug text, is_helpful boolean)
RETURNS void AS $$
DECLARE
  v_article_id uuid;
BEGIN
  -- Get article ID
  SELECT id INTO v_article_id
  FROM help_articles
  WHERE slug = article_slug;

  -- Insert or update vote
  INSERT INTO help_article_votes (article_id, user_id, is_helpful)
  VALUES (v_article_id, auth.uid(), is_helpful)
  ON CONFLICT (article_id, user_id)
  DO UPDATE SET is_helpful = EXCLUDED.is_helpful;

  -- Update article vote counts
  UPDATE help_articles
  SET 
    helpful_votes = (
      SELECT COUNT(*) 
      FROM help_article_votes 
      WHERE article_id = v_article_id AND is_helpful = true
    ),
    unhelpful_votes = (
      SELECT COUNT(*) 
      FROM help_article_votes 
      WHERE article_id = v_article_id AND is_helpful = false
    )
  WHERE id = v_article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert initial categories
INSERT INTO help_categories (name, slug, description, icon) VALUES
  ('Getting Started', 'getting-started', 'Learn the basics of using AccessWeb', 'Book'),
  ('WCAG Guidelines', 'wcag', 'Detailed explanations of WCAG 2.1 requirements', 'FileText'),
  ('Integrations', 'integrations', 'Set up and use our platform integrations', 'Code'),
  ('Tools & Features', 'tools', 'Learn about our accessibility testing tools', 'Settings'),
  ('Compliance', 'compliance', 'Stay compliant with accessibility laws', 'Shield'),
  ('International', 'international', 'Global accessibility standards and requirements', 'Globe');

-- Insert sample articles
INSERT INTO help_articles (
  category_id,
  title,
  slug,
  content,
  is_published
) VALUES
  (
    (SELECT id FROM help_categories WHERE slug = 'getting-started'),
    'Quick Start Guide',
    'quick-start-guide',
    '# Quick Start Guide\n\nGet started with AccessWeb in minutes...',
    true
  ),
  (
    (SELECT id FROM help_categories WHERE slug = 'wcag'),
    'Understanding WCAG 2.1',
    'understanding-wcag',
    '# Understanding WCAG 2.1\n\nA comprehensive guide to WCAG 2.1...',
    true
  ),
  (
    (SELECT id FROM help_categories WHERE slug = 'integrations'),
    'WordPress Integration Guide',
    'wordpress-integration',
    '# WordPress Integration\n\nLearn how to integrate AccessWeb with WordPress...',
    true
  );