import { NextResponse } from "next/server"
import { db } from "@/src/server/db"
import { qrCodes } from "@/src/server/db/schema"
import { eq } from "drizzle-orm"

// GET /api/qr-code/scan/[id] - Track a QR code scan and redirect to the URL
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const [qrCode] = await db.select().from(qrCodes).where(eq(qrCodes.id, id))

    if (!qrCode) {
      return NextResponse.json({ error: "QR code not found" }, { status: 404 })
    }

    // Increment scan count
    await db
      .update(qrCodes)
      .set({
        scans: qrCode.scans + 1,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(qrCodes.id, id))

    // Redirect to the URL
    return NextResponse.redirect(qrCode.url)
  } catch (error) {
    console.error("Error scanning QR code:", error)
    return NextResponse.json({ error: "Failed to process QR code scan" }, { status: 500 })
  }
}

