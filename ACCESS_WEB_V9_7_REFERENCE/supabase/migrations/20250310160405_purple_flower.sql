/*
  # Create articles and article_categories tables

  1. New Tables
    - `article_categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text)
      - `description` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `articles`
      - `id` (uuid, primary key)
      - `category_id` (uuid, references article_categories)
      - `title` (text)
      - `slug` (text)
      - `description` (text)
      - `content` (text)
      - `author_id` (uuid, references users)
      - `status` (text)
      - `published_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access to published articles
    - Add policies for authors to manage their own articles
    - Add policies for admins to manage all content
*/

-- Article categories table
CREATE TABLE IF NOT EXISTS article_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES article_categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  content text NOT NULL,
  author_id uuid REFERENCES users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policies for article categories
CREATE POLICY "Public can read article categories"
  ON article_categories
  FOR SELECT
  TO PUBLIC;

CREATE POLICY "Admins can manage article categories"
  ON article_categories
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Policies for articles
CREATE POLICY "Public can read published articles"
  ON articles
  FOR SELECT
  TO PUBLIC
  USING (status = 'published');

CREATE POLICY "Authors can manage own articles"
  ON articles
  TO authenticated
  USING (
    auth.uid() = author_id OR
    auth.jwt() ->> 'role' = 'admin'
  )
  WITH CHECK (
    auth.uid() = author_id OR
    auth.jwt() ->> 'role' = 'admin'
  );