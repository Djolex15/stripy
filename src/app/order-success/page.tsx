"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Cookies from "js-cookie"
import OrderSuccessPage from "@/src/components/order-success"

export default function Page() {
  const [showComponent, setShowComponent] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowComponent(true)
    }, 500)

    // Store the order ID in cookies instead of localStorage
    const orderId = searchParams.get("orderId")
    if (orderId) {
      Cookies.set("lastOrderId", orderId, { expires: 1 }) // Expires in 1 day
    }

    return () => clearTimeout(timer)
  }, [searchParams])

  return showComponent ? <OrderSuccessPage /> : <OrderSuccessPage />
}

