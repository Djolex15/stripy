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

/**
 * Business metrics data structure
 */
export interface BusinessMetricsData {
  id: string
  initialInvestment: number // In EUR
  investmentDate: Date
  operatingCosts: number // Monthly operating costs in EUR
  investorPercentage: number // Percentage that goes to investors
  affiliatePercentage: number // Average percentage to affiliates
  updatedAt: Date
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

