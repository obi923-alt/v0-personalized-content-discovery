import { AppSidebar, MobileHeader } from "@/components/app-sidebar"
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
          <DigestStats items={mockDigestItems} />
          
          <div className="mt-6 lg:mt-8">
            <DigestList items={mockDigestItems} />
          </div>
        </div>
      </main>
    </div>
  )
}
