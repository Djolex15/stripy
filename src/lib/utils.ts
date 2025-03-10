import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// This function is no longer needed for product prices as we're using direct RSD values
// but we'll keep it for other price calculations like cart totals
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

