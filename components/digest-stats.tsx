"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { DigestItem } from "@/lib/types"
import { FileText, Twitter, TrendingUp, Clock } from "lucide-react"

interface DigestStatsProps {
  items: DigestItem[]
}

export function DigestStats({ items }: DigestStatsProps) {
  const articleCount = items.filter((item) => item.type === "article").length
  const tweetCount = items.filter((item) => item.type === "tweet").length
  const avgRelevance = Math.round(
    items.reduce((acc, item) => acc + item.relevanceScore, 0) / items.length
  )
  const highRelevanceCount = items.filter((item) => item.relevanceScore >= 85).length

  const stats = [
    {
      label: "Articles",
      value: articleCount,
      icon: FileText,
      color: "text-primary",
    },
    {
      label: "Tweets",
      value: tweetCount,
      icon: Twitter,
      color: "text-chart-2",
    },
    {
      label: "Avg. Relevance",
      value: `${avgRelevance}%`,
      icon: TrendingUp,
      color: "text-chart-3",
    },
    {
      label: "High Priority",
      value: highRelevanceCount,
      icon: Clock,
      color: "text-chart-5",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/80">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-tight text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
