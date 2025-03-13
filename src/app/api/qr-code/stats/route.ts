import { NextResponse } from "next/server"
import { db } from "@/src/server/db"
import { qrCodes } from "@/src/server/db/schema"
import { desc, sql, sum } from "drizzle-orm"

// GET /api/qr-code/stats - Get statistics for all QR codes
export async function GET() {
  try {
    // Get total scans across all QR codes
    const [totalScansResult] = await db.select({ total: sum(qrCodes.scans) }).from(qrCodes)

    const totalScans = totalScansResult?.total || 0

    // Get total number of QR codes
    const totalQrCodesResult = await db.select({ count: sql<number>`count(*)` }).from(qrCodes)

    const totalQrCodes = totalQrCodesResult[0]?.count || 0

    // Get top 5 most scanned QR codes
    const topQrCodes = await db
      .select({
        id: qrCodes.id,
        name: qrCodes.name,
        url: qrCodes.url,
        scans: qrCodes.scans,
      })
      .from(qrCodes)
      .orderBy(desc(qrCodes.scans))
      .limit(5)

    return NextResponse.json({
      totalScans,
      totalQrCodes,
      topQrCodes,
    })
  } catch (error) {
    console.error("Error fetching QR code stats:", error)
    return NextResponse.json({ error: "Failed to fetch QR code statistics" }, { status: 500 })
  }
}

