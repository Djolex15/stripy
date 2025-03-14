"use server"

import { db } from "@/src/server/db"
import { businessMetrics, orders, promoCodeUsage, promoCodes } from "@/src/server/db/schema"
import { eq, sql, count, and, isNotNull } from "drizzle-orm"
import type { BusinessMetricsData } from "@/src/lib/types"

// Update the calculateAndUpdateBusinessMetrics function to handle currency conversion

/**
 * Calculates and updates all business metrics based on current orders and settings
 */
export async function calculateAndUpdateBusinessMetrics(): Promise<BusinessMetricsData | null> {
  try {
    // Get current business metrics settings
    const currentMetrics = await db.select().from(businessMetrics).limit(1).execute()

    if (!currentMetrics.length) {
      console.error("No business metrics configuration found")
      return null
    }

    const metricsConfig = currentMetrics[0]

    // Calculate gross revenue (sum of all orders' totalPrice)
    // Now we need to handle currency conversion for orders
    const ordersResult = await db
      .select({
        id: orders.id,
        totalPrice: orders.totalPrice,
        currency: orders.currency,
      })
      .from(orders)
      .execute()

    // Convert all order amounts to EUR for consistent calculations
    const EUR_TO_RSD_RATE = 117.5
    let grossRevenue = 0
    const totalOrders = ordersResult.length

    // Process each order and convert currency if needed
    for (const order of ordersResult) {
      const amount = Number(order.totalPrice)
      // Convert RSD to EUR if the order is in RSD
      if (order.currency === "RSD") {
        grossRevenue += amount / EUR_TO_RSD_RATE
      } else {
        // Default to EUR
        grossRevenue += amount
      }
    }

    // Calculate affiliate payouts
    const affiliateOrders = await db
      .select({
        id: orders.id,
        totalPrice: orders.totalPrice,
        currency: orders.currency,
        discount: promoCodes.discount,
      })
      .from(orders)
      .leftJoin(promoCodes, eq(orders.promoCode, promoCodes.code))
      .where(isNotNull(orders.promoCode))
      .execute()

    let totalAffiliatePayouts = 0
    let affiliateDrivenSales = 0
    const affiliateOrderCount = affiliateOrders.length

    // Process each affiliate order and convert currency if needed
    for (const order of affiliateOrders) {
      const amount = Number(order.totalPrice)
      const discount = Number(order.discount || 0)

      // Convert RSD to EUR if the order is in RSD
      if (order.currency === "RSD") {
        const amountInEur = amount / EUR_TO_RSD_RATE
        affiliateDrivenSales += amountInEur
        totalAffiliatePayouts += (amountInEur * discount) / 100
      } else {
        // Default to EUR
        affiliateDrivenSales += amount
        totalAffiliatePayouts += (amount * discount) / 100
      }
    }

    // Calculate net revenue (gross revenue - affiliate payouts)
    const netRevenue = grossRevenue - totalAffiliatePayouts

    // Calculate operating costs (monthly costs * months since investment)
    const investmentDate = new Date(metricsConfig.investmentDate)
    const currentDate = new Date()
    const monthsSinceInvestment =
      (currentDate.getFullYear() - investmentDate.getFullYear()) * 12 +
      (currentDate.getMonth() - investmentDate.getMonth())

    const operatingCosts = Number.parseFloat(metricsConfig.operatingCosts) * Math.max(1, monthsSinceInvestment)

    // Calculate profit (net revenue - operating costs)
    const profit = netRevenue - operatingCosts

    // Calculate investment recovery
    const initialInvestment = Number.parseFloat(metricsConfig.initialInvestment)
    const investmentRecovered = profit >= initialInvestment
    const remainingInvestment = investmentRecovered ? 0 : initialInvestment - profit

    // Calculate investor returns
    const investorPercentage = Number.parseFloat(metricsConfig.investorPercentage)
    const investorReturns = profit > 0 ? (profit * investorPercentage) / 100 : 0

    // Calculate company profit (after investor returns)
    const companyProfit = profit > 0 ? profit - investorReturns : 0

    // Update the business metrics record
    await db
      .update(businessMetrics)
      .set({
        totalOrders: totalOrders.toString(),
        grossRevenue: grossRevenue.toString(),
        netRevenue: netRevenue.toString(),
        totalAffiliatePayouts: totalAffiliatePayouts.toString(),
        affiliateDrivenSales: affiliateDrivenSales.toString(),
        affiliateOrderCount: affiliateOrderCount.toString(),
        operatingCostsToDate: operatingCosts.toString(),
        profit: profit.toString(),
        investmentRecovered: investmentRecovered ? "1" : "0",
        remainingInvestment: remainingInvestment.toString(),
        investorReturns: investorReturns.toString(),
        companyProfit: companyProfit.toString(),
        updatedAt: new Date(),
      })
      .where(eq(businessMetrics.id, metricsConfig.id))
      .execute()

    // Return the updated metrics
    return {
      ...metricsConfig,
      totalOrders,
      grossRevenue,
      netRevenue,
      totalAffiliatePayouts,
      affiliateDrivenSales,
      affiliateOrderCount,
      operatingCostsToDate: operatingCosts,
      profit,
      investmentRecovered,
      remainingInvestment,
      investorReturns,
      companyProfit,
    } as unknown as BusinessMetricsData
  } catch (error) {
    console.error("Failed to calculate business metrics:", error)
    return null
  }
}

