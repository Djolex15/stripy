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
      paymentMethod: "Payment Method",
      pouzecem: "Cash on Delivery",
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
      paymentMethod: "Način plaćanja",
      pouzecem: "Pouzećem",
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
            }}>{t.orderConfirmed}</Heading>
            <Text style={{
              color: colors.text,
              fontSize: "16px",
              lineHeight: "1.6",
              margin: "16px 0",
            }}>{t.greeting}</Text>
            <Text style={{
              color: colors.text,
              fontSize: "16px",
              lineHeight: "1.6",
              margin: "16px 0",
            }}>{t.thankYou}</Text>

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
                    })}
                  </Text>
                </Column>
              </Row>
            </Section>

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
                {t.paymentMethod}
              </Heading>
              <Text style={{
                margin: "10px 0",
                lineHeight: "1.6",
                color: colors.text,
                fontWeight: "600",
              }}>{getPaymentMethodText()}</Text>
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
                {t.shippingAddress}
              </Heading>
              <Text style={{
                margin: "10px 0",
                lineHeight: "1.6",
                color: colors.text,
              }}>
                {order.customerName}
                <br />
                {order.address}
                {order.apartmentNumber && `, ${order.apartmentNumber}`}
                <br />
                {order.city}, {order.postalCode}
              </Text>
            </Section>

            <Hr style={{
              borderTop: `1px solid ${colors.border}`,
              margin: "20px 0",
            }} />

            <Text style={{
              color: colors.text,
              fontSize: "16px",
              lineHeight: "1.6",
              margin: "16px 0",
            }}>{t.questions}</Text>

            <Text style={{
              color: colors.text,
              fontSize: "16px",
              lineHeight: "1.6",
              margin: "16px 0",
            }}>{t.thankYouShopping}</Text>

            <Text className="accent-text" style={{
              color: colors.accent,
              fontSize: "16px",
              fontStyle: "italic",
              margin: "30px 0 0",
              textAlign: "center",
            }}>{t.teamSignature}</Text>
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
              margin: "10px 0 20px",
            }}>
              <a href="https://www.perceptionuae.com" target="_blank" rel="noopener noreferrer" style={{
                color: colors.mutedText,
              }}>
                {t.allRightsReserved} © {new Date().getFullYear()} Perception Creative Agency
              </a>
            </Text>
            <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}`} className="accent-bg" style={{
              backgroundColor: colors.accent,
              borderRadius: "6px",
              color: colors.headerBg,
              display: "inline-block",
              fontSize: "14px",
              fontWeight: "600",
              padding: "10px 20px",
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}>
              {t.visitWebsite}
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}