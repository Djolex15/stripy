// Update your existing business-query.ts file with these additional functions

"use server"

import { businessMetrics, investorData, promoCodes, orders } from "@/src/server/db/schema"
import { eq } from "drizzle-orm"
import { db } from "@/src/server/db"
import { v4 as uuidv4 } from "uuid"
import type { BusinessMetricsData } from "@/src/lib/types"
import { calculateAndUpdateBusinessMetrics } from "@/src/lib/business-metrics"
import { sql } from "drizzle-orm"

// Helper function to generate a UUID
export async function generateId() {
  return uuidv4()
}

// Business metrics functions
export async function getBusinessMetrics(): Promise<BusinessMetricsData | null> {
  try {
    // First, ensure metrics are up to date
    await calculateAndUpdateBusinessMetrics()

    // Then retrieve the updated metrics
    const result = await db.select().from(businessMetrics).limit(1).execute()

    if (result.length > 0) {
      // Convert string values to numbers for the frontend
      const metrics = result[0]
      return {
        ...metrics,
        initialInvestment: Number.parseFloat(metrics.initialInvestment),
        operatingCosts: Number.parseFloat(metrics.operatingCosts),
        investorPercentage: Number.parseFloat(metrics.investorPercentage),
        affiliatePercentage: Number.parseFloat(metrics.affiliatePercentage),
        totalOrders: Number.parseInt(metrics.totalOrders || "0"),
        grossRevenue: Number.parseInt(metrics.grossRevenue || "0"),
        netRevenue: Number.parseInt(metrics.netRevenue || "0"),
        totalAffiliatePayouts: Number.parseInt(metrics.totalAffiliatePayouts || "0"),
        affiliateDrivenSales: Number.parseInt(metrics.affiliateDrivenSales || "0"),
        affiliateOrderCount: Number.parseInt(metrics.affiliateOrderCount || "0"),
        operatingCostsToDate: Number.parseFloat(metrics.operatingCostsToDate || "0"),
        profit: Number.parseFloat(metrics.profit || "0"),
        investmentRecovered: metrics.investmentRecovered === "1",
        remainingInvestment: Number.parseFloat(metrics.remainingInvestment || "0"),
        investorReturns: Number.parseFloat(metrics.investorReturns || "0"),
        companyProfit: Number.parseFloat(metrics.companyProfit || "0"),
        // Convert Date objects to ISO strings for serialization
        investmentDate:
          metrics.investmentDate instanceof Date ? metrics.investmentDate.toISOString() : metrics.investmentDate,
        updatedAt: metrics.updatedAt instanceof Date ? metrics.updatedAt.toISOString() : metrics.updatedAt,
      } as unknown as BusinessMetricsData
    }

    return null
  } catch (error) {
    console.error("Failed to get business metrics:", error)
    return null
  }
}

export async function updateBusinessMetrics(data: Omit<BusinessMetricsData, "id" | "updatedAt">) {
  try {
    // Check if we already have business metrics
    const existingMetrics = await db.select().from(businessMetrics).limit(1).execute()

    if (existingMetrics.length > 0) {
      // Update existing record
      await db
        .update(businessMetrics)
        .set({
          initialInvestment: data.initialInvestment.toString(),
          investmentDate: new Date(data.investmentDate),
          operatingCosts: data.operatingCosts.toString(),
          investorPercentage: data.investorPercentage.toString(),
          affiliatePercentage: data.affiliatePercentage.toString(),
          updatedAt: new Date(),
        })
        .where(eq(businessMetrics.id, existingMetrics[0].id))
        .execute()

      // Recalculate metrics with new settings
      await calculateAndUpdateBusinessMetrics()

      return { success: true }
    } else {
      // Create new record
      const id = await generateId()
      await db
        .insert(businessMetrics)
        .values({
          id,
          initialInvestment: data.initialInvestment.toString(),
          investmentDate: new Date(data.investmentDate),
          operatingCosts: data.operatingCosts.toString(),
          investorPercentage: data.investorPercentage.toString(),
          affiliatePercentage: data.affiliatePercentage.toString(),
          updatedAt: new Date(),
        })
        .execute()

      // Calculate initial metrics
      await calculateAndUpdateBusinessMetrics()

      return { success: true, id }
    }
  } catch (error) {
    console.error("Failed to update business metrics:", error)
    return { success: false, error }
  }
}

