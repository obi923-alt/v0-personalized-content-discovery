"use client"
import { AppSidebar, MobileHeader } from "@/components/app-sidebar"
import { DigestList } from "@/components/digest-list"
import { DigestStats } from "@/components/digest-stats"
import { mockDigestItems } from "@/lib/mock-data"
import { format } from "date-fns"
import { RefreshCw, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
export default function DigestPage() {
  const today = new Date()

  const [digestItems, setDigestItems] = useState<[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  })

  useEffect(() => {
    fetchDigestItems()
  }, [pagination.page])
  

  const fetchDigestItems = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/digest_items?page=${pagination.page}&limit=${pagination.limit}`)
      if (!response.ok) {
        throw new Error("Failed to fetch digest items")
      }
      const data = await response.json()
      console.log("the stuff",data.items)
      setDigestItems(data.items)
      setPagination(prev => ({ ...prev, total: data.total }))
    } catch (error) {
      console.error("Error fetching digest items:", error)
      setError("Failed to fetch digest items")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <MobileHeader />
      
      <main className="lg:pl-60">
        <div className="sticky top-14 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:top-0">
          <div className="flex h-14 items-center justify-between px-4 lg:h-16 lg:px-8">
            <div>
              <h1 className="text-base font-semibold tracking-tight text-foreground lg:text-lg">Today's Digest</h1>
              <p className="hidden text-sm text-muted-foreground sm:block">
                {format(today, "EEEE, MMMM d, yyyy")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 shadow-sm">
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button size="sm" className="gap-2 shadow-sm">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Send Digest</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-8 lg:max-w-6xl">
          <DigestStats items={digestItems} />
          
          <div className="mt-6 lg:mt-8">
            <DigestList items={digestItems} />
          </div>
        </div>
      </main>
    </div>
  )
}
