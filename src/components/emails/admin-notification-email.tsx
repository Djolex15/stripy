import {
  Body,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Heading,
} from "@react-email/components"
import { formatCurrencyBased } from "@/src/lib/utils"
import type { OrderWithItems } from "@/src/lib/types"

interface AdminNotificationEmailProps {
  order: OrderWithItems
  language?: string
}

export const AdminNotificationEmailTemplate = ({ order, language }: AdminNotificationEmailProps) => {
  // Determine language based on order currency if not specified
  const lang = language || (order.currency === "RSD" ? "sr" : "en")

  // Translations
  const translations = {
    sr: {
      preview: `Nova porudžbina #${order.id.substring(0, 8)} od ${order.customerName}`,
      newOrder: "Primljena nova porudžbina",
      orderDetails: "Nova porudžbina je postavljena u vašoj prodavnici. Evo detalja:",
      orderNumber: "Porudžbina",
      customerInfo: "Informacije o kupcu",
      name: "Ime",
      email: "Email",
      phone: "Telefon",
      address: "Adresa",
      city: "Grad",
      customerNotes: "Napomene kupca",
      orderItems: "Stavke porudžbine",
      quantity: "Količina",
      promoCode: "Promo kod",
      paymentMethod: "Način plaćanja", // Add this line
      pouzecem: "Pouzećem", // Add this line
      total: "Ukupno",
      viewOrderDetails: "Pogledaj detalje porudžbine",
      allRightsReserved: "Sva prava zadržana",
    },
    en: {
      preview: `New Order #${order.id.substring(0, 8)} from ${order.customerName}`,
      newOrder: "New Order Received",
      orderDetails: "A new order has been placed on your store. Here are the details:",
      orderNumber: "Order",
      customerInfo: "Customer Information",
      name: "Name",
      email: "Email",
      phone: "Phone",
      address: "Address",
      city: "City",
      customerNotes: "Customer Notes",
      orderItems: "Order Items",
      quantity: "Quantity",
      promoCode: "Promo Code",
      paymentMethod: "Payment Method", // Add this line
      pouzecem: "Cash on Delivery", // Add this line
      total: "Total",
      viewOrderDetails: "View Order Details",
      allRightsReserved: "All rights reserved",
    },
  }

  // Get translations for the current language
  const t = translations[lang as keyof typeof translations]

  // Format currency based on the order's currency
  const formatPrice = (price: number) => {
    return formatCurrencyBased(price, lang) // Assuming price is stored in cents/paras
  }

  // Get payment method display text
  const getPaymentMethodText = () => {
    if (order.paymentMethod === "pouzecem") {
      return t.pouzecem
    }
    return order.paymentMethod
  }

  return (
    <Html>
      <Head>
        <title>{t.preview}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&display=swap');
            * {
              box-sizing: border-box;
            }
          `}
        </style>
      </Head>
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <img src="https://mystripy.com/primary-logo.png" alt="Stripy Logo" style={logo} width={140} height={40}/>
          </Section>
          <Section style={section}>
            <Heading style={h1}>{t.newOrder}</Heading>
            <Text style={text}>{t.orderDetails}</Text>

            <Section style={orderInfoSection}>
              <Row>
                <Column>
                  <Heading as="h2" style={h2}>
                    {t.orderNumber} #{order.id.substring(0, 8)}
                  </Heading>
                </Column>
                <Column style={{ textAlign: "right" }}>
                  <Text style={orderDate}>
                    {new Date(order.createdAt).toLocaleDateString(lang === "sr" ? "sr-RS" : "en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section style={customerSection}>
              <Heading as="h2" style={h2}>
                {t.customerInfo}
              </Heading>
              <Row style={customerInfoRow}>
                <Column style={customerInfoLabel}>
                  <Text>{t.name}:</Text>
                </Column>
                <Column style={customerInfoValue}>
                  <Text>{order.customerName}</Text>
                </Column>
              </Row>
              <Row style={customerInfoRow}>
                <Column style={customerInfoLabel}>
                  <Text>{t.email}:</Text>
                </Column>
                <Column style={customerInfoValue}>
                  <Text>
                    <Link href={`mailto:${order.customerEmail}`} style={emailLink}>
                      {order.customerEmail}
                    </Link>
                  </Text>
                </Column>
              </Row>
              <Row style={customerInfoRow}>
                <Column style={customerInfoLabel}>
                  <Text>{t.phone}:</Text>
                </Column>
                <Column style={customerInfoValue}>
                  <Text>
                    <Link href={`tel:${order.customerPhone}`} style={phoneLink}>
                      {order.customerPhone}
                    </Link>
                  </Text>
                </Column>
              </Row>
              <Row style={customerInfoRow}>
                <Column style={customerInfoLabel}>
                  <Text>{t.address}:</Text>
                </Column>
                <Column style={customerInfoValue}>
                  <Text>
                    {order.address}
                    {order.apartmentNumber && `, ${order.apartmentNumber}`}
                  </Text>
                </Column>
              </Row>
              <Row style={customerInfoRow}>
                <Column style={customerInfoLabel}>
                  <Text>{t.city}:</Text>
                </Column>
                <Column style={customerInfoValue}>
                  <Text>
                    {order.city}, {order.postalCode}
                  </Text>
                </Column>
              </Row>
              <Row style={customerInfoRow}>
                <Column style={customerInfoLabel}>
                  <Text>{t.paymentMethod}:</Text>
                </Column>
                <Column style={customerInfoValue}>
                  <Text>{getPaymentMethodText()}</Text>
                </Column>
              </Row>
              {order.notes && (
                <Section style={notesSection}>
                  <Text style={notesLabel}>{t.customerNotes}:</Text>
                  <Text style={notesText}>{order.notes}</Text>
                </Section>
              )}
            </Section>

            <Hr style={divider} />

            <Heading as="h2" style={h2}>
              {t.orderItems}
            </Heading>

            <Section style={orderItemsContainer}>
              {order.items.map((item) => (
                <Row key={item.id} style={orderItem}>
                  <Column style={orderItemDetails}>
                    <Text style={orderItemName}>{item.productName}</Text>
                    <Text style={orderItemQuantity}>
                      {t.quantity}: {item.quantity}
                    </Text>
                  </Column>
                  <Column style={orderItemPrice}>
                    <Text>{formatPrice(item.price * item.quantity)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>

            <Hr style={divider} />

            {order.promoCode && (
              <Row style={summaryRow}>
                <Column style={summaryLabel}>
                  <Text>{t.promoCode}:</Text>
                </Column>
                <Column style={summaryValue}>
                  <Text>{order.promoCode}</Text>
                </Column>
              </Row>
            )}

            <Row style={summaryRow}>
              <Column style={summaryLabel}>
                <Text style={totalLabel}>{t.total}:</Text>
              </Column>
              <Column style={summaryValue}>
                <Text style={totalValue}>{formatPrice(order.totalPrice)}</Text>
              </Column>
            </Row>

            <Hr style={divider} />

            <Section style={actionSection}>
              <Link
                href={`${process.env.NEXT_PUBLIC_BASE_URL}/admin/orders/${order.id}`}
                style={button}
                target="_blank"
              >
                {t.viewOrderDetails}
              </Link>
            </Section>
          </Section>
          <Section style={footer}>
            <Text style={footerText}>
              <a href="https://www.perceptionuae.com" target="_blank" rel="noopener noreferrer">
                {t.allRightsReserved} © {new Date().getFullYear()} Perception Creative Agency
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Enhanced styles
const main = {
  backgroundColor: "#1a1a1a",
  fontFamily: "Archivo, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  color: "#ffffff",
  letterSpacing: "0.5px",
  margin: "0",
  padding: "20px 0",
}

const container = {
  backgroundColor: "#2e2e2e",
  margin: "0 auto",
  maxWidth: "600px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
  borderRadius: "12px",
  overflow: "hidden",
}

const header = {
  backgroundColor: "#212121",
  padding: "24px 0",
  textAlign: "center" as const,
  borderBottom: "1px solid #3a3a3a",
}

const logo = {
  display: "block",
  margin: "0 auto",
}

const section = {
  padding: "30px",
}

const h1 = {
  color: "#cbff01",
  fontWeight: "700",
  fontSize: "28px",
  lineHeight: "1.3",
  margin: "0 0 20px",
  textAlign: "center" as const,
  letterSpacing: "1px",
  textTransform: "uppercase" as const,
}

const h2 = {
  color: "#cbff01",
  fontWeight: "600",
  fontSize: "20px",
  lineHeight: "1.3",
  margin: "0 0 10px",
  letterSpacing: "0.5px",
}

const text = {
  color: "#ffffff",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "16px 0",
}

const orderInfoSection = {
  margin: "30px 0 20px",
  backgroundColor: "#212121",
  padding: "20px",
  borderRadius: "8px",
  border: "1px solid #3a3a3a",
}

const orderDate = {
  color: "#b3b3b3",
  fontSize: "14px",
  margin: "5px 0 0",
}

const customerSection = {
  margin: "20px 0",
  backgroundColor: "#212121",
  padding: "20px",
  borderRadius: "8px",
  border: "1px solid #3a3a3a",
}

const customerInfoRow = {
  margin: "8px 0",
}

const customerInfoLabel = {
  width: "30%",
  color: "#cbff01",
  fontWeight: "600",
}

const customerInfoValue = {
  width: "70%",
}

const emailLink = {
  color: "#ffffff",
  textDecoration: "underline",
}

const phoneLink = {
  color: "#ffffff",
  textDecoration: "underline",
}

const notesSection = {
  marginTop: "15px",
  padding: "10px 0",
  borderTop: "1px dashed #3a3a3a",
}

const notesLabel = {
  color: "#cbff01",
  fontWeight: "600",
  margin: "10px 0 5px",
}

const notesText = {
  backgroundColor: "#262626",
  padding: "12px",
  borderRadius: "6px",
  margin: "5px 0 0",
  fontStyle: "italic",
  color: "#b3b3b3",
  border: "1px solid #3a3a3a",
}

const orderItemsContainer = {
  margin: "20px 0",
  backgroundColor: "#262626",
  borderRadius: "8px",
  padding: "5px 15px",
  border: "1px solid #3a3a3a",
}

const orderItem = {
  borderBottom: "1px solid #3a3a3a",
  padding: "15px 0",
}

const orderItemDetails = {
  width: "70%",
}

const orderItemName = {
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 5px",
  color: "#ffffff",
}

const orderItemQuantity = {
  color: "#b3b3b3",
  fontSize: "14px",
  margin: "0",
}

const orderItemPrice = {
  width: "30%",
  textAlign: "right" as const,
  color: "#cbff01",
  fontWeight: "600",
}

const divider = {
  borderTop: "1px solid #3a3a3a",
  margin: "20px 0",
}

const summaryRow = {
  margin: "10px 0",
}

const summaryLabel = {
  width: "70%",
}

const summaryValue = {
  width: "30%",
  textAlign: "right" as const,
  color: "#cbff01",
}

const totalLabel = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#ffffff",
}

const totalValue = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#cbff01",
}

const actionSection = {
  margin: "30px 0",
  textAlign: "center" as const,
}

const button = {
  backgroundColor: "#cbff01",
  borderRadius: "6px",
  color: "#212121",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "bold",
  padding: "12px 24px",
  textDecoration: "none",
  textAlign: "center" as const,
  letterSpacing: "1px",
  textTransform: "uppercase" as const,
}

const footer = {
  backgroundColor: "#212121",
  padding: "30px",
  textAlign: "center" as const,
  borderTop: "1px solid #3a3a3a",
}

const footerLogo = {
  margin: "0 auto 15px",
}

const footerText = {
  color: "#b3b3b3",
  fontSize: "14px",
  margin: "10px 0",
}

