"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, QrCodeIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/src/hooks/use-toast"
import { verifyCreatorCredentials, getPromoCodeUsage, getCreatorEarnings, getPromoCodeOrders } from "@/src/lib/query"
import { createDefaultBusinessData } from "@/src/lib/business-query"
import { saveCreatorAuth, loadCreatorAuth, clearCreatorAuth } from "@/src/lib/auth-storage"
import { useMediaQuery } from "@/src/hooks/use-media-query"
import { QRCodeGenerator } from "@/src/components/qr-code-generator"

import InvestorDashboard from "./investor-dashboard"
import BusinessOverviewDashboard from "./business-overview-dashboard"
import CreatorDashboard from "./creator-dashboard"

// Exchange rate - in a real app, this would come from an API
const EUR_TO_RSD_RATE = 117.5

export default function AdminPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [creatorData, setCreatorData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [displayCurrency, setDisplayCurrency] = useState<"EUR" | "RSD">("EUR")
  const [activeTab, setActiveTab] = useState("dashboard")
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Update the loadCreatorData function to also load business data for special dashboards
  const loadCreatorData = async (code: string) => {
    setIsLoading(true)
    try {
      const [usageData, earningsData, ordersData] = await Promise.all([
        getPromoCodeUsage(code),
        getCreatorEarnings(code),
        getPromoCodeOrders(code),
      ])

      if (usageData && earningsData) {
        setCreatorData({
          ...usageData,
          ...earningsData,
          orders: (ordersData || []).filter((order) => order.createdAt !== null),
        })
      }

      // Initialize business data if needed for special dashboards
      if (code.toLowerCase() === "investor1" || code.toLowerCase() === "perceptionca") {
        await initializeBusinessData()
      }
    } catch (error) {
      console.error("Failed to load data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Update the initializeBusinessData function to ensure it completes before returning
  const initializeBusinessData = async () => {
    try {
      const result = await createDefaultBusinessData()
      if (!result.success) {
        console.error("Failed to initialize business data:", result.error)
      }
      return result
    } catch (error) {
      console.error("Failed to initialize business data:", error)
      return { success: false, error }
    }
  }

  // Update the useEffect to ensure business data is initialized on mount
  useEffect(() => {
    setMounted(true)
    setDisplayCurrency("EUR")

    // Check if user is already authenticated
    const savedAuth = loadCreatorAuth()
    if (savedAuth) {
      setIsAuthenticated(true)
      setPromoCode(savedAuth.code)
      setCreatorData(savedAuth)
      loadCreatorData(savedAuth.code)
    }

    // Initialize default business data if needed
    initializeBusinessData()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const creator = await verifyCreatorCredentials(promoCode, password)

      if (creator) {
        setIsAuthenticated(true)
        setCreatorData(creator)
        saveCreatorAuth(creator)
        loadCreatorData(creator.code)
      } else {
        toast({
          title: "Invalid credentials",
          description: "The promo code or password you entered is incorrect.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login error",
        description: "An error occurred while trying to log in. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCreatorData(null)
    clearCreatorAuth()
    setPassword("")
  }

  const renderDashboard = () => {
    if (!creatorData) return null

    // Check for special promo codes
    const code = creatorData.code?.toLowerCase()

    if (code === "investor1") {
      return (
        <InvestorDashboard
          creatorData={creatorData}
          isLoading={isLoading}
          displayCurrency={displayCurrency}
          onRefresh={() => loadCreatorData(creatorData.code)}
          onLogout={handleLogout}
          onToggleCurrency={() => setDisplayCurrency((prev) => (prev === "EUR" ? "RSD" : "EUR"))}
        />
      )
    } else if (code === "perceptionca") {
      return (
        <BusinessOverviewDashboard
          creatorData={creatorData}
          isLoading={isLoading}
          displayCurrency={displayCurrency}
          onRefresh={() => loadCreatorData(creatorData.code)}
          onLogout={handleLogout}
          onToggleCurrency={() => setDisplayCurrency((prev) => (prev === "EUR" ? "RSD" : "EUR"))}
        />
      )
    } else {
      return (
        <CreatorDashboard
          creatorData={creatorData}
          isLoading={isLoading}
          displayCurrency={displayCurrency}
          onRefresh={() => loadCreatorData(creatorData.code)}
          onLogout={handleLogout}
          onToggleCurrency={() => setDisplayCurrency((prev) => (prev === "EUR" ? "RSD" : "EUR"))}
        />
      )
    }
  }

  const backgroundStyle = {
    backgroundImage: "url('/websitebackground.png')",
    backgroundSize: "100vw",
    backgroundAttachment: "scroll",
  }

  if (!mounted) return null

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col" style={backgroundStyle}>
        <div className="container mx-auto py-8 md:py-16 px-4 flex justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Creator Login</CardTitle>
                <CardDescription>Enter your promo code and password to access your dashboard.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="promoCode">Promo Code</Label>
                    <Input
                      id="promoCode"
                      value={promoCode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPromoCode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col" style={backgroundStyle}>
      <header className="fixed top-0 z-50 w-full bg-transparent backdrop-blur-sm height-[80px]">
        <div className="container flex h-16 md:h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/primary-logo.svg" alt="Stripy Logo" width={140} height={28} className="rounded-sm" />
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("dashboard")}
              className={activeTab === "dashboard" ? "bg-muted" : ""}
            >
              Dashboard
            </Button>
            {creatorData?.code?.toLowerCase() === "perceptionca" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("qrcodes")}
                className={activeTab === "qrcodes" ? "bg-muted" : ""}
              >
                <QrCodeIcon className="h-4 w-4 mr-2" />
                QR Codes
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8 mt-20">
        {activeTab === "dashboard" ? (
          renderDashboard()
        ) : (
          renderDashboard()
        )}
      </main>
    </div>
  )
}

