import type React from "react"
import { CartProvider } from "@/src/lib/cart-context"
import { ThemeProvider } from "@/src/components/theme-provider"
import { Toaster } from "@/src/components/ui/toaster"
import "./globals.css"

export const metadata = {
  title: "Stripy | Diši bolje. Živi punim plućima.",
  description: "Stripy nosne trake otvaraju tvoje nazalne kanale za bolje disanje, smanjeno hrkanje i bolji kvalitet sna.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="dark">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

