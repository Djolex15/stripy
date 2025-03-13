"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "@/src/lib/i18n-client"
import ScrollToSection from "@/src/components/scroll-to-section"
import LanguageSwitcher from "@/src/components/language-switcher"
import CartButton from "@/src/components/cart-button"
import { Moon, Wind, Zap, Activity, ChevronDown } from "lucide-react"
import { ProductCard } from "@/src/components/product-card"
import { products } from "@/src/lib/products"
import { cn } from "@/src/lib/utils"
import { useMediaQuery } from "@/src/hooks/use-media-query"

export default function HomeClient() {
  const { t, i18n } = useTranslation()
  const heroRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Set mounted state to true after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle scroll events for animation
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Calculate transform values based on scroll position
  const imageTransform = `scale(${1 + scrollY * 0.0005}) translateY(${scrollY * 0.1}px)`
  const opacityValue = Math.max(0, 1 - scrollY * 0.002)

  // Determine hero image based on device and language
  const getHeroImage = () => {
    if (!mounted) return "/placeholder.svg"

    // Use responsive images based on device type and language
    if (isMobile) {
      // Mobile-optimized images (taller aspect ratio for phones)
      return i18n.language === "sr" ? "/hero-sr-mobile.png" : "/hero-en-mobile.png"
    } else {
      // Desktop images (16:9 aspect ratio)
      return i18n.language === "sr" ? "/hero-sr.png" : "/hero-en.png"
    }
  }

  // Determine potential image based on device and language
  const getPotentialImage = () => {
    if (!mounted) return "/placeholder.svg"

    if (isMobile) {
      return i18n.language === "sr" ? "/potential-sr-mobile.png" : "/potential-en-mobile.png"
    } else {
      return i18n.language === "sr" ? "/potential-sr.png" : "/potential-en.png"
    }
  }

  // Use a fixed year for server rendering to avoid hydration mismatch
  const currentYear = mounted ? new Date().getFullYear() : 2025

  // Benefits data with animations
  const benefits = [
    {
      icon: <Wind className="h-10 w-10" />,
      title: t("opensAirways"),
      description: t("opensAirwaysDesc"),
      delay: "0ms",
    },
    {
      icon: <Moon className="h-10 w-10" />,
      title: t("reducesSnoring"),
      description: t("reducesSnoringSleepDesc"),
      delay: "150ms",
    },
    {
      icon: <Zap className="h-10 w-10" />,
      title: t("maximizesOxygen"),
      description: t("maximizesOxygenDesc"),
      delay: "300ms",
    },
    {
      icon: <Activity className="h-10 w-10" />,
      title: t("nonInvasive"),
      description: t("nonInvasiveDesc"),
      delay: "450ms",
    },
  ]

  // FAQ items
  const faqItems = [
    { id: "item-1", question: t("freeShipping"), answer: t("freeShippingAnswer") },
    { id: "item-2", question: t("safeForDailyUse"), answer: t("safeForDailyUseAnswer") },
    { id: "item-3", question: t("stayInPlace"), answer: t("stayInPlaceAnswer") },
    { id: "item-4", question: t("deviated"), answer: t("deviatedAnswer") },
    { id: "item-5", question: t("howWork"), answer: t("howWorkAnswer") },
    { id: "item-6", question: t("notDelivered"), answer: t("notDeliveredAnswer") },
  ]

  if (!mounted) {
    // Return a simple loading state or skeleton that matches the structure
    return (
      <div className="flex min-h-screen flex-col">
        <header className="fixed top-0 z-50 w-full bg-[#212121]">
          <div className="container flex h-20 items-center justify-between">
            <div className="h-5 w-32 bg-gray-700 rounded-sm"></div>
            <div className="flex items-center gap-4">
              <div className="h-8 w-20 bg-gray-700 rounded"></div>
              <div className="h-8 w-8 bg-gray-700 rounded"></div>
            </div>
          </div>
        </header>
        <div className="flex-1 mt-20">
          <div className="h-screen bg-gray-800"></div>
        </div>
      </div>
    )
  }

  // Define consistent section spacing - changed to py-5 for all sections
  const sectionSpacing = "py-8"

  return (
    <div
      className="flex min-h-screen flex-col mt-20"
      style={{
        backgroundImage: "url('/websitebackground.png')",
        backgroundSize: "100vw", // Smaller pattern on mobile
        backgroundAttachment: "scroll",
      }}
    >
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
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative overflow-hidden w-full"
          style={{
            height: "calc(100vh - 80px)",
          }}
        >
          {/* Hero image container with aspect ratio preservation */}
          <div
            className="absolute inset-0 z-0 w-full h-full"
            style={{
              transform: imageTransform,
              transition: "transform 0.3s ease-out",
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={getHeroImage() || "/placeholder.svg"}
                alt="Stripy lifestyle"
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 768px) 100vw, 100vw"
              />
            </div>
          </div>

          {/* CTA Button */}
          <div
            className="absolute bottom-8 md:bottom-16 left-1/2 -translate-x-1/2 z-10"
            style={{ opacity: opacityValue }}
          >
            <ScrollToSection
              targetId="products"
              className="inline-flex h-12 md:h-14 items-center justify-center rounded-md bg-[#cbff01] px-6 md:px-8 py-2 md:py-3 text-base md:text-lg font-medium text-black shadow transition-colors hover:bg-[#cbff01]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {t("orderNow")}
            </ScrollToSection>
          </div>
        </section>

        {/* Product Offers Section */}
        <section id="products" className={`container ${sectionSpacing}`}>
          <h2 className="mb-8 text-center text-2xl md:text-3xl font-bold tracking-tight sm:text-4xl">
            {t("heroTitle")}
          </h2>
          <div className="grid gap-8 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <ProductCard key={index} product={product} featured={index === 1} />
            ))}
          </div>
        </section>

        {/* Oslobodi potencijal */}
        <section className={"w-full " + -sectionSpacing}>
          <div className="relative w-full">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={getPotentialImage() || "/placeholder.svg"}
                alt={t("oslobodiPotencijal")}
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority={false}
              />
            </div>
          </div>
        </section>

        {/* Science of Breathing Section - NEW SECTION */}

        {/* Why Use Stripy Section */}
        <section className={`${sectionSpacing} relative overflow-hidden`}>
          {/* No background elements */}

          <div className="container relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight sm:text-4xl mb-4">{t("whatStripyDoes")}</h2>
            </div>

            <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group bg-background/80 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg border border-muted hover:border-[#cbff01]/50 transition-all duration-300 hover:shadow-[#cbff01]/5 hover:shadow-xl"
                  style={{
                    animationDelay: benefit.delay,
                    transform: "translateY(0)",
                    opacity: 1,
                    transition: `transform 0.5s ease, opacity 0.5s ease`,
                  }}
                >
                  <div className="flex flex-col h-full">
                    <div className="mb-4 p-3 rounded-full bg-[#cbff01]/10 w-fit group-hover:bg-[#cbff01]/20 transition-colors duration-300">
                      <div className="text-[#cbff01]">{benefit.icon}</div>
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm md:text-base text-muted-foreground flex-grow">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className={`${sectionSpacing} relative overflow-hidden`}>
          {/* No background elements */}

          <div className="container relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight sm:text-4xl mb-4">{t("faq")}</h2>
            </div>

            <div className="mx-auto max-w-3xl bg-background/90 rounded-xl p-4 md:p-6 shadow-lg border border-muted">
              <div className="space-y-3 md:space-y-4">
                {faqItems.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "rounded-lg overflow-hidden border border-muted transition-all duration-300",
                      activeAccordion === item.id ? "border-[#cbff01]/50 shadow-md" : "hover:border-muted/80",
                    )}
                  >
                    <button
                      onClick={() => setActiveAccordion(activeAccordion === item.id ? null : item.id)}
                      className="flex items-center justify-between w-full p-3 md:p-4 text-left font-medium text-sm md:text-base"
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 md:h-5 md:w-5 text-muted-foreground transition-transform duration-200",
                          activeAccordion === item.id ? "transform rotate-180 text-[#cbff01]" : "",
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-200",
                        activeAccordion === item.id ? "max-h-96 p-3 md:p-4 pt-0" : "max-h-0",
                      )}
                    >
                      <div className="text-sm md:text-base text-muted-foreground pt-2 border-t border-muted/50">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background mt-5">
        <div className="container py-4">
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
            <div>
              <h3 className="mb-2 text-base font-semibold">{t("aboutStripy")}</h3>
              <p className="text-sm text-muted-foreground">{t("aboutStripyNew")}</p>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold">{t("contactUs")}</h3>
              <p className="text-sm text-muted-foreground">Email: info@mystripy.com</p>
              <div className="mt-2 flex gap-3">
                <a
                  href="https://www.facebook.com/profile.php?id=61574093874513"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Facebook
                </a>
                <a
                  href="https://www.instagram.com/mystripy/"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Instagram
                </a>
                <a
                  href="https://www.tiktok.com/@mystripy"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  TikTok
                </a>
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold">{t("quickLinks")}</h3>
              <ul className="space-y-1">
                <li>
                  <a href="#products" className="text-sm text-muted-foreground hover:text-foreground">
                    {t("products")}
                  </a>
                </li>
                <li>
                  <a href="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground">
                    {t("privacyPolicy")}
                  </a>
                </li>
                <li>
                  <a href="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground">
                    {t("termsOfService")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-3 border-t pt-3 text-center text-xs text-muted-foreground">
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

