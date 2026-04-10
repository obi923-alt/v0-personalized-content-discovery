"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { AlertCircle, Check, Loader2 } from "lucide-react"
import { useSources } from "@/app/context/SourcesContext"

export function ManageCookiesModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [websiteName, setWebsiteName] = useState("")
  const [cookieJson, setCookieJson] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [websiteNames,setWebsiteNames] = useState<string[]>([])
  const {sources, loadSources} = useSources()
  const [isRemoving, setIsRemoving] = useState(false)
  

  useEffect(() => {
    const names = sources.map((source) => source.name)
    setWebsiteNames(names)
    if (names.length > 0 && !websiteName) {
      setWebsiteName(names[0])
    }
  }, [sources, websiteName])
  console.log(websiteNames)

  const handleOpenChange = (newOpen: boolean) => {
    if (isUploading) return
    setOpen(newOpen)
    if (!newOpen) {
      // Reset state when closed
      setTimeout(() => {
        setWebsiteName("")
        setCookieJson("")
        setError(null)
        setSuccess(false)
      }, 200)
    }
  }

  const handleSave = async () => {
    setError(null)
    setSuccess(false)

    if (!websiteName.trim()) {
      setError("Website name is required")
      return
    }

    if (!cookieJson.trim()) {
      setError("Cookie JSON is required")
      return
    }

    let parsedData
    try {
      parsedData = JSON.parse(cookieJson)
    } catch (err) {
      setError("Invalid JSON format. Please ensure you copied the cookies correctly.")
      return
    }

    setIsUploading(true)

    try {
      // 1. Get signed URL
      const res = await fetch("/api/cookies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cookieName: websiteName }),
      })

      if (!res.ok) {
        throw new Error("Failed to get upload URL")
      }

      const { uploadURL } = await res.json()

      // 2. Upload to S3 using the signed URL
      const uploadRes = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      })
      
      
      if (!uploadRes.ok) {
        throw new Error("Failed to upload cookie data")
      }
      
      const cookiePath = uploadURL.split('?')[0]

      const res2 = await fetch("/api/cookies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cookiePath, name: websiteName }),
      })

      if (!res2.ok) {
        throw new Error("Failed to update cookie path")
      }
      setSuccess(true)
      await loadSources()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred during upload")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = async () => {
    if (!websiteName) return
    setError(null)
    setIsRemoving(true)

    try {
      const res = await fetch("/api/cookies", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: websiteName }),
      })

      if (!res.ok) {
        throw new Error("Failed to clear cookies")
      }

      setSuccess(true)
      await loadSources()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear cookies")
    } finally {
      setIsRemoving(false)
    }
  }

  const selectedSource = sources.find(s => s.name === websiteName)
  const hasCookies = !!selectedSource?.cookies_url

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Cookies</DialogTitle>
          <DialogDescription>
            Paste your exported cookies as JSON and provide a website name. These will be securely stored for scraping.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && (
            <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/5 p-3 text-green-600 text-sm">
              <Check className="h-4 w-4 shrink-0" />
              <p>Cookies uploaded successfully!</p>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="website">Website Name</Label>
             <Select value={websiteName} onValueChange={(v) => setWebsiteName(v)} disabled={isUploading || success}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a website" />
                </SelectTrigger>
                <SelectContent>
                  {
                    websiteNames.map((name)=>(
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cookies">Cookie Data (JSON)</Label>
            <Textarea
              id="cookies"
              placeholder="[{...}, {...}]"
              className="h-40 font-mono text-xs"
              value={cookieJson}
              onChange={(e) => setCookieJson(e.target.value)}
              disabled={isUploading || success}
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex-1 flex justify-start">
             {hasCookies && !success && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleRemove} 
                disabled={isUploading || isRemoving}
                className="w-full sm:w-auto"
              >
                {isRemoving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Remove Cookies
              </Button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isUploading || isRemoving}>
              {success ? "Close" : "Cancel"}
            </Button>
            {!success && (
              <Button onClick={handleSave} disabled={isUploading || isRemoving}>
                {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUploading ? "Uploading..." : "Save Cookies"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
