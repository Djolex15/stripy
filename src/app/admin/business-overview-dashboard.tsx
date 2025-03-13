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

interface BusinessOverviewDashboardProps {
  creatorData: any
  isLoading: boolean
  displayCurrency: "EUR" | "RSD"
  onRefresh: () => void
  onLogout: () => void
  onToggleCurrency: () => void
}

export default function BusinessOverviewDashboard({
  creatorData,
  isLoading: isLoadingProp,
  displayCurrency,
  onRefresh,
  onLogout,
  onToggleCurrency,
}: BusinessOverviewDashboardProps) {
  const { t } = useTranslation()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isLoading, setIsLoading] = useState(isLoadingProp)
  const [businessData, setBusinessData] = useState<any>(null)

  // Business data - in a real app, this would come from a database
  const businessMetrics = {
    initialInvestment: 25000, // EUR
    operatingCosts: 1500, // Monthly operating costs in EUR
    investorPercentage: 15, // 15% goes to investors
    affiliatePercentage: 10, // 10% average to affiliates
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

  // Calculate total business metrics
  const calculateBusinessMetrics = () => {
    if (!businessData?.creatorEarnings) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        totalAffiliateEarnings: 0,
        grossProfit: 0,
        netProfit: 0,
        investorEarnings: 0,
        companyProfit: 0,
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

    // Calculate profits
    const grossProfit = totalRevenue - totalAffiliateEarnings
    const operatingCosts = businessMetrics.operatingCosts * 6 // Assuming 6 months of operation
    const netProfit = grossProfit - operatingCosts

    // Calculate earnings distribution
    const investorEarnings = netProfit * (businessMetrics.investorPercentage / 100)
    const companyProfit = netProfit - investorEarnings

    return {
      totalRevenue,
      totalOrders,
      totalAffiliateEarnings,
      grossProfit,
      netProfit,
      investorEarnings,
      companyProfit,
      operatingCosts,
      formattedTotalRevenue: formatCurrency(totalRevenue, "EUR"),
      formattedTotalAffiliateEarnings: formatCurrency(totalAffiliateEarnings, "EUR"),
      formattedGrossProfit: formatCurrency(grossProfit, "EUR"),
      formattedNetProfit: formatCurrency(netProfit, "EUR"),
      formattedInvestorEarnings: formatCurrency(investorEarnings, "EUR"),
      formattedCompanyProfit: formatCurrency(companyProfit, "EUR"),
      formattedOperatingCosts: formatCurrency(operatingCosts, "EUR"),
    }
  }

  const businessMetricsData = calculateBusinessMetrics()

  const handleRefresh = () => {
    onRefresh()
    loadBusinessData()
  }

  return (
    <div className="container mx-auto py-4 md:py-8 px-4 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{t("businessOverview")}</h1>
          <p className="text-sm md:text-base text-muted-foreground">{t("completeBusinessPerformance")}</p>
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
            <CardTitle className="text-sm md:text-lg">{t("totalRevenue")}</CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <p className="text-xl md:text-3xl font-bold">{businessMetricsData.formattedTotalRevenue}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("from")} {businessMetricsData.totalOrders} {t("orders")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-sm md:text-lg">{t("grossProfit")}</CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <p className="text-xl md:text-3xl font-bold">{businessMetricsData.formattedGrossProfit}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("afterAffiliatePayouts")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-sm md:text-lg">{t("netProfit")}</CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <p className="text-xl md:text-3xl font-bold">{businessMetricsData.formattedNetProfit}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("afterOperatingCosts")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-sm md:text-lg">{t("companyProfit")}</CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <p className="text-xl md:text-3xl font-bold">{businessMetricsData.formattedCompanyProfit}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("afterInvestorPayouts")}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 md:mb-8">
        <CardHeader className="px-3 md:px-6 pt-3 md:pt-6 pb-2 md:pb-4">
          <CardTitle className="text-lg md:text-xl">{t("financialBreakdown")}</CardTitle>
          <CardDescription className="text-xs md:text-sm">{t("financialMetricsDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("totalRevenue")}</h3>
                <p className="text-lg md:text-2xl font-semibold">{businessMetricsData.formattedTotalRevenue}</p>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("affiliatePayouts")}</h3>
                <p className="text-lg md:text-2xl font-semibold">
                  - {businessMetricsData.formattedTotalAffiliateEarnings}
                </p>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("grossProfit")}</h3>
                <p className="text-lg md:text-2xl font-semibold">{businessMetricsData.formattedGrossProfit}</p>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("operatingCosts")}</h3>
                <p className="text-lg md:text-2xl font-semibold">- {businessMetricsData.formattedOperatingCosts}</p>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("netProfit")}</h3>
                <p className="text-lg md:text-2xl font-semibold">{businessMetricsData.formattedNetProfit}</p>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                  {t("investorEarnings")} ({businessMetrics.investorPercentage}%)
                </h3>
                <p className="text-lg md:text-2xl font-semibold">- {businessMetricsData.formattedInvestorEarnings}</p>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("companyProfit")}</h3>
                <p className="text-lg md:text-2xl font-semibold">{businessMetricsData.formattedCompanyProfit}</p>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("initialInvestment")}</h3>
                <p className="text-lg md:text-2xl font-semibold">{formatCurrency(businessMetrics.initialInvestment)}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm md:text-base font-medium mb-2">{t("profitDistribution")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                <Card className="bg-muted/50">
                  <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
                    <CardTitle className="text-sm md:text-base">{t("affiliatePayouts")}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                    <p className="text-lg md:text-xl font-bold">
                      {businessMetricsData.formattedTotalAffiliateEarnings}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {((businessMetricsData.totalAffiliateEarnings / businessMetricsData.totalRevenue) * 100).toFixed(
                        1,
                      )}
                      % {t("ofRevenue")}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
                    <CardTitle className="text-sm md:text-base">{t("investorEarnings")}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                    <p className="text-lg md:text-xl font-bold">{businessMetricsData.formattedInvestorEarnings}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {businessMetrics.investorPercentage}% {t("ofNetProfit")}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
                    <CardTitle className="text-sm md:text-base">{t("companyProfit")}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                    <p className="text-lg md:text-xl font-bold">{businessMetricsData.formattedCompanyProfit}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {100 - businessMetrics.investorPercentage}% {t("ofNetProfit")}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 md:mb-8">
        <CardHeader className="px-3 md:px-6 pt-3 md:pt-6 pb-2 md:pb-4">
          <CardTitle className="text-lg md:text-xl">{t("affiliatePerformance")}</CardTitle>
          <CardDescription className="text-xs md:text-sm">{t("affiliatePerformanceDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
          {isLoading ? (
            <div className="text-center py-6 md:py-8 text-muted-foreground">{t("loadingData")}</div>
          ) : businessData?.creatorEarnings && businessData.creatorEarnings.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto -mx-3 md:-mx-6">
                <div className="inline-block min-w-full align-middle px-3 md:px-6">
                  <table className="min-w-full divide-y divide-muted">
                    <thead>
                      <tr className="text-xs md:text-sm">
                        <th scope="col" className="py-2 px-2 text-left font-medium">
                          {t("promoCodeName")}
                        </th>
                        <th scope="col" className="py-2 px-2 text-left font-medium">
                          {t("creatorName")}
                        </th>
                        <th scope="col" className="py-2 px-2 text-left font-medium">
                          {t("commission")}
                        </th>
                        <th scope="col" className="py-2 px-2 text-left font-medium">
                          {t("orderCount")}
                        </th>
                        <th scope="col" className="py-2 px-2 text-left font-medium">
                          {t("totalSales")}
                        </th>
                        <th scope="col" className="py-2 px-2 text-left font-medium">
                          {t("earnings")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-muted/50 text-xs md:text-sm">
                      {businessData.creatorEarnings.map((earning: any) => (
                        <tr key={earning.code}>
                          <td className="py-2 px-2 whitespace-nowrap">{earning.code}</td>
                          <td className="py-2 px-2 whitespace-nowrap">{earning.creatorName}</td>
                          <td className="py-2 px-2 whitespace-nowrap">{earning.discount}%</td>
                          <td className="py-2 px-2 whitespace-nowrap">{earning.orderCount}</td>
                          <td className="py-2 px-2 whitespace-nowrap">
                            {formatCurrency(earning.totalSales || 0, "EUR")}
                          </td>
                          <td className="py-2 px-2 whitespace-nowrap">
                            {formatCurrency(earning.totalEarnings || 0, "EUR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-bold text-xs md:text-sm">
                        <td colSpan={3} className="py-2 px-2 text-right">
                          {t("totalLabel")}
                        </td>
                        <td className="py-2 px-2">{businessMetricsData.totalOrders}</td>
                        <td className="py-2 px-2">{businessMetricsData.formattedTotalRevenue}</td>
                        <td className="py-2 px-2">{businessMetricsData.formattedTotalAffiliateEarnings}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 md:py-8 text-muted-foreground">{t("noEarningsData")}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-3 md:px-6 pt-3 md:pt-6 pb-2 md:pb-4">
          <CardTitle className="text-lg md:text-xl">{t("businessMetrics")}</CardTitle>
          <CardDescription className="text-xs md:text-sm">{t("businessMetricsAndHealth")}</CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("roi")}</h3>
                <p className="text-lg md:text-2xl font-semibold">
                  {businessMetricsData.netProfit > 0
                    ? `${((businessMetricsData.netProfit / businessMetrics.initialInvestment) * 100).toFixed(1)}%`
                    : "0%"}
                </p>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("profitMargin")}</h3>
                <p className="text-lg md:text-2xl font-semibold">
                  {businessMetricsData.totalRevenue > 0
                    ? `${((businessMetricsData.netProfit / businessMetricsData.totalRevenue) * 100).toFixed(1)}%`
                    : "0%"}
                </p>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("averageOrderValue")}</h3>
                <p className="text-lg md:text-2xl font-semibold">
                  {businessMetricsData.totalOrders > 0
                    ? formatCurrency(businessMetricsData.totalRevenue / businessMetricsData.totalOrders, "EUR")
                    : formatCurrency(0, "EUR")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

