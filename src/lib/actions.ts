"use server"

import type { OrderInquiry, OrderWithItems } from "./types"
import { db } from "../server/db"
import { generateId, trackPromoCodeUsage } from "../lib/query"
import { orders, orderItems } from "../server/db/schema"
import { sendOrderConfirmationEmail, sendAdminNotificationEmail } from "./email"

/**
 * Process an order inquiry, save it to the database, and send confirmation emails
 */
export async function sendOrderInquiry(orderData: OrderInquiry) {
  try {
    // Generate a unique ID for the order
    const orderId = await generateId()

    // Set default currency if not provided
    const currency = orderData.currency || "EUR"
    const totalPriceInt = orderData.totalPrice

    // Insert the order into the database
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

    // Process and insert order items
    const orderItemsData = []
    for (const item of orderData.orderItems) {
      // Select the appropriate name and price based on currency
      const productName = currency === "RSD" ? item.product.nameSr : item.product.nameEn
      const productPrice = currency === "RSD" ? item.product.priceSr : Math.round(item.product.price * 100) // Convert EUR to cents

      // Generate a unique ID for the order item
      const itemId = await generateId()
      
      // Insert the order item into the database
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

      // Add the item to our local array for email purposes
      orderItemsData.push({
        id: itemId,
        orderId,
        productId: item.product.id,
        productName,
        quantity: item.quantity,
        price: productPrice,
        currency,
      })
    }

    // Track promo code usage if one was applied
    if (orderData.appliedPromoCode) {
      await trackPromoCodeUsage(orderData.appliedPromoCode, orderId)
    }

    // Prepare complete order data for emails
    const orderWithItems: OrderWithItems = {
      id: orderId,
      customerName: orderData.customerInfo.name,
      customerEmail: orderData.customerInfo.email,
      customerPhone: orderData.customerInfo.phone,
      address: orderData.customerInfo.address,
      apartmentNumber: orderData.customerInfo.apartmentNumber,
      city: orderData.customerInfo.city,
      postalCode: orderData.customerInfo.postalCode,
      notes: orderData.customerInfo.notes,
      totalPrice: totalPriceInt,
      currency,
      promoCode: orderData.appliedPromoCode,
      createdAt: new Date().toISOString(),
      items: orderItemsData,
    }

    // Handle email sending with graceful fallbacks
    await sendEmailsWithFallback(orderWithItems)

    // Return success with the order ID
    return { success: true, orderId }
  } catch (error) {
    console.error("Failed to process order:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    }
  }
}

/**
 * Get statistics for all promo codes
 */
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

/**
 * Send confirmation emails for an existing order
 */
export async function sendOrderConfirmationEmails(orderId: string) {
  try {
    // Fetch the order from the database
    const orderResult = await db.query.orders.findFirst({
      where: (orders, { eq }) => eq(orders.id, orderId),
    })

    if (!orderResult) {
      return { success: false, error: "Order not found" }
    }

    // Fetch the order items
    const orderItemsResult = await db.query.orderItems.findMany({
      where: (orderItems, { eq }) => eq(orderItems.orderId, orderId),
    })

    // Prepare the complete order data
    const orderWithItems: OrderWithItems = {
      ...orderResult,
      apartmentNumber: orderResult.apartmentNumber || undefined,
      notes: orderResult.notes || undefined,
      promoCode: orderResult.promoCode || undefined,
      createdAt: orderResult.createdAt || new Date().toISOString(),
      items: orderItemsResult,
    }

    // Send the emails with graceful fallbacks
    await sendEmailsWithFallback(orderWithItems)

    return { success: true }
  } catch (error) {
    console.error("Failed to send order confirmation emails:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    }
  }
}

/**
 * Helper function to send emails with proper error handling and fallbacks
 */
async function sendEmailsWithFallback(orderWithItems: OrderWithItems) {
  // Skip email sending in development mode or if required environment variables are missing
  if (process.env.NODE_ENV === "development" || !process.env.RESEND_API_KEY) {
    console.log("Skipping email sending in development mode or missing API key")
    return { skipped: true }
  }

  const emailPromises = []

  // Try to send customer confirmation email
  try {
    emailPromises.push(sendOrderConfirmationEmail(orderWithItems))
  } catch (emailError) {
    console.error("Error sending customer confirmation email:", emailError)
    // Continue execution even if customer email fails
  }

  // Try to send admin notification email
  try {
    emailPromises.push(sendAdminNotificationEmail(orderWithItems))
  } catch (emailError) {
    console.error("Error sending admin notification email:", emailError)
    // Continue execution even if admin email fails
  }

  // Wait for all email attempts to complete
  if (emailPromises.length > 0) {
    await Promise.allSettled(emailPromises)
  }

  return { sent: true }
}