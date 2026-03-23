import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
    try {
        const result = await sql`
            SELECT * FROM interest_profile
        `
        const countResult = await sql`SELECT COUNT(*) FROM interest_profile`
        const total = Number(countResult[0].count)

        return NextResponse.json({ items: result, total })
    } catch (error) {
        console.error("Error fetching interest profile:", error)
        return NextResponse.json({ error: "Failed to fetch interest profile" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { id,topics, geographic_focus, authors, keywords, description } = await request.json()
        const result = await sql`
            UPDATE interest_profile SET topics = ${topics}, geographic_focus = ${geographic_focus}, 
            authors = ${authors}, keywords = ${keywords}, description = ${description}
            WHERE id = ${id}
        `
        return NextResponse.json({ items: result })
    } catch (error) {
        console.error("Error updating interest profile:", error)
        return NextResponse.json({ error: "Failed to update interest profile" }, { status: 500 })
    }
}