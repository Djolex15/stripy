import { NextResponse } from "next/server"
import { db } from "@/src/server/db"
import { reviews } from "@/src/server/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    // Get reviews for the specified product
    const productReviews = await db.query.reviews.findMany({
      where: eq(reviews.productId, productId),
      orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
    })

    // Return only the necessary fields for display (exclude email)
    const sanitizedReviews = productReviews.map((review) => ({
      id: review.id,
      productId: review.productId,
      name: review.name,
      rating: review.rating,
      comment: review.comment,
      language: review.language,
      createdAt: review.createdAt,
    }))

    return NextResponse.json(sanitizedReviews)
  } catch (error) {
    console.error("Failed to fetch reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

