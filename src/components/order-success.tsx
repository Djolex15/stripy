"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle, Home } from "lucide-react"
import Cookies from "js-cookie"
import { Button } from "@/src/components/ui/button"
import { useTranslation } from "@/src/lib/i18n-client"
import { sendOrderConfirmationEmails } from "@/src/lib/actions"
import { useToast } from "@/src/hooks/use-toast"

export default function OrderSuccessPage() {
  const { t } = useTranslation()
  const [countdown, setCountdown] = useState(15)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    setMounted(true)
    window.scrollTo(0, 0)

    // Get the order ID from the URL or cookies
    const orderId = new URLSearchParams(window.location.search).get("orderId") || Cookies.get("lastOrderId")

    if (orderId) {
      sendOrderConfirmationEmails(orderId)
        .then((result) => {
          if (!result.success) {
            toast({
              title: "Error",
              description: "Failed to send confirmation emails. Please contact support.",
              variant: "destructive",
            })
          }
        })
        .catch((error) => {
          console.error("Error sending confirmation emails:", error)
          toast({
            title: "Error",
            description: "An unexpected error occurred. Please contact support.",
            variant: "destructive",
          })
        })

      // Clear the order ID from cookies
      Cookies.remove("lastOrderId")
    } else {
      console.error("No order ID found")
      toast({
        title: "Error",
        description: "Order ID not found. Please contact support.",
        variant: "destructive",
      })
    }

    // Set up countdown timer
    const initialDelay = setTimeout(() => {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setRedirecting(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }, 500)

    return () => clearTimeout(initialDelay)
  }, [toast])

  // Handle redirection separately to avoid issues
  useEffect(() => {
    if (redirecting) {
      window.location.href = "/"
    }
  }, [redirecting])

  if (!mounted) {
    return null
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-4 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/websitebackground.png')",
          backgroundSize: "100vw",
          backgroundAttachment: "scroll",
        }}
      />

      <div className="bg-background/80 backdrop-blur-md rounded-lg shadow-xl max-w-3xl w-full p-8 md:p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
        <CheckCircle className="h-24 w-24 text-[#cbff01] mx-auto mb-6" />

        <h1 className="text-4xl md:text-5xl font-bold mb-6">{t("orderConfirmed")}</h1>

        <p className="text-xl mb-8">{t("thankYouForYourOrder")}</p>

        <div className="bg-[#cbff01]/20 p-6 rounded-lg mb-8">
          <p className="text-xl font-medium mb-2">{t("orderConfirmationSentToEmail")}</p>
          <p className="text-muted-foreground">{t("checkYourInboxForDetails")}</p>
        </div>

        <p className="mb-8 text-muted-foreground">{t("orderProcessingMessage")}</p>

        <div className="mb-6 text-lg">
          <p>
            {t("redirectingToHomepage")} <span className="font-bold text-[#cbff01]">{countdown}</span> {t("seconds")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg py-6">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              {t("backToHome")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

