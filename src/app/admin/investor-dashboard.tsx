"use client"

import { RefreshCw, LogOut, RotateCw } from "lucide-react"

import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useMediaQuery } from "@/src/hooks/use-media-query"
import { getAllPromoCodeUsage, getAllCreatorEarnings } from "@/src/lib/query"
import { useState, useEffect } from "react"
import { useTranslation } from "@/src/lib/i18n-client"

// Exchange rate - in a real app, this would come from an API
const EUR_TO_RSD_RATE = 117.5

interface InvestorDashboardProps {
  creatorData: any
  isLoading: boolean
  displayCurrency: "EUR" | "RSD"
  onRefresh: () => void
  onLogout: () => void
  onToggleCurrency: () => void
}

export default function InvestorDashboard({
  creatorData,
  isLoading: isLoadingProp,
  displayCurrency,
  onRefresh,
  onLogout,
  onToggleCurrency,
}: InvestorDashboardProps) {
  const { t } = useTranslation()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isLoading, setIsLoading] = useState(isLoadingProp)
  const [businessData, setBusinessData] = useState<any>(null)

  // Investment data - in a real app, this would come from a database
  const investmentData = {
    initialInvestment: 10000, // EUR
    investmentDate: "2023-01-15",
    ownershipPercentage: 15, // 15% ownership
    returnPerOrder: 0.05, // 5% of each order
  }

  useEffect(() => {
    loadBusinessData()
  }, [])

  const loadBusinessData = async () => {
    setIsLoading(true)
    try {
      const [allPromoCodeUsage, allCreatorEarnings] = await Promise.all([
        getAllPromoCodeUsage(),
        getAllCreatorEarnings(),
      ])

      setBusinessData({
        promoCodeUsage: allPromoCodeUsage,
        creatorEarnings: allCreatorEarnings,
      })
    } catch (error) {
      console.error("Failed to load business data:", error)
    } finally {
      setIsLoading(false)
    }
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

  // Calculate total business revenue
  const calculateBusinessTotals = () => {
    if (!businessData?.creatorEarnings) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        totalAffiliateEarnings: 0,
      }
    }

    let totalRevenue = 0
    let totalOrders = 0
    let totalAffiliateEarnings = 0

    businessData.creatorEarnings.forEach((earning: any) => {
      totalRevenue += earning.totalSales || 0
      totalOrders += earning.orderCount || 0
      totalAffiliateEarnings += earning.totalEarnings || 0
    })

    return {
      totalRevenue,
      totalOrders,
      totalAffiliateEarnings,
      formattedTotalRevenue: formatCurrency(totalRevenue, "EUR"),
      formattedTotalAffiliateEarnings: formatCurrency(totalAffiliateEarnings, "EUR"),
    }
  }

  // Calculate investor returns
  const calculateInvestorReturns = () => {
    const businessTotals = calculateBusinessTotals()

    // Calculate investor's share of the business
    const businessProfit = businessTotals.totalRevenue - businessTotals.totalAffiliateEarnings
    const investorProfit = businessProfit * (investmentData.ownershipPercentage / 100)

    // Calculate return on investment
    const roi = (investorProfit / investmentData.initialInvestment) * 100

    // Calculate per-order return
    const perOrderReturn = businessTotals.totalOrders > 0 ? investorProfit / businessTotals.totalOrders : 0

    return {
      investorProfit,
      roi,
      perOrderReturn,
      formattedInvestorProfit: formatCurrency(investorProfit, "EUR"),
      formattedPerOrderReturn: formatCurrency(perOrderReturn, "EUR"),
    }
  }

  const businessTotals = calculateBusinessTotals()
  const investorReturns = calculateInvestorReturns()

  const handleRefresh = () => {
    onRefresh()
    loadBusinessData()
  }

  return (
    <div className="container mx-auto py-4 md:py-8 px-4 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{t("investorDashboard")}</h1>
          <p className="text-sm md:text-base text-muted-foreground">{t("investmentOverview")}</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={onToggleCurrency}>
            <RotateCw className="h-4 w-4 mr-1 md:mr-2" />
            {displayCurrency === "EUR" ? "RSD" : "EUR"}
          </Button>
          <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-1 md:mr-2 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? t("loading") : t("refresh")}
          </Button>
          <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-1 md:mr-2" />
            {t("logout")}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-4 mb-6 md:mb-8">
        <Card>
          <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-sm md:text-lg">{t("initialInvestment")}</CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <p className="text-xl md:text-3xl font-bold">{formatCurrency(investmentData.initialInvestment)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("investedOn")} {new Date(investmentData.investmentDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-sm md:text-lg">{t("ownershipPercentage")}</CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <p className="text-xl md:text-3xl font-bold">{investmentData.ownershipPercentage}%</p>
            <p className="text-xs text-muted-foreground mt-1">{t("ofTotalBusinessEquity")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-sm md:text-lg">{t("totalReturn")}</CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <p className="text-xl md:text-3xl font-bold">{investorReturns.formattedInvestorProfit}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("roi")}: {investorReturns.roi.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-sm md:text-lg">{t("returnPerOrder")}</CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <p className="text-xl md:text-3xl font-bold">{investorReturns.formattedPerOrderReturn}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("averagePerCompletedOrder")}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 md:mb-8">
        <CardHeader className="px-3 md:px-6 pt-3 md:pt-6 pb-2 md:pb-4">
          <CardTitle className="text-lg md:text-xl">{t("businessPerformance")}</CardTitle>
          <CardDescription className="text-xs md:text-sm">{t("businessMetricsDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("totalRevenue")}</h3>
                <p className="text-lg md:text-2xl font-semibold">{businessTotals.formattedTotalRevenue}</p>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("totalOrders")}</h3>
                <p className="text-lg md:text-2xl font-semibold">{businessTotals.totalOrders}</p>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("affiliatePayouts")}</h3>
                <p className="text-lg md:text-2xl font-semibold">{businessTotals.formattedTotalAffiliateEarnings}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm md:text-base font-medium mb-2">{t("businessProfitBreakdown")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <h4 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("grossRevenue")}</h4>
                  <p className="text-base md:text-lg font-semibold">{businessTotals.formattedTotalRevenue}</p>
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("affiliateCosts")}</h4>
                  <p className="text-base md:text-lg font-semibold">
                    - {businessTotals.formattedTotalAffiliateEarnings}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("netProfit")}</h4>
                  <p className="text-base md:text-lg font-semibold">
                    {formatCurrency(businessTotals.totalRevenue - businessTotals.totalAffiliateEarnings, "EUR")}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                    {t("yourShare")} ({investmentData.ownershipPercentage}%)
                  </h4>
                  <p className="text-base md:text-lg font-semibold">{investorReturns.formattedInvestorProfit}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-3 md:px-6 pt-3 md:pt-6 pb-2 md:pb-4">
          <CardTitle className="text-lg md:text-xl">{t("orderHistory")}</CardTitle>
          <CardDescription className="text-xs md:text-sm">{t("orderHistoryDescription")}</CardDescription>
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
                          {t("yourReturn")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-muted/50 text-xs md:text-sm">
                      {creatorData.orders.map((order: any) => {
                        const orderDate = new Date(order.createdAt).toLocaleDateString()
                        const orderAmountInEUR =
                          order.currency === "RSD" ? order.totalPrice / EUR_TO_RSD_RATE : order.totalPrice
                        const investorReturn =
                          orderAmountInEUR * (investmentData.ownershipPercentage / 100) * investmentData.returnPerOrder

                        return (
                          <tr key={order.id}>
                            <td className="py-2 px-2 whitespace-nowrap">{order.id.substring(0, 6)}...</td>
                            <td className="py-2 px-2 whitespace-nowrap">{orderDate}</td>
                            <td className="py-2 px-2 whitespace-nowrap">
                              {formatCurrency(order.totalPrice, order.currency)}
                            </td>
                            <td className="py-2 px-2 whitespace-nowrap">{order.currency}</td>
                            <td className="py-2 px-2 whitespace-nowrap">{formatCurrency(investorReturn, "EUR")}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 md:py-8 text-muted-foreground">{t("noOrderData")}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