// Update the getBusinessMetricsWithCalculations function to properly serialize Date objects
export async function getBusinessMetricsWithCalculations(): Promise<BusinessMetricsData | null> {
  try {
    // First calculate and update metrics
    const updatedMetrics = await calculateAndUpdateBusinessMetrics()

    if (updatedMetrics) {
      // Ensure Date objects are serialized
      return {
        ...updatedMetrics,
        // Convert Date objects to ISO strings for serialization
        investmentDate:
          updatedMetrics.investmentDate instanceof Date
            ? updatedMetrics.investmentDate.toISOString()
            : updatedMetrics.investmentDate,
        updatedAt:
          updatedMetrics.updatedAt instanceof Date ? updatedMetrics.updatedAt.toISOString() : updatedMetrics.updatedAt,
      }
    }

    return null
  } catch (error) {
    console.error("Failed to get business metrics with calculations:", error)
    return null
  }
}

/**
 * Gets affiliate performance data
 */
export async function getAffiliatePerformance() {
  try {
    const result = await db
      .select({
        code: promoCodes.code,
        creatorName: promoCodes.creatorName,
        discount: promoCodes.discount,
        orderCount: count(orders.id),
        totalSales: sql<string>`COALESCE(SUM(${orders.totalPrice}), 0)`,
        totalEarnings: sql<string>`COALESCE(SUM(${orders.totalPrice} * ${promoCodes.discount} / 100), 0)`,
      })
      .from(promoCodes)
      .leftJoin(orders, eq(promoCodes.code, orders.promoCode))
      .groupBy(promoCodes.code, promoCodes.creatorName, promoCodes.discount)
      .execute()

    return result.map((item) => ({
      ...item,
      totalSales: Number.parseInt(item.totalSales),
      totalEarnings: Number.parseInt(item.totalEarnings),
    }))
  } catch (error) {
    console.error("Failed to get affiliate performance:", error)
    return []
  }
}

/**
 * Updates the promo code usage table with earnings information
 */
export async function updatePromoCodeEarnings(orderId: string, promoCode: string, orderTotal: number) {
  try {
    // Get the promo code discount percentage
    const promoResult = await db
      .select({ discount: promoCodes.discount })
      .from(promoCodes)
      .where(eq(promoCodes.code, promoCode))
      .limit(1)
      .execute()

    if (!promoResult.length) {
      return false
    }

    const discount = promoResult[0].discount
    const earnings = (orderTotal * discount) / 100

    // Find the promo code usage record
    const usageResult = await db
      .select({ id: promoCodeUsage.id })
      .from(promoCodeUsage)
      .where(and(eq(promoCodeUsage.code, promoCode), eq(promoCodeUsage.orderId, orderId)))
      .limit(1)
      .execute()

    if (usageResult.length) {
      // Update the existing record with earnings
      await db
        .update(promoCodeUsage)
        .set({
          earnings: earnings.toString(),
        })
        .where(eq(promoCodeUsage.id, usageResult[0].id))
        .execute()
    }

    return true
  } catch (error) {
    console.error("Failed to update promo code earnings:", error)
    return false
  }
}

