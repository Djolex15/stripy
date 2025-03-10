"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { CartItem, Product } from "@/src/lib/types"
import Cookies from "js-cookie"

interface CartContextType {
  cart: CartItem[]
  cartUpdated: boolean
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Cookie name for cart data
const CART_COOKIE_NAME = "stripy-cart"
// Cookie expiration in days (30 days)
const COOKIE_EXPIRATION = 30

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartUpdated, setCartUpdated] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load cart from cookies on mount (client-side only)
  useEffect(() => {
    if (!isClient) return

    try {
      const savedCart = Cookies.get(CART_COOKIE_NAME)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        // Validate that the parsed data is an array
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart)
        } else {
          console.error("Invalid cart data format in cookies")
          Cookies.remove(CART_COOKIE_NAME)
        }
      }
    } catch (error) {
      console.error("Failed to parse cart from cookies:", error)
      Cookies.remove(CART_COOKIE_NAME)
    }
  }, [isClient])

  // Save cart to cookies whenever it changes (client-side only)
  useEffect(() => {
    if (!isClient) return

    try {
      if (cart.length > 0) {
        Cookies.set(CART_COOKIE_NAME, JSON.stringify(cart), {
          expires: COOKIE_EXPIRATION,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        })
      } else {
        // If cart is empty, remove the cookie
        Cookies.remove(CART_COOKIE_NAME)
      }
    } catch (error) {
      console.error("Failed to save cart to cookies:", error)
    }
  }, [cart, isClient])

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id)

      if (existingItem) {
        // If product already exists in cart, increase quantity
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        // Otherwise add new item to cart
        return [...prevCart, { product, quantity: 1 }]
      }
    })

    // Trigger cart updated animation
    setCartUpdated(true)

    // Reset the updated flag after a short delay
    setTimeout(() => {
      setCartUpdated(false)
    }, 100)
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) => prevCart.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider value={{ cart, cartUpdated, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

