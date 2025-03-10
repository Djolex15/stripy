import { getPromoCode } from "@/src/lib/query"

// Interface for promo code
export interface PromoCode {
  code: string
  discount: number // Percentage discount (0-100)
  creatorName: string
}

// Function to validate a promo code
export async function validatePromoCode(code: string): Promise<PromoCode | null> {
  if (!code) return null

  try {
    const normalizedCode = code.trim().toUpperCase()
    const promoCode = await getPromoCode(normalizedCode)

    if (!promoCode) return null

    return {
      code: promoCode.code,
      discount: promoCode.discount,
      creatorName: promoCode.creatorName,
    }
  } catch (error) {
    console.error("Error validating promo code:", error)
    return null
  }
}

// Calculate discounted price
export function calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
  if (discountPercentage <= 0 || discountPercentage > 100) return originalPrice

  const discountAmount = (originalPrice * discountPercentage) / 100
  return originalPrice - discountAmount
}

