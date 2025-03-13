import { sql } from "drizzle-orm"
import { pgTable, text, integer, decimal, timestamp } from "drizzle-orm/pg-core"

// Promo codes table
export const promoCodes = pgTable("promo_codes", {
  code: text("code").primaryKey(),
  discount: integer("discount").notNull(), // Percentage discount (0-100)
  creatorName: text("creator_name").notNull(),
  password: text("password").notNull(), // Added password field for admin access
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
})

// Promo code usage table
export const promoCodeUsage = pgTable("promo_code_usage", {
  id: text("id").primaryKey(),
  code: text("code")
    .notNull()
    .references(() => promoCodes.code),
  orderId: text("order_id").notNull(),
  usedAt: text("used_at").default(sql`CURRENT_TIMESTAMP`),
})

// Orders table
export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  address: text("address").notNull(),
  apartmentNumber: text("apartment_number"),
  city: text("city").notNull(),
  postalCode: text("postal_code").notNull(),
  notes: text("notes"),
  totalPrice: integer("total_price").notNull(), // Store in cents/paras
  currency: text("currency").notNull(), // "EUR" or "RSD"
  promoCode: text("promo_code").references(() => promoCodes.code),
  paymentMethod: text("payment_method").notNull(), // Added payment method field
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
})

// Order items table
export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id),
  productId: text("product_id").notNull(),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(), // Store in cents/paras
  currency: text("currency").notNull(), // "EUR" or "RSD"
})

// Reviews table
export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  rating: integer("rating").notNull(), // 1-5 star rating
  comment: text("comment").notNull(),
  language: text("language").notNull(), // "en" or "sr"
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
})

// Business metrics table
export const businessMetrics = pgTable("business_metrics", {
  id: text("id").primaryKey(),
  initialInvestment: decimal("initial_investment").notNull(), // In EUR
  investmentDate: timestamp("investment_date").notNull(),
  operatingCosts: decimal("operating_costs").notNull(), // Monthly operating costs in EUR
  investorPercentage: decimal("investor_percentage").notNull(), // Percentage that goes to investors
  affiliatePercentage: decimal("affiliate_percentage").notNull(), // Average percentage to affiliates
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

// Investor data table
export const investorData = pgTable("investor_data", {
  id: text("id").primaryKey(),
  investorName: text("investor_name").notNull(),
  initialInvestment: decimal("initial_investment").notNull(), // In EUR
  investmentDate: timestamp("investment_date").notNull(),
  ownershipPercentage: decimal("ownership_percentage").notNull(), // Percentage ownership
  returnPerOrder: decimal("return_per_order").notNull(), // Percentage return per order
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

// QR codes table
export const qrCodes = pgTable("qr_codes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  scans: integer("scans").default(0).notNull(),
  imageData: text("image_data"), // Store base64 encoded image data
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})
