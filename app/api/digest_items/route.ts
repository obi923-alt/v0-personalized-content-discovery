"use client"

import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    const [settings] = await Promise.all([
      sql`SELECT * FROM app_settings`
    ])

    const [items, total] = await Promise.all([
      sql`
        SELECT * FROM digest_items
        WHERE (created_at >= NOW() - INTERVAL '1 day' OR saved = True)
        AND relevance_score >= ${settings[0].relevance_threshold}
        ORDER BY created_at DESC
        LIMIT ${settings[0].max_items}
      `,
      sql`
        SELECT COUNT(*) FROM digest_items
        WHERE (created_at >= NOW() - INTERVAL '1 day' OR saved = True)
        AND relevance_score >= ${settings[0].relevance_threshold}
      `
    ])

    return NextResponse.json({ items, total, page, limit })
  } catch (error) {
    console.error("Error fetching digest items:", error)
    return NextResponse.json({ error: "Failed to fetch digest items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json()
    await sql`UPDATE digest_items SET saved = NOT saved WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving digest item:", error)
    return NextResponse.json({ error: "Failed to save digest item" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, feedback } = await request.json()

    // Validate value
    if (feedback !== "thumbs_up" && feedback !== "thumbs_down") {
      return NextResponse.json({ error: "Invalid feedback value" }, { status: 400 })
    }

    // Toggle off if same value sent again
    await sql`
      UPDATE digest_items
      SET feedback = CASE
        WHEN feedback = ${feedback} THEN NULL
        ELSE ${feedback}
      END
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating feedback:", error)
    return NextResponse.json({ error: "Failed to update feedback" }, { status: 500 })
  }
}