// Get all affiliate earnings data for the business overview
export async function getAllCreatorEarnings() {
  try {
    // First get all promo codes
    const promoCodesData = await db.select().from(promoCodes).execute()

    // For each promo code, get the orders and calculate earnings with currency conversion
    const EUR_TO_RSD_RATE = 117.5
    const results = []

    for (const promoCode of promoCodesData) {
      // Get all orders with this promo code
      const ordersWithPromo = await db.select().from(orders).where(eq(orders.promoCode, promoCode.code)).execute()

      let totalSales = 0
      let totalEarnings = 0

      // Process each order with currency conversion
      for (const order of ordersWithPromo) {
        const amount = Number(order.totalPrice)
        const discount = Number(promoCode.discount || 0)

        // Convert RSD to EUR if the order is in RSD
        if (order.currency === "RSD") {
          const amountInEur = amount / EUR_TO_RSD_RATE
          totalSales += amountInEur
          totalEarnings += (amountInEur * discount) / 100
        } else {
          // Default to EUR
          totalSales += amount
          totalEarnings += (amount * discount) / 100
        }
      }

      results.push({
        code: promoCode.code,
        creatorName: promoCode.creatorName,
        discount: Number.parseFloat(promoCode.discount.toString()),
        orderCount: ordersWithPromo.length,
        totalSales,
        totalEarnings,
      })
    }

    return results.sort((a, b) => b.totalSales - a.totalSales)
  } catch (error) {
    console.error("Failed to get all creator earnings:", error)
    return []
  }
}

// Get all promo code usage data
export async function getAllPromoCodeUsage() {
  try {
    const result = await db.execute(sql`
      SELECT 
        p.code, 
        COUNT(pcu.id) as "usageCount"
      FROM 
        promo_codes p
      LEFT JOIN 
        promo_code_usage pcu ON p.code = pcu.code
      GROUP BY 
        p.code
      ORDER BY 
        "usageCount" DESC
    `)

    // Ensure all values are serializable
    return result.map((row) => ({
      code: row.code,
      usageCount: Number.parseInt(row.usageCount as string),
    }))
  } catch (error) {
    console.error("Failed to get all promo code usage:", error)
    return []
  }
}

export async function createDefaultBusinessData() {
  try {
    // Check if we already have business metrics
    const existingMetrics = await db.select().from(businessMetrics).limit(1).execute()
    const existingInvestor = await db.select().from(investorData).limit(1).execute()

    let businessId = null
    let investorId = null
    let metricsCreated = false
    let investorCreated = false

    if (existingMetrics.length === 0) {
      // Create default business metrics
      businessId = await generateId()
      await db
        .insert(businessMetrics)
        .values({
          id: businessId,
          initialInvestment: "25000", // EUR
          investmentDate: new Date("2023-01-01"),
          operatingCosts: "1500", // Monthly operating costs in EUR
          investorPercentage: "15", // 15% goes to investors
          affiliatePercentage: "10", // 10% average to affiliates
          updatedAt: new Date(),
        })
        .execute()
      metricsCreated = true

      // Calculate initial metrics
      await calculateAndUpdateBusinessMetrics()
    }

    if (existingInvestor.length === 0) {
      // Create default investor data
      investorId = await generateId()
      await db
        .insert(investorData)
        .values({
          id: investorId,
          investorName: "Primary Investor",
          initialInvestment: "10000", // EUR
          investmentDate: new Date("2023-01-15"),
          ownershipPercentage: "15", // 15% ownership
          returnPerOrder: "0.05", // 5% of each order
          updatedAt: new Date(),
        })
        .execute()
      investorCreated = true
    }

    return {
      success: true,
      metricsCreated,
      investorCreated,
      businessId,
      investorId,
    }
  } catch (error) {
    console.error("Failed to create default business data:", error)
    return { success: false, error }
  }
}

