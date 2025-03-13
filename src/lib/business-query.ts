"use server"

import { businessMetrics, investorData } from "@/src/server/db/schema"
import { eq } from "drizzle-orm"
import { db } from "@/src/server/db"
import { v4 as uuidv4 } from "uuid"
import type { BusinessMetricsData, InvestorData } from "@/src/lib/types"

// Helper function to generate a UUID
export async function generateId() {
  return uuidv4()
}

// Business metrics functions
export async function getBusinessMetrics(): Promise<BusinessMetricsData | null> {
  try {
    const result = await db.select().from(businessMetrics).limit(1).execute()

    return result.length > 0 ? (result[0] as unknown as BusinessMetricsData) : null
  } catch (error) {
    console.error("Failed to get business metrics:", error)
    return null
  }
}

export async function updateBusinessMetrics(data: Omit<BusinessMetricsData, "id" | "updatedAt">) {
  try {
    // Check if we already have business metrics
    const existingMetrics = await getBusinessMetrics()

    if (existingMetrics) {
      // Update existing record
      return db
        .update(businessMetrics)
        .set({
          initialInvestment: data.initialInvestment.toString(),
          investmentDate: data.investmentDate,
          operatingCosts: data.operatingCosts.toString(),
          investorPercentage: data.investorPercentage.toString(),
          affiliatePercentage: data.affiliatePercentage.toString(),
          updatedAt: new Date(),
        })
        .where(eq(businessMetrics.id, existingMetrics.id))
        .execute()
    } else {
      // Create new record
      const id = await generateId()
      return db
        .insert(businessMetrics)
        .values({
          id,
          initialInvestment: data.initialInvestment.toString(),
          investmentDate: data.investmentDate,
          operatingCosts: data.operatingCosts.toString(),
          investorPercentage: data.investorPercentage.toString(),
          affiliatePercentage: data.affiliatePercentage.toString(),
          updatedAt: new Date(),
        })
        .execute()
    }
  } catch (error) {
    console.error("Failed to update business metrics:", error)
    throw error
  }
}

// Investor data functions
export async function getInvestorData(id?: string): Promise<InvestorData | null> {
  try {
    if (id) {
      const result = await db.select().from(investorData).where(eq(investorData.id, id)).limit(1).execute()

      return result.length > 0 ? (result[0] as unknown as InvestorData) : null
    } else {
      // Get the first investor if no ID is provided
      const result = await db.select().from(investorData).limit(1).execute()

      return result.length > 0 ? (result[0] as unknown as InvestorData) : null
    }
  } catch (error) {
    console.error("Failed to get investor data:", error)
    return null
  }
}

export async function getAllInvestors(): Promise<InvestorData[]> {
  try {
    const result = await db.select().from(investorData).execute()

    return result as unknown as InvestorData[]
  } catch (error) {
    console.error("Failed to get all investors:", error)
    return []
  }
}

export async function updateInvestorData(data: Omit<InvestorData, "updatedAt">) {
  try {
    // Check if the investor already exists
    const existingInvestor = await getInvestorData(data.id)

    if (existingInvestor) {
      // Update existing record
      return db
        .update(investorData)
        .set({
          investorName: data.investorName,
          initialInvestment: data.initialInvestment.toString(),
          investmentDate: data.investmentDate,
          ownershipPercentage: data.ownershipPercentage.toString(),
          returnPerOrder: data.returnPerOrder.toString(),
          updatedAt: new Date(),
        })
        .where(eq(investorData.id, data.id))
        .execute()
    } else {
      // Create new record
      const id = data.id || (await generateId())
      return db
        .insert(investorData)
        .values({
          id,
          investorName: data.investorName,
          initialInvestment: data.initialInvestment.toString(),
          investmentDate: data.investmentDate,
          ownershipPercentage: data.ownershipPercentage.toString(),
          returnPerOrder: data.returnPerOrder.toString(),
          updatedAt: new Date(),
        })
        .execute()
    }
  } catch (error) {
    console.error("Failed to update investor data:", error)
    throw error
  }
}

export async function createDefaultBusinessData() {
  try {
    // Check if we already have business metrics
    const existingMetrics = await getBusinessMetrics()
    const existingInvestor = await getInvestorData()

    let businessId = null
    let investorId = null
    let metricsCreated = false
    let investorCreated = false

    if (!existingMetrics) {
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
    }

    if (!existingInvestor) {
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

