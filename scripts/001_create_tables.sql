-- Sources table to store RSS feeds, websites, and Twitter accounts
CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  enabled BOOLEAN DEFAULT true,
  last_fetched TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Digest items table to store scraped content
CREATE TABLE IF NOT EXISTS digest_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  source_name TEXT NOT NULL,
  author TEXT,
  url TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  summary TEXT,
  relevance_score INTEGER DEFAULT 50,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Interest profile table
CREATE TABLE IF NOT EXISTS interest_profile (
  id INTEGER PRIMARY KEY DEFAULT 1,
  topics TEXT[] DEFAULT '{}',
  geographic_focus TEXT[] DEFAULT '{}',
  authors TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  description TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- App settings table
CREATE TABLE IF NOT EXISTS app_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  max_items INTEGER DEFAULT 20,
  relevance_threshold INTEGER DEFAULT 70,
  delivery_time TEXT DEFAULT '07:00',
  email TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);
