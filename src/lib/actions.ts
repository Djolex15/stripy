"use server"

import type { OrderInquiry, OrderWithItems } from "./types"
import { db } from "../server/db"
import { generateId, trackPromoCodeUsage } from "../lib/query"
import { orders, orderItems } from "../server/db/schema"
import { sendOrderConfirmationEmail, sendAdminNotificationEmail } from "./email"
import Cookies from "js-cookie"

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
        paymentMethod: orderData.customerInfo.paymentMethod || "pouzecem", // Add payment method with default
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
      paymentMethod: orderData.customerInfo.paymentMethod || "pouzecem", // Add payment method with default
      createdAt: new Date().toISOString(),
      items: orderItemsData,
    }

    Cookies.set("lastOrderId", orderId, { expires: 1 })

    // Handle email sending with graceful fallbacks
    await sendEmailsWithFallback(orderWithItems)
    console.log("Confirmation emails sent successfully")
    // Return success with the order ID
    return { success: true, orderId }
  } catch (error) {
    console.error("Failed to process order:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
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

export async function sendOrderConfirmationEmails(orderId: string) {
  try {
    // Fetch the order from the database
    const orderResult = await db.query.orders.findFirst({
      where: (orders, { eq }) => eq(orders.id, orderId),
    })

    if (!orderResult) {
      console.error(`Order not found with ID: ${orderId}`)
      return { success: false, error: "Order not found" }
    }

    // Fetch the order items
    const orderItemsResult = await db.query.orderItems.findMany({
      where: (orderItems, { eq }) => eq(orderItems.orderId, orderId),
    })

    if (!orderItemsResult || orderItemsResult.length === 0) {
      console.error(`No order items found for order ID: ${orderId}`)
      return { success: false, error: "Order items not found" }
    }

    // Prepare the complete order data
    const orderWithItems: OrderWithItems = {
      ...orderResult,
      apartmentNumber: orderResult.apartmentNumber || undefined,
      notes: orderResult.notes || undefined,
      promoCode: orderResult.promoCode || undefined,
      paymentMethod: orderResult.paymentMethod || "pouzecem", // Add payment method with default
      createdAt: orderResult.createdAt || new Date().toISOString(),
      items: orderItemsResult,
    }

    // Send the emails with graceful fallbacks
    const emailResult = await sendEmailsWithFallback(orderWithItems)

    // Log the result for debugging
    console.log(`Email sending result for order ${orderId}:`, emailResult)

    return { success: true }
  } catch (error) {
    console.error("Failed to send order confirmation emails:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

async function sendEmailsWithFallback(orderWithItems: OrderWithItems) {
  // Skip email sending in development mode if explicitly set
  if (process.env.SKIP_EMAILS === "true") {
    console.log("Skipping email sending due to SKIP_EMAILS environment variable")
    return { skipped: true }
  }

  // Check if Resend API key is available
  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY environment variable")
    return { error: "Missing API key", skipped: true }
  }

  const emailPromises = []
  // Define a generic result type that doesn't rely on CreateEmailResponseSuccess
  const results: {
    customer: { success: boolean; data?: any; error?: unknown } | null
    admin: { success: boolean; data?: any; error?: unknown } | null
  } = { customer: null, admin: null }

  // Try to send customer confirmation email
  try {
    const customerEmailPromise = sendOrderConfirmationEmail(orderWithItems)
    emailPromises.push(
      customerEmailPromise.then((result) => {
        results.customer = result
        return result
      }),
    )
  } catch (emailError) {
    console.error("Error initiating customer confirmation email:", emailError)
    results.customer = { success: false, error: emailError }
  }

  // Try to send admin notification email
  try {
    const adminEmailPromise = sendAdminNotificationEmail(orderWithItems)
    emailPromises.push(
      adminEmailPromise.then((result) => {
        results.admin = result
        return result
      }),
    )
  } catch (emailError) {
    console.error("Error initiating admin notification email:", emailError)
    results.admin = { success: false, error: emailError }
  }

  // Wait for all email attempts to complete
  if (emailPromises.length > 0) {
    await Promise.allSettled(emailPromises)
  }

  return {
    sent: emailPromises.length > 0,
    results,
  }
}

