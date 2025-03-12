"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Send, Tag, X } from "lucide-react"
import Cookies from "js-cookie"

import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { useToast } from "@/src/hooks/use-toast"
import { useCart } from "@/src/lib/cart-context"
import { useTranslation } from "@/src/lib/i18n-client"
import { sendOrderInquiry } from "@/src/lib/actions"
import { loadOrderFormData, saveOrderFormData, clearOrderFormData, type OrderFormData } from "@/src/lib/order-storage"
import { validatePromoCode, type PromoCode } from "@/src/lib/promo-codes"
import { Checkbox } from "@/components/ui/checkbox"

// Add the payment method type to the ExtendedOrderFormData interface
interface ExtendedOrderFormData extends OrderFormData {
  promoCode: string
  paymentMethod: string // Add this line
}

export default function OrderPage() {
  const { t, i18n } = useTranslation()
  const { cart, clearCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null)
  const [isCheckingPromo, setIsCheckingPromo] = useState(false)

  // Update the initial state to include paymentMethod
  const [formData, setFormData] = useState<ExtendedOrderFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    apartmentNumber: "",
    city: "",
    postalCode: "",
    notes: "",
    promoCode: "",
    paymentMethod: "pouzecem", // Default to cash on delivery
  })

  // Load saved form data on mount
  useEffect(() => {
    setMounted(true)

    // Load saved form data if available
    const savedFormData = loadOrderFormData()
    if (savedFormData) {
      setFormData((prev) => ({
        ...prev,
        ...savedFormData,
        promoCode: prev.promoCode, // Keep promo code separate from saved form data
      }))
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      // Only save if at least one field has data
      const hasData = Object.values(formData).some(
        (value) => typeof value === "string" && value.trim() !== "" && value !== formData.promoCode,
      )
      if (hasData) {
        // Don't save the promo code with the form data
        const { promoCode, ...dataToSave } = formData
        saveOrderFormData(dataToSave)
      }
    }
  }, [formData, mounted])

  if (!mounted) {
    return null
  }

  // Calculate total price based on language
  let totalPrice =
    i18n.language === "sr"
      ? cart.reduce((total, item) => total + item.product.priceSr * item.quantity, 0)
      : cart.reduce((total, item) => {
          // For EUR, store in cents for database precision
          const itemTotal = Math.round(item.product.price * 100) * item.quantity
          return total + itemTotal
        }, 0)

  // Apply discount if promo code is valid
  if (appliedPromo) {
    totalPrice = Number.parseFloat(calculateDiscountedPrice(totalPrice, appliedPromo.discount).toFixed(2))
  }

  // Format the total price
  const formattedTotalPrice =
    i18n.language === "sr" ? `${totalPrice.toLocaleString("sr-RS")} RSD` : `${(totalPrice / 100).toFixed(2)} €`

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    // Since we only have one payment method, we'll just set it based on the checkbox
    setFormData((prev) => ({ ...prev, paymentMethod: "pouzecem" }))
  }

  const handleApplyPromoCode = async () => {
    if (!formData.promoCode.trim()) return

    setIsCheckingPromo(true)

    try {
      const promoCode = await validatePromoCode(formData.promoCode)

      if (promoCode) {
        setAppliedPromo(promoCode)
        toast({
          title: t("promoCodeApplied"),
          description: `${promoCode.discount}% ${t("discountApplied")}`,
        })
      } else {
        setAppliedPromo(null)
        toast({
          title: t("invalidPromoCode"),
          description: t("promoCodeNotFound"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error validating promo code:", error)
      toast({
        title: t("invalidPromoCode"),
        description: t("promoCodeNotFound"),
        variant: "destructive",
      })
    } finally {
      setIsCheckingPromo(false)
    }
  }

  const handleRemovePromoCode = () => {
    setAppliedPromo(null)
    setFormData((prev) => ({ ...prev, promoCode: "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.postalCode
    ) {
      toast({
        title: t("formError"),
        description: t("pleaseCompleteAllFields"),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Get the currency based on language preference from the language switcher
      const currency = i18n.language === "sr" ? "RSD" : "EUR"

      // Update the sendOrderInquiry call to include the payment method
      const result = await sendOrderInquiry({
        customerInfo: {
          ...formData,
          paymentMethod: formData.paymentMethod, // Add this line
        },
        orderItems: cart,
        totalPrice,
        currency,
        appliedPromoCode: appliedPromo ? appliedPromo.code : undefined,
      })

      if (result.success) {
        // Store the order ID in cookies before redirecting
        if (result.orderId) {
          Cookies.set("lastOrderId", result.orderId, { expires: 1 })

          // Clear both cart and saved form data on successful order
          clearCart()
          clearOrderFormData()

          console.log("Order submitted successfully")
          // Redirect to the success page with the order ID as a query parameter
          router.push(`/order-success?orderId=${result.orderId}`)
        } else {
          throw new Error("Order ID not returned from server")
        }
      } else {
        throw new Error(result.error || "Order submission failed")
      }
    } catch (error) {
      console.error("Order submission error:", error)
      toast({
        title: t("orderError"),
        description: t("orderErrorMessage"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundImage: "url('/websitebackground.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "100vw",
        backgroundAttachment: "scroll",
      }}
    >
      <div className="container mx-auto py-8 md:py-16">
        <h1 className="mb-8 text-3xl font-bold">{t("completeYourOrder")}</h1>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("customerInformation")}</CardTitle>
                <CardDescription>{t("pleaseProvideYourDetails")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form id="order-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("fullName")} *</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("email")} *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("phoneNumber")} *</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">{t("address")} *</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apartmentNumber">{t("apartmentNumber")}</Label>
                    <Input
                      id="apartmentNumber"
                      name="apartmentNumber"
                      value={formData.apartmentNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">{t("city")} *</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">{t("postalCode")} *</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Replace the dropdown with a checkbox */}
                  <div className="space-y-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">{t("paymentMethod")} *</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="paymentMethod" checked={true} onCheckedChange={handleCheckboxChange} />
                      <Label htmlFor="paymentMethod" className="font-medium">
                        {t("pouzecem")}
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">{t("additionalNotes")}</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder={t("anySpecialInstructions")}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="mt-8 flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/cart">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("backToCart")}
                </Link>
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

                  {/* Promo Code Section */}
                  <div className="border-t pt-4 mt-4">
                    <Label htmlFor="promoCode">{t("promoCode")}</Label>

                    {appliedPromo ? (
                      <div className="mt-2 flex items-center justify-between bg-[#cbff01]/10 p-2 rounded-md">
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-2 text-[#cbff01]" />
                          <span className="font-medium">
                            {appliedPromo.code} (-{appliedPromo.discount}%)
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleRemovePromoCode} type="button">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-2 flex gap-2">
                        <Input
                          id="promoCode"
                          name="promoCode"
                          value={formData.promoCode}
                          onChange={handleChange}
                          placeholder={t("enterPromoCode")}
                          className="flex-1 focus:ring-[#cbff01]"
                        />
                        <Button
                          onClick={handleApplyPromoCode}
                          disabled={!formData.promoCode || isCheckingPromo}
                          type="button"
                          size="sm"
                        >
                          {isCheckingPromo ? t("applying") : t("apply")}
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                    <span>{t("total")}</span>
                    <span>{formattedTotalPrice}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" form="order-form" disabled={isSubmitting}>
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? t("submitting") : t("order")}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

const calculateDiscountedPrice = (price: number, discount: number): number => {
  // Calculate discount amount in cents
  const discountAmount = Math.round(price * (discount / 100))
  return price - discountAmount
}

