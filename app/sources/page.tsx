"use client"

import { useState } from "react"
import { AppSidebar, MobileHeader } from "@/components/app-sidebar"
import { SourceCard } from "@/components/source-card"
import { AddSourceDialog } from "@/components/add-source-dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
      <MobileHeader />
      
      <main className="lg:pl-60">
        <div className="sticky top-14 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:top-0">
          <div className="flex h-14 items-center justify-between px-4 lg:h-16 lg:px-8">
            <div>
              <h1 className="text-base font-semibold tracking-tight text-foreground lg:text-lg">Sources</h1>
              <p className="hidden text-sm text-muted-foreground sm:block">
                Manage your content sources
              </p>
            </div>
            <AddSourceDialog onAdd={handleAdd} />
          </div>
        </div>

        <div className="p-4 lg:p-8 lg:max-w-6xl">
          <div className="grid grid-cols-3 gap-2 mb-6 sm:gap-4 sm:mb-8">
            <button
              onClick={() => setFilterType(filterType === "rss" ? null : "rss")}
              className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all shadow-sm sm:flex-row sm:gap-4 sm:p-5 ${
                filterType === "rss" 
                  ? "border-primary/50 bg-primary/5 shadow-primary/5" 
                  : "border-border bg-card hover:shadow-md hover:shadow-foreground/5"
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/80 sm:h-11 sm:w-11 sm:rounded-xl">
                <Rss className="h-4 w-4 text-chart-1 sm:h-5 sm:w-5" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-lg font-semibold tracking-tight text-foreground sm:text-2xl">{typeCounts.rss}</p>
                <p className="text-[10px] text-muted-foreground sm:text-xs">RSS Feeds</p>
              </div>
            </button>
            <button
              onClick={() => setFilterType(filterType === "website" ? null : "website")}
              className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all shadow-sm sm:flex-row sm:gap-4 sm:p-5 ${
                filterType === "website" 
                  ? "border-primary/50 bg-primary/5 shadow-primary/5" 
                  : "border-border bg-card hover:shadow-md hover:shadow-foreground/5"
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/80 sm:h-11 sm:w-11 sm:rounded-xl">
                <Globe className="h-4 w-4 text-chart-2 sm:h-5 sm:w-5" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-lg font-semibold tracking-tight text-foreground sm:text-2xl">{typeCounts.website}</p>
                <p className="text-[10px] text-muted-foreground sm:text-xs">Websites</p>
              </div>
            </button>
            <button
              onClick={() => setFilterType(filterType === "twitter" ? null : "twitter")}
              className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all shadow-sm sm:flex-row sm:gap-4 sm:p-5 ${
                filterType === "twitter" 
                  ? "border-primary/50 bg-primary/5 shadow-primary/5" 
                  : "border-border bg-card hover:shadow-md hover:shadow-foreground/5"
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/80 sm:h-11 sm:w-11 sm:rounded-xl">
                <Twitter className="h-4 w-4 text-chart-3 sm:h-5 sm:w-5" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-lg font-semibold tracking-tight text-foreground sm:text-2xl">{typeCounts.twitter}</p>
                <p className="text-[10px] text-muted-foreground sm:text-xs">Twitter/X</p>
              </div>
            </button>
          </div>

          <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:gap-4">
            <div className="relative w-full sm:flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-card border-border shadow-sm"
              />
            </div>
            <div className="flex items-center justify-between sm:ml-auto sm:gap-4">
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
              <p className="text-xs text-muted-foreground sm:text-sm">
                {filteredSources.length} sources
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
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
            <div className="rounded-xl border border-border bg-card p-8 text-center sm:p-12">
              <Rss className="mx-auto h-10 w-10 text-muted-foreground/50 sm:h-12 sm:w-12" />
              <p className="mt-4 text-sm text-muted-foreground sm:text-base">No sources found</p>
              <p className="text-xs text-muted-foreground/70 sm:text-sm">Try adjusting your search or add a new source</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
