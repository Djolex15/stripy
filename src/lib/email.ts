"use server"

import { Resend } from "resend"
import { OrderConfirmationEmailTemplate } from "../components/emails/order-confirmation-email"
import { AdminNotificationEmailTemplate } from "../components/emails/admin-notification-email"
import type { OrderWithItems } from "@/src/lib/types"

// Define Resend API response types
interface CreateEmailResponseSuccess {
  id: string
  from: string
  to: string | string[]
  created_at: string
  status: "success" | "pending"
}

interface CreateEmailResponseError {
  statusCode: number
  name: string
  message: string
}

type EmailResponse = {
  data?: CreateEmailResponseSuccess | null
  error?: CreateEmailResponseError | null
}

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY)

// Email addresses
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "stripy459@gmail.com"
const FROM_EMAIL = process.env.FROM_EMAIL || "orders@mystripy.com"
const FROM_NAME = process.env.FROM_NAME || "Stripy"

export async function sendOrderConfirmationEmail(
  order: OrderWithItems,
): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: order.customerEmail,
      subject: `Order Confirmation #${order.id.substring(0, 8)}`,
      react: OrderConfirmationEmailTemplate({ order }),
    })

    if (result.error) {
      console.error("Error sending customer confirmation email:", result.error)
      return { success: false, error: result.error }
    }

    return { success: true, data: result.data }
  } catch (error) {
    console.error("Exception sending customer confirmation email:", error)
    return { success: false, error }
  }
}

export async function sendAdminNotificationEmail(
  order: OrderWithItems,
): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `New Order: #${order.id.substring(0, 8)} - ${order.customerName}`,
      react: AdminNotificationEmailTemplate({ order }),
    })

    if (result.error) {
      console.error("Error sending admin notification email:", result.error)
      return { success: false, error: result.error }
    }

    return { success: true, data: result.data }
  } catch (error) {
    console.error("Exception sending admin notification email:", error)
    return { success: false, error }
  }
}

