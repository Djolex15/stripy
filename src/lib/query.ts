"use server"

import { promoCodes, promoCodeUsage, orders } from "@/src/server/db/schema"
import { eq, and } from "drizzle-orm"
import { sql } from "drizzle-orm"
import { db } from "../server/db"
import { v4 as uuidv4 } from "uuid"
import type { PgColumn } from "drizzle-orm/pg-core"

// Helper function to generate a UUID
export async function generateId() {
  return uuidv4()
}

// Promo code functions
export async function getPromoCode(code: string) {
  return db
    .select()
    .from(promoCodes)
    .where(eq(promoCodes.code, code.toUpperCase()))
    .execute()
    .then((result) => result[0])
}

export async function trackPromoCodeUsage(code: string, orderId: string) {
  const id = await generateId()
  return db
    .insert(promoCodeUsage)
    .values({
      id,
      code: code.toUpperCase(),
      orderId,
    })
    .execute()
}

export async function verifyCreatorCredentials(code: string, password: string) {
  const result = await db
    .select({
      code: promoCodes.code,
      creatorName: promoCodes.creatorName,
    })
    .from(promoCodes)
    .where(and(eq(promoCodes.code, code), eq(promoCodes.password, password)))
    .limit(1)

  return result.length > 0 ? result[0] : null
}

export async function getPromoCodeUsage(code: string) {
  const result = await db
    .select({
      code: promoCodes.code,
      creatorName: promoCodes.creatorName,
      usageCount: count(promoCodeUsage.id),
      lastUsed: sql<string>`MAX(${promoCodeUsage.usedAt})`,
    })
    .from(promoCodes)
    .leftJoin(promoCodeUsage, eq(promoCodes.code, promoCodeUsage.code))
    .where(eq(promoCodes.code, code))
    .groupBy(promoCodes.code, promoCodes.creatorName)

  return result.length > 0 ? result[0] : null
}

export async function getCreatorEarnings(code: string) {
  // This query calculates earnings for a specific creator based on orders using their promo code
  const result = await db
    .select({
      code: promoCodes.code,
      creatorName: promoCodes.creatorName,
      discount: promoCodes.discount,
      orderCount: count(orders.id),
      totalSales: sql<number>`COALESCE(SUM(${orders.totalPrice}), 0)`,
      totalEarnings: sql<number>`COALESCE(SUM(${orders.totalPrice} * ${promoCodes.discount} / 100), 0)`,
    })
    .from(promoCodes)
    .leftJoin(orders, eq(promoCodes.code, orders.promoCode))
    .where(eq(promoCodes.code, code))
    .groupBy(promoCodes.code, promoCodes.creatorName, promoCodes.discount)

  return result.length > 0 ? result[0] : null
}

// For super admin only - gets all promo code usage
export async function getAllPromoCodeUsage() {
  const result = await db
    .select({
      code: promoCodes.code,
      creatorName: promoCodes.creatorName,
      usageCount: count(promoCodeUsage.id),
      lastUsed: sql<string>`MAX(${promoCodeUsage.usedAt})`,
    })
    .from(promoCodes)
    .leftJoin(promoCodeUsage, eq(promoCodes.code, promoCodeUsage.code))
    .groupBy(promoCodes.code, promoCodes.creatorName)
    .orderBy(sql`usageCount DESC`)

  return result
}

// For super admin only - gets all creator earnings
export async function getAllCreatorEarnings() {
  const result = await db
    .select({
      code: promoCodes.code,
      creatorName: promoCodes.creatorName,
      discount: promoCodes.discount,
      orderCount: count(orders.id),
      totalSales: sql<number>`COALESCE(SUM(${orders.totalPrice}), 0)`,
      totalEarnings: sql<number>`COALESCE(SUM(${orders.totalPrice} * ${promoCodes.discount} / 100), 0)`,
    })
    .from(promoCodes)
    .leftJoin(orders, eq(promoCodes.code, orders.promoCode))
    .groupBy(promoCodes.code, promoCodes.creatorName, promoCodes.discount)
    .orderBy(sql`totalEarnings DESC`)

  return result
}

export async function getPromoCodeOrders(code: string) {
  try {
    // Fetch all orders that used this promo code
    const ordersResult = await db.query.orders.findMany({
      where: eq(orders.promoCode, code),
    })

    return ordersResult
  } catch (error) {
    console.error("Failed to get promo code orders:", error)
    return []
  }
}

function count(column: PgColumn): any {
  return sql`COUNT(${column})`
}

