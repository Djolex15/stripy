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
      paymentMethod: "Način plaćanja",
      pouzecem: "Pouzećem",
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
      paymentMethod: "Payment Method",
      pouzecem: "Cash on Delivery",
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

  // Define all colors as constants to ensure consistency
  const colors = {
    background: "#1a1a1a",
    containerBg: "#2e2e2e",
    headerBg: "#212121",
    accent: "#cbff01",
    text: "#ffffff",
    mutedText: "#b3b3b3",
    border: "#3a3a3a",
    sectionBg: "#212121",
    itemsBg: "#262626",
  }

  return (
    <Html>
      <Head>
        <title>{t.preview}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&display=swap');
            * {
              box-sizing: border-box;
            }
            body {
              background-color: ${colors.background} !important;
              font-family: Archivo, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
              color: ${colors.text} !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .main-container {
              background-color: ${colors.containerBg} !important;
            }
            .header-section {
              background-color: ${colors.headerBg} !important;
            }
            .accent-text {
              color: ${colors.accent} !important;
            }
            .accent-bg {
              background-color: ${colors.accent} !important;
              color: ${colors.headerBg} !important;
            }
            .muted-text {
              color: ${colors.mutedText} !important;
            }
            .section-bg {
              background-color: ${colors.sectionBg} !important;
            }
            .items-bg {
              background-color: ${colors.itemsBg} !important;
            }
          `}
        </style>
      </Head>
      <Preview>{t.preview}</Preview>
      <Body style={{
        backgroundColor: colors.background,
        fontFamily: "Archivo, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: colors.text,
        letterSpacing: "0.5px",
        margin: "0",
        padding: "20px 0",
      }}>
        <Container className="main-container" style={{
          backgroundColor: colors.containerBg,
          margin: "0 auto",
          maxWidth: "600px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          borderRadius: "12px",
          overflow: "hidden",
        }}>
          <Section className="header-section" style={{
            backgroundColor: colors.headerBg,
            padding: "24px 0",
            textAlign: "center",
            borderBottom: `1px solid ${colors.border}`,
          }}>
            <img src="https://mystripy.com/primary-logo.png" alt="Stripy Logo" style={{
              display: "block",
              margin: "0 auto",
            }} width={140} height={40}/>
          </Section>
          <Section style={{
            padding: "30px",
          }}>
            <Heading className="accent-text" style={{
              color: colors.accent,
              fontWeight: "700",
              fontSize: "28px",
              lineHeight: "1.3",
              margin: "0 0 20px",
              textAlign: "center",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}>{t.newOrder}</Heading>
            <Text style={{
              color: colors.text,
              fontSize: "16px",
              lineHeight: "1.6",
              margin: "16px 0",
            }}>{t.orderDetails}</Text>

            <Section className="section-bg" style={{
              margin: "30px 0 20px",
              backgroundColor: colors.sectionBg,
              padding: "20px",
              borderRadius: "8px",
              border: `1px solid ${colors.border}`,
            }}>
              <Row>
                <Column>
                  <Heading as="h2" className="accent-text" style={{
                    color: colors.accent,
                    fontWeight: "600",
                    fontSize: "20px",
                    lineHeight: "1.3",
                    margin: "0 0 10px",
                    letterSpacing: "0.5px",
                  }}>
                    {t.orderNumber} #{order.id.substring(0, 8)}
                  </Heading>
                </Column>
                <Column style={{ textAlign: "right" }}>
                  <Text className="muted-text" style={{
                    color: colors.mutedText,
                    fontSize: "14px",
                    margin: "5px 0 0",
                  }}>
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

            <Section className="section-bg" style={{
              margin: "20px 0",
              backgroundColor: colors.sectionBg,
              padding: "20px",
              borderRadius: "8px",
              border: `1px solid ${colors.border}`,
            }}>
              <Heading as="h2" className="accent-text" style={{
                color: colors.accent,
                fontWeight: "600",
                fontSize: "20px",
                lineHeight: "1.3",
                margin: "0 0 10px",
                letterSpacing: "0.5px",
              }}>
                {t.customerInfo}
              </Heading>
              <Row style={{
                margin: "8px 0",
              }}>
                <Column style={{
                  width: "30%",
                  color: colors.accent,
                  fontWeight: "600",
                }}>
                  <Text className="accent-text">{t.name}:</Text>
                </Column>
                <Column style={{
                  width: "70%",
                }}>
                  <Text>{order.customerName}</Text>
                </Column>
              </Row>
              <Row style={{
                margin: "8px 0",
              }}>
                <Column style={{
                  width: "30%",
                  color: colors.accent,
                  fontWeight: "600",
                }}>
                  <Text className="accent-text">{t.email}:</Text>
                </Column>
                <Column style={{
                  width: "70%",
                }}>
                  <Text>
                    <Link href={`mailto:${order.customerEmail}`} style={{
                      color: colors.text,
                      textDecoration: "underline",
                    }}>
                      {order.customerEmail}
                    </Link>
                  </Text>
                </Column>
              </Row>
              <Row style={{
                margin: "8px 0",
              }}>
                <Column style={{
                  width: "30%",
                  color: colors.accent,
                  fontWeight: "600",
                }}>
                  <Text className="accent-text">{t.phone}:</Text>
                </Column>
                <Column style={{
                  width: "70%",
                }}>
                  <Text>
                    <Link href={`tel:${order.customerPhone}`} style={{
                      color: colors.text,
                      textDecoration: "underline",
                    }}>
                      {order.customerPhone}
                    </Link>
                  </Text>
                </Column>
              </Row>
              <Row style={{
                margin: "8px 0",
              }}>
                <Column style={{
                  width: "30%",
                  color: colors.accent,
                  fontWeight: "600",
                }}>
                  <Text className="accent-text">{t.address}:</Text>
                </Column>
                <Column style={{
                  width: "70%",
                }}>
                  <Text>
                    {order.address}
                    {order.apartmentNumber && `, ${order.apartmentNumber}`}
                  </Text>
                </Column>
              </Row>
              <Row style={{
                margin: "8px 0",
              }}>
                <Column style={{
                  width: "30%",
                  color: colors.accent,
                  fontWeight: "600",
                }}>
                  <Text className="accent-text">{t.city}:</Text>
                </Column>
                <Column style={{
                  width: "70%",
                }}>
                  <Text>
                    {order.city}, {order.postalCode}
                  </Text>
                </Column>
              </Row>
              <Row style={{
                margin: "8px 0",
              }}>
                <Column style={{
                  width: "30%",
                  color: colors.accent,
                  fontWeight: "600",
                }}>
                  <Text className="accent-text">{t.paymentMethod}:</Text>
                </Column>
                <Column style={{
                  width: "70%",
                }}>
                  <Text>{getPaymentMethodText()}</Text>
                </Column>
              </Row>
              {order.notes && (
                <Section style={{
                  marginTop: "15px",
                  padding: "10px 0",
                  borderTop: `1px dashed ${colors.border}`,
                }}>
                  <Text className="accent-text" style={{
                    color: colors.accent,
                    fontWeight: "600",
                    margin: "10px 0 5px",
                  }}>{t.customerNotes}:</Text>
                  <Text className="items-bg" style={{
                    backgroundColor: colors.itemsBg,
                    padding: "12px",
                    borderRadius: "6px",
                    margin: "5px 0 0",
                    fontStyle: "italic",
                    color: colors.mutedText,
                    border: `1px solid ${colors.border}`,
                  }}>{order.notes}</Text>
                </Section>
              )}
            </Section>

            <Hr style={{
              borderTop: `1px solid ${colors.border}`,
              margin: "20px 0",
            }} />

            <Heading as="h2" className="accent-text" style={{
              color: colors.accent,
              fontWeight: "600",
              fontSize: "20px",
              lineHeight: "1.3",
              margin: "0 0 10px",
              letterSpacing: "0.5px",
            }}>
              {t.orderItems}
            </Heading>

            <Section className="items-bg" style={{
              margin: "20px 0",
              backgroundColor: colors.itemsBg,
              borderRadius: "8px",
              padding: "5px 15px",
              border: `1px solid ${colors.border}`,
            }}>
              {order.items.map((item) => (
                <Row key={item.id} style={{
                  borderBottom: `1px solid ${colors.border}`,
                  padding: "15px 0",
                }}>
                  <Column style={{
                    width: "70%",
                  }}>
                    <Text style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      margin: "0 0 5px",
                      color: colors.text,
                    }}>{item.productName}</Text>
                    <Text className="muted-text" style={{
                      color: colors.mutedText,
                      fontSize: "14px",
                      margin: "0",
                    }}>
                      {t.quantity}: {item.quantity}
                    </Text>
                  </Column>
                  <Column style={{
                    width: "30%",
                    textAlign: "right",
                    color: colors.accent,
                    fontWeight: "600",
                  }}>
                    <Text className="accent-text">{formatPrice(item.price * item.quantity)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>

            <Hr style={{
              borderTop: `1px solid ${colors.border}`,
              margin: "20px 0",
            }} />

            {order.promoCode && (
              <Row style={{
                margin: "10px 0",
              }}>
                <Column style={{
                  width: "70%",
                }}>
                  <Text>{t.promoCode}:</Text>
                </Column>
                <Column style={{
                  width: "30%",
                  textAlign: "right",
                  color: colors.accent,
                }}>
                  <Text className="accent-text">{order.promoCode}</Text>
                </Column>
              </Row>
            )}

            <Row style={{
              margin: "10px 0",
            }}>
              <Column style={{
                width: "70%",
              }}>
                <Text style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: colors.text,
                }}>{t.total}:</Text>
              </Column>
              <Column style={{
                width: "30%",
                textAlign: "right",
                color: colors.accent,
              }}>
                <Text className="accent-text" style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: colors.accent,
                }}>{formatPrice(order.totalPrice)}</Text>
              </Column>
            </Row>

            <Hr style={{
              borderTop: `1px solid ${colors.border}`,
              margin: "20px 0",
            }} />

            <Section style={{
              margin: "30px 0",
              textAlign: "center",
            }}>
              <Link
                href={`${process.env.NEXT_PUBLIC_BASE_URL}/admin/orders/${order.id}`}
                className="accent-bg"
                style={{
                  backgroundColor: colors.accent,
                  borderRadius: "6px",
                  color: colors.headerBg,
                  display: "inline-block",
                  fontSize: "16px",
                  fontWeight: "bold",
                  padding: "12px 24px",
                  textDecoration: "none",
                  textAlign: "center",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
                target="_blank"
              >
                {t.viewOrderDetails}
              </Link>
            </Section>
          </Section>
          <Section className="header-section" style={{
            backgroundColor: colors.headerBg,
            padding: "30px",
            textAlign: "center",
            borderTop: `1px solid ${colors.border}`,
          }}>
            <Text className="muted-text" style={{
              color: colors.mutedText,
              fontSize: "14px",
              margin: "10px 0",
            }}>
              <a href="https://www.perceptionuae.com" target="_blank" rel="noopener noreferrer" style={{
                color: colors.mutedText,
              }}>
                {t.allRightsReserved} © {new Date().getFullYear()} Perception Creative Agency
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}