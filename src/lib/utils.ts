import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, language: string): string {
  if (language === "sr") {
    // Convert to RSD for Serbian users
    const amountInRSD = Math.round(amount * 117.5)
    return `${amountInRSD.toLocaleString("sr-RS")} RSD`
  } else {
    // Default to EUR
    return `${amount.toFixed(2)} €`
  }
}

export function formatCurrencyBased(amount: number, currency: string): string {
  // If currency is RSD, use Serbian formatting
  if (currency === "RSD") {
    return `${amount} RSD`
  }
  // If currency is sr (language), convert to RSD
  else if (currency === "sr") {
    // Convert to RSD for Serbian users
    return `${amount.toLocaleString("sr-RS")} RSD`
  }
  // Default to EUR
  else {
    return `${amount.toFixed(2)} €`
  }
}



