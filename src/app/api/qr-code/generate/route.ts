import { NextResponse } from "next/server"
import { db } from "@/src/server/db"
import { qrCodes } from "@/src/server/db/schema"
import QRCode from "qrcode"
import { nanoid } from "nanoid"

// POST /api/qr-code/generate - Generate a new QR code
export async function POST(request: Request) {
  try {
    const { url, name } = await request.json()

    // Validate URL
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    try {
      new URL(url)
    } catch (e) {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    // Generate a unique ID for the QR code
    const id = nanoid(10)

    // Get the base URL from environment or request
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
    const host = request.headers.get("host") || process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
    const baseUrl = `${protocol}://${host}`

    // Generate QR code data URL with absolute URL and custom styling
    const qrCodeDataUrl = await QRCode.toDataURL(`${baseUrl}/api/qr-code/scan/${id}`, {
      color: {
        dark: "#cbff01", // QR code color
        light: "#00000000", // Transparent background
      },
      margin: 1,
      width: 300,
    })

    // Store the QR code in the database
    await db.insert(qrCodes).values({
      id,
      name: name || url,
      url,
      scans: 0,
      imageData: qrCodeDataUrl.split(",")[1], // Store base64 data without the prefix
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      id,
      message: "QR code generated successfully",
    })
  } catch (error) {
    console.error("Error generating QR code:", error)
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 })
  }
}

