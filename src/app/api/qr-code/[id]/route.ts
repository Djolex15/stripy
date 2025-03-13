import { NextResponse } from "next/server"
import { db } from "@/src/server/db"
import { qrCodes } from "@/src/server/db/schema"
import { eq } from "drizzle-orm"

// GET /api/qr-code/[id] - Get a specific QR code image
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const [qrCode] = await db.select().from(qrCodes).where(eq(qrCodes.id, id))

    if (!qrCode || !qrCode.imageData) {
      return NextResponse.json({ error: "QR code not found" }, { status: 404 })
    }

    // Convert base64 to binary
    const buffer = Buffer.from(qrCode.imageData, "base64")

    // Return the image with proper content type
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error fetching QR code:", error)
    return NextResponse.json({ error: "Failed to fetch QR code" }, { status: 500 })
  }
}

// DELETE /api/qr-code/[id] - Delete a QR code
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    await db.delete(qrCodes).where(eq(qrCodes.id, id))

    return NextResponse.json({
      success: true,
      message: "QR code deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting QR code:", error)
    return NextResponse.json({ error: "Failed to delete QR code" }, { status: 500 })
  }
}

