"use client"

import { useState } from "react"
import { DigestItem } from "./digest-item"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { DigestItem as DigestItemType, ContentType } from "@/lib/types"
import { Search, Filter, SlidersHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { isToday } from "date-fns"

interface DigestListProps {
  items: DigestItemType[]
  loading:boolean
}

export function DigestList({ items, loading }: DigestListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<ContentType[]>([])
  const [sortBy, setSortBy] = useState<"relevance" | "date">("relevance")
  const [filterSaved, setFilterSaved] = useState(false)
  const [timeFilter, setTimeFilter] = useState<"today" | "all">("today")

  const filteredItems = items
    .filter((item) => {
      const matchesSearch = searchQuery === "" || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source_name.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesTypes = selectedTypes.length === 0 || 
        selectedTypes.includes(item.type)
      
      const matchesSaved = filterSaved ? item.saved : true
      
      const matchesTime = timeFilter === "all" || isToday(new Date(item.published_at))
      
      return matchesSearch && matchesTypes && matchesSaved && matchesTime
    })
    .sort((a, b) => {
      if (sortBy === "relevance") {
        return b.relevance_score - a.relevance_score
      }
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    })

  const toggleType = (type: ContentType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const handleFilterSaved = () => {
    setFilterSaved((prev) => !prev)
  }


  return (
    loading? <>
    <div style={{width:"100%",height:"60vh"}} className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading your personalized digest...</p>
      </div>
    </div>
    
    </>
    :
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

        <Tabs  value={timeFilter} onValueChange={(v) => setTimeFilter(v as "today" | "all")} className="w-auto">
          <TabsList>
            <TabsTrigger style={{cursor:"pointer"}} value="today">Today</TabsTrigger>
            <TabsTrigger style={{cursor:"pointer"}} value="all">All Items</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex gap-1">
            {(["article", "tweet"] as ContentType[]).map((type) => (
              <Button
                key={type}
                variant={selectedTypes.includes(type) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleType(type)}
                className="text-xs whitespace-nowrap"
                style={{cursor:"pointer"}}
              >
                {type === "article" ? "Articles" : "Tweets"}
              </Button>
            ))}
                 <Button
                 style={{cursor:"pointer"}}
                variant={filterSaved ? "default" : "outline"}
                size="sm"
                onClick={handleFilterSaved}
                className="text-xs whitespace-nowrap"
              >
                Saved
              </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button style={{cursor:"pointer"}} variant="outline" size="sm" className="gap-1.5 whitespace-nowrap">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={sortBy === "relevance"}
                onCheckedChange={() => setSortBy("relevance")}
                style={{cursor:"pointer"}}
              >
                By Relevance
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === "date"}
                onCheckedChange={() => setSortBy("date")}
                style={{cursor:"pointer"}}
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
        {selectedTypes.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedTypes([])}
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
