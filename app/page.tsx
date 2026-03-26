"use client"
import { AppSidebar, MobileHeader } from "@/components/app-sidebar"
import { DigestList } from "@/components/digest-list"
import { DigestStats } from "@/components/digest-stats"
import { mockDigestItems } from "@/lib/mock-data"
import { format } from "date-fns"
import { RefreshCw, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import emailjs from "@emailjs/browser"
import { toast } from "sonner"
export default function DigestPage() {
  const today = new Date()

  const [digestItems, setDigestItems] = useState<[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
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
      localStorage.clear();
localStorage.setItem(
  "last_updates",
  new Date(data.items[0].created_at) .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
);
    } catch (error) {
      console.error("Error fetching digest items:", error)
      setError("Failed to fetch digest items")
    } finally {
      setLoading(false)
    }
  }

  const handleSendDigest = async () => {
    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

      if (!serviceId || !templateId || !publicKey) {
        toast.error("EmailJS configuration missing in environment variables.")
        return
      }

      const topItems = digestItems.slice(0, 3)
      const uniqueSources = new Set(digestItems.map((item: any) => item.source_name)).size
      const avgRelevance = digestItems.length > 0 
        ? Math.round(digestItems.reduce((acc: number, item: any) => acc + item.relevance_score, 0) / digestItems.length)
        : 0

      const templateParams: Record<string, any> = {
        date: format(new Date(), "EEEE, MMMM d, yyyy"),
        item_count: digestItems.length,
        source_count: uniqueSources,
        avg_relevance: avgRelevance,
        recipient_name: "User",
        dashboard_url: window.location.origin,
        settings_url: `${window.location.origin}/settings`,
        year: new Date().getFullYear()
      }

      // Map top 3 items
      topItems.forEach((item: any, index: number) => {
        const i = index + 1
        templateParams[`item${i}_title`] = item.title
        templateParams[`item${i}_source`] = item.source_name
        templateParams[`item${i}_author`] = item.author || "Unknown Author"
        templateParams[`item${i}_date`] = format(new Date(item.published_at), "MMM d")
        templateParams[`item${i}_summary`] = item.summary
        templateParams[`item${i}_relevance`] = item.relevance_score
        templateParams[`item${i}_url`] = item.url
        templateParams[`item${i}_type`] = item.type.charAt(0).toUpperCase() + item.type.slice(1)
      })

      const promise = emailjs.send(serviceId, templateId, templateParams, publicKey)

      toast.promise(promise, {
        loading: "Sending your daily digest...",
        success: "Digest sent successfully to your email!",
        error: "Failed to send digest. Please check your configuration.",
      })

      const res = await promise
      console.log("EmailJS Response:", res)
    } catch (e) {
      console.error("Error sending digest:", e)
      toast.error("An unexpected error occurred while sending the email.")
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
              {/* <Button variant="outline" size="sm" className="gap-2 shadow-sm">
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </Button> */}
              <Button onClick={handleSendDigest} size="sm" className="gap-2 shadow-sm">
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
