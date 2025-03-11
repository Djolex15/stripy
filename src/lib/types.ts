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

export interface CartItem {
  product: Product
  quantity: number
}

export interface OrderInquiry {
  customerInfo: {
    name: string
    email: string
    phone: string
    address: string
    apartmentNumber?: string
    city: string
    postalCode: string
    notes?: string
    promoCode?: string
  }
  orderItems: CartItem[]
  totalPrice: number
  currency: string
  appliedPromoCode?: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  quantity: number
  price: number
  currency: string
}

export interface OrderWithItems {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  apartmentNumber?: string | null
  city: string
  postalCode: string
  notes?: string
  totalPrice: number
  currency: string
  promoCode?: string
  createdAt: string
  items: OrderItem[]
}
