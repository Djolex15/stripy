"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Plus, Check, Award, Star, Sparkles } from 'lucide-react'
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
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart(product)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleCardClick = () => {
    router.push(`/product/${product.id}`)
  }

  const productNameParts = (i18n.language === "sr" ? product.nameSr : product.nameEn).split('-').map(part => part.trim())

  const productFirstPart = productNameParts[0] || ""
  const productSecondPart = productNameParts[1] || ""
  const productPrice =
    i18n.language === "sr" ? `${product.priceSr.toLocaleString("sr-RS")} RSD` : `${product.price.toFixed(2)} €`

  // Star animation positions
  const starPositions = [
    { left: "10%", top: "30%", delay: 0.1, size: 16 },
    { left: "20%", top: "60%", delay: 0.2, size: 12 },
    { right: "15%", top: "25%", delay: 0.3, size: 14 },
    { right: "25%", bottom: "30%", delay: 0.15, size: 16 },
    { left: "30%", bottom: "20%", delay: 0.25, size: 12 },
  ]

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer relative"
    >
      <Card className={`overflow-hidden relative ${featured ? "border-[#cbff01] shadow-lg" : ""}`}>
        {/* Normal state - always rendered */}
        <div className={`transition-opacity duration-500 ${isHovered ? "opacity-0" : "opacity-100"}`}>
          <div className="aspect-[4/3] relative">
            <Image src={product.image || "/hero-sr.png"} alt={productNameParts.join(" ")} fill className="object-cover transition-transform duration-500 ease-in-out transform hover:scale-105" />
            {featured && (
              <div className="absolute top-0 right-0 z-10 m-2">
                <Badge className="bg-[#cbff01] text-[#212121] px-3 py-1 flex items-center gap-1">
                  <Award className="h-3.5 w-3.5" />
                  {i18n.language === "sr" ? "Najpopularnije" : "Most Popular"}
                </Badge>
              </div>
            )}
          </div>
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-base grid grid-rows-2">
              <span>{productFirstPart}</span>
              <span>{productSecondPart}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-1 px-4">
            <p className="text-muted-foreground text-sm line-clamp-2">
              {i18n.language === "sr" ? product.descriptionSr : product.descriptionEn}
            </p>
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
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 15,
                  }}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full bg-[#cbff01] text-[#212121]" disabled>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: [0, 15, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Check className="mr-2 h-4 w-4" />
                    </motion.div>
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
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.div whileTap={{ scale: 0.95 }} className="w-full">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddToCart(e)
                        
                        // Create particle animation
                        const button = e.currentTarget
                        const buttonRect = button.getBoundingClientRect()
                        const particleCount = 15
                        
                        for (let i = 0; i < particleCount; i++) {
                          const particle = document.createElement('div')
                          const size = Math.random() * 8 + 4
                          
                          // Set particle styles
                          particle.style.position = 'fixed'
                          particle.style.width = `${size}px`
                          particle.style.height = `${size}px`
                          particle.style.borderRadius = '50%'
                          particle.style.backgroundColor = featured ? '#cbff01' : '#3b82f6'
                          particle.style.opacity = '0.8'
                          particle.style.zIndex = '100'
                          
                          // Position at center of button
                          particle.style.left = `${buttonRect.left + buttonRect.width / 2}px`
                          particle.style.top = `${buttonRect.top + buttonRect.height / 2}px`
                          
                          // Add to DOM
                          document.body.appendChild(particle)
                          
                          // Random direction
                          const angle = Math.random() * Math.PI * 2
                          const speed = Math.random() * 100 + 50
                          const vx = Math.cos(angle) * speed
                          const vy = Math.sin(angle) * speed
                          
                          // Animate
                          particle.animate([
                            { transform: 'translate(0, 0) scale(1)', opacity: 0.8 },
                            { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 }
                          ], {
                            duration: 600,
                            easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
                          }).onfinish = () => {
                            document.body.removeChild(particle)
                          }
                        }
                        
                        // Button pulse animation
                        button.animate([
                          { transform: 'scale(0.95)' },
                          { transform: 'scale(1.05)' },
                          { transform: 'scale(1)' }
                        ], {
                          duration: 400,
                          easing: 'ease-in-out'
                        })
                      }}
                      className={`w-full ${featured ? "bg-[#cbff01] hover:bg-[#cbff01]/90 text-[#212121]" : ""}`}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {t("addToCart")}
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardFooter>
        </div>

        {/* Hover state - absolutely positioned over the normal state */}
        <div
          className={`absolute inset-0 z-20 transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <Image
              src={product.hoverImage || product.image || "/hero-sr.png"}
              alt={productNameParts.join(" ")}
              fill
              className="object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
            />

            {/* Decorative stars */}
            {starPositions.map((pos, index) => (
              <motion.div
                key={`star-${index}`}
                className="absolute z-30"
                style={{
                  left: pos.left,
                  right: pos.right,
                  top: pos.top,
                  bottom: pos.bottom,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0.8],
                  scale: [0, 1, 0.9],
                  y: [0, -10, -5],
                }}
                transition={{
                  delay: pos.delay,
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                {index % 2 === 0 ? (
                  <Star className={`w-${pos.size} h-${pos.size} ${featured ? "text-[#cbff01]" : "text-white"}`} />
                ) : (
                  <Sparkles className={`w-${pos.size} h-${pos.size} ${featured ? "text-[#cbff01]" : "text-white"}`} />
                )}
              </motion.div>
            ))}

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`text-3xl font-bold grid grid-rows-2 ${featured ? "text-[#cbff01]" : "text-white"}`}
              >
                <span>{productFirstPart}</span>
                <span>{productSecondPart}</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full"
              >
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full">
                  <Button
                    className={`w-full ${featured ? "bg-[#cbff01] hover:bg-[#cbff01]/90 text-[#212121]" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddToCart(e)
                      
                      // Create particle animation
                      const button = e.currentTarget
                      const buttonRect = button.getBoundingClientRect()
                      const particleCount = 15
                      
                      for (let i = 0; i < particleCount; i++) {
                        const particle = document.createElement('div')
                        const size = Math.random() * 8 + 4
                        
                        // Set particle styles
                        particle.style.position = 'fixed'
                        particle.style.width = `${size}px`
                        particle.style.height = `${size}px`
                        particle.style.borderRadius = '50%'
                        particle.style.backgroundColor = featured ? '#cbff01' : '#3b82f6'
                        particle.style.opacity = '0.8'
                        particle.style.zIndex = '100'
                        
                        // Position at center of button
                        particle.style.left = `${buttonRect.left + buttonRect.width / 2}px`
                        particle.style.top = `${buttonRect.top + buttonRect.height / 2}px`
                        
                        // Add to DOM
                        document.body.appendChild(particle)
                        
                        // Random direction
                        const angle = Math.random() * Math.PI * 2
                        const speed = Math.random() * 100 + 50
                        const vx = Math.cos(angle) * speed
                        const vy = Math.sin(angle) * speed
                        
                        // Animate
                        particle.animate([
                          { transform: 'translate(0, 0) scale(1)', opacity: 0.8 },
                          { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 }
                        ], {
                          duration: 600,
                          easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
                        }).onfinish = () => {
                          document.body.removeChild(particle)
                        }
                      }
                      
                      // Button pulse animation
                      button.animate([
                        { transform: 'scale(0.95)' },
                        { transform: 'scale(1.05)' },
                        { transform: 'scale(1)' }
                      ], {
                        duration: 400,
                        easing: 'ease-in-out'
                      })
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {t("addToCart")}
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}