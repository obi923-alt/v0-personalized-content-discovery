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
    const body = await request.json()

    // Handle feedback update
    if ("feedback" in body) {
      const { id, feedback } = body

      if (feedback !== "thumbs up" && feedback !== "thumbs down" && feedback !== null) {
        return NextResponse.json({ error: "Invalid feedback value" }, { status: 400 })
      }

      await sql`UPDATE digest_items SET feedback = ${feedback} WHERE id = ${id}`
      return NextResponse.json({ success: true })
    }

    // Handle save/unsave toggle
    if ("id" in body) {
      const { id } = body
      await sql`UPDATE digest_items SET saved = NOT saved WHERE id = ${id}`
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  } catch (error) {
    console.error("Error updating digest item:", error)
    return NextResponse.json({ error: "Failed to update digest item" }, { status: 500 })
  }
}