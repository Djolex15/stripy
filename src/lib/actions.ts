"use server"

import type { OrderInquiry } from "./types"
import { db } from "../server/db"
import { generateId, trackPromoCodeUsage } from "../lib/query"
import { orders, orderItems } from "../server/db/schema"

export async function sendOrderInquiry(orderData: OrderInquiry) {
  try {
    const orderId = await generateId()

    // Use the currency passed from the order page component
    const currency = orderData.currency || "EUR" // Default to EUR if not provided

    // Convert price to integer (cents/paras) for storage
    // For RSD, the price is already in whole units
    // For EUR, the price is already in cents from the frontend
    const totalPriceInt = orderData.totalPrice

    // Insert order into database
    await db
      .insert(orders)
      .values({
        id: orderId,
        customerName: orderData.customerInfo.name,
        customerEmail: orderData.customerInfo.email,
        customerPhone: orderData.customerInfo.phone,
        address: orderData.customerInfo.address,
        apartmentNumber: orderData.customerInfo.apartmentNumber || null,
        city: orderData.customerInfo.city,
        postalCode: orderData.customerInfo.postalCode,
        notes: orderData.customerInfo.notes || null,
        totalPrice: totalPriceInt,
        currency,
        promoCode: orderData.appliedPromoCode || null,
        createdAt: new Date().toISOString(),
      })
      .execute()

    // Insert order items
    for (const item of orderData.orderItems) {
      const productName = currency === "RSD" ? item.product.nameSr : item.product.nameEn
      const productPrice = currency === "RSD" ? item.product.priceSr : Math.round(item.product.price * 100) // Convert EUR to cents

      const itemId = await generateId()
      await db
        .insert(orderItems)
        .values({
          id: itemId,
          orderId,
          productId: item.product.id,
          productName,
          quantity: item.quantity,
          price: productPrice,
          currency,
        })
        .execute()
    }

    // Track promo code usage if one was applied
    if (orderData.appliedPromoCode) {
      await trackPromoCodeUsage(orderData.appliedPromoCode, orderId)
    }

    // Return success with order ID
    return { success: true, orderId }
  } catch (error) {
    console.error("Failed to send order inquiry:", error)
    throw new Error("Failed to send order inquiry")
  }
}

export async function getPromoCodeStats() {
  try {
    // Get all promo codes with their usage statistics
    const result = await db.query.promoCodes.findMany({
      with: {
        usage: true,
      },
    })

    return result
  } catch (error) {
    console.error("Failed to get promo code stats:", error)
    throw new Error("Failed to get promo code statistics")
  }
}

