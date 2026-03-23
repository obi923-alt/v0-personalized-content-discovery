"use client"

import { useEffect, useState } from "react"
import { AppSidebar, MobileHeader } from "@/components/app-sidebar"
import { TagInput } from "@/components/tag-input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockInterestProfile } from "@/lib/mock-data"
import type { InterestProfile } from "@/lib/types"
import { Save, Sparkles, MapPin, Users, Hash, FileText } from "lucide-react"

export default function ProfilePage() {
  const [profile, setProfile] = useState<InterestProfile>(mockInterestProfile);
  const [saved, setSaved] = useState(false);
  const [hasEditted,setHasEditted] = useState(false);
  const [isSaving,setIsSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/interest_profile")
      const data = await response.json()
      setProfile(data.items[0])
      console.log("profile",data)
    } catch(e) {
      console.error("Error fetching profile",e)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const updateProfile = <K extends keyof InterestProfile>(
    key: K,
    value: InterestProfile[K]
  ) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
    setHasEditted(true)
    console.log("updating profile with",profile)
  }

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setHasEditted(false)
      const response = await fetch("/api/interest_profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      })
      const data = await response.json()
      setSaved(true)
      setTimeout(() =>{ 
        setIsSaving(false)
        setSaved(false)
      }, 2000)
    
      console.log("profile updated",data)
    } catch(e) {
      console.error("Error updating profile",e)
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
              <h1 className="text-base font-semibold tracking-tight text-foreground lg:text-lg">Interest Profile</h1>
              <p className="hidden text-sm text-muted-foreground sm:block">
                Define your editorial interests for AI filtering
              </p>
            </div>
            <Button onClick={handleSaveProfile} style={{cursor:"pointer"}} disabled={!hasEditted} className="gap-2 shadow-sm">
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">{saved ? "Saved!" : "Save Profile"}</span>
              <span className="sm:hidden">{saved ? "Saved!" : "Save"}</span>
            </Button>
          </div>
        </div>

        <div className="p-4 lg:p-8 lg:max-w-4xl">
          <div className="rounded-xl border border-border bg-card p-4 mb-5 shadow-sm sm:p-6 sm:mb-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 sm:h-12 sm:w-12 sm:rounded-xl">
                <Sparkles className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground sm:text-base">How it works</h2>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed sm:text-sm">
                  Your interest profile helps the AI evaluate content relevance. Articles and tweets are 
                  scored based on how well they match your topics, geographic focus, preferred authors, 
                  and keywords. The more specific your profile, the better the filtering.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:gap-5">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-chart-1" />
                  <CardTitle className="text-sm font-medium">Description</CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  A brief description of your work and what kind of content you're looking for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={profile.description}
                  onChange={(e) => updateProfile("description", e.target.value)}
                  className="min-h-[100px] bg-card border-border text-sm sm:min-h-[120px]"
                  placeholder="Describe your editorial focus..."
                />
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-chart-1" />
                  <CardTitle className="text-sm font-medium">Topics</CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm">
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
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-chart-2" />
                  <CardTitle className="text-sm font-medium">Geographic Focus</CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  Regions, countries, or cities you focus on
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TagInput
                  tags={profile.geographic_focus}
                  onChange={(tags) => updateProfile("geographic_focus", tags)}
                  placeholder="Add a location and press Enter..."
                />
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-chart-3" />
                  <CardTitle className="text-sm font-medium">Authors & Voices</CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm">
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
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-chart-5" />
                  <CardTitle className="text-sm font-medium">Keywords</CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm">
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
