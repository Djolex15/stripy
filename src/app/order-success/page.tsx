"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import OrderSuccessPage from "@/src/components/order-success"

export default function Page() {
  const [showComponent, setShowComponent] = useState(false)
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowComponent(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchParams])

  return <OrderSuccessPage orderId={orderId} />
}
