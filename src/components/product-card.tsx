"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Plus, Check, Award } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { useCart } from "@/src/lib/cart-context"
import type { Product } from "@/src/lib/types"
import { useTranslation } from "@/src/lib/i18n-client"

interface ProductCardProps {
  product: Product
  featured?: boolean
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const { t, i18n } = useTranslation()
  const { addToCart } = useCart()
  const router = useRouter()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    // Stop propagation to prevent navigation when clicking the add to cart button
    e.stopPropagation()

    addToCart(product)
    setIsAdded(true)

    // Reset the added state after animation completes
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  const handleCardClick = () => {
    router.push(`/product/${product.id}`)
  }

  // Get localized product name and description based on current language
  const productName = i18n.language === "sr" ? product.nameSr : product.nameEn
  const productDescription = i18n.language === "sr" ? product.descriptionSr : product.descriptionEn

  // Use the direct price in RSD for Serbian users instead of conversion
  const productPrice =
    i18n.language === "sr" ? `${product.priceSr.toLocaleString("sr-RS")} RSD` : `${product.price.toFixed(2)} €`

  return (
    <motion.div
      whileHover={{ y: featured ? -5 : 0 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={handleCardClick}
      className="cursor-pointer"
    >
      <Card className={`overflow-hidden ${featured ? "border-[#cbff01] shadow-lg relative scale-105 z-10" : ""}`}>
        {featured && (
          <div className="absolute top-0 right-0 z-10 m-2">
            <Badge className="bg-[#cbff01] text-[#212121] px-3 py-1 flex items-center gap-1">
              <Award className="h-3.5 w-3.5" />
              {i18n.language === "sr" ? "Najpopularnije" : "Most Popular"}
            </Badge>
          </div>
        )}
        <div className="aspect-[4/3] relative">
          <Image
            src={product.image || "/hero-sr.png"}
            alt={productName}
            fill
            className="object-cover transition-all hover:scale-105"
          />
        </div>
        <CardHeader className="py-2 px-4">
          <CardTitle className="text-base">{productName}</CardTitle>
        </CardHeader>
        <CardContent className="py-1 px-4">
          <p className="text-muted-foreground text-sm line-clamp-2">{productDescription}</p>
          <div className="flex items-center justify-between mt-2">
            <p className={`text-lg font-bold ${featured ? "text-[#cbff01]" : ""}`}>{productPrice}</p>
            {featured && (
              <p className="text-xs text-[#cbff01] font-medium">
                {i18n.language === "sr" ? "Naša preporuka" : "Best value"}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="py-2 px-4">
          <AnimatePresence mode="wait">
            {isAdded ? (
              <motion.div
                key="added"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full"
              >
                <Button variant="outline" className="w-full bg-[#cbff01] text-[#212121] py-1 h-8" disabled>
                  <Check className="mr-2 h-4 w-4" />
                  {t("itemAddedToCart")}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="add"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="w-full"
                onClick={(e) => e.stopPropagation()} // Prevent card click when clicking this div
              >
                <Button
                  onClick={handleAddToCart}
                  className={`w-full py-1 h-8 ${featured ? "bg-[#cbff01] hover:bg-[#cbff01]/90" : ""}`}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t("addToCart")}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

