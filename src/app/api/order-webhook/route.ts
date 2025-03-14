import { NextResponse } from "next/server"
import { db } from "@/src/server/db"
import { orders } from "@/src/server/db/schema"
import { eq } from "drizzle-orm"
import { updatePromoCodeEarnings, calculateAndUpdateBusinessMetrics } from "@/src/lib/business-metrics"

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json()

    // Get the order details
    const orderResult = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1).execute()

    if (!orderResult.length) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    const order = orderResult[0]

    // If the order has a promo code, update the earnings
    if (order.promoCode) {
      await updatePromoCodeEarnings(orderId, order.promoCode, order.totalPrice)
    }

    // Recalculate all business metrics
    await calculateAndUpdateBusinessMetrics()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing order webhook:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

