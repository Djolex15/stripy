"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/src/components/ui/button"
import { useCart } from "@/src/lib/cart-context"
import { Badge } from "@/src/components/ui/badge"

export default function CartButton() {
  const { cart, cartUpdated } = useCart()
  const [animate, setAnimate] = useState(false)

  // Calculate total items in cart
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)

  // Trigger animation when cart is updated
  useEffect(() => {
    if (cartUpdated && cart.length > 0) {
      setAnimate(true)

      // Reset animation after it completes
      const timer = setTimeout(() => {
        setAnimate(false)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [cartUpdated, cart.length])

  return (
    <div className="relative">
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            key="badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-2 -right-2 z-10"
          >
            <Badge variant="destructive" className="h-5 min-w-5 flex items-center justify-center rounded-full px-1.5">
              {itemCount}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>

      <Link href="/cart">
        <motion.div
          animate={
            animate
              ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 15, -15, 0],
                  transition: { duration: 0.5 },
                }
              : {}
          }
        >
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>

            {animate && (
              <motion.div
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 rounded-full bg-primary"
              />
            )}
          </Button>
        </motion.div>
      </Link>
    </div>
  )
}

