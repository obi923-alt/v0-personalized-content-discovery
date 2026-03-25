"use client"

import { useState } from "react"
import { DigestItem } from "./digest-item"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { DigestItem as DigestItemType, ContentTag } from "@/lib/types"
import { Search, Filter, SlidersHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DigestListProps {
  items: DigestItemType[]
}

export function DigestList({ items }: DigestListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<ContentTag[]>([])
  const [sortBy, setSortBy] = useState<"relevance" | "date">("relevance")

  const filteredItems = items
    .filter((item) => {
      const matchesSearch = searchQuery === "" || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source_name.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some((tag) => item.tags.includes(tag))
      
      return matchesSearch && matchesTags
    })
    .sort((a, b) => {
      if (sortBy === "relevance") {
        return b.relevance_score - a.relevance_score
      }
      return b.published_at.getTime() - a.published_at.getTime()
    })

  const toggleTag = (tag: ContentTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="relative w-full sm:flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card border-border shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex gap-1">
            {(["essay", "newsletter", "social"] as ContentTag[]).map((tag) => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleTag(tag)}
                className="text-xs whitespace-nowrap"
              >
                {tag === "essay" ? "Essays" : tag === "newsletter" ? "Newsletter" : "Social"}
              </Button>
            ))}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 whitespace-nowrap">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={sortBy === "relevance"}
                onCheckedChange={() => setSortBy("relevance")}
              >
                By Relevance
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === "date"}
                onCheckedChange={() => setSortBy("date")}
              >
                By Date
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted-foreground sm:text-sm">
          Showing {filteredItems.length} of {items.length} items
        </p>
        {selectedTags.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedTags([])}
            className="text-xs text-muted-foreground"
          >
            Clear filters
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <DigestItem key={item.id} item={item} />
          ))
        ) : (
          <div className="rounded-xl border border-border bg-card py-12 text-center sm:py-16">
            <Filter className="mx-auto h-10 w-10 text-muted-foreground/40 sm:h-12 sm:w-12" />
            <p className="mt-4 text-sm text-muted-foreground sm:text-base">No items match your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
