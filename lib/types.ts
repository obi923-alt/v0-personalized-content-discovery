export type ContentType = "article" | "tweet"

export type ContentTag = "essay" | "newsletter" | "social"

export interface DigestItem {
  id: string
  type: ContentType
  title: string
  source_name: string
  author?: string
  url: string
  published_at: Date
  summary: string
  relevance_score: number
  tags: ContentTag[]
  imageUrl?: string
}

export interface Source {
  id: string
  name: string
  url: string
  source_type: "rss" | "website" | "twitter"
  category: string
  enabled: boolean
  lastFetched?: Date
}

export interface InterestProfile {
  topics: string[]
  geographic_focus: string[]
  authors: string[]
  keywords: string[]
  description: string
}

export interface DigestSettings {
  maxItems: number
  relevanceThreshold: number
  deliveryTime: string
  email: string
}
