"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"
import type { Source } from "@/lib/types"

interface AddSourceDialogProps {
  // Add mode
  onAdd?: (source: Omit<Source, "id" | "enabled" | "lastFetched">) => Promise<void>
  // Edit mode
  source?: Source
  onEdit?: (id: string, updates: Omit<Source, "id" | "enabled" | "lastFetched">) => Promise<void>
  // Controlled open state (used by SourceCard to open programmatically)
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const categories = [
  "Think Tanks",
  "Magazines",
  "Policy",
  "Urban Policy",
  "Research",
  "Twitter/X",
  "Blogs",
  "News",
]

export function AddSourceDialog({ onAdd, source, onEdit, open: controlledOpen, onOpenChange }: AddSourceDialogProps) {
  const isEditMode = !!source && !!onEdit

  const [internalOpen, setInternalOpen] = useState(false)
  const [submitting, setSubmitting]     = useState(false)
  const [name, setName]                 = useState("")
  const [url, setUrl]                   = useState("")
  const [type, setType]                 = useState<"rss" | "website" | "twitter">("rss")
  const [category, setCategory]         = useState("")

  // Use controlled open state if provided, otherwise internal
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = (val: boolean) => {
    onOpenChange ? onOpenChange(val) : setInternalOpen(val)
  }

  // Populate fields when opening in edit mode
  useEffect(() => {
    if (open && isEditMode) {
      setName(source.name)
      setUrl(source.url)
      setType(source.type)
      setCategory(source.category ?? "")
    }
    if (!open) {
      // Reset when closing
      if (!isEditMode) {
        setName("")
        setUrl("")
        setType("rss")
        setCategory("")
      }
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !url || !type || !category) return

    setSubmitting(true)
    try {
      if (isEditMode) {
        await onEdit(source.id, { name, url, type, category })
      } else {
        await onAdd?.({ name, url, type, category })
      }
      setOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Only render a trigger button in add mode (edit mode is opened externally) */}
      {!isEditMode && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Source
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Source" : "Add New Source"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the details for this source."
              : "Add a new content source to monitor. RSS feeds, websites, or Twitter accounts."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g., Brookings Institution"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="e.g., https://brookings.edu/feed"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rss">RSS Feed</SelectItem>
                  <SelectItem value="website">Website (Scrape)</SelectItem>
                  <SelectItem value="twitter">Twitter/X Account</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !name || !url || !category}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Save changes" : "Add Source"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}