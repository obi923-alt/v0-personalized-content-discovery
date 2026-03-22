import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const getDb = () => {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set")
  return neon(process.env.DATABASE_URL)
}

export type SettingsRow = {
  email:              string
  deliveryTime:       string
  maxItems:           number
  relevanceThreshold: number
  emailNotifications: boolean
  paywallBypass:      boolean
  updatedAt:          string | null
}

function rowToSettings(row: Record<string, unknown>): SettingsRow {
  return {
    email:              String(row.email ?? ""),
    deliveryTime:       String(row.delivery_time ?? "07:00"),
    maxItems:           Number(row.max_items ?? 25),
    relevanceThreshold: Number(row.relevance_threshold ?? 70),
    emailNotifications: Boolean(row.email_notifications ?? true),
    paywallBypass:      Boolean(row.paywall_bypass ?? true),
    updatedAt:          row.updated_at ? String(row.updated_at) : null,
  }
}

// ── GET /api/settings ─────────────────────────────────────────────────────────
export async function GET() {
  try {
    const sql = getDb()
    const rows = await sql`
      SELECT id, email, delivery_time, max_items, relevance_threshold,
             email_notifications, paywall_bypass, updated_at
      FROM app_settings
      LIMIT 1
    `
    if (rows.length === 0) {
      return NextResponse.json({
        email: "", deliveryTime: "07:00", maxItems: 25, relevanceThreshold: 70,
        emailNotifications: true, paywallBypass: true, updatedAt: null,
      })
    }
    return NextResponse.json(rowToSettings(rows[0]))
  } catch (err) {
    console.error("GET /api/settings:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

// ── PATCH /api/settings ───────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const sql = getDb()
    const {
      email, deliveryTime, maxItems, relevanceThreshold,
      emailNotifications, paywallBypass,
    } = await req.json()

    const rows = await sql`
      UPDATE app_settings SET
        email               = COALESCE(${email               ?? null}, email),
        delivery_time       = COALESCE(${deliveryTime        ?? null}, delivery_time),
        max_items           = COALESCE(${maxItems            ?? null}, max_items),
        relevance_threshold = COALESCE(${relevanceThreshold  ?? null}, relevance_threshold),
        email_notifications = COALESCE(${emailNotifications  ?? null}, email_notifications),
        paywall_bypass      = COALESCE(${paywallBypass       ?? null}, paywall_bypass),
        updated_at          = NOW()
      WHERE id = (SELECT id FROM app_settings LIMIT 1)
      RETURNING id, email, delivery_time, max_items, relevance_threshold,
                email_notifications, paywall_bypass, updated_at
    `
    if (rows.length === 0) {
      return NextResponse.json({ error: "No settings row found" }, { status: 404 })
    }
    return NextResponse.json(rowToSettings(rows[0]))
  } catch (err) {
    console.error("PATCH /api/settings:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save settings" },
      { status: 500 }
    )
  }
}