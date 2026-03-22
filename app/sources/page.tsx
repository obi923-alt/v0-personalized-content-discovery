"use client"

import { useState, useEffect } from "react"
import { AppSidebar, MobileHeader } from "@/components/app-sidebar"
import { SourceCard } from "@/components/source-card"
import { AddSourceDialog } from "@/components/add-source-dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Source } from "@/lib/types"
import { Search, Rss, Globe, Twitter, Loader2, AlertCircle } from "lucide-react"

export default function SourcesPage() {
  const [sources, setSources]         = useState<Source[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType]   = useState<string | null>(null)

  // ── Fetch on mount ───────────────────────────────────────────────────────
  useEffect(() => {
    loadSources()
  }, [])

  async function loadSources() {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch("/api/sources")
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? "Failed to load sources")
      }
      const data: Source[] = await res.json()
      setSources(
        data.map((s) => ({
          ...s,
          lastFetched: s.lastFetched ? new Date(s.lastFetched) : undefined,
        }))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // ── Add → persists to DB ─────────────────────────────────────────────────
  const handleAdd = async (newSource: Omit<Source, "id" | "enabled" | "lastFetched">) => {
    try {
      const res = await fetch("/api/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSource),
      })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? "Failed to add source")
      }
      const created: Source = await res.json()
      setSources((prev) => [...prev, {
        ...created,
        lastFetched: created.lastFetched ? new Date(created.lastFetched) : undefined,
      }])
    } catch (err) {
      // Surface the error — you could also show a toast here
      setError(err instanceof Error ? err.message : "Failed to add source")
    }
  }

  // ── Delete → persists to DB ──────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    // Optimistic update: remove from UI immediately
    setSources((prev) => prev.filter((s) => s.id !== id))
    try {
      const res = await fetch(`/api/sources?id=${id}`, { method: "DELETE" })
      if (!res.ok) {
        // Roll back if the server call fails
        loadSources()
      }
    } catch {
      loadSources() // roll back
    }
  }

  // ── Edit → persists to DB ────────────────────────────────────────────────
  const handleEdit = async (id: string, updates: Omit<Source, "id" | "enabled" | "lastFetched">) => {
    const res = await fetch(`/api/sources?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!res.ok) {
      const body = await res.json()
      throw new Error(body.error ?? "Failed to update source")
    }
    const updated: Source = await res.json()
    setSources((prev) =>
      prev.map((s) => s.id === id ? { ...updated, lastFetched: updated.lastFetched ? new Date(updated.lastFetched) : undefined } : s)
    )
  }

  // ── Toggle (local only) ──────────────────────────────────────────────────
  const handleToggle = (id: string, enabled: boolean) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled } : s))
    )
  }

  // ── Derived state ────────────────────────────────────────────────────────
  const filteredSources = sources.filter((source) => {
    const matchesSearch =
      searchQuery === "" ||
      source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.url.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === null || source.type === filterType
    return matchesSearch && matchesType
  })

  const typeCounts = {
    rss:     sources.filter((s) => s.type === "rss").length,
    website: sources.filter((s) => s.type === "website").length,
    twitter: sources.filter((s) => s.type === "twitter").length,
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <MobileHeader />

      <main className="lg:pl-60">
        {/* Header */}
        <div className="sticky top-14 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:top-0">
          <div className="flex h-14 items-center justify-between px-4 lg:h-16 lg:px-8">
            <div>
              <h1 className="text-base font-semibold tracking-tight text-foreground lg:text-lg">
                Sources
              </h1>
              <p className="hidden text-sm text-muted-foreground sm:block">
                Manage your content sources
              </p>
            </div>
            <AddSourceDialog onAdd={handleAdd} />
          </div>
        </div>

        <div className="p-4 lg:p-8 lg:max-w-6xl">

          {/* ── Loading ── */}
          {loading && (
            <div className="flex items-center justify-center gap-2 py-24 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading sources…</span>
            </div>
          )}

          {/* ── Error ── */}
          {!loading && error && (
            <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Something went wrong</p>
                <p className="text-xs opacity-80">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto border-destructive/30 text-destructive hover:bg-destructive/10"
                onClick={() => { setError(null); loadSources() }}
              >
                Retry
              </Button>
            </div>
          )}

          {/* ── Content ── */}
          {!loading && !error && (
            <>
              {/* Type filter cards */}
              <div className="grid grid-cols-3 gap-2 mb-6 sm:gap-4 sm:mb-8">
                {(
                  [
                    { key: "rss",     label: "RSS Feeds", icon: <Rss     className="h-4 w-4 text-chart-1 sm:h-5 sm:w-5" /> },
                    { key: "website", label: "Websites",  icon: <Globe   className="h-4 w-4 text-chart-2 sm:h-5 sm:w-5" /> },
                    { key: "twitter", label: "Twitter/X", icon: <Twitter className="h-4 w-4 text-chart-3 sm:h-5 sm:w-5" /> },
                  ] as const
                ).map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() => setFilterType(filterType === key ? null : key)}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all shadow-sm sm:flex-row sm:gap-4 sm:p-5 ${
                      filterType === key
                        ? "border-primary/50 bg-primary/5 shadow-primary/5"
                        : "border-border bg-card hover:shadow-md hover:shadow-foreground/5"
                    }`}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/80 sm:h-11 sm:w-11 sm:rounded-xl">
                      {icon}
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-lg font-semibold tracking-tight text-foreground sm:text-2xl">
                        {typeCounts[key]}
                      </p>
                      <p className="text-[10px] text-muted-foreground sm:text-xs">{label}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Search + filter bar */}
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
                    {filteredSources.length} {filteredSources.length === 1 ? "source" : "sources"}
                  </p>
                </div>
              </div>

              {/* Source grid */}
              {filteredSources.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                  {filteredSources.map((source) => (
                    <SourceCard
                      key={source.id}
                      source={source}
                      onToggle={handleToggle}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                    />
                  ))}
                </div>
              ) : (
                /* ── Empty state ── */
                <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
                  {searchQuery || filterType ? (
                    // Filtered empty state
                    <>
                      <Search className="mx-auto h-10 w-10 text-muted-foreground/40" />
                      <p className="mt-4 text-sm font-medium text-muted-foreground">No sources match your search</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">Try a different keyword or clear the filter</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-4 text-muted-foreground"
                        onClick={() => { setSearchQuery(""); setFilterType(null) }}
                      >
                        Clear search
                      </Button>
                    </>
                  ) : (
                    // Truly empty — no sources at all
                    <>
                      <Rss className="mx-auto h-10 w-10 text-muted-foreground/40" />
                      <p className="mt-4 text-sm font-medium text-foreground">No sources yet</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Add your first source to start building your digest
                      </p>
                      <div className="mt-6">
                        <AddSourceDialog onAdd={handleAdd} />
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}