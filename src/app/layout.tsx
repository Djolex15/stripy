import type React from "react"
import { CartProvider } from "@/src/lib/cart-context"
import { ThemeProvider } from "@/src/components/theme-provider"
import { Toaster } from "@/src/components/ui/toaster"
import "./globals.css"

export const metadata = {
  title: "Stripy - Breathe Better, Sleep Better",
  description: "Stripy nasal strips for improved breathing and reduced snoring",
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

