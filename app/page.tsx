import { AppSidebar } from "@/components/app-sidebar"
import { DigestList } from "@/components/digest-list"
import { DigestStats } from "@/components/digest-stats"
import { mockDigestItems } from "@/lib/mock-data"
import { format } from "date-fns"
import { RefreshCw, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DigestPage() {
  const today = new Date()

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      
      <main className="pl-60">
        <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex h-16 items-center justify-between px-8">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">Today's Digest</h1>
              <p className="text-sm text-muted-foreground">
                {format(today, "EEEE, MMMM d, yyyy")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 shadow-sm">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button size="sm" className="gap-2 shadow-sm">
                <Mail className="h-4 w-4" />
                Send Digest
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8 max-w-6xl">
          <DigestStats items={mockDigestItems} />
          
          <div className="mt-8">
            <DigestList items={mockDigestItems} />
          </div>
        </div>
      </main>
    </div>
  )
}
