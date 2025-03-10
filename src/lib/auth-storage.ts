import Cookies from "js-cookie"

const AUTH_STORAGE_KEY = "stripy-creator-auth"

export interface CreatorAuthData {
  code: string
  creatorName: string
  usageCount?: number
  lastUsed?: string
  discount?: number
  orderCount?: number
  totalSales?: number
  totalEarnings?: number
  orders?: Array<{
    id: string
    totalPrice: number
    currency: string
    createdAt: string
  }>
}

export function saveCreatorAuth(data: CreatorAuthData): void {
  try {
    Cookies.set(AUTH_STORAGE_KEY, JSON.stringify(data), { expires: 30 }) // Expires in 30 days
  } catch (error) {
    console.error("Failed to save creator auth data to cookies:", error)
  }
}

export function loadCreatorAuth(): CreatorAuthData | null {
  try {
    const savedData = Cookies.get(AUTH_STORAGE_KEY)
    if (!savedData) return null

    return JSON.parse(savedData) as CreatorAuthData
  } catch (error) {
    console.error("Failed to load creator auth data from cookies:", error)
    Cookies.remove(AUTH_STORAGE_KEY)
    return null
  }
}

export function clearCreatorAuth(): void {
  try {
    Cookies.remove(AUTH_STORAGE_KEY)
  } catch (error) {
    console.error("Failed to clear creator auth data from cookies:", error)
  }
}
