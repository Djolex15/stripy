import { Body, Container, Column, Head, Heading, Hr, Html, Preview, Row, Section, Text } from "@react-email/components"
import { formatCurrency } from "../../lib/utils"
import type { OrderWithItems, OrderItem } from "../../lib/types"

interface AdminNotificationEmailProps {
  order: OrderWithItems
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
}

export const AdminNotificationEmailTemplate = ({ order }: AdminNotificationEmailProps) => {
  const previewText = `New order #${order.id.substring(0, 8)} received`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Heading style={h1}>New Order Received</Heading>
            <Text style={text}>A new order has been placed on your website.</Text>
            <Text style={text}>
              <strong>Order ID:</strong> #{order.id.substring(0, 8)}
            </Text>
            <Text style={text}>
              <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
            </Text>

            <Hr style={hr} />

            <Heading style={h2}>Customer Information</Heading>
            <Text style={text}>
              <strong>Name:</strong> {order.customerName}
            </Text>
            <Text style={text}>
              <strong>Email:</strong> {order.customerEmail}
            </Text>
            <Text style={text}>
              <strong>Phone:</strong> {order.customerPhone}
            </Text>
            <Text style={text}>
              <strong>Address:</strong> {order.address}
              {order.apartmentNumber ? `, Apt ${order.apartmentNumber}` : ""}
            </Text>
            <Text style={text}>
              <strong>City:</strong> {order.city}, {order.postalCode}
            </Text>

            {order.notes && (
              <>
                <Text style={text}>
                  <strong>Notes:</strong> {order.notes}
                </Text>
              </>
            )}

            <Hr style={hr} />

            <Heading style={h2}>Order Details</Heading>

            {order.items.map((item: OrderItem) => (
              <Row key={item.id} style={itemRow}>
                <Column>
                  <Text style={itemName}>
                    {item.productName} × {item.quantity}
                  </Text>
                </Column>
                <Column style={alignRight}>
                  <Text style={itemPrice}>{formatCurrency(item.price * item.quantity, item.currency)}</Text>
                </Column>
              </Row>
            ))}

            <Hr style={hr} />

            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Total</Text>
              </Column>
              <Column style={alignRight}>
                <Text style={totalPrice}>{formatCurrency(order.totalPrice, order.currency)}</Text>
              </Column>
            </Row>

            {order.promoCode && (
              <Text style={text}>
                <strong>Promo Code Used:</strong> {order.promoCode}
              </Text>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0",
  maxWidth: "600px",
}

const section = {
  padding: "0 24px",
}

const h1 = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "30px 0",
  padding: "0",
  lineHeight: "1.5",
}

const h2 = {
  color: "#1f2937",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "24px 0 16px",
  padding: "0",
  lineHeight: "1.5",
}

const text = {
  color: "#4b5563",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "16px 0",
}

const itemRow = {
  margin: "8px 0",
}

const itemName = {
  color: "#4b5563",
  fontSize: "16px",
  fontWeight: "normal",
  margin: "0",
}

const itemPrice = {
  color: "#4b5563",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0",
}

const totalRow = {
  margin: "16px 0",
}

const totalLabel = {
  color: "#1f2937",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0",
}

const totalPrice = {
  color: "#1f2937",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0",
}

const alignRight = {
  textAlign: "right" as const,
}

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
}

