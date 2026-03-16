"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Source } from "@/lib/types"
import { Rss, Globe, Twitter, MoreVertical, Trash2, Edit, ExternalLink } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"

interface SourceCardProps {
  source: Source
  onToggle: (id: string, enabled: boolean) => void
  onDelete: (id: string) => void
}

const sourceIcons = {
  rss: Rss,
  website: Globe,
  twitter: Twitter,
}

const sourceTypeLabels = {
  rss: "RSS Feed",
  website: "Website",
  twitter: "Twitter/X",
}

export function SourceCard({ source, onToggle, onDelete }: SourceCardProps) {
  const Icon = sourceIcons[source.type]

  return (
    <Card className="bg-card border-border transition-colors hover:border-border/80">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-foreground truncate">{source.name}</h3>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{source.url}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs font-normal">
                  {sourceTypeLabels[source.type]}
                </Badge>
                <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                  {source.category}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={source.enabled}
              onCheckedChange={(checked) => onToggle(source.id, checked)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={() => onDelete(source.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {source.lastFetched && (
          <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
            Last fetched {formatDistanceToNow(source.lastFetched, { addSuffix: true })}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
