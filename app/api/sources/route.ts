import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Source } from "@/lib/types"

const getDb = () => {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set")
  return neon(process.env.DATABASE_URL)
}

// ── Shared row → Source mapper ────────────────────────────────────────────────
function rowToSource(row: Record<string, unknown>): Source {
  return {
    id:          String(row.id),
    name:        row.name as string,
    url:         row.url as string,
    type:        row.type as Source["type"],
    category:    (row.category as string) ?? "",
    enabled:     (row.enabled as boolean) ?? true,
    lastFetched: row.last_crawled ? new Date(row.last_crawled as string) : undefined,
    cookies_url: row.cookies_url as string | undefined,
  }
}

// ── GET /api/sources ──────────────────────────────────────────────────────────
export async function GET() {
  try {
    const sql = getDb()
    const rows = await sql`
      SELECT id, name, url, type, category, enabled, last_crawled, cookies_url
      FROM sources
      ORDER BY name ASC
    `
    return NextResponse.json(rows.map(rowToSource))
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
    return NextResponse.json(rowToSource(rows[0]), { status: 201 })
  } catch (err) {
    console.error("POST /api/sources:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create source" },
      { status: 500 }
    )
  }
}

// ── PATCH /api/sources?id=123 ─────────────────────────────────────────────────
// Handles two shapes:
//   { enabled: boolean }              → toggle only
//   { name, url, type, category }     → full field update
export async function PATCH(req: NextRequest) {
  try {
    const sql = getDb()
    const id = new URL(req.url).searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 })
    }

    const body = await req.json()

    // ── Toggle-only update ──────────────────────────────────────────────────
    if ("enabled" in body && Object.keys(body).length === 1) {
      const rows = await sql`
        UPDATE sources
        SET enabled = ${body.enabled}
        WHERE id = ${id}
        RETURNING id, name, url, type, category, enabled, last_crawled
      `
      if (rows.length === 0) {
        return NextResponse.json({ error: "Source not found" }, { status: 404 })
      }
      return NextResponse.json(rowToSource(rows[0]))
    }

    // ── Full field update ───────────────────────────────────────────────────
    const { name, url, type, category } = body

    if (!name || !url || !type) {
      return NextResponse.json({ error: "name, url, and type are required" }, { status: 400 })
    }

    const rows = await sql`
      UPDATE sources
      SET name     = ${name},
          url      = ${url},
          type     = ${type},
          category = ${category ?? ""}
      WHERE id = ${id}
      RETURNING id, name, url, type, category, enabled, last_crawled
    `
    if (rows.length === 0) {
      return NextResponse.json({ error: "Source not found" }, { status: 404 })
    }
    return NextResponse.json(rowToSource(rows[0]))
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