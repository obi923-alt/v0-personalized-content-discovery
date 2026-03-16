"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockSettings } from "@/lib/mock-data"
import type { DigestSettings } from "@/lib/types"
import { 
  Save, 
  Mail, 
  Clock, 
  SlidersHorizontal,
  Bell,
  Shield,
  Database
} from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState<DigestSettings>(mockSettings)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [paywallBypass, setPaywallBypass] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateSettings = <K extends keyof DigestSettings>(
    key: K,
    value: DigestSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      
      <main className="pl-64">
        <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-8">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground">
                Configure your digest delivery
              </p>
            </div>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              {saved ? "Saved!" : "Save Settings"}
            </Button>
          </div>
        </div>

        <div className="p-8">
          <div className="max-w-2xl space-y-6">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Email Delivery</CardTitle>
                </div>
                <CardDescription>
                  Configure where and when to receive your daily digest
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSettings("email", e.target.value)}
                    className="bg-secondary border-border"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Delivery Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={settings.deliveryTime}
                    onChange={(e) => updateSettings("deliveryTime", e.target.value)}
                    className="bg-secondary border-border w-32"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your digest will be delivered daily at this time
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive the digest via email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-chart-2" />
                  <CardTitle className="text-base">Filtering</CardTitle>
                </div>
                <CardDescription>
                  Control how content is filtered and ranked
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Maximum Items</Label>
                    <span className="text-sm font-medium text-foreground">{settings.maxItems}</span>
                  </div>
                  <Slider
                    value={[settings.maxItems]}
                    onValueChange={([value]) => updateSettings("maxItems", value)}
                    min={10}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum number of items to include in each digest
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Relevance Threshold</Label>
                    <span className="text-sm font-medium text-foreground">{settings.relevanceThreshold}%</span>
                  </div>
                  <Slider
                    value={[settings.relevanceThreshold]}
                    onValueChange={([value]) => updateSettings("relevanceThreshold", value)}
                    min={50}
                    max={95}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Only include items with relevance scores above this threshold
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-chart-3" />
                  <CardTitle className="text-base">Content Access</CardTitle>
                </div>
                <CardDescription>
                  Configure authentication for paywalled content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Paywall Bypass</Label>
                    <p className="text-xs text-muted-foreground">
                      Use stored cookies to access subscriber content
                    </p>
                  </div>
                  <Switch
                    checked={paywallBypass}
                    onCheckedChange={setPaywallBypass}
                  />
                </div>
                <div className="rounded-lg bg-secondary p-4">
                  <p className="text-sm text-muted-foreground">
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

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-chart-5" />
                  <CardTitle className="text-base">Data</CardTitle>
                </div>
                <CardDescription>
                  Manage your data and pipeline settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-foreground">Export Configuration</p>
                    <p className="text-xs text-muted-foreground">
                      Download your sources and profile as JSON/YAML
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-foreground">Import Configuration</p>
                    <p className="text-xs text-muted-foreground">
                      Load sources and profile from a file
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Import
                  </Button>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-destructive">Reset All Data</p>
                    <p className="text-xs text-muted-foreground">
                      Clear all sources, profile, and settings
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
