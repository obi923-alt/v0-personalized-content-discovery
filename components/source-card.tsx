"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AddSourceDialog } from "@/components/add-source-dialog"
import type { Source } from "@/lib/types"
import { Rss, Globe, Twitter, MoreVertical, Trash2, Edit, ExternalLink, Loader2 } from "lucide-react"
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
  onEdit: (id: string, updates: Omit<Source, "id" | "enabled" | "lastFetched">) => Promise<void>
}

const sourceIcons   = { rss: Rss, website: Globe, twitter: Twitter }
const sourceTypeLabels = { rss: "RSS Feed", website: "Website", twitter: "Twitter/X" }

export function SourceCard({ source, onToggle, onDelete, onEdit }: SourceCardProps) {
  const [deleting, setDeleting]     = useState(false)
  const [editOpen, setEditOpen]     = useState(false)
  const Icon = sourceIcons[source.type]

  const handleDelete = async () => {
    setDeleting(true)
    await onDelete(source.id)
  }

  return (
    <>
      {/* Edit dialog — rendered outside the card so it's not nested in the dropdown */}
      <AddSourceDialog
        source={source}
        onEdit={onEdit}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <Card className={`bg-card border-border shadow-sm transition-all hover:shadow-md hover:shadow-foreground/5 hover:-translate-y-0.5 ${deleting ? "opacity-50 pointer-events-none" : ""}`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/80">
                <Icon className="h-5 w-5 text-chart-1" />
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-foreground truncate">{source.name}</h3>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{source.url}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs font-normal">
                    {sourceTypeLabels[source.type]}
                  </Badge>
                  {source.category && (
                    <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                      {source.category}
                    </Badge>
                  )}
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
                    {deleting
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <MoreVertical className="h-4 w-4" />
                    }
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
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
    </>
  )
}