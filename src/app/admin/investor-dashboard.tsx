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
import { getInvestorData, updateInvestorData } from "@/src/lib/business-query"
import { useTranslation } from "@/src/lib/i18n-client"
import { useToast } from "@/src/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { InvestorData } from "@/src/lib/types"

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

// Form schema for investor data
const investorFormSchema = z.object({
  investorName: z.string().min(2, {
    message: "Investor name must be at least 2 characters.",
  }),
  initialInvestment: z.coerce.number().positive({
    message: "Initial investment must be a positive number.",
  }),
  investmentDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date.",
  }),
  ownershipPercentage: z.coerce.number().min(0).max(100, {
    message: "Ownership percentage must be between 0 and 100.",
  }),
  returnPerOrder: z.coerce.number().min(0).max(1, {
    message: "Return per order must be between 0 and 1 (0% to 100%).",
  }),
})

export default function InvestorDashboard({
  creatorData,
  isLoading: isLoadingProp,
  displayCurrency,
  onRefresh,
  onLogout,
  onToggleCurrency,
}: InvestorDashboardProps) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isLoading, setIsLoading] = useState(isLoadingProp)
  const [businessData, setBusinessData] = useState<any>(null)
  const [investorData, setInvestorData] = useState<InvestorData | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Form for editing investor data
  const form = useForm<z.infer<typeof investorFormSchema>>({
    resolver: zodResolver(investorFormSchema),
    defaultValues: {
      investorName: "",
      initialInvestment: 0,
      investmentDate: "",
      ownershipPercentage: 0,
      returnPerOrder: 0,
    },
  })

  useEffect(() => {
    loadBusinessData()
    loadInvestorData()
  }, [])

  // Update form values when investor data changes
  useEffect(() => {
    if (investorData) {
      form.reset({
        investorName: investorData.investorName,
        initialInvestment: investorData.initialInvestment,
        investmentDate: new Date(investorData.investmentDate).toISOString().split("T")[0],
        ownershipPercentage: investorData.ownershipPercentage,
        returnPerOrder: investorData.returnPerOrder,
      })
    }
  }, [investorData, form])

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

  // Update the loadInvestorData function to handle errors better
  const loadInvestorData = async () => {
    try {
      const data = await getInvestorData()
      if (data) {
        setInvestorData(data)
      } else {
        console.error("No investor data returned")
        // Create default investor data if none exists
        await updateInvestorData({
          id: crypto.randomUUID(),
          investorName: "Primary Investor",
          initialInvestment: 10000,
          investmentDate: new Date("2023-01-15"),
          ownershipPercentage: 15,
          returnPerOrder: 0.05,
        })
        // Try to load again
        const retryData = await getInvestorData()
        if (retryData) {
          setInvestorData(retryData)
        }
      }
    } catch (error) {
      console.error("Failed to load investor data:", error)
    }
  }

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof investorFormSchema>) => {
    try {
      if (!investorData?.id) return

      await updateInvestorData({
        id: investorData.id,
        investorName: values.investorName,
        initialInvestment: values.initialInvestment,
        investmentDate: new Date(values.investmentDate),
        ownershipPercentage: values.ownershipPercentage,
        returnPerOrder: values.returnPerOrder,
      })

      // Reload investor data
      await loadInvestorData()

      toast({
        title: "Investor data updated",
        description: "The investor data has been successfully updated.",
      })

      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Failed to update investor data:", error)
      toast({
        title: "Update failed",
        description: "There was a problem updating the investor data.",
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
    if (!investorData)
      return {
        investorProfit: 0,
        roi: 0,
        perOrderReturn: 0,
        formattedInvestorProfit: formatCurrency(0, "EUR"),
        formattedPerOrderReturn: formatCurrency(0, "EUR"),
      }

    const businessTotals = calculateBusinessTotals()

    // Calculate investor's share of the business
    const businessProfit = businessTotals.totalRevenue - businessTotals.totalAffiliateEarnings
    const investorProfit = businessProfit * (investorData.ownershipPercentage / 100)

    // Calculate return on investment
    const roi = (investorProfit / investorData.initialInvestment) * 100

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
    loadInvestorData()
  }

  if (!investorData) {
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
          <h1 className="text-2xl md:text-3xl font-bold">{t("investorDashboard")}</h1>
          <p className="text-sm md:text-base text-muted-foreground">{t("investmentOverview")}</p>
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
                <DialogTitle>{t("editInvestorData")}</DialogTitle>
                <DialogDescription>{t("updateInvestorDataDescription")}</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="investorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("investorName")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                    name="ownershipPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("ownershipPercentage")} (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" max="100" {...field} />
                        </FormControl>
                        <FormDescription>{t("percentageOfBusinessOwned")}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="returnPerOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("returnPerOrderPercentage")}</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" max="1" {...field} />
                        </FormControl>
                        <FormDescription>{t("percentageReturnPerOrder")}</FormDescription>
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
            <CardTitle className="text-sm md:text-lg">{t("initialInvestment")}</CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <p className="text-xl md:text-3xl font-bold">{formatCurrency(investorData.initialInvestment)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("investedOn")} {new Date(investorData.investmentDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-sm md:text-lg">{t("ownershipPercentage")}</CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <p className="text-xl md:text-3xl font-bold">{investorData.ownershipPercentage}%</p>
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
                    {t("yourShare")} ({investorData.ownershipPercentage}%)
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
                          orderAmountInEUR * (investorData.ownershipPercentage / 100) * investorData.returnPerOrder

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

