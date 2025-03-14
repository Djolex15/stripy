/**
 * Product interface with multilingual support
 */
export interface Product {
  id: string
  nameEn: string
  nameSr: string
  descriptionEn: string
  descriptionSr: string
  price: number
  priceSr: number
  image?: string
  hoverImage: string
}

/**
 * Cart item with product and quantity
 */
export interface CartItem {
  product: Product
  quantity: number
}

/**
 * Customer information for order form
 */
export interface OrderFormData {
  name: string
  email: string
  phone: string
  address: string
  apartmentNumber?: string
  city: string
  postalCode: string
  notes?: string
  promoCode?: string
  paymentMethod: string // Added payment method field
}

/**
 * Order inquiry data structure
 */
export interface OrderInquiry {
  customerInfo: OrderFormData
  orderItems: CartItem[]
  totalPrice: number
  currency: string
  appliedPromoCode?: string
}

/**
 * Order item as stored in the database
 */
export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  quantity: number
  price: number
  currency: string
}

/**
 * Complete order with items for email templates
 */
export interface OrderWithItems {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  apartmentNumber?: string | null
  city: string
  postalCode: string
  notes?: string | null
  totalPrice: number
  currency: string
  promoCode?: string | null
  paymentMethod: string // Added payment method field
  createdAt: string
  items: OrderItem[]
}

/**
 * Promo code structure
 */
export interface PromoCode {
  id: string
  code: string
  discount: number
  active: boolean
  createdAt: string
}

// Update the BusinessMetricsData interface
export interface BusinessMetricsData {
  id: string
  initialInvestment: number // In EUR
  investmentDate: string | Date // Changed to accept string or Date
  operatingCosts: number // Monthly operating costs in EUR
  investorPercentage: number // Percentage that goes to investors
  affiliatePercentage: number // Average percentage to affiliates

  // New fields for calculated metrics
  totalOrders?: number
  grossRevenue?: number
  netRevenue?: number
  totalAffiliatePayouts?: number
  affiliateDrivenSales?: number
  affiliateOrderCount?: number
  operatingCostsToDate?: number
  profit?: number
  investmentRecovered?: boolean
  remainingInvestment?: number
  investorReturns?: number
  companyProfit?: number

  updatedAt: string | Date // Changed to accept string or Date
}

// Add this to your existing types.ts file
export interface AffiliatePerformance {
  code: string
  creatorName: string
  discount: number
  orderCount: number
  totalSales: number
  totalEarnings: number
}

/**
 * Investor data structure
 */
export interface InvestorData {
  id: string
  investorName: string
  initialInvestment: number // In EUR
  investmentDate: Date
  ownershipPercentage: number // Percentage ownership
  returnPerOrder: number // Percentage return per order
  updatedAt: Date
}
