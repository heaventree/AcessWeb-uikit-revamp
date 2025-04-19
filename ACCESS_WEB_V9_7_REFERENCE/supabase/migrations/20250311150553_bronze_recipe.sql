/*
  # Help Center System

  1. Tables
    - help_categories: Categories for help articles
    - help_articles: Help articles with content and metadata

  2. Security
    - Enable RLS on all tables
    - Drop existing policies to avoid conflicts
    - Create new policies with unique names

  3. Functions
    - Article view tracking
    - Helpful/unhelpful voting
*/

-- Drop existing policies
DO $$ 
BEGIN
  -- Drop category policies
  DROP POLICY IF EXISTS "Public can view help categories" ON help_categories;
  DROP POLICY IF EXISTS "Admins can manage help categories" ON help_categories;
  
  -- Drop article policies
  DROP POLICY IF EXISTS "Public can view published help articles" ON help_articles;
  DROP POLICY IF EXISTS "Admins can manage help articles" ON help_articles;
END $$;

-- Drop existing functions
DROP FUNCTION IF EXISTS increment_article_views(text);
DROP FUNCTION IF EXISTS vote_article_helpful(text, boolean);

-- Create help_categories table
CREATE TABLE IF NOT EXISTS help_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
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

-- Create policies with unique names
CREATE POLICY "help_categories_public_view_20240311"
  ON help_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "help_categories_admin_manage_20240311"
  ON help_categories
  FOR ALL
  TO authenticated
  USING (role() = 'admin');

CREATE POLICY "help_articles_public_view_20240311"
  ON help_articles
  FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "help_articles_admin_manage_20240311"
  ON help_articles
  FOR ALL
  TO authenticated
  USING (role() = 'admin');

-- Create functions
CREATE FUNCTION increment_article_views(article_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE help_articles
  SET views = views + 1
  WHERE slug = article_slug;
END;
$$;

CREATE FUNCTION vote_article_helpful(article_slug text, is_helpful boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
INSERT INTO help_categories (name, description, icon, slug, "order") VALUES
('Getting Started', 'Learn the basics of using AccessWeb', 'Book', 'getting-started', 1),
('WCAG Guidelines', 'Detailed explanations of WCAG 2.1 requirements', 'FileText', 'wcag', 2),
('Integrations', 'Set up and use our platform integrations', 'Code', 'integrations', 3),
('Tools & Features', 'Learn about our accessibility testing tools', 'Settings', 'tools', 4),
('Compliance', 'Stay compliant with accessibility laws', 'Shield', 'compliance', 5),
('International', 'Global accessibility standards and requirements', 'Globe', 'international', 6);

-- Insert initial articles
INSERT INTO help_articles (category_id, title, slug, content, published) VALUES
(
  (SELECT id FROM help_categories WHERE slug = 'wcag'),
  'WCAG 2.1 Overview',
  'wcag-overview',
  '# WCAG 2.1 Overview

Web Content Accessibility Guidelines (WCAG) 2.1 defines how to make web content more accessible to people with disabilities. This guide provides a comprehensive overview of WCAG principles and requirements.

## Core Principles

WCAG 2.1 is organized around four principles:

1. **Perceivable** - Information must be presentable to users in ways they can perceive
2. **Operable** - Interface components must be operable
3. **Understandable** - Information and operation must be understandable
4. **Robust** - Content must be robust enough to work with current and future technologies

## Conformance Levels

WCAG 2.1 has three levels of conformance:

- **Level A** - Basic accessibility features
- **Level AA** - Addresses major accessibility barriers
- **Level AAA** - Highest level of accessibility

## Key Requirements

### Perceivable
- Text alternatives for non-text content
- Captions and audio descriptions
- Content adaptable and distinguishable

### Operable
- Keyboard accessible
- Enough time to read content
- No seizure-inducing content
- Navigable content

### Understandable
- Readable text
- Predictable functionality
- Input assistance

### Robust
- Compatible with assistive technologies
- Valid HTML/ARIA usage

## Implementation Guide

1. Start with semantic HTML
2. Add proper ARIA attributes when needed
3. Test with assistive technologies
4. Validate against WCAG criteria
5. Monitor and maintain compliance

## Resources

- [Official WCAG 2.1 Documentation](https://www.w3.org/WAI/WCAG21/quickref/)
- [WCAG 2.1 Success Criteria](https://www.w3.org/WAI/WCAG21/Understanding/)
- [Techniques for WCAG 2.1](https://www.w3.org/WAI/WCAG21/Techniques/)',
  true
);