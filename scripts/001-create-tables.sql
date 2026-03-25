-- Create sources table
CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('rss', 'website', 'twitter')),
  category VARCHAR(100) NOT NULL,
  enabled BOOLEAN DEFAULT true,
  last_fetched TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create digest_items table
CREATE TABLE IF NOT EXISTS digest_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL CHECK (type IN ('article', 'tweet')),
  title TEXT NOT NULL,
  source_name VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  url TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  summary TEXT,
  relevance_score INTEGER DEFAULT 0 CHECK (relevance_score >= 0 AND relevance_score <= 100),
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interest_profile table
CREATE TABLE IF NOT EXISTS interest_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topics TEXT[] DEFAULT '{}',
  geographic_focus TEXT[] DEFAULT '{}',
  authors TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  max_items INTEGER DEFAULT 25,
  relevance_threshold INTEGER DEFAULT 70,
  delivery_time TIME DEFAULT '07:00',
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback table for digest item feedback
CREATE TABLE IF NOT EXISTS digest_item_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  digest_item_id UUID REFERENCES digest_items(id) ON DELETE CASCADE,
  feedback_type VARCHAR(50) NOT NULL CHECK (feedback_type IN ('like', 'dislike', 'not_relevant', 'more_like_this')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_digest_items_published_at ON digest_items(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_digest_items_relevance_score ON digest_items(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_digest_items_source_id ON digest_items(source_id);
CREATE INDEX IF NOT EXISTS idx_sources_enabled ON sources(enabled);
CREATE INDEX IF NOT EXISTS idx_feedback_item_id ON digest_item_feedback(digest_item_id);
