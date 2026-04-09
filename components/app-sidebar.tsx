"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { 
  Newspaper, 
  Rss, 
  UserCircle, 
  Settings,
  Sparkles,
  Menu
} from "lucide-react"
import { useSettings } from "@/app/context/SettingsContext"
import { useInterestProfile } from "@/app/context/InterestProfileContext"

const navigation = [
  { name: "Today's Digest", href: "/", icon: Newspaper },
  { name: "Sources", href: "/sources", icon: Rss },
  { name: "Interest Profile", href: "/profile", icon: UserCircle },
  { name: "Settings", href: "/settings", icon: Settings },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isDirty: isSettingsDirty, setIsDirty: setSettingsDirty } = useSettings()
  const { isDirty: isProfileDirty, setIsDirty: setProfileDirty } = useInterestProfile()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingHref, setPendingHref] = useState<string | null>(null)

  const lastUpdated = "10:00AM"

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname !== href && (isSettingsDirty || isProfileDirty)) {
      e.preventDefault()
      setPendingHref(href)
      setShowConfirmDialog(true)
      return
    }
    onNavigate?.()
  }

  const handleConfirmLeave = () => {
    if (pendingHref) {
      setSettingsDirty(false)
      setProfileDirty(false)
      router.push(pendingHref)
      onNavigate?.()
    }
    setShowConfirmDialog(false)
    setPendingHref(null)
  }

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
              onClick={(e) => handleNavigate(e, item.href)}
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

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes in your profile or settings. Are you sure you want to leave? Your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingHref(null)}>Stay</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmLeave}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Leave anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
