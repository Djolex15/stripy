import Cookies from "js-cookie"

export interface OrderFormData {
  name: string
  email: string
  phone: string
  address: string
  apartmentNumber: string
  city: string
  postalCode: string
  notes: string
}

const STORAGE_KEY = "stripy-order-form"

export function saveOrderFormData(data: OrderFormData): void {
  try {
    Cookies.set(STORAGE_KEY, JSON.stringify(data), { expires: 7 }) // Expires in 7 days
  } catch (error) {
    console.error("Failed to save order form data to cookies:", error)
  }
}

export function loadOrderFormData(): OrderFormData | null {
  try {
    const savedData = Cookies.get(STORAGE_KEY)
    if (!savedData) return null

    return JSON.parse(savedData) as OrderFormData
  } catch (error) {
    console.error("Failed to load order form data from cookies:", error)
    Cookies.remove(STORAGE_KEY)
    return null
  }
}

export function clearOrderFormData(): void {
  try {
    Cookies.remove(STORAGE_KEY)
  } catch (error) {
    console.error("Failed to clear order form data from cookies:", error)
  }
}

