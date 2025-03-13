"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Plus, Minus, Star, ShoppingCart } from "lucide-react"
import { motion, useAnimationControls } from "framer-motion"

import { Button } from "@/src/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Input } from "@/src/components/ui/input"
import { useToast } from "@/src/hooks/use-toast"
import { useCart } from "@/src/lib/cart-context"
import { products } from "@/src/lib/products"
import { useTranslation } from "@/src/lib/i18n-client"
import type { Product } from "@/src/lib/types"
import LanguageSwitcher from "@/src/components/language-switcher"
import CartButton from "@/src/components/cart-button"
import { useMediaQuery } from "@/src/hooks/use-media-query"
import { submitReview } from "@/src/lib/actions"

export default function ProductDetailPage() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState("black")
  const [isAdded, setIsAdded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const imageRef = useRef<HTMLDivElement>(null)
  const currentYear = mounted ? new Date().getFullYear() : 2025

  // Animation controls
  const imageControls = useAnimationControls()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isTouching, setIsTouching] = useState(false)
  const [showSpotlight, setShowSpotlight] = useState(false)

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
    isPreviousOwner: false,
  })
  const [reviewCharCount, setReviewCharCount] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  // Replace the triggerAnimation function with this mouse-following rotation function
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return

    const rect = imageRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate rotation based on mouse position relative to center
    // Increased rotation angles for more dramatic tilt
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 25 // Max 25 degrees
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 20 // Max 20 degrees

    // Update image rotation - tilting toward the mouse
    imageControls.start({
      rotateY,
      rotateX,
      transition: { type: "spring", stiffness: 300, damping: 20 }, // More responsive spring
    })

    // Update spotlight position
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
    setShowSpotlight(true)
  }

  // Add touch event handlers for mobile
  const handleTouchStart = () => {
    setIsTouching(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!imageRef.current || !isTouching) return

    const rect = imageRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate rotation based on touch position relative to center
    // Increased rotation angles for more dramatic tilt
    const rotateY = ((touch.clientX - centerX) / (rect.width / 2)) * 25 // Max 25 degrees
    const rotateX = -((touch.clientY - centerY) / (rect.height / 2)) * 20 // Max 20 degrees

    // Update image rotation - tilting toward the touch point
    imageControls.start({
      rotateY,
      rotateX,
      transition: { type: "spring", stiffness: 300, damping: 20 }, // More responsive spring
    })

    // Update spotlight position
    const x = ((touch.clientX - rect.left) / rect.width) * 100
    const y = ((touch.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
    setShowSpotlight(true)
  }

  const handleTouchEnd = () => {
    setIsTouching(false)

    // Reset rotation when touch ends
    imageControls.start({
      rotateY: 0,
      rotateX: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    })

    setShowSpotlight(false)
  }

  // Replace the handleMouseLeave function
  const handleMouseLeave = () => {
    // Reset rotation when mouse leaves
    imageControls.start({
      rotateY: 0,
      rotateX: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    })

    setShowSpotlight(false)
  }

  // Handle scroll events for animation
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMounted(true)
    // Find the product by ID
    const foundProduct = products.find((p) => p.id === id)
    if (foundProduct) {
      setProduct(foundProduct)
    }

    // Fetch reviews for this product
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?productId=${id}`)
        if (response.ok) {
          const data = await response.json()
          setReviews(data)
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [id])

  if (!mounted || !product) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  // Get localized product name and description based on current language
  const productName = i18n.language === "sr" ? product.nameSr : product.nameEn
  const productDescription = i18n.language === "sr" ? product.descriptionSr : product.descriptionEn

  // Use the direct price in RSD for Serbian users instead of conversion
  const productPrice =
    i18n.language === "sr" ? `${product.priceSr.toLocaleString("sr-RS")} RSD` : `${product.price.toFixed(2)} €`

  const handleAddToCart = () => {
    // Add the product to cart with the selected quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    setIsAdded(true)

    // Reset the added state after animation completes
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "comment") {
      // Limit comment to 300 characters
      if (value.length <= 300) {
        setReviewForm((prev) => ({ ...prev, [name]: value }))
        setReviewCharCount(value.length)
      }
    } else {
      setReviewForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleRatingChange = (rating: number) => {
    setReviewForm((prev) => ({ ...prev, rating }))
  }

  const handlePreviousOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReviewForm((prev) => ({ ...prev, isPreviousOwner: e.target.checked }))
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  // List of bad words to filter (both English and Serbian)
  const badWords = [
    // English bad words
    "fuck",
    "shit",
    "ass",
    "bitch",
    "dick",
    "cunt",
    "damn",
    // Serbian bad words
    "јебем",
    "курац",
    "пичка",
    "говно",
    "дупе",
    "срање",
  ]

  const containsBadWords = (text: string) => {
    const lowerText = text.toLowerCase()
    return badWords.some((word) => lowerText.includes(word))
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!reviewForm.name.trim()) {
      toast({
        title: i18n.language === "sr" ? "Greška" : "Error",
        description: i18n.language === "sr" ? "Molimo unesite vaše ime" : "Please enter your name",
        variant: "destructive",
      })
      return
    }

    if (!validateEmail(reviewForm.email)) {
      toast({
        title: i18n.language === "sr" ? "Greška" : "Error",
        description:
          i18n.language === "sr" ? "Molimo unesite validnu email adresu" : "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    if (!reviewForm.comment.trim()) {
      toast({
        title: i18n.language === "sr" ? "Greška" : "Error",
        description: i18n.language === "sr" ? "Molimo unesite komentar" : "Please enter a comment",
        variant: "destructive",
      })
      return
    }

    if (!reviewForm.isPreviousOwner) {
      toast({
        title: i18n.language === "sr" ? "Greška" : "Error",
        description:
          i18n.language === "sr"
            ? "Samo prethodni vlasnici mogu ostaviti recenziju"
            : "Only previous owners can leave a review",
        variant: "destructive",
      })
      return
    }

    // Check for bad words
    if (containsBadWords(reviewForm.comment)) {
      toast({
        title: i18n.language === "sr" ? "Neprikladni sadržaj" : "Inappropriate Content",
        description:
          i18n.language === "sr"
            ? "Vaša recenzija sadrži neprikladne reči"
            : "Your review contains inappropriate language",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const result = await submitReview({
        productId: product.id,
        name: reviewForm.name,
        email: reviewForm.email,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        language: i18n.language,
      })

      if (result.success) {
        toast({
          title: i18n.language === "sr" ? "Uspešno" : "Success",
          description:
            i18n.language === "sr"
              ? "Vaša recenzija je uspešno poslata"
              : "Your review has been submitted successfully",
        })

        // Reset form
        setReviewForm({
          name: "",
          email: "",
          rating: 5,
          comment: "",
          isPreviousOwner: false,
        })
        setReviewCharCount(0)

        // Add the new review to the list
        setReviews((prev) => [result.review, ...prev])
      } else {
        toast({
          title: i18n.language === "sr" ? "Greška" : "Error",
          description: result.error || (i18n.language === "sr" ? "Došlo je do greške" : "An error occurred"),
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: i18n.language === "sr" ? "Greška" : "Error",
        description: i18n.language === "sr" ? "Došlo je do greške" : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Common background style
  const backgroundStyle = {
    backgroundImage: "url('/websitebackground.png')",
    backgroundRepeat: "repeat",
    backgroundSize: "100vw",
    backgroundAttachment: "scroll",
  }

  return (
    <div className="flex min-h-screen flex-col mt-20" style={backgroundStyle}>
       <header className="fixed top-0 z-50 w-full bg-transparent backdrop-blur-sm height-[80px]">
        <div className="container flex h-16 md:h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/primary-logo.svg" alt="Stripy Logo" width={140} height={28} className="rounded-sm" />
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <LanguageSwitcher />
            <CartButton />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto py-8">
          <div className="mb-6">
            <Button variant="ghost" asChild className="pl-0">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("continueShopping")}
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left column - Product image with enhanced 3D animation */}
            <div className="space-y-4">
              <div
                ref={imageRef}
                className="relative aspect-square overflow-hidden rounded-lg border group perspective-[1000px]"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#212121] to-[#2a2a2a] opacity-80"></div>

                {/* Animated circular glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-radial from-[#cbff01]/30 via-transparent to-transparent"
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [0.9, 1.05, 0.9],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                ></motion.div>

                {/* Spotlight effect that follows cursor */}
                {showSpotlight && (
                  <div
                    className="absolute inset-0 bg-gradient-radial from-[#cbff01]/20 via-transparent to-transparent pointer-events-none"
                    style={{
                      backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                      backgroundSize: "120% 120%",
                      opacity: 0.8,
                      mixBlendMode: "overlay",
                    }}
                  ></div>
                )}

                {/* Product image with 3D transform */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center transform-style-3d"
                  animate={imageControls}
                  initial={{ rotateX: 0, rotateY: 0, scale: 1 }}
                  transition={{ duration: 0.1 }}
                >
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={productName}
                    fill
                    className="object-contain p-8 transform-style-3d drop-shadow-2xl"
                    style={{
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                      filter: "drop-shadow(0 20px 30px rgba(0, 0, 0, 0.3))",
                    }}
                    priority
                  />
                </motion.div>

                {/* Pulsing ring effect */}
                <motion.div
                  className="absolute inset-0 rounded-full border border-[#cbff01]/20"
                  animate={{
                    scale: [0.8, 1.1, 0.8],
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />

                {/* Interactive prompt */}
                <motion.div
                  className="absolute bottom-4 left-0 right-0 flex justify-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <div className="bg-black/40 backdrop-blur-sm text-white/90 px-3 py-1.5 rounded-full text-xs font-medium">
                    {i18n.language === "sr" ? "Pređite mišem za 3D efekat" : "Hover for 3D effect"}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right column - Product details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">{productName}</h1>
                <p className="mt-2 text-xl font-semibold">{productPrice}</p>

                {/* Star rating - only show if there are reviews */}
                {reviews.length > 0 ? (
                  <div className="mt-4 flex group">
                    {/* Calculate average rating */}
                    {(() => {
                      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                      const roundedRating = Math.round(averageRating * 10) / 10 // Round to 1 decimal place

                      return (
                        <>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <div key={star} className="relative">
                              <Star
                                className={`h-5 w-5 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-[8deg] ${
                                  star <= Math.floor(averageRating)
                                    ? "fill-[#cbff01] text-[#cbff01]"
                                    : star <= averageRating + 0.5 && star > Math.floor(averageRating)
                                      ? "fill-[#cbff01]/50 text-[#cbff01]"
                                      : "text-gray-300"
                                }`}
                                style={{ transitionDelay: `${(star - 1) * 50}ms` }}
                              />
                              {/* Individual star hover effect */}
                              <div
                                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                onMouseEnter={(e) => {
                                  // Find all star elements
                                  const stars =
                                    e.currentTarget.parentElement?.parentElement?.querySelectorAll(".star-hover")
                                  if (stars) {
                                    stars.forEach((el, idx) => {
                                      const distance = Math.abs(idx + 1 - star)
                                      const scale = distance === 0 ? 1.5 : 1.3 - distance * 0.1
                                      ;(el as HTMLElement).style.transform = `scale(${scale})`
                                    })
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  // Reset all stars
                                  const stars =
                                    e.currentTarget.parentElement?.parentElement?.querySelectorAll(".star-hover")
                                  if (stars) {
                                    stars.forEach((el) => {
                                      ;(el as HTMLElement).style.transform = "scale(1)"
                                    })
                                  }
                                }}
                              >
                                <Star
                                  className={`star-hover h-5 w-5 transition-all duration-200 ${
                                    star <= Math.floor(averageRating)
                                      ? "fill-[#cbff01] text-[#cbff01]"
                                      : star <= averageRating + 0.5 && star > Math.floor(averageRating)
                                        ? "fill-[#cbff01]/50 text-[#cbff01]"
                                        : "text-gray-300"
                                  }`}
                                />
                              </div>
                            </div>
                          ))}
                          <span className="ml-2 text-sm text-gray-500 transition-all duration-300 group-hover:font-bold">
                            ({roundedRating.toFixed(1)})
                          </span>
                        </>
                      )
                    })()}
                  </div>
                ) : null}
              </div>

              <div>
                <h2 className="text-lg font-medium">
                  {i18n.language === "sr" ? "Opis proizvoda" : "Product Description"}
                </h2>
                <p className="mt-2 text-white">{productDescription}</p>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <h2 className="text-lg font-medium">{i18n.language === "sr" ? "Prednosti" : "Benefits"}</h2>
                <ul className="list-inside list-disc space-y-1 text-white">
                  <li>{i18n.language === "sr" ? "Bolje disanje" : "Better breathing"}</li>
                  <li>{i18n.language === "sr" ? "Smanjeno hrkanje" : "Reduced snoring"}</li>
                  <li>{i18n.language === "sr" ? "Bolji san" : "Better sleep"}</li>
                  <li>
                    {i18n.language === "sr" ? "Poboljšane sportske performanse" : "Improved athletic performance"}
                  </li>
                </ul>
              </div>

              {/* Color selection */}
              <div>
                <h2 className="text-lg font-medium">{i18n.language === "sr" ? "Boja" : "Color"}</h2>
                <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="mt-2 flex space-x-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="black" id="color-black" />
                    <Label htmlFor="color-black">{i18n.language === "sr" ? "Crna" : "Black"}</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Quantity selector */}
              <div>
                <h2 className="text-lg font-medium">{i18n.language === "sr" ? "Količina" : "Quantity"}</h2>
                <div className="mt-2 flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={incrementQuantity}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to cart button */}
              <Button
                onClick={handleAddToCart}
                className="mt-6 w-full bg-[#cbff01] text-[#212121] hover:bg-[#cbff01]/90"
                size="lg"
                disabled={isAdded}
              >
                {isAdded ? (
                  <span>{i18n.language === "sr" ? "Dodato u korpu!" : "Added to cart!"}</span>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {i18n.language === "sr" ? "Dodaj u korpu" : "Add to cart"}
                  </>
                )}
              </Button>

              {/* Shipping info */}
              <div className="rounded-lg border p-4">
                <h2 className="font-medium">{i18n.language === "sr" ? "Dostava" : "Shipping"}</h2>
                <p className="text-sm text-white">
                  {i18n.language === "sr"
                    ? "Besplatna dostava za porudžbine preko 2000 RSD"
                    : "Free shipping for orders over €20"}
                </p>
              </div>
            </div>
          </div>

          {/* Reviews section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">{i18n.language === "sr" ? "Recenzije" : "Reviews"}</h2>

            {/* Display reviews */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-[#cbff01] border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">
                    {i18n.language === "sr" ? "Učitavanje recenzija..." : "Loading reviews..."}
                  </p>
                </div>
              ) : reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div
                    key={index}
                    className="rounded-lg border p-6 bg-background/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#cbff01]/20 hover:border-[#cbff01]/50 hover:-translate-y-1 hover:bg-background/95"
                  >
                    <div className="flex items-center mb-4">
                      <div className="flex mr-2 group">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${
                              review.rating >= star ? "fill-[#cbff01] text-[#cbff01]" : "text-gray-300"
                            }`}
                            style={{ transitionDelay: `${(star - 1) * 30}ms` }}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 transition-all duration-300 group-hover:font-bold">
                        {review.rating}.0
                      </span>
                    </div>
                    <p className="text-white mb-2 transition-all duration-300 hover:text-[#cbff01]">{review.comment}</p>
                    <p className="text-sm text-gray-500 font-medium">{review.name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString(i18n.language === "sr" ? "sr-RS" : "en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">
                    {i18n.language === "sr"
                      ? "Još uvek nema recenzija za ovaj proizvod. Budite prvi koji će podeliti svoje iskustvo!"
                      : "There are no reviews for this product yet. Be the first to share your experience!"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Review form */}
          <div className="mt-10 bg-background/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-muted">
            <h3 className="text-xl font-semibold mb-4">
              {i18n.language === "sr" ? "Napišite recenziju" : "Write a Review"}
            </h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{i18n.language === "sr" ? "Ime" : "Name"}</Label>
                  <Input id="name" name="name" value={reviewForm.name} onChange={handleReviewChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{i18n.language === "sr" ? "Email" : "Email"}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={reviewForm.email}
                    onChange={handleReviewChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{i18n.language === "sr" ? "Ocena" : "Rating"}</Label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleRatingChange(rating)}
                      className="focus:outline-none relative group"
                    >
                      <Star
                        className={`h-6 w-6 transition-all duration-300 transform group-hover:scale-125 ${
                          reviewForm.rating >= rating
                            ? "fill-[#cbff01] text-[#cbff01]"
                            : "text-gray-300 group-hover:text-gray-100"
                        }`}
                      />
                      {rating <= reviewForm.rating && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#cbff01] text-[#212121] px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          {rating}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="comment">{i18n.language === "sr" ? "Komentar" : "Comment"}</Label>
                  <span className="text-xs text-muted-foreground">{reviewCharCount}/300</span>
                </div>
                <Textarea
                  id="comment"
                  name="comment"
                  value={reviewForm.comment}
                  onChange={handleReviewChange}
                  rows={4}
                  maxLength={300}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPreviousOwner"
                  checked={reviewForm.isPreviousOwner}
                  onChange={handlePreviousOwnerChange}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isPreviousOwner" className="text-sm">
                  {i18n.language === "sr"
                    ? "Potvrđujem da sam koristio/la ovaj proizvod"
                    : "I confirm that I have used this product"}
                </Label>
              </div>

              <Button type="submit" className="bg-[#cbff01] text-[#212121] hover:bg-[#cbff01]/90" disabled={submitting}>
                {submitting
                  ? i18n.language === "sr"
                    ? "Slanje..."
                    : "Submitting..."
                  : i18n.language === "sr"
                    ? "Pošalji recenziju"
                    : "Submit Review"}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <footer className="border-t bg-background mt-5">
        <div className="container py-5">
          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <h3 className="mb-3 md:mb-4 text-base md:text-lg font-semibold">{t("aboutStripy")}</h3>
              <p className="text-sm md:text-base text-muted-foreground">{t("heroSubtitle")}</p>
            </div>
            <div>
              <h3 className="mb-3 md:mb-4 text-base md:text-lg font-semibold">{t("contactUs")}</h3>
              <p className="text-sm md:text-base text-muted-foreground">Email: info@mystripy.com</p>
              <div className="mt-3 md:mt-4 flex gap-3 md:gap-4">
                <a
                  href="https://www.facebook.com/profile.php?id=61574093874513"
                  className="text-sm md:text-base text-muted-foreground hover:text-foreground"
                >
                  Facebook
                </a>
                <a
                  href="https://www.instagram.com/mystripy/"
                  className="text-sm md:text-base text-muted-foreground hover:text-foreground"
                >
                  Instagram
                </a>
                <a
                  href="https://www.tiktok.com/@mystripy"
                  className="text-sm md:text-base text-muted-foreground hover:text-foreground"
                >
                  TikTok
                </a>
              </div>
            </div>
            <div>
              <h3 className="mb-3 md:mb-4 text-base md:text-lg font-semibold">{t("quickLinks")}</h3>
              <ul className="space-y-1 md:space-y-2">
                <li>
                  <a href="/#products" className="text-sm md:text-base text-muted-foreground hover:text-foreground">
                    {t("products")}
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy-policy"
                    className="text-sm md:text-base text-muted-foreground hover:text-foreground"
                  >
                    {t("privacyPolicy")}
                  </a>
                </li>
                <li>
                  <a
                    href="/terms-of-service"
                    className="text-sm md:text-base text-muted-foreground hover:text-foreground"
                  >
                    {t("termsOfService")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-5 border-t pt-5 text-center text-xs md:text-sm text-muted-foreground">
            <p>
              <a href="https://www.perceptionuae.com" target="_blank" rel="noopener noreferrer">
                {t("allRightsReserved")} © {currentYear} Perception Creative Agency
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

