"use client"

import { RefreshCw, LogOut, RotateCw } from "lucide-react"

import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { useMediaQuery } from "@/src/hooks/use-media-query"

// Exchange rate - in a real app, this would come from an API
const EUR_TO_RSD_RATE = 117.5

interface CreatorDashboardProps {
  creatorData: any
  isLoading: boolean
  displayCurrency: "EUR" | "RSD"
  onRefresh: () => void
  onLogout: () => void
  onToggleCurrency: () => void
}

export default function CreatorDashboard({
  creatorData,
  isLoading,
  displayCurrency,
  onRefresh,
  onLogout,
  onToggleCurrency,
}: CreatorDashboardProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

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

    creatorData.orders.forEach((order: any) => {
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

  return (
    <div className="container mx-auto py-4 md:py-8 px-4 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Creator Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">Welcome {creatorData?.creatorName}</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={onToggleCurrency}>
            <RotateCw className="h-4 w-4 mr-1 md:mr-2" />
            {displayCurrency === "EUR" ? "RSD" : "EUR"}
          </Button>
          <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-1 md:mr-2 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
          <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-1 md:mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-4 mb-6 md:mb-8">
        <Card>
          <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-sm md:text-lg">Your Promo Code</CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <p className="text-xl md:text-3xl font-bold">{creatorData?.code}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-sm md:text-lg">Discount Offered</CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <p className="text-xl md:text-3xl font-bold">{creatorData?.discount || 0}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-sm md:text-lg">Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <p className="text-xl md:text-3xl font-bold">{creatorData?.orderCount || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-sm md:text-lg">Your Earnings</CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <p className="text-xl md:text-3xl font-bold">{orderTotals.formattedTotalEarnings}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 md:mb-8">
        <CardHeader className="px-3 md:px-6 pt-3 md:pt-6 pb-2 md:pb-4">
          <CardTitle className="text-lg md:text-xl">Earnings Summary</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Overview of your earnings from the promo code usage
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Total Sales</h3>
                <p className="text-lg md:text-2xl font-semibold">{orderTotals.formattedTotalOrders}</p>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Your Commission</h3>
                <p className="text-lg md:text-2xl font-semibold">{creatorData?.discount || 0}%</p>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Total Earnings</h3>
                <p className="text-lg md:text-2xl font-semibold">{orderTotals.formattedTotalEarnings}</p>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Last Used</h3>
                <p className="text-lg md:text-2xl font-semibold">
                  {creatorData?.lastUsed ? new Date(creatorData.lastUsed).toLocaleDateString() : "Never"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 md:mb-8">
        <CardHeader className="px-3 md:px-6 pt-3 md:pt-6 pb-2 md:pb-4">
          <CardTitle className="text-lg md:text-xl">Order Details</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Details of orders placed using your promo code
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
          {isLoading ? (
            <div className="text-center py-6 md:py-8 text-muted-foreground">Loading data...</div>
          ) : creatorData?.orders && creatorData.orders.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto -mx-3 md:-mx-6">
                <div className="inline-block min-w-full align-middle px-3 md:px-6">
                  <table className="min-w-full divide-y divide-muted">
                    <thead>
                      <tr className="text-xs md:text-sm">
                        <th scope="col" className="py-2 px-2 text-left font-medium">
                          Order ID
                        </th>
                        <th scope="col" className="py-2 px-2 text-left font-medium">
                          Order Date
                        </th>
                        <th scope="col" className="py-2 px-2 text-left font-medium">
                          Order Amount
                        </th>
                        <th scope="col" className="py-2 px-2 text-left font-medium">
                          Order Currency
                        </th>
                        <th scope="col" className="py-2 px-2 text-left font-medium">
                          Your Earnings Per Order
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-muted/50 text-xs md:text-sm">
                      {creatorData.orders.map((order: any) => {
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
                          Total
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
            <div className="text-center py-6 md:py-8 text-muted-foreground">No order data available</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-3 md:px-6 pt-3 md:pt-6 pb-2 md:pb-4">
          <CardTitle className="text-lg md:text-xl">Usage Statistics</CardTitle>
          <CardDescription className="text-xs md:text-sm">Statistics about your promo code usage</CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
          {isLoading ? (
            <div className="text-center py-6 md:py-8 text-muted-foreground">Loading data...</div>
          ) : creatorData?.usageCount ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Total Usage</h3>
                  <p className="text-lg md:text-2xl font-semibold">{creatorData.usageCount}</p>
                </div>
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Conversion Rate</h3>
                  <p className="text-lg md:text-2xl font-semibold">
                    {creatorData.usageCount && creatorData.orderCount
                      ? `${((creatorData.orderCount / creatorData.usageCount) * 100).toFixed(1)}%`
                      : "0%"}
                  </p>
                </div>
              </div>

              <div className="pt-3 md:pt-4 border-t">
                <h3 className="text-xs md:text-sm font-medium mb-2">Promotion Tips</h3>
                <ul className="text-xs md:text-sm text-muted-foreground space-y-1 md:space-y-2 list-disc pl-5">
                  <li>Share your promo code on social media to reach more potential customers.</li>
                  <li>Include your promo code in your email signature for passive promotion.</li>
                  <li>Create content that showcases the products and mention your discount code.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 md:py-8 text-muted-foreground">No usage data available</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

