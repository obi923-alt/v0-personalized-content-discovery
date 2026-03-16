"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { DigestItem as DigestItemType } from "@/lib/types"
import { 
  ExternalLink, 
  Bookmark, 
  Share2, 
  ChevronDown,
  ChevronUp,
  FileText,
  Twitter
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface DigestItemProps {
  item: DigestItemType
}

const tagColors: Record<string, string> = {
  essay: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  newsletter: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  social: "bg-chart-3/20 text-chart-3 border-chart-3/30",
}

const tagLabels: Record<string, string> = {
  essay: "Essay Inspiration",
  newsletter: "Newsletter",
  social: "Social Share",
}

export function DigestItem({ item }: DigestItemProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="group border-b border-border py-6 first:pt-0 last:border-0">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
          {item.type === "tweet" ? (
            <Twitter className="h-5 w-5 text-muted-foreground" />
          ) : (
            <FileText className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/80">{item.source}</span>
            <span>·</span>
            <time dateTime={item.publishedAt.toISOString()}>
              {formatDistanceToNow(item.publishedAt, { addSuffix: true })}
            </time>
            {item.author && item.type === "article" && (
              <>
                <span>·</span>
                <span>{item.author}</span>
              </>
            )}
          </div>

          <h3 className="mt-1.5 text-base font-medium leading-snug text-foreground">
            {item.type === "tweet" ? (
              <span className="font-normal">{item.title}</span>
            ) : (
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                {item.title}
              </a>
            )}
          </h3>

          <div className={cn(
            "mt-3 overflow-hidden transition-all duration-300",
            expanded ? "max-h-96" : "max-h-0"
          )}>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {item.summary}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {item.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="outline"
                className={cn("text-xs font-normal", tagColors[tag])}
              >
                {tagLabels[tag]}
              </Badge>
            ))}
            
            <div className="ml-auto flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" />
                    Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" />
                    More
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-primary"
                asChild
              >
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div 
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold",
              item.relevanceScore >= 90 
                ? "bg-primary/20 text-primary" 
                : item.relevanceScore >= 80 
                  ? "bg-chart-2/20 text-chart-2"
                  : "bg-muted text-muted-foreground"
            )}
          >
            {item.relevanceScore}
          </div>
        </div>
      </div>
    </article>
  )
}
