-- Sources table to store RSS feeds, websites, and Twitter accounts
CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('rss', 'website', 'twitter')),
  category TEXT DEFAULT 'general',
  enabled BOOLEAN DEFAULT true,
  last_fetched TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Digest items table to store scraped content
CREATE TABLE IF NOT EXISTS digest_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('article', 'tweet')),
  title TEXT NOT NULL,
  source_name TEXT NOT NULL,
  author TEXT,
  url TEXT NOT NULL UNIQUE,
  published_at TIMESTAMPTZ,
  summary TEXT,
  relevance_score INTEGER DEFAULT 50,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Interest profile table (single row for app settings)
CREATE TABLE IF NOT EXISTS interest_profile (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  topics TEXT[] DEFAULT '{}',
  geographic_focus TEXT[] DEFAULT '{}',
  authors TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  description TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- App settings table (single row)
CREATE TABLE IF NOT EXISTS app_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  max_items INTEGER DEFAULT 20,
  relevance_threshold INTEGER DEFAULT 70,
  delivery_time TEXT DEFAULT '07:00',
  email TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default rows for settings tables
INSERT INTO interest_profile (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
INSERT INTO app_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_digest_items_source_id ON digest_items(source_id);
CREATE INDEX IF NOT EXISTS idx_digest_items_published_at ON digest_items(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_digest_items_relevance_score ON digest_items(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_sources_enabled ON sources(enabled);
