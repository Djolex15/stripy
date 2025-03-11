"use server"

import { Resend } from "resend"
import { OrderConfirmationEmailTemplate } from "../components/emails/order-confirmation-email"
import { AdminNotificationEmailTemplate } from "../components/emails/admin-notification-email"
import type { OrderWithItems } from "@/src/lib/types"

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY)

// Email addresses
const ADMIN_EMAIL = "stripy459@gmail.com"
const FROM_EMAIL = "stripy459@gmail.com"

export async function sendOrderConfirmationEmail(order: OrderWithItems) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customerEmail,
      subject: "Your Order Confirmation",
      react: OrderConfirmationEmailTemplate({ order }),
    })

    if (error) {
      console.error("Error sending customer confirmation email:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Exception sending customer confirmation email:", error)
    return { success: false, error }
  }
}

export async function sendAdminNotificationEmail(order: OrderWithItems) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Order: #${order.id.substring(0, 8)}`,
      react: AdminNotificationEmailTemplate({ order }),
    })

    if (error) {
      console.error("Error sending admin notification email:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Exception sending admin notification email:", error)
    return { success: false, error }
  }
}

