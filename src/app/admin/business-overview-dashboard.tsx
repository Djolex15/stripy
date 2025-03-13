"use client"

import { RefreshCw, LogOut, RotateCw, Edit } from "lucide-react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useMediaQuery } from "@/src/hooks/use-media-query"
import { getAllPromoCodeUsage, getAllCreatorEarnings } from "@/src/lib/query"
import { getBusinessMetrics, updateBusinessMetrics } from "@/src/lib/business-query"
import { useTranslation } from "@/src/lib/i18n-client"
import { useToast } from "@/src/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { BusinessMetricsData } from "@/src/lib/types"

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

// Form schema for business metrics
const businessFormSchema = z.object({
  initialInvestment: z.coerce.number().positive({
    message: "Initial investment must be a positive number.",
  }),
  investmentDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date.",
  }),
  operatingCosts: z.coerce.number().positive({
    message: "Operating costs must be a positive number.",
  }),
  investorPercentage: z.coerce.number().min(0).max(100, {
    message: "Investor percentage must be between 0 and 100.",
  }),
  affiliatePercentage: z.coerce.number().min(0).max(100, {
    message: "Affiliate percentage must be between 0 and 100.",
  }),
})

// Function to convert currency
const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  if (fromCurrency === toCurrency) {
    return amount
  }

  if (fromCurrency === "EUR" && toCurrency === "RSD") {
    return amount * EUR_TO_RSD_RATE
  }

  if (fromCurrency === "RSD" && toCurrency === "EUR") {
    return amount / EUR_TO_RSD_RATE
  }

  return amount // Or handle other conversions as needed
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
  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isLoading, setIsLoading] = useState(isLoadingProp)
  const [businessData, setBusinessData] = useState<any>(null)
  const [businessMetricsData, setBusinessMetricsData] = useState<BusinessMetricsData | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Form for editing business metrics
  const form = useForm<z.infer<typeof businessFormSchema>>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      initialInvestment: 0,
      investmentDate: "",
      operatingCosts: 0,
      investorPercentage: 0,
      affiliatePercentage: 0,
    },
  })

  useEffect(() => {
    loadBusinessData()
    loadBusinessMetrics()
  }, [])

  // Update form values when business metrics change
  useEffect(() => {
    if (businessMetricsData) {
      form.reset({
        initialInvestment: businessMetricsData.initialInvestment,
        investmentDate: new Date(businessMetricsData.investmentDate).toISOString().split("T")[0],
        operatingCosts: businessMetricsData.operatingCosts,
        investorPercentage: businessMetricsData.investorPercentage,
        affiliatePercentage: businessMetricsData.affiliatePercentage,
      })
    }
  }, [businessMetricsData, form])

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

  // Update the loadBusinessMetrics function to handle errors better
  const loadBusinessMetrics = async () => {
    try {
      const data = await getBusinessMetrics()
      if (data) {
        setBusinessMetricsData(data)
      } else {
        console.error("No business metrics data returned")
        // Create default data if none exists
        await updateBusinessMetrics({
          initialInvestment: 25000,
          investmentDate: new Date("2023-01-01"),
          operatingCosts: 1500,
          investorPercentage: 15,
          affiliatePercentage: 10,
        })
        // Try to load again
        const retryData = await getBusinessMetrics()
        if (retryData) {
          setBusinessMetricsData(retryData)
        }
      }
    } catch (error) {
      console.error("Failed to load business metrics:", error)
    }
  }

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof businessFormSchema>) => {
    try {
      await updateBusinessMetrics({
        initialInvestment: values.initialInvestment,
        investmentDate: new Date(values.investmentDate),
        operatingCosts: values.operatingCosts,
        investorPercentage: values.investorPercentage,
        affiliatePercentage: values.affiliatePercentage,
      })

      // Reload business metrics
      await loadBusinessMetrics()

      toast({
        title: "Business metrics updated",
        description: "The business metrics have been successfully updated.",
      })

      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Failed to update business metrics:", error)
      toast({
        title: "Update failed",
        description: "There was a problem updating the business metrics.",
        variant: "destructive",
      })
    }
  }

  // Format currency based on selected display currency
  const formatCurrency = (amount: number, originalCurrency = "EUR") => {
    // Handle null or undefined amounts
    if (amount === null || amount === undefined) {
      amount = 0
    }

    // Convert to the display currency if needed
    const convertedAmount = convertCurrency(amount, originalCurrency, displayCurrency)

    if (displayCurrency === "RSD") {
      return `${Math.round(convertedAmount).toLocaleString()} RSD`
    } else {
      // If original was in cents, convert to euros
      const inEuros = Number(convertedAmount) // Ensure it's a number
      return `€${inEuros.toFixed(2)}`
    }
  }

  // Calculate total business metrics
  const calculateBusinessMetrics = () => {
    if (!businessData?.creatorEarnings || !businessMetricsData) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        totalAffiliateEarnings: 0,
        grossProfit: 0,
        netProfit: 0,
        investorEarnings: 0,
        companyProfit: 0,
        operatingCosts: 0,
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
    const operatingCosts = businessMetricsData.operatingCosts * 6 // Assuming 6 months of operation
    const netProfit = grossProfit - operatingCosts

    // Calculate earnings distribution
    const investorEarnings = netProfit * (businessMetricsData.investorPercentage / 100)
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

  const businessMetrics = calculateBusinessMetrics()

  const handleRefresh = () => {
    onRefresh()
    loadBusinessData()
    loadBusinessMetrics()
  }

  if (!businessMetricsData) {
    return (
      <div className="container mx-auto py-4 md:py-8 px-4 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-4 md:py-8 px-4 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{t("businessOverview")}</h1>
          <p className="text-sm md:text-base text-muted-foreground">{t("completeBusinessPerformance")}</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size={isMobile ? "sm" : "default"}>
                <Edit className="h-4 w-4 mr-1 md:mr-2" />
                {t("edit")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t("editBusinessMetrics")}</DialogTitle>
                <DialogDescription>{t("updateBusinessMetricsDescription")}</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="initialInvestment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("initialInvestment")} (EUR)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="investmentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("investmentDate")}</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="operatingCosts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("monthlyOperatingCosts")} (EUR)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="investorPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("investorPercentage")} (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" max="100" {...field} />
                        </FormControl>
                        <FormDescription>{t("percentageToInvestors")}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="affiliatePercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("affiliatePercentage")} (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" max="100" {...field} />
                        </FormControl>
                        <FormDescription>{t("averagePercentageToAffiliates")}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">{t("saveChanges")}</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
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
            <p className="text-xl md:text-3xl font-bold">{businessMetrics.formattedTotalRevenue}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("from")} {businessMetrics.totalOrders} {t("orders")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-sm md:text-lg">{t("grossProfit")}</CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <p className="text-xl md:text-3xl font-bold">{businessMetrics.formattedGrossProfit}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("afterAffiliatePayouts")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-sm md:text-lg">{t("netProfit")}</CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <p className="text-xl md:text-3xl font-bold">{businessMetrics.formattedNetProfit}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("afterOperatingCosts")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-sm md:text-lg">{t("companyProfit")}</CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <p className="text-xl md:text-3xl font-bold">{businessMetrics.formattedCompanyProfit}</p>
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
                <p className="text-lg md:text-2xl font-semibold">{businessMetrics.formattedTotalRevenue}</p>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("affiliatePayouts")}</h3>
                <p className="text-lg md:text-2xl font-semibold">- {businessMetrics.formattedTotalAffiliateEarnings}</p>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("grossProfit")}</h3>
                <p className="text-lg md:text-2xl font-semibold">{businessMetrics.formattedGrossProfit}</p>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("operatingCosts")}</h3>
                <p className="text-lg md:text-2xl font-semibold">- {businessMetrics.formattedOperatingCosts}</p>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("netProfit")}</h3>
                <p className="text-lg md:text-2xl font-semibold">{businessMetrics.formattedNetProfit}</p>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                  {t("investorEarnings")} ({businessMetricsData.investorPercentage}%)
                </h3>
                <p className="text-lg md:text-2xl font-semibold">- {businessMetrics.formattedInvestorEarnings}</p>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("companyProfit")}</h3>
                <p className="text-lg md:text-2xl font-semibold">{businessMetrics.formattedCompanyProfit}</p>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("initialInvestment")}</h3>
                <p className="text-lg md:text-2xl font-semibold">
                  {formatCurrency(businessMetricsData.initialInvestment)}
                </p>
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
                    <p className="text-lg md:text-xl font-bold">{businessMetrics.formattedTotalAffiliateEarnings}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {((businessMetrics.totalAffiliateEarnings / businessMetrics.totalRevenue) * 100).toFixed(1)}%{" "}
                      {t("ofRevenue")}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
                    <CardTitle className="text-sm md:text-base">{t("investorEarnings")}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                    <p className="text-lg md:text-xl font-bold">{businessMetrics.formattedInvestorEarnings}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {businessMetricsData.investorPercentage}% {t("ofNetProfit")}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
                    <CardTitle className="text-sm md:text-base">{t("companyProfit")}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                    <p className="text-lg md:text-xl font-bold">{businessMetrics.formattedCompanyProfit}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {100 - businessMetricsData.investorPercentage}% {t("ofNetProfit")}
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
                        <td className="py-2 px-2">{businessMetrics.totalOrders}</td>
                        <td className="py-2 px-2">{businessMetrics.formattedTotalRevenue}</td>
                        <td className="py-2 px-2">{businessMetrics.formattedTotalAffiliateEarnings}</td>
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
                  {businessMetrics.netProfit > 0
                    ? `${((businessMetrics.netProfit / businessMetricsData.initialInvestment) * 100).toFixed(1)}%`
                    : "0%"}
                </p>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("profitMargin")}</h3>
                <p className="text-lg md:text-2xl font-semibold">
                  {businessMetrics.totalRevenue > 0
                    ? `${((businessMetrics.netProfit / businessMetrics.totalRevenue) * 100).toFixed(1)}%`
                    : "0%"}
                </p>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">{t("averageOrderValue")}</h3>
                <p className="text-lg md:text-2xl font-semibold">
                  {businessMetrics.totalOrders > 0
                    ? formatCurrency(businessMetrics.totalRevenue / businessMetrics.totalOrders, "EUR")
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

