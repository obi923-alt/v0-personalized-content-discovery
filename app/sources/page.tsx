"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SourceCard } from "@/components/source-card"
import { AddSourceDialog } from "@/components/add-source-dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockSources } from "@/lib/mock-data"
import type { Source } from "@/lib/types"
import { Search, Rss, Globe, Twitter } from "lucide-react"

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>(mockSources)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string | null>(null)

  const filteredSources = sources.filter((source) => {
    const matchesSearch = searchQuery === "" ||
      source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.url.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = filterType === null || source.type === filterType
    
    return matchesSearch && matchesType
  })

  const handleToggle = (id: string, enabled: boolean) => {
    setSources((prev) =>
      prev.map((source) =>
        source.id === id ? { ...source, enabled } : source
      )
    )
  }

  const handleDelete = (id: string) => {
    setSources((prev) => prev.filter((source) => source.id !== id))
  }

  const handleAdd = (newSource: Omit<Source, "id" | "enabled" | "lastFetched">) => {
    const source: Source = {
      ...newSource,
      id: String(Date.now()),
      enabled: true,
      lastFetched: undefined,
    }
    setSources((prev) => [...prev, source])
  }

  const typeCounts = {
    rss: sources.filter((s) => s.type === "rss").length,
    website: sources.filter((s) => s.type === "website").length,
    twitter: sources.filter((s) => s.type === "twitter").length,
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      
      <main className="pl-60">
        <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex h-16 items-center justify-between px-8">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">Sources</h1>
              <p className="text-sm text-muted-foreground">
                Manage your content sources
              </p>
            </div>
            <AddSourceDialog onAdd={handleAdd} />
          </div>
        </div>

        <div className="p-8 max-w-6xl">
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <button
              onClick={() => setFilterType(filterType === "rss" ? null : "rss")}
              className={`flex items-center gap-4 rounded-xl border p-5 transition-all shadow-sm ${
                filterType === "rss" 
                  ? "border-primary/50 bg-primary/5 shadow-primary/5" 
                  : "border-border bg-card hover:shadow-md hover:shadow-foreground/5"
              }`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/80">
                <Rss className="h-5 w-5 text-chart-1" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-semibold tracking-tight text-foreground">{typeCounts.rss}</p>
                <p className="text-xs text-muted-foreground">RSS Feeds</p>
              </div>
            </button>
            <button
              onClick={() => setFilterType(filterType === "website" ? null : "website")}
              className={`flex items-center gap-4 rounded-xl border p-5 transition-all shadow-sm ${
                filterType === "website" 
                  ? "border-primary/50 bg-primary/5 shadow-primary/5" 
                  : "border-border bg-card hover:shadow-md hover:shadow-foreground/5"
              }`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/80">
                <Globe className="h-5 w-5 text-chart-2" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-semibold tracking-tight text-foreground">{typeCounts.website}</p>
                <p className="text-xs text-muted-foreground">Websites</p>
              </div>
            </button>
            <button
              onClick={() => setFilterType(filterType === "twitter" ? null : "twitter")}
              className={`flex items-center gap-4 rounded-xl border p-5 transition-all shadow-sm ${
                filterType === "twitter" 
                  ? "border-primary/50 bg-primary/5 shadow-primary/5" 
                  : "border-border bg-card hover:shadow-md hover:shadow-foreground/5"
              }`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/80">
                <Twitter className="h-5 w-5 text-chart-3" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-semibold tracking-tight text-foreground">{typeCounts.twitter}</p>
                <p className="text-xs text-muted-foreground">Twitter/X</p>
              </div>
            </button>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-card border-border shadow-sm"
              />
            </div>
            {filterType && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setFilterType(null)}
                className="text-muted-foreground"
              >
                Clear filter
              </Button>
            )}
            <p className="text-sm text-muted-foreground ml-auto">
              {filteredSources.length} sources
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSources.map((source) => (
              <SourceCard
                key={source.id}
                source={source}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {filteredSources.length === 0 && (
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <Rss className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No sources found</p>
              <p className="text-sm text-muted-foreground/70">Try adjusting your search or add a new source</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
