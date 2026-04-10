"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ExternalLink, Download, Key, Laptop, MousePointer2 } from "lucide-react"

export function CookieHelpModal({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            How to Upload Cookies
          </DialogTitle>
          <DialogDescription>
            Follow these steps to give the scraper access to subscriber-only content.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              1
            </div>
            <div className="space-y-1.5">
              <p className="font-medium leading-none">Install an Extension</p>
              <p className="text-sm text-muted-foreground">
                Install a browser extension like 
                <a 
                  href="https://cookie-editor.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mx-1 text-primary hover:underline inline-flex items-center gap-0.5"
                >
                  Cookie-Editor
                  <ExternalLink className="h-3 w-3" />
                </a>
                on Chrome, Firefox, or Edge.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              2
            </div>
            <div className="space-y-1.5">
              <p className="font-medium leading-none">Log in to the Website</p>
              <p className="text-sm text-muted-foreground">
                Visit the website you want to scrape (e.g. nytimes.com) and ensure you are logged into your subscriber account.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              3
            </div>
            <div className="space-y-1.5">
              <p className="font-medium leading-none">Export as JSON</p>
              <p className="text-sm text-muted-foreground">
                Open the extension, click the <strong>Export</strong> button, and choose the <strong>JSON</strong> format. This copies the data to your clipboard.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              4
            </div>
            <div className="space-y-1.5">
              <p className="font-medium leading-none">Paste and Save</p>
              <p className="text-sm text-muted-foreground">
                Click <strong>Manage Cookies</strong> below, select the website, and paste the JSON into the text field. Click Save to finish.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-muted p-4 text-xs text-muted-foreground">
          <p className="flex items-center gap-2 font-medium text-foreground mb-1">
            <Laptop className="h-3 w-3" />
            Security Tip
          </p>
          Your cookies are stored securely and only used to impersonate your browser session for the scraper to access content you already have rights to.
        </div>
      </DialogContent>
    </Dialog>
  )
}
