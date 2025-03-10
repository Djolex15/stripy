"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, LogOut, RefreshCw, RotateCw } from 'lucide-react'

import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import LanguageSelector from "@/src/components/language-switcher"
import { useToast } from "@/src/hooks/use-toast"
import { useTranslation } from "@/src/lib/i18n-client"
import { verifyCreatorCredentials, getPromoCodeUsage, getCreatorEarnings, getPromoCodeOrders } from "@/src/lib/query"
import i18n from "@/src/lib/i18n-client"
import { useMediaQuery } from "@/src/hooks/use-media-query"
import { saveCreatorAuth, loadCreatorAuth, clearCreatorAuth, type CreatorAuthData } from "@/src/lib/auth-storage"

// Exchange rate - in a real app, this would come from an API
const EUR_TO_RSD_RATE = 117.5

export default function AdminPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [creatorData, setCreatorData] = useState<{
    code: string
    creatorName: string
    usageCount?: number
    lastUsed?: string
    discount?: number
    orderCount?: number
    totalSales?: number
    totalEarnings?: number
    orders?: Array<{
      id: string
      totalPrice: number
      currency: string
      createdAt: string
    }>
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [displayCurrency, setDisplayCurrency] = useState<"EUR" | "RSD">("EUR")
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    setMounted(true)
    setCurrentLanguage(i18n.language || "en")
    setDisplayCurrency(i18n.language === "sr" ? "RSD" : "EUR")

    // Listen for language changes
    const handleLanguageChanged = (lng: string) => {
      setCurrentLanguage(lng)
      setDisplayCurrency(lng === "sr" ? "RSD" : "EUR")
    }

    i18n.on("languageChanged", handleLanguageChanged)

    // Check if user is already authenticated
    const savedAuth = loadCreatorAuth()
    if (savedAuth) {
      setIsAuthenticated(true)
      setPromoCode(savedAuth.code)
      setCreatorData(savedAuth)
      loadCreatorData(savedAuth.code)
    }

    return () => {
      i18n.off("languageChanged", handleLanguageChanged)
    }
  }, [])

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
          orders: (ordersData || []).filter((order) => order.createdAt !== null) as Array<{
            id: string
            totalPrice: number
            currency: string
            createdAt: string
          }>,
        })
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
          title: t("invalidCredentials"),
          description: t("invalidCredentialsMessage"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: t("loginError"),
        description: t("tryAgainLater"),
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

  const handleRefresh = () => {
    if (creatorData?.code) {
      loadCreatorData(creatorData.code)
    }
  }

  const toggleDisplayCurrency = () => {
    setDisplayCurrency((prev) => (prev === "EUR" ? "RSD" : "EUR"))
  }

  // Convert amount between currencies
  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string) => {
    if (fromCurrency === toCurrency) return amount

    if (fromCurrency === "EUR" && toCurrency === "RSD") {
      // Convert from EUR to RSD
      return amount * EUR_TO_RSD_RATE
    } else if (fromCurrency === "RSD" && toCurrency === "EUR") {
      // Convert from RSD to EUR
      return amount / EUR_TO_RSD_RATE
    }

    return amount
  }

  // Format currency based on selected display currency
  const formatCurrency = (amount: number, originalCurrency = "EUR") => {
    // Convert to the display currency if needed
    const convertedAmount = convertCurrency(amount, originalCurrency, displayCurrency)

    if (displayCurrency === "RSD") {
      return `${Math.round(convertedAmount).toLocaleString()} RSD`
    } else {
      // If original was in cents, convert to euros
      const inEuros = originalCurrency === "EUR" ? convertedAmount : convertedAmount
      return `€${inEuros.toFixed(2)}`
    }
  }

  // Calculate total orders and earnings
  const calculateOrdersTotal = () => {
    if (!creatorData?.orders || creatorData.orders.length === 0) {
      return { totalOrdersAmount: 0, totalEarnings: 0 }
    }

    let totalOrdersAmount = 0
    let totalEarnings = 0

    creatorData.orders.forEach((order) => {
      // Convert all to EUR for consistent calculation
      const orderAmountInEUR = order.currency === "RSD" ? order.totalPrice / EUR_TO_RSD_RATE : order.totalPrice

      totalOrdersAmount += orderAmountInEUR

      // Calculate earnings based on discount percentage
      const earningsPercentage = creatorData.discount || 0
      const earningsForOrder = orderAmountInEUR * (earningsPercentage / 100)
      totalEarnings += earningsForOrder
    })

    return {
      totalOrdersAmount,
      totalEarnings,
      // Return formatted values for display
      formattedTotalOrders: formatCurrency(totalOrdersAmount, "EUR"),
      formattedTotalEarnings: formatCurrency(totalEarnings, "EUR"),
    }
  }

  const orderTotals = calculateOrdersTotal()

  if (!mounted) return null

  const backgroundStyle = {
    backgroundImage: "url('/websitebackground.png')",
    backgroundRepeat: "repeat",
    backgroundSize: isMobile ? "100px" : "200px", // Smaller pattern on mobile
    backgroundAttachment: "scroll",
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col" style={backgroundStyle}>
        <div className="container mx-auto py-8 md:py-16 px-4 flex justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("creatorLogin")}</CardTitle>
                <CardDescription>{t("enterCreatorCredentials")}</CardDescription>
              </div>
              <LanguageSelector />
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="promoCode">{t("promoCode")}</Label>
                    <Input
                      id="promoCode"
                      value={promoCode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPromoCode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t("password")}</Label>
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
                    {isLoading ? t("loggingIn") : t("login")}
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
      <div className="container mx-auto py-4 md:py-8 px-4 min-h-screen">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{t("creatorDashboard")}</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {t("welcome")} {creatorData?.creatorName}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={toggleDisplayCurrency}>
              <RotateCw className="h-4 w-4 mr-1 md:mr-2" />
              {displayCurrency === "EUR" ? "RSD" : "EUR"}
            </Button>
            <LanguageSelector />
            <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-1 md:mr-2 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? t("loading") : t("refresh")}
            </Button>
            <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1 md:mr-2" />
              {t("logout")}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-4 mb-6 md:mb-8">
          <Card>
            <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
              <CardTitle className="text-sm md:text-lg">{t("yourPromoCode")}</CardTitle>
            </CardHeader>
            <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
              <p className="text-xl md:text-3xl font-bold">{creatorData?.code}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
              <CardTitle className="text-sm md:text-lg">{t("discountOffered")}</CardTitle>
            </CardHeader>
            <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
              <p className="text-xl md:text-3xl font-bold">{creatorData?.discount || 0}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
              <CardTitle className="text-sm md:text-lg">{t("totalOrders")}</CardTitle>
            </CardHeader>
            <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
              <p className="text-xl md:text-3xl font-bold">{creatorData?.orderCount || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
              <CardTitle className="text-sm md:text-lg">{t("yourEarnings")}</CardTitle>
            </CardHeader>
            <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
              <p className="text-xl md:text-3xl font-bold">{orderTotals.formattedTotalEarnings}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 md:mb-8">
          <CardHeader className="px-3 md:px-6 pt-3 md:pt-6 pb-2 md:pb-4">
            <CardTitle className="text-lg md:text-xl">{t("earningsSummary")}</CardTitle>
            <CardDescription className="text-xs md:text-sm">{t("earningsSummaryDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <div className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("totalSales")}</h3>
                  <p className="text-lg md:text-2xl font-semibold">{orderTotals.formattedTotalOrders}</p>
                </div>
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("yourCommission")}</h3>
                  <p className="text-lg md:text-2xl font-semibold">{creatorData?.discount || 0}%</p>
                </div>
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("totalEarnings")}</h3>
                  <p className="text-lg md:text-2xl font-semibold">{orderTotals.formattedTotalEarnings}</p>
                </div>
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("lastUsed")}</h3>
                  <p className="text-lg md:text-2xl font-semibold">
                    {creatorData?.lastUsed ? new Date(creatorData.lastUsed).toLocaleDateString() : t("never")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 md:mb-8">
          <CardHeader className="px-3 md:px-6 pt-3 md:pt-6 pb-2 md:pb-4">
            <CardTitle className="text-lg md:text-xl">{t("orderDetails")}</CardTitle>
            <CardDescription className="text-xs md:text-sm">{t("orderDetailsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            {isLoading ? (
              <div className="text-center py-6 md:py-8 text-muted-foreground">{t("loadingData")}</div>
            ) : creatorData?.orders && creatorData.orders.length > 0 ? (
              <div className="space-y-4">
                <div className="overflow-x-auto -mx-3 md:-mx-6">
                  <div className="inline-block min-w-full align-middle px-3 md:px-6">
                    <table className="min-w-full divide-y divide-muted">
                      <thead>
                        <tr className="text-xs md:text-sm">
                          <th scope="col" className="py-2 px-2 text-left font-medium">
                            {t("orderId")}
                          </th>
                          <th scope="col" className="py-2 px-2 text-left font-medium">
                            {t("orderDate")}
                          </th>
                          <th scope="col" className="py-2 px-2 text-left font-medium">
                            {t("orderAmount")}
                          </th>
                          <th scope="col" className="py-2 px-2 text-left font-medium">
                            {t("orderCurrency")}
                          </th>
                          <th scope="col" className="py-2 px-2 text-left font-medium">
                            {t("yourEarningsPerOrder")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-muted/50 text-xs md:text-sm">
                        {creatorData.orders.map((order) => {
                          const orderDate = new Date(order.createdAt).toLocaleDateString()
                          const earningsPercentage = creatorData.discount || 0
                          const earningsAmount = order.totalPrice * (earningsPercentage / 100)

                          return (
                            <tr key={order.id}>
                              <td className="py-2 px-2 whitespace-nowrap">{order.id.substring(0, 6)}...</td>
                              <td className="py-2 px-2 whitespace-nowrap">{orderDate}</td>
                              <td className="py-2 px-2 whitespace-nowrap">
                                {formatCurrency(order.totalPrice, order.currency)}
                              </td>
                              <td className="py-2 px-2 whitespace-nowrap">{order.currency}</td>
                              <td className="py-2 px-2 whitespace-nowrap">
                                {formatCurrency(earningsAmount, order.currency)}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="font-bold text-xs md:text-sm">
                          <td colSpan={2} className="py-2 px-2 text-right">
                            {t("totalLabel")}
                          </td>
                          <td className="py-2 px-2">{orderTotals.formattedTotalOrders}</td>
                          <td className="py-2 px-2">{displayCurrency}</td>
                          <td className="py-2 px-2">{orderTotals.formattedTotalEarnings}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 md:py-8 text-muted-foreground">{t("noOrderData")}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-3 md:px-6 pt-3 md:pt-6 pb-2 md:pb-4">
            <CardTitle className="text-lg md:text-xl">{t("usageStatistics")}</CardTitle>
            <CardDescription className="text-xs md:text-sm">{t("usageStatisticsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            {isLoading ? (
              <div className="text-center py-6 md:py-8 text-muted-foreground">{t("loadingData")}</div>
            ) : creatorData?.usageCount ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("totalUsage")}</h3>
                    <p className="text-lg md:text-2xl font-semibold">{creatorData.usageCount}</p>
                  </div>
                  <div>
                    <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("conversionRate")}</h3>
                    <p className="text-lg md:text-2xl font-semibold">
                      {creatorData.usageCount && creatorData.orderCount
                        ? `${((creatorData.orderCount / creatorData.usageCount) * 100).toFixed(1)}%`
                        : "0%"}
                    </p>
                  </div>
                </div>

                <div className="pt-3 md:pt-4 border-t">
                  <h3 className="text-xs md:text-sm font-medium mb-2">{t("promotionTips")}</h3>
                  <ul className="text-xs md:text-sm text-muted-foreground space-y-1 md:space-y-2 list-disc pl-5">
                    <li>{t("promotionTip1")}</li>
                    <li>{t("promotionTip2")}</li>
                    <li>{t("promotionTip3")}</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 md:py-8 text-muted-foreground">{t("noUsageData")}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
