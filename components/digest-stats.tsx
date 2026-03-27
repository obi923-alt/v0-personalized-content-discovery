"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { DigestItem } from "@/lib/types"
import { FileText, Twitter, TrendingUp, Clock } from "lucide-react"

interface DigestStatsProps {
  items: DigestItem[]
}

export function DigestStats({ items }: DigestStatsProps) {
  const articleCount = items.filter((item) => item.type !== "tweet").length
  const tweetCount = items.filter((item) => item.type === "tweet").length
  const avgRelevance = Math.round(
    items.reduce((acc, item) => acc + item.relevance_score, 0) / items.length
  ) || 0
  const highRelevanceCount = items.filter((item) => item.relevance_score >= 85).length

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
      label: "High Relevance",
      value: highRelevanceCount,
      icon: Clock,
      color: "text-chart-5",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card border-border shadow-sm">
          <CardContent className="p-3 sm:p-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/80 sm:h-11 sm:w-11 sm:rounded-xl">
                <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground sm:text-xs">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
