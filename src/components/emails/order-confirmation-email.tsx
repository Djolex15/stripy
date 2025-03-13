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

interface OrderConfirmationEmailProps {
  order: OrderWithItems
  language?: string
}

export const OrderConfirmationEmailTemplate = ({ order, language }: OrderConfirmationEmailProps) => {
  // Determine language based on order currency if not specified
  const lang = language || (order.currency === "RSD" ? "sr" : "en")

  // Translations
  const translations = {
    en: {
      preview: `Your order #${order.id.substring(0, 8)} has been confirmed`,
      orderConfirmed: "Order Confirmed",
      greeting: `Hi ${order.customerName},`,
      thankYou:
        "Thank you for your order! We've received your purchase and are processing it now. You'll find all the details of your order below.",
      orderNumber: "Order",
      quantity: "Quantity",
      promoCode: "Promo Code",
      paymentMethod: "Payment Method", // Add this line
      pouzecem: "Cash on Delivery", // Add this line
      total: "Total",
      shippingAddress: "Shipping Address",
      questions: "If you have any questions about your order, please don't hesitate to contact us.",
      thankYouShopping: "Thank you for shopping with us!",
      teamSignature: "The Team at Stripy",
      allRightsReserved: "All rights reserved",
      visitWebsite: "Visit our website",
    },
    sr: {
      preview: `Vaša porudžbina #${order.id.substring(0, 8)} je potvrđena`,
      orderConfirmed: "Porudžbina potvrđena",
      greeting: `Zdravo ${order.customerName},`,
      thankYou:
        "Hvala vam na porudžbini! Primili smo vašu kupovinu i trenutno je obrađujemo. U nastavku ćete pronaći sve detalje vaše porudžbine.",
      orderNumber: "Porudžbina",
      quantity: "Količina",
      promoCode: "Promo kod",
      paymentMethod: "Način plaćanja", // Add this line
      pouzecem: "Pouzećem", // Add this line
      total: "Ukupno",
      shippingAddress: "Adresa za dostavu",
      questions: "Ako imate bilo kakvih pitanja o vašoj porudžbini, slobodno nas kontaktirajte.",
      thankYouShopping: "Hvala što kupujete kod nas!",
      teamSignature: "Tim Stripy",
      allRightsReserved: "Sva prava zadržana",
      visitWebsite: "Posetite naš sajt",
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
            <img src="https://mystripy.com/primary-logo.png" alt="Stripy Logo" style={logo} width={140} height={28}/>
          </Section>
          <Section style={section}>
            <Heading style={h1}>{t.orderConfirmed}</Heading>
            <Text style={text}>{t.greeting}</Text>
            <Text style={text}>{t.thankYou}</Text>

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
                    })}
                  </Text>
                </Column>
              </Row>
            </Section>

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

            <Section style={paymentMethodSection}>
              <Heading as="h2" style={h2}>
                {t.paymentMethod}
              </Heading>
              <Text style={paymentMethodText}>{getPaymentMethodText()}</Text>
            </Section>

            <Section style={shippingSection}>
              <Heading as="h2" style={h2}>
                {t.shippingAddress}
              </Heading>
              <Text style={addressText}>
                {order.customerName}
                <br />
                {order.address}
                {order.apartmentNumber && `, ${order.apartmentNumber}`}
                <br />
                {order.city}, {order.postalCode}
              </Text>
            </Section>

            <Hr style={divider} />

            <Text style={text}>{t.questions}</Text>

            <Text style={text}>{t.thankYouShopping}</Text>

            <Text style={signature}>{t.teamSignature}</Text>
          </Section>
          <Section style={footer}>
            <Text style={footerText}>
              <a href="https://www.perceptionuae.com" target="_blank" rel="noopener noreferrer">
                {t.allRightsReserved} © {new Date().getFullYear()} Perception Creative Agency
              </a>
            </Text>
            <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}`} style={footerButton}>
              {t.visitWebsite}
            </Link>
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

const paymentMethodSection = {
  margin: "20px 0",
  backgroundColor: "#212121",
  padding: "20px",
  borderRadius: "8px",
  border: "1px solid #3a3a3a",
}

const paymentMethodText = {
  margin: "10px 0",
  lineHeight: "1.6",
  color: "#ffffff",
  fontWeight: "600",
}

const shippingSection = {
  margin: "20px 0",
  backgroundColor: "#212121",
  padding: "20px",
  borderRadius: "8px",
  border: "1px solid #3a3a3a",
}

const addressText = {
  margin: "10px 0",
  lineHeight: "1.6",
  color: "#ffffff",
}

const signature = {
  color: "#cbff01",
  fontSize: "16px",
  fontStyle: "italic",
  margin: "30px 0 0",
  textAlign: "center" as const,
}

const footer = {
  backgroundColor: "#212121",
  padding: "30px",
  textAlign: "center" as const,
  borderTop: "1px solid #3a3a3a",
}

const footerLogo = {
  margin: "0 auto",
  display: "block",
}

const footerText = {
  color: "#b3b3b3",
  fontSize: "14px",
  margin: "10px 0 20px",
}

const footerButton = {
  backgroundColor: "#cbff01",
  borderRadius: "6px",
  color: "#212121",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "600",
  padding: "10px 20px",
  textDecoration: "none",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
}

