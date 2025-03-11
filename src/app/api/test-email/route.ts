import { NextResponse } from "next/server"
import { sendOrderConfirmationEmail, sendAdminNotificationEmail } from "@/src/lib/email"

// This is just for testing - you can delete this file after confirming emails work
export async function GET() {
  // Sample order data for testing
  const testOrder = {
    id: "test-order-123",
    customerName: "Test Customer",
    customerEmail: "your-test-email@example.com", // Change this to your email for testing
    customerPhone: "+1234567890",
    address: "123 Test Street",
    apartmentNumber: "4B",
    city: "Test City",
    postalCode: "12345",
    notes: "This is a test order",
    totalPrice: 9999, // 99.99 EUR in cents
    currency: "EUR",
    createdAt: new Date().toISOString(),
    items: [
      {
        id: "item-1",
        orderId: "test-order-123",
        productId: "product-1",
        productName: "Test Product 1",
        quantity: 2,
        price: 2999, // 29.99 EUR in cents
        currency: "EUR",
      },
      {
        id: "item-2",
        orderId: "test-order-123",
        productId: "product-2",
        productName: "Test Product 2",
        quantity: 1,
        price: 3999, // 39.99 EUR in cents
        currency: "EUR",
      },
    ],
  }

  try {
    // Send test emails
    const customerEmailResult = await sendOrderConfirmationEmail(testOrder)
    const adminEmailResult = await sendAdminNotificationEmail(testOrder)

    return NextResponse.json({
      success: true,
      customerEmail: customerEmailResult,
      adminEmail: adminEmailResult,
    })
  } catch (error) {
    console.error("Error sending test emails:", error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

