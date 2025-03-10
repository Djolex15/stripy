"use client"

import { useEffect, useState } from "react"
import OrderSuccessPage from "@/src/components/order-success"

export default function Page() {
  const [showComponent, setShowComponent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowComponent(true)
    }, 500) // 1 second delay

    return () => clearTimeout(timer)
  }, [])

  return showComponent ? <OrderSuccessPage /> : null
}