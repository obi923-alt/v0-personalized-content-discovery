"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  Newspaper, 
  Rss, 
  UserCircle, 
  Settings,
  Sparkles,
  Menu
} from "lucide-react"

const navigation = [
  { name: "Today's Digest", href: "/", icon: Newspaper },
  { name: "Sources", href: "/sources", icon: Rss },
  { name: "Interest Profile", href: "/profile", icon: UserCircle },
  { name: "Settings", href: "/settings", icon: Settings },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  const lastUpdated =  "00:00 AM"

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-base font-semibold tracking-tight text-sidebar-foreground">Daily Digest</span>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary shadow-sm"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("h-[18px] w-[18px]", isActive && "text-primary")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="rounded-lg bg-sidebar-accent/60 p-3.5">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Last updated</p>
          <p className="mt-0.5 text-sm font-medium text-sidebar-foreground">
            Today at {lastUpdated}
          </p>
        </div>
      </div>
    </div>
  )
}

export function MobileHeader() {
  const [open, setOpen] = useState(false)

  return (
    <div className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0 bg-sidebar">
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
          <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <span className="font-semibold text-foreground">Daily Digest</span>
      </div>
    </div>
  )
}

export function AppSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-60 border-r border-border bg-sidebar lg:block">
      <SidebarContent />
    </aside>
  )
}
