/*
# Create articles table for Ikorodu news website

1. New Tables
- `articles`
  - `id` (uuid, primary key)
  - `title` (text, not null) - headline of the article
  - `slug` (text, unique, not null) - URL-friendly identifier
  - `summary` (text, not null) - short standfirst/dek shown in cards
  - `body` (text, not null) - full article content (markdown-style paragraphs separated by \n\n)
  - `category` (text, not null) - news section: Politics, Business, Sports, Community, Health, Education, Culture
  - `image_url` (text) - hero image URL
  - `image_credit` (text) - photo credit line
  - `author` (text, not null) - byline
  - `location` (text) - specific area within Ikorodu (e.g. Ikorodu Town, Ijede, Imota, Igbogbo)
  - `is_featured` (boolean, default false) - shown in hero/featured slots
  - `is_breaking` (boolean, default false) - shown in breaking news ticker
  - `read_time_minutes` (integer, default 3) - estimated read time
  - `published_at` (timestamptz, not null) - publication timestamp
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Indexes
- Index on `slug` for fast lookups
- Index on `category` for category pages
- Index on `published_at` for chronological ordering
- Index on `is_featured` for homepage queries

3. Security
- Enable RLS on `articles`.
- Allow anon + authenticated SELECT (public news content).
- Allow anon + authenticated INSERT/UPDATE/DELETE (single-tenant, no auth - content management).
*/

CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  summary text NOT NULL,
  body text NOT NULL,
  category text NOT NULL,
  image_url text,
  image_credit text,
  author text NOT NULL,
  location text,
  is_featured boolean NOT NULL DEFAULT false,
  is_breaking boolean NOT NULL DEFAULT false,
  read_time_minutes integer NOT NULL DEFAULT 3,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles (category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles (is_featured) WHERE is_featured = true;

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_articles" ON articles;
CREATE POLICY "anon_select_articles" ON articles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_articles" ON articles;
CREATE POLICY "anon_insert_articles" ON articles FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_articles" ON articles;
CREATE POLICY "anon_update_articles" ON articles FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_articles" ON articles;
CREATE POLICY "anon_delete_articles" ON articles FOR DELETE
  TO anon, authenticated USING (true);
