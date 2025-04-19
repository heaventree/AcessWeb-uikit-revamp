/*
  # Help System Schema

  1. New Tables
    - help_categories
      - Basic category information
      - Icon and description fields
    - help_articles
      - Article content and metadata
      - Category relationship
      - View and vote tracking
    
  2. Security
    - Enable RLS on all tables
    - Public read access
    - Admin write access
*/

-- Create help_categories table
CREATE TABLE IF NOT EXISTS help_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  slug text UNIQUE NOT NULL,
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
  author_id uuid,
  is_published boolean DEFAULT false,
  views integer DEFAULT 0,
  helpful_votes integer DEFAULT 0,
  unhelpful_votes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE help_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view categories"
  ON help_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view published articles"
  ON help_articles
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Admins can manage categories"
  ON help_categories
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage articles"
  ON help_articles
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create function to increment article views
CREATE OR REPLACE FUNCTION increment_article_views(article_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE help_articles
  SET views = views + 1
  WHERE slug = article_slug;
END;
$$;

-- Create function to vote on article helpfulness
CREATE OR REPLACE FUNCTION vote_article_helpful(article_slug text, is_helpful boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Insert initial categories
INSERT INTO help_categories (name, description, icon, slug) VALUES
  ('Getting Started', 'Learn the basics of using AccessWeb', 'Book', 'getting-started'),
  ('WCAG Guidelines', 'Detailed explanations of WCAG 2.1 requirements', 'FileText', 'wcag-guidelines'),
  ('Implementation', 'Technical guides for implementing accessibility', 'Code', 'implementation'),
  ('Best Practices', 'Recommended approaches and patterns', 'Settings', 'best-practices'),
  ('Integrations', 'Connect with popular platforms and tools', 'Globe', 'integrations'),
  ('Compliance', 'Understanding accessibility regulations', 'Shield', 'compliance');

-- Insert initial articles
INSERT INTO help_articles (
  category_id,
  title,
  slug,
  content,
  is_published,
  author_id
) VALUES
  (
    (SELECT id FROM help_categories WHERE slug = 'getting-started'),
    'Quick Start Guide',
    'quick-start-guide',
    '# Quick Start Guide\n\nWelcome to AccessWeb! This guide will help you get started with our accessibility testing platform...',
    true,
    '00000000-0000-0000-0000-000000000001'
  ),
  (
    (SELECT id FROM help_categories WHERE slug = 'wcag-guidelines'),
    'WCAG 2.1 Overview',
    'wcag-overview',
    '# WCAG 2.1 Overview\n\nWCAG 2.1 is the current standard for web accessibility...',
    true,
    '00000000-0000-0000-0000-000000000001'
  ),
  (
    (SELECT id FROM help_categories WHERE slug = 'implementation'),
    'Implementing Accessible Forms',
    'implementing-accessible-forms',
    '# Implementing Accessible Forms\n\nLearn how to create accessible forms that work with screen readers...',
    true,
    '00000000-0000-0000-0000-000000000001'
  ),
  (
    (SELECT id FROM help_categories WHERE slug = 'best-practices'),
    'Color Contrast Best Practices',
    'color-contrast-best-practices',
    '# Color Contrast Best Practices\n\nEnsure your content is readable by maintaining proper color contrast...',
    true,
    '00000000-0000-0000-0000-000000000001'
  );