"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react"

import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { useCart } from "@/src/lib/cart-context"
import { useTranslation } from "@/src/lib/i18n-client"
import type { CartItem } from "@/src/lib/types"

export default function CartPage() {
  const { t, i18n } = useTranslation()
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const [mounted, setMounted] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Calculate total price based on language
  const totalPrice =
    i18n.language === "sr"
      ? cart.reduce((total, item) => total + item.product.priceSr * item.quantity, 0)
      : cart.reduce((total, item) => total + item.product.price * item.quantity, 0)

  // Format the total price
  const formattedTotalPrice =
    i18n.language === "sr" ? `${totalPrice.toLocaleString("sr-RS")} RSD` : `${totalPrice.toFixed(2)} €`

  // Common background style
  const backgroundStyle = {
    backgroundImage: "url('/websitebackground.png')",
    backgroundRepeat: "repeat",
    backgroundSize: "100vw", // Consistent with previous setting
    backgroundAttachment: "scroll",
  }

  if (cart.length === 0) {
    return (
      <div className="flex min-h-screen flex-col" style={backgroundStyle}>
        <div className="container mx-auto py-16 text-center">
          <div className="mb-8 flex justify-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground" />
          </div>
          <h1 className="mb-4 text-3xl font-bold">{t("cartEmpty")}</h1>
          <p className="mb-8 text-muted-foreground">{t("cartEmptyMessage")}</p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("continueShopping")}
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col" style={backgroundStyle}>
      <div className="container mx-auto py-8 md:py-16">
        <h1 className="mb-8 text-3xl font-bold">{t("yourCart")}</h1>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="space-y-4">
              {cart.map((item) => (
                <CartItemCard
                  key={item.product.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("continueShopping")}
                </Link>
              </Button>
              <Button variant="outline" onClick={() => clearCart()}>
                {t("clearCart")}
              </Button>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>{t("orderSummary")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {cart.map((item) => {
                    const productName = i18n.language === "sr" ? item.product.nameSr : item.product.nameEn
                    const itemPrice =
                      i18n.language === "sr"
                        ? `${(item.product.priceSr * item.quantity).toLocaleString("sr-RS")} RSD`
                        : `${(item.product.price * item.quantity).toFixed(2)} €`

                    return (
                      <div key={item.product.id} className="flex justify-between">
                        <span>
                          {productName} × {item.quantity}
                        </span>
                        <span>{itemPrice}</span>
                      </div>
                    )
                  })}
                  <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                    <span>{t("total")}</span>
                    <span>{formattedTotalPrice}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/order">{t("proceedToOrder")}</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

interface CartItemCardProps {
  item: CartItem
  updateQuantity: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
}

function CartItemCard({ item, updateQuantity, removeFromCart }: CartItemCardProps) {
  const { t, i18n } = useTranslation()
  const { product, quantity } = item

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number.parseInt(e.target.value)
    if (newQuantity > 0) {
      updateQuantity(product.id, newQuantity)
    }
  }

  // Get localized product name based on current language
  const productName = i18n.language === "sr" ? product.nameSr : product.nameEn

  // Use the direct price in RSD for Serbian users instead of conversion
  const productPrice =
    i18n.language === "sr" ? `${product.priceSr.toLocaleString("sr-RS")} RSD` : `${product.price.toFixed(2)} €`

  return (
    <div className="flex items-center gap-4 rounded-lg border p-4 bg-background/90">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={product.image || "/placeholder.svg?height=80&width=80"}
          alt={productName}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <h3 className="font-medium">{productName}</h3>
        <p className="text-sm text-muted-foreground">{productPrice}</p>
      </div>

      <div className="flex items-center gap-4">
        <Input type="number" min="1" value={quantity} onChange={handleQuantityChange} className="w-16" />
        <Button variant="ghost" size="icon" onClick={() => removeFromCart(product.id)}>
          <Trash2 className="h-5 w-5" />
          <span className="sr-only">{t("removeItem")}</span>
        </Button>
      </div>
    </div>
  )
}

