export type ContentType = "article" | "tweet"

export type ContentTag = "essay" | "newsletter" | "social"

export interface DigestItem {
  id: string
  type: ContentType
  title: string
  source: string
  author?: string
  url: string
  publishedAt: Date
  summary: string
  relevanceScore: number
  tags: ContentTag[]
  imageUrl?: string
}

export interface Source {
  id: string
  name: string
  url: string
  type: "rss" | "website" | "twitter"
  category: string
  enabled: boolean
  lastFetched?: Date
}

export interface InterestProfile {
  topics: string[]
  geographicFocus: string[]
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
