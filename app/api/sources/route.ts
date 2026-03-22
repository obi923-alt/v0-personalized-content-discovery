import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Source } from "@/lib/types"

const getDb = () => {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set")
  return neon(process.env.DATABASE_URL)
}

// ── GET /api/sources ──────────────────────────────────────────────────────────
export async function GET() {
  try {
    const sql = getDb()
    const rows = await sql`
      SELECT id, name, url, type, category, enabled, last_crawled
      FROM sources
      ORDER BY name ASC
    `
    const sources: Source[] = rows.map((row) => ({
      id:          String(row.id),
      name:        row.name,
      url:         row.url,
      type:        row.type,
      category:    row.category ?? "",
      enabled:     row.enabled ?? true,
      lastFetched: row.last_crawled ? new Date(row.last_crawled) : undefined,
    }))
    return NextResponse.json(sources)
  } catch (err) {
    console.error("GET /api/sources:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch sources" },
      { status: 500 }
    )
  }
}

// ── POST /api/sources ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const sql = getDb()
    const { name, url, type, category } = await req.json()

    if (!name || !url || !type) {
      return NextResponse.json({ error: "name, url, and type are required" }, { status: 400 })
    }

    const rows = await sql`
      INSERT INTO sources (name, url, type, category, enabled)
      VALUES (${name}, ${url}, ${type}, ${category ?? ""}, true)
      RETURNING id, name, url, type, category, enabled, last_crawled
    `
    const source: Source = {
      id:          String(rows[0].id),
      name:        rows[0].name,
      url:         rows[0].url,
      type:        rows[0].type,
      category:    rows[0].category ?? "",
      enabled:     rows[0].enabled ?? true,
      lastFetched: rows[0].last_crawled ? new Date(rows[0].last_crawled) : undefined,
    }
    return NextResponse.json(source, { status: 201 })
  } catch (err) {
    console.error("POST /api/sources:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create source" },
      { status: 500 }
    )
  }
}

// ── PATCH /api/sources?id=123 ─────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const sql = getDb()
    const id = new URL(req.url).searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 })
    }

    const { name, url, type, category } = await req.json()

    if (!name || !url || !type) {
      return NextResponse.json({ error: "name, url, and type are required" }, { status: 400 })
    }

    const rows = await sql`
      UPDATE sources
      SET name = ${name}, url = ${url}, type = ${type}, category = ${category ?? ""}
      WHERE id = ${id}
      RETURNING id, name, url, type, category, enabled, last_crawled
    `

    if (rows.length === 0) {
      return NextResponse.json({ error: "Source not found" }, { status: 404 })
    }

    const source: Source = {
      id:          String(rows[0].id),
      name:        rows[0].name,
      url:         rows[0].url,
      type:        rows[0].type,
      category:    rows[0].category ?? "",
      enabled:     rows[0].enabled ?? true,
      lastFetched: rows[0].last_crawled ? new Date(rows[0].last_crawled) : undefined,
    }
    return NextResponse.json(source)
  } catch (err) {
    console.error("PATCH /api/sources:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update source" },
      { status: 500 }
    )
  }
}

// ── DELETE /api/sources?id=123 ────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const sql = getDb()
    const id = new URL(req.url).searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 })
    }

    await sql`DELETE FROM sources WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("DELETE /api/sources:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete source" },
      { status: 500 }
    )
  }
}