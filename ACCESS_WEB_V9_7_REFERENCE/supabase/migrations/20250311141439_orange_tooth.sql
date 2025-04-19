/*
  # Help Articles System

  1. New Table
    - `help_articles`
      - `id` (uuid, primary key)
      - `slug` (text, unique)
      - `title` (text)
      - `content` (text)
      - `category` (text)
      - `author_id` (uuid, references auth.users)
      - `published` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `views` (integer)
      - `helpful_votes` (integer)
      - `unhelpful_votes` (integer)

  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for admin write access

  3. Functions
    - Add function to increment article views
    - Add function to track helpful/unhelpful votes
*/

-- Create help_articles table
CREATE TABLE IF NOT EXISTS help_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  author_id uuid REFERENCES auth.users(id),
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  views integer DEFAULT 0,
  helpful_votes integer DEFAULT 0,
  unhelpful_votes integer DEFAULT 0
);

-- Enable RLS
ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view published articles" ON help_articles
  FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can manage articles" ON help_articles
  FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE auth.jwt() ->> 'role' = 'admin'
  ));

-- Create function to increment views
CREATE OR REPLACE FUNCTION increment_article_views(article_slug text)
RETURNS void AS $$
BEGIN
  UPDATE help_articles
  SET views = views + 1
  WHERE slug = article_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to track votes
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