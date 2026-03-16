"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Newspaper, 
  Rss, 
  UserCircle, 
  Settings,
  Sparkles
} from "lucide-react"

const navigation = [
  { name: "Today's Digest", href: "/", icon: Newspaper },
  { name: "Sources", href: "/sources", icon: Rss },
  { name: "Interest Profile", href: "/profile", icon: UserCircle },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold text-sidebar-foreground">Daily Digest</span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border p-4">
          <div className="rounded-lg bg-sidebar-accent/50 p-4">
            <p className="text-xs text-muted-foreground">Last updated</p>
            <p className="text-sm font-medium text-sidebar-foreground">
              Today at 7:00 AM
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
