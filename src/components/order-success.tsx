"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle, Home } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { useTranslation } from "@/src/lib/i18n-client"
import { sendOrderConfirmationEmails } from "@/src/lib/actions"
import { useToast } from "@/src/hooks/use-toast"

interface OrderSuccessPageProps {
  orderId?: string | null
}

export default function OrderSuccessPage({ orderId }: OrderSuccessPageProps) {
  const { t } = useTranslation()
  const [countdown, setCountdown] = useState(15)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()
  const [redirecting, setRedirecting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    setMounted(true)
    window.scrollTo(0, 0)

    // Use the order ID from props
    if (orderId && !emailSent) {
      sendOrderConfirmationEmails(orderId)
        .then((result) => {
          if (result.success) {
            setEmailSent(true)
            console.log("Confirmation emails sent successfully")
          } else {
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
    } else if (!orderId) {
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
  }, [toast, emailSent, orderId])

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
    <div className="fixed inset-0 flex flex-col items-center justify-center p-4 z-50 overflow-auto">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/websitebackground.png')",
          backgroundSize: "cover", // Changed from 100vw to cover for better mobile scaling
          backgroundPosition: "center",
          backgroundAttachment: "fixed", // Better for mobile scrolling
        }}
      />

      <div className="bg-background/80 backdrop-blur-md rounded-lg shadow-xl w-full max-w-3xl mx-auto my-4 p-4 sm:p-6 md:p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
        <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 text-[#cbff01] mx-auto mb-4 sm:mb-6" />

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">{t("orderConfirmed")}</h1>

        <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 md:mb-8">{t("thankYouForYourOrder")}</p>

        <div className="bg-[#cbff01]/20 p-3 sm:p-4 md:p-6 rounded-lg mb-4 sm:mb-6 md:mb-8">
          <p className="text-base sm:text-lg md:text-xl font-medium mb-1 sm:mb-2">
            {t("orderConfirmationSentToEmail")}
          </p>
          <p className="text-sm sm:text-base text-muted-foreground">{t("checkYourInboxForDetails")}</p>
        </div>

        <p className="mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base text-muted-foreground">{t("orderProcessingMessage")}</p>

        <div className="mb-4 sm:mb-6 text-base sm:text-lg">
          <p>
            {t("redirectingToHomepage")} <span className="font-bold text-[#cbff01]">{countdown}</span> {t("seconds")}
          </p>
        </div>

        <div className="flex justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto text-base sm:text-lg py-5 px-6">
            <Link href="/">
              <Home className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {t("backToHome")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

