"use client"

import { useState, useEffect } from "react"
import { AppSidebar, MobileHeader } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Save, Mail, SlidersHorizontal, Shield, Database,
  Loader2, AlertCircle, Check,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useSettings } from "../context/SettingsContext"

type Settings = {
  email:              string
  deliveryTime:       string
  maxItems:           number
  relevanceThreshold: number
  emailNotifications: boolean
  paywallBypass:      boolean
  updatedAt:          string | null
}

const DEFAULTS: Settings = {
  email:              "",
  deliveryTime:       "07:00",
  maxItems:           25,
  relevanceThreshold: 70,
  emailNotifications: true,
  paywallBypass:      true,
  updatedAt:          null,
}

export default function SettingsPage() {
  const { settings, loading, error, setSettings, setError, isDirty, setIsDirty } = useSettings()
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // ── Save ─────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:              settings.email,
          deliveryTime:       settings.deliveryTime,
          maxItems:           settings.maxItems,
          relevanceThreshold: settings.relevanceThreshold,
          emailNotifications: settings.emailNotifications,
          paywallBypass:      settings.paywallBypass,
        }),
      })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? "Failed to save settings")
      }
      setSettings(await res.json())
      setSaved(true)
      setIsDirty(false)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setSaving(false)
    }
  }

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev: Settings) => ({ ...prev, [key]: value }))
    setIsDirty(true)
  }

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
                Settings
              </h1>
              {/* <p className="hidden text-sm text-muted-foreground sm:block">
                {settings.updatedAt
                  ? `Last saved ${formatDistanceToNow(new Date(settings.updatedAt), { addSuffix: true })}`
                  : "Configure your digest delivery"}
              </p> */}
            </div>
            <Button onClick={handleSave} disabled={saving || loading} className="gap-2 shadow-sm">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" />
                : saved  ? <Check   className="h-4 w-4" />
                :           <Save    className="h-4 w-4" />}
              <span className="hidden sm:inline">
                {saving ? "Saving…" : saved ? "Saved!" : "Save Settings"}
              </span>
              <span className="sm:hidden">
                {saving ? "…" : saved ? "✓" : "Save"}
              </span>
            </Button>
          </div>
        </div>

        <div className="p-4 lg:p-8 lg:max-w-2xl">

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center gap-2 py-24 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading settings…</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-destructive mb-5">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Something went wrong</p>
                <p className="text-xs opacity-80">{error}</p>
              </div>
            </div>
          )}

          {/* Content */}
          {!loading && (
            <div className="space-y-4 sm:space-y-5">

              {/* Email Delivery */}
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-chart-1" />
                    <CardTitle className="text-sm font-medium">Email Delivery</CardTitle>
                  </div>
                  <CardDescription className="text-xs sm:text-sm">
                    Configure where and when to receive your daily digest
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="bg-card border-border"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-sm">Delivery Time</Label>
                    <Input
                      id="time" 
                      type="time"
                      max={"06:00"}
                      value={settings.deliveryTime}
                      onChange={(e) => update("deliveryTime", e.target.value)}
                      className="bg-card border-border w-32"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your digest will be delivered daily at this time
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive the digest via email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(v) => update("emailNotifications", v)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Filtering */}
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-chart-2" />
                    <CardTitle className="text-sm font-medium">Filtering</CardTitle>
                  </div>
                  <CardDescription className="text-xs sm:text-sm">
                    Control how content is filtered and ranked
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Maximum Items</Label>
                      <span className="text-sm font-medium text-foreground">{settings.maxItems}</span>
                    </div>
                    <Slider
                      value={[settings.maxItems]}
                      onValueChange={([v]) => update("maxItems", v)}
                      min={10} max={30} step={5}
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum number of items to include in each digest
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Relevance Threshold</Label>
                      <span className="text-sm font-medium text-foreground">{settings.relevanceThreshold}%</span>
                    </div>
                    <Slider
                      value={[settings.relevanceThreshold]}
                      onValueChange={([v]) => update("relevanceThreshold", v)}
                      min={30} max={95} step={5}
                    />
                    <p className="text-xs text-muted-foreground">
                      Only include items with relevance scores above this threshold
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Content Access */}
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-chart-2" />
                    <CardTitle className="text-sm font-medium">Content Access</CardTitle>
                  </div>
                  <CardDescription className="text-xs sm:text-sm">
                    Configure authentication for paywalled content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Paywall Bypass</Label>
                      <p className="text-xs text-muted-foreground">
                        Use stored cookies to access subscriber content
                      </p>
                    </div>
                    <Switch
                      checked={settings.paywallBypass}
                      onCheckedChange={(v) => update("paywallBypass", v)}
                    />
                  </div>
                  <div className="rounded-lg bg-secondary p-3 sm:p-4">
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      To access paywalled content, export your browser cookies for each site
                      and upload them to the system. This allows the scraper to access content
                      you have legitimate access to through your subscriptions.
                    </p>
                    <Button variant="outline" size="sm" className="mt-3">
                      Manage Cookies
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Data */}
              {/* <Card className="border-border shadow-sm">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-chart-3" />
                    <CardTitle className="text-sm font-medium">Data</CardTitle>
                  </div>
                  <CardDescription className="text-xs sm:text-sm">
                    Manage your data and pipeline settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-foreground">Export Configuration</p>
                      <p className="text-xs text-muted-foreground">Download your sources and profile as JSON</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">Export</Button>
                  </div>
                  <div className="flex flex-col gap-3 pt-2 border-t border-border sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-foreground">Import Configuration</p>
                      <p className="text-xs text-muted-foreground">Load sources and profile from a file</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">Import</Button>
                  </div>
                  <div className="flex flex-col gap-3 pt-2 border-t border-border sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-destructive">Reset All Data</p>
                      <p className="text-xs text-muted-foreground">Clear all sources, profile, and settings</p>
                    </div>
                    <Button variant="destructive" size="sm" className="w-full sm:w-auto">Reset</Button>
                  </div>
                </CardContent>
              </Card> */}

            </div>
          )}
        </div>
      </main>
    </div>
  )
}