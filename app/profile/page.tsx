"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { TagInput } from "@/components/tag-input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockInterestProfile } from "@/lib/mock-data"
import type { InterestProfile } from "@/lib/types"
import { Save, Sparkles, MapPin, Users, Hash, FileText } from "lucide-react"

export default function ProfilePage() {
  const [profile, setProfile] = useState<InterestProfile>(mockInterestProfile)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateProfile = <K extends keyof InterestProfile>(
    key: K,
    value: InterestProfile[K]
  ) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      
      <main className="pl-60">
        <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex h-16 items-center justify-between px-8">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">Interest Profile</h1>
              <p className="text-sm text-muted-foreground">
                Define your editorial interests for AI filtering
              </p>
            </div>
            <Button onClick={handleSave} className="gap-2 shadow-sm">
              <Save className="h-4 w-4" />
              {saved ? "Saved!" : "Save Profile"}
            </Button>
          </div>
        </div>

        <div className="p-8 max-w-4xl">
          <div className="rounded-xl border border-border bg-card p-6 mb-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">How it works</h2>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  Your interest profile helps the AI evaluate content relevance. Articles and tweets are 
                  scored based on how well they match your topics, geographic focus, preferred authors, 
                  and keywords. The more specific your profile, the better the filtering.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-chart-1" />
                  <CardTitle className="text-sm font-medium">Description</CardTitle>
                </div>
                <CardDescription>
                  A brief description of your work and what kind of content you're looking for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={profile.description}
                  onChange={(e) => updateProfile("description", e.target.value)}
                  className="min-h-[120px] bg-card border-border"
                  placeholder="Describe your editorial focus..."
                />
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-chart-1" />
                  <CardTitle className="text-sm font-medium">Topics</CardTitle>
                </div>
                <CardDescription>
                  Subject areas you write about or want to stay informed on
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TagInput
                  tags={profile.topics}
                  onChange={(tags) => updateProfile("topics", tags)}
                  placeholder="Add a topic and press Enter..."
                />
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-chart-2" />
                  <CardTitle className="text-sm font-medium">Geographic Focus</CardTitle>
                </div>
                <CardDescription>
                  Regions, countries, or cities you focus on
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TagInput
                  tags={profile.geographicFocus}
                  onChange={(tags) => updateProfile("geographicFocus", tags)}
                  placeholder="Add a location and press Enter..."
                />
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-chart-3" />
                  <CardTitle className="text-sm font-medium">Authors & Voices</CardTitle>
                </div>
                <CardDescription>
                  Writers, researchers, or thought leaders whose work you follow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TagInput
                  tags={profile.authors}
                  onChange={(tags) => updateProfile("authors", tags)}
                  placeholder="Add an author and press Enter..."
                />
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-chart-5" />
                  <CardTitle className="text-sm font-medium">Keywords</CardTitle>
                </div>
                <CardDescription>
                  Specific terms, concepts, or phrases that indicate relevance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TagInput
                  tags={profile.keywords}
                  onChange={(tags) => updateProfile("keywords", tags)}
                  placeholder="Add a keyword and press Enter..."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
