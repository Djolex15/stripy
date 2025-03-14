"use client"

import { useState, useEffect } from "react"
import { RefreshCw, LogOut, RotateCw, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isLoading, setIsLoading] = useState(isLoadingProp)
  const [businessData, setBusinessData] = useState<any>(null)
  const [businessMetricsData, setBusinessMetricsData] = useState<BusinessMetricsData | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "revenue" | "affiliates" | "investment">("overview")

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
        // Handle both string and Date objects for investmentDate
        investmentDate:
          typeof businessMetricsData.investmentDate === "string"
            ? businessMetricsData.investmentDate.split("T")[0]
            : new Date(businessMetricsData.investmentDate).toISOString().split("T")[0],
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

  const loadBusinessMetrics = async () => {
    try {
      const data = await getBusinessMetrics()
      if (data) {
        setBusinessMetricsData(data)
      } else {
        console.error("No business metrics data returned")
      }
    } catch (error) {
      console.error("Failed to load business metrics:", error)
    }
  }

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof businessFormSchema>) => {
    try {
      const result = await updateBusinessMetrics({
        initialInvestment: values.initialInvestment,
        investmentDate: new Date(values.investmentDate),
        operatingCosts: values.operatingCosts,
        investorPercentage: values.investorPercentage,
        affiliatePercentage: values.affiliatePercentage,
      })

      if (result.success) {
        // Reload business metrics
        await loadBusinessMetrics()

        toast({
          title: "Business metrics updated",
          description: "The business metrics have been successfully updated.",
        })

        setIsEditDialogOpen(false)
      } else {
        throw new Error("Failed to update business metrics")
      }
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
  const formatCurrency = (amount: number | undefined, originalCurrency = "EUR") => {
    // Handle null or undefined amounts
    if (amount === undefined || amount === null) {
      amount = 0
    }

    // Convert to the display currency if needed
    const convertedAmount = convertCurrency(amount, originalCurrency, displayCurrency)

    if (displayCurrency === "RSD") {
      return `${Math.round(convertedAmount).toLocaleString()} RSD`
    } else {
      return `€${convertedAmount.toFixed(2)}`
    }
  }

  // Calculate investment recovery percentage
  const calculateInvestmentRecoveryPercentage = () => {
    if (!businessMetricsData || !businessMetricsData.initialInvestment) return 0

    const profit = businessMetricsData.profit || 0
    if (profit >= businessMetricsData.initialInvestment) return 100

    return Math.round((profit / businessMetricsData.initialInvestment) * 100)
  }

  const handleRefresh = () => {
    onRefresh()
    loadBusinessData()
    loadBusinessMetrics()
  }

  if (!businessMetricsData) {
    return (
      <div className="container mx-auto py-4 md:py-8 px-4 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading business metrics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-4 md:py-8 px-4 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Business Overview</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Complete business performance and financial metrics
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size={isMobile ? "sm" : "default"}>
                <Edit className="h-4 w-4 mr-1 md:mr-2" />
                Edit Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Business Metrics</DialogTitle>
                <DialogDescription>Update your business settings and investment information.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="initialInvestment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Investment (EUR)</FormLabel>
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
                        <FormLabel>Investment Date</FormLabel>
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
                        <FormLabel>Monthly Operating Costs (EUR)</FormLabel>
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
                        <FormLabel>Investor Percentage (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" max="100" {...field} />
                        </FormControl>
                        <FormDescription>Percentage of profit that goes to investors</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="affiliatePercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Affiliate Percentage (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" max="100" {...field} />
                        </FormControl>
                        <FormDescription>Average percentage paid to affiliates</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Save Changes</Button>
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
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
          <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-1 md:mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="overview"
        className="space-y-4"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as any)}
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue & Profit</TabsTrigger>
          <TabsTrigger value="affiliates">Affiliate Program</TabsTrigger>
          <TabsTrigger value="investment">Investment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(businessMetricsData.grossRevenue)}</div>
                <p className="text-xs text-muted-foreground">From {businessMetricsData.totalOrders || 0} orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(businessMetricsData.netRevenue)}</div>
                <p className="text-xs text-muted-foreground">After affiliate payouts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(businessMetricsData.profit)}</div>
                <p className="text-xs text-muted-foreground">After operating costs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investment Recovery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{calculateInvestmentRecoveryPercentage()}%</div>
                <Progress value={calculateInvestmentRecoveryPercentage()} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {businessMetricsData.investmentRecovered
                    ? "Initial investment recovered"
                    : `${formatCurrency(businessMetricsData.remainingInvestment)} remaining`}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6 md:mb-8">
            <CardHeader className="px-3 md:px-6 pt-3 md:pt-6 pb-2 md:pb-4">
              <CardTitle className="text-lg md:text-xl">Financial Breakdown</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Detailed breakdown of revenue, costs, and profit
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
              <div className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Total Revenue</h3>
                    <p className="text-lg md:text-2xl font-semibold">
                      {formatCurrency(businessMetricsData.grossRevenue)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Affiliate Payouts</h3>
                    <p className="text-lg md:text-2xl font-semibold">
                      - {formatCurrency(businessMetricsData.totalAffiliatePayouts)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Gross Profit</h3>
                    <p className="text-lg md:text-2xl font-semibold">
                      {formatCurrency(businessMetricsData.netRevenue)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Operating Costs</h3>
                    <p className="text-lg md:text-2xl font-semibold">
                      - {formatCurrency(businessMetricsData.operatingCostsToDate)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Net Profit</h3>
                    <p className="text-lg md:text-2xl font-semibold">{formatCurrency(businessMetricsData.profit)}</p>
                  </div>
                  <div>
                    <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                      Investor Returns ({businessMetricsData.investorPercentage}%)
                    </h3>
                    <p className="text-lg md:text-2xl font-semibold">
                      - {formatCurrency(businessMetricsData.investorReturns)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Company Profit</h3>
                    <p className="text-lg md:text-2xl font-semibold">
                      {formatCurrency(businessMetricsData.companyProfit)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm md:text-base font-medium mb-2">Profit Distribution</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                    <Card className="bg-muted/50">
                      <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
                        <CardTitle className="text-sm md:text-base">Affiliate Payouts</CardTitle>
                      </CardHeader>
                      <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                        <p className="text-lg md:text-xl font-bold">
                          {formatCurrency(businessMetricsData.totalAffiliatePayouts)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {businessMetricsData.grossRevenue && businessMetricsData.grossRevenue > 0
                            ? `${(((businessMetricsData.totalAffiliatePayouts || 0) / businessMetricsData.grossRevenue) * 100).toFixed(1)}% of revenue`
                            : "0% of revenue"}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
                        <CardTitle className="text-sm md:text-base">Investor Returns</CardTitle>
                      </CardHeader>
                      <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                        <p className="text-lg md:text-xl font-bold">
                          {formatCurrency(businessMetricsData.investorReturns)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {businessMetricsData.investorPercentage}% of net profit
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
                        <CardTitle className="text-sm md:text-base">Company Profit</CardTitle>
                      </CardHeader>
                      <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                        <p className="text-lg md:text-xl font-bold">
                          {formatCurrency(businessMetricsData.companyProfit)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {100 - businessMetricsData.investorPercentage}% of net profit
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Analysis of revenue sources and distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                    <p className="text-xl font-bold">{businessMetricsData.totalOrders || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Affiliate-Driven Orders</p>
                    <p className="text-xl font-bold">{businessMetricsData.affiliateOrderCount || 0}</p>
                    <p className="text-xs text-muted-foreground">
                      {businessMetricsData.totalOrders && businessMetricsData.totalOrders > 0
                        ? `${(((businessMetricsData.affiliateOrderCount || 0) / businessMetricsData.totalOrders) * 100).toFixed(1)}% of total orders`
                        : "0% of total orders"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Affiliate-Driven Sales</p>
                    <p className="text-xl font-bold">{formatCurrency(businessMetricsData.affiliateDrivenSales)}</p>
                    <p className="text-xs text-muted-foreground">
                      {businessMetricsData.grossRevenue && businessMetricsData.grossRevenue > 0
                        ? `${(((businessMetricsData.affiliateDrivenSales || 0) / businessMetricsData.grossRevenue) * 100).toFixed(1)}% of total revenue`
                        : "0% of total revenue"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profit Analysis</CardTitle>
                <CardDescription>Breakdown of costs and profit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Gross Profit Margin</p>
                    <p className="text-xl font-bold">
                      {businessMetricsData.grossRevenue && businessMetricsData.grossRevenue > 0
                        ? `${(((businessMetricsData.netRevenue || 0) / businessMetricsData.grossRevenue) * 100).toFixed(1)}%`
                        : "0%"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Net Profit Margin</p>
                    <p className="text-xl font-bold">
                      {businessMetricsData.grossRevenue && businessMetricsData.grossRevenue > 0
                        ? `${(((businessMetricsData.profit || 0) / businessMetricsData.grossRevenue) * 100).toFixed(1)}%`
                        : "0%"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Operating Costs</p>
                    <p className="text-xl font-bold">{formatCurrency(businessMetricsData.operatingCostsToDate)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(businessMetricsData.operatingCosts)} per month
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="affiliates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Affiliate Performance</CardTitle>
              <CardDescription>Track affiliate sales and commissions</CardDescription>
            </CardHeader>
            <CardContent>
              {businessData?.creatorEarnings && businessData.creatorEarnings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2 font-medium">Promo Code</th>
                        <th className="text-left py-2 px-2 font-medium">Creator</th>
                        <th className="text-left py-2 px-2 font-medium">Commission</th>
                        <th className="text-right py-2 px-2 font-medium">Orders</th>
                        <th className="text-right py-2 px-2 font-medium">Sales</th>
                        <th className="text-right py-2 px-2 font-medium">Earnings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {businessData.creatorEarnings.map((earning: any) => (
                        <tr key={earning.code} className="border-b">
                          <td className="py-2 px-2">{earning.code}</td>
                          <td className="py-2 px-2">{earning.creatorName}</td>
                          <td className="py-2 px-2">{earning.discount}%</td>
                          <td className="py-2 px-2 text-right">{earning.orderCount}</td>
                          <td className="py-2 px-2 text-right">{formatCurrency(earning.totalSales)}</td>
                          <td className="py-2 px-2 text-right">{formatCurrency(earning.totalEarnings)}</td>
                        </tr>
                      ))}
                      <tr className="font-bold">
                        <td colSpan={3} className="py-2 px-2 text-right">
                          Total
                        </td>
                        <td className="py-2 px-2 text-right">{businessMetricsData.affiliateOrderCount || 0}</td>
                        <td className="py-2 px-2 text-right">
                          {formatCurrency(businessMetricsData.affiliateDrivenSales)}
                        </td>
                        <td className="py-2 px-2 text-right">
                          {formatCurrency(businessMetricsData.totalAffiliatePayouts)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No affiliate data available</p>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Affiliate Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(businessMetricsData.affiliateDrivenSales)}</div>
                <p className="text-xs text-muted-foreground">
                  {businessMetricsData.grossRevenue && businessMetricsData.grossRevenue > 0
                    ? `${(((businessMetricsData.affiliateDrivenSales || 0) / businessMetricsData.grossRevenue) * 100).toFixed(1)}% of total revenue`
                    : "0% of total revenue"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Affiliate Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(businessMetricsData.totalAffiliatePayouts)}</div>
                <p className="text-xs text-muted-foreground">
                  Average {businessMetricsData.affiliatePercentage}% commission
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Net Affiliate Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    (businessMetricsData.affiliateDrivenSales || 0) - (businessMetricsData.totalAffiliatePayouts || 0),
                  )}
                </div>
                <p className="text-xs text-muted-foreground">After affiliate commissions</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="investment" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Investment Overview</CardTitle>
                <CardDescription>Track your initial investment and returns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Initial Investment</p>
                    <p className="text-xl font-bold">{formatCurrency(businessMetricsData.initialInvestment)}</p>
                    <p className="text-xs text-muted-foreground">
                      Invested on{" "}
                      {typeof businessMetricsData.investmentDate === "string"
                        ? new Date(businessMetricsData.investmentDate).toLocaleDateString()
                        : new Date(businessMetricsData.investmentDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Investment Recovery</p>
                    <p className="text-xl font-bold">{calculateInvestmentRecoveryPercentage()}%</p>
                    <Progress value={calculateInvestmentRecoveryPercentage()} className="h-2 mt-2" />
                  </div>

                  {!businessMetricsData.investmentRecovered && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Remaining to Recover</p>
                      <p className="text-xl font-bold">{formatCurrency(businessMetricsData.remainingInvestment)}</p>
                    </div>
                  )}

                  {businessMetricsData.investmentRecovered && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Return on Investment</p>
                      <p className="text-xl font-bold">
                        {businessMetricsData.initialInvestment > 0
                          ? `${(((businessMetricsData.profit || 0) / businessMetricsData.initialInvestment) * 100).toFixed(1)}%`
                          : "0%"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investor Returns</CardTitle>
                <CardDescription>Breakdown of investor earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Investor Percentage</p>
                    <p className="text-xl font-bold">{businessMetricsData.investorPercentage}%</p>
                    <p className="text-xs text-muted-foreground">Of net profit after investment recovery</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Investor Earnings</p>
                    <p className="text-xl font-bold">{formatCurrency(businessMetricsData.investorReturns)}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Company Profit</p>
                    <p className="text-xl font-bold">{formatCurrency(businessMetricsData.companyProfit)}</p>
                    <p className="text-xs text-muted-foreground">After investor payouts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

