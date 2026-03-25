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
  essay: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  newsletter: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  social: "bg-chart-3/10 text-chart-3 border-chart-3/20",
}

const tagLabels: Record<string, string> = {
  essay: "Essay Inspiration",
  newsletter: "Newsletter",
  social: "Social Share",
}

export function DigestItem({ item }: DigestItemProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="group rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:shadow-md hover:shadow-foreground/5 sm:p-5 sm:hover:-translate-y-0.5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {/* Icon - hidden on mobile, shown on larger screens */}
        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/80 sm:flex">
          {item.type === "tweet" ? (
            <Twitter className="h-5 w-5 text-chart-1" />
          ) : (
            <FileText className="h-5 w-5 text-chart-2" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          {/* Mobile: row with icon, source, score */}
          <div className="flex items-start gap-3 sm:hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/80">
              {item.type === "tweet" ? (
                <Twitter className="h-4 w-4 text-chart-1" />
              ) : (
                <FileText className="h-4 w-4 text-chart-2" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground/80 truncate">{item.source_name}</span>
                <span>·</span>
                <time dateTime={item.published_at.toString()} suppressHydrationWarning>
                  {formatDistanceToNow(item.published_at, { addSuffix: true })}
                </time>
              </div>
            </div>
            <div 
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                (item.relevance_score*10) >= 90 
                  ? "bg-gradient-to-br from-chart-5/20 to-chart-5/10 text-chart-5 ring-1 ring-chart-5/20" 
                  : (item.relevance_score*10)  >= 80 
                    ? "bg-gradient-to-br from-chart-1/15 to-chart-1/5 text-chart-1 ring-1 ring-chart-1/20"
                    : "bg-secondary text-muted-foreground"
              )}
            >
              {(item.relevance_score*10) }
            </div>
          </div>

          {/* Desktop: metadata row */}
          <div className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
            <span className="font-medium text-foreground/80">{item.source_name}</span>
            <span>·</span>
            <time dateTime={item.published_at.toString()} suppressHydrationWarning>
              {formatDistanceToNow(item.published_at, { addSuffix: true })}
            </time>
            {item.author && item.type !== "tweet" && (
              <>
                <span>·</span>
                <span>{item.author}</span>
              </>
            )}
          </div>

          <h3 className="mt-2 text-sm font-medium leading-snug text-foreground sm:mt-1.5 sm:text-base">
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
                className={cn("text-xs font-normal", tagColors["newsletter"])}
              >
                <span className="hidden sm:inline">{tag}</span>
                <span className="sm:hidden">{tag}</span>
              </Badge>
            ))}
            
            <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground sm:gap-1.5 sm:px-3"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">More</span>
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
                className="hidden h-8 w-8 text-muted-foreground hover:text-foreground sm:inline-flex"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 px-2 text-xs text-muted-foreground hover:text-primary sm:px-3"
                asChild
              >
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Open</span>
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop: relevance score */}
        <div className="hidden shrink-0 text-right sm:block">
          <div 
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold",
              (item.relevance_score*10)  >= 90 
                ? "bg-gradient-to-br from-chart-5/20 to-chart-5/10 text-chart-5 ring-1 ring-chart-5/20" 
                : (item.relevance_score*10)  >= 80 
                  ? "bg-gradient-to-br from-chart-1/15 to-chart-1/5 text-chart-1 ring-1 ring-chart-1/20"
                  : "bg-secondary text-muted-foreground"
            )}
          >
            {(item.relevance_score*10) }
          </div>
        </div>
      </div>
    </article>
  )
}
