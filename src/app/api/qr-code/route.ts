import { NextResponse } from "next/server"
import { db } from "@/src/server/db"
import { qrCodes } from "@/src/server/db/schema"
import { desc } from "drizzle-orm"

// GET /api/qr-code - Get all QR codes
export async function GET() {
  try {
    const allQrCodes = await db.select().from(qrCodes).orderBy(desc(qrCodes.createdAt))

    return NextResponse.json({ qrCodes: allQrCodes })
  } catch (error) {
    console.error("Error fetching QR codes:", error)
    return NextResponse.json({ error: "Failed to fetch QR codes" }, { status: 500 })
  }
}

