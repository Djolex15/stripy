"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "@/src/lib/i18n-client"
import LanguageSwitcher from "@/src/components/language-switcher"
import CartButton from "@/src/components/cart-button"

export default function TermsOfServicePage() {
  const { t, i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)

  // Set mounted state to true after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a simple loading state or skeleton
    return (
      <div className="flex min-h-screen flex-col">
         <header className="fixed top-0 z-50 w-full bg-transparent backdrop-blur-sm height-[80px]">
        <div className="container flex h-16 md:h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/primary-logo.svg" alt="Stripy Logo" width={140} height={28} className="rounded-sm" />
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <LanguageSwitcher />
            <CartButton />
          </div>
        </div>
      </header>
        <div className="flex-1 mt-20">
          <div className="h-screen bg-gray-800"></div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex min-h-screen flex-col mt-20"
      style={{
        backgroundImage: "url('/websitebackground.png')",
        backgroundSize: "100vw", // Smaller pattern on mobile
        backgroundAttachment: "scroll",
      }}
    >
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-transparent backdrop-blur-sm height-[80px]">
        <div className="container flex h-16 md:h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/primary-logo.svg" alt="Stripy Logo" width={100} height={20} className="rounded-sm" />
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <LanguageSwitcher />
            <CartButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <section className="container py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            {/* Page Title */}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-8">{t("termsOfService")}</h1>

            {/* Terms of Service Content */}
            <div className="space-y-6 text-muted-foreground">
              {/* English Version */}
              {i18n.language === "en" && (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">Last updated: {new Date().getDate()}.{new Date().getMonth()}.{new Date().getFullYear()}.</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">1. Introduction</h3>
                    <p>
                      Welcome to Stripy! By accessing and using our website (mystripy.com) and services, you agree to
                      these Terms of Service. If you do not agree, please do not use our services.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">2. Use of Our Services</h3>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Stripy provides nasal strips designed to improve breathing and sleep quality.</li>
                      <li>You must be at least 18 years old to make purchases on our website.</li>
                      <li>
                        You agree to use our services only for lawful purposes and in accordance with these Terms.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">3. Orders and Pricing</h3>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>All prices are displayed in EUR (Euros) and RSD (Serbian Dinar).</li>
                      <li>Stripy reserves the right to change prices at any time without prior notice.</li>
                      <li>
                        Orders are placed through our website, and orders are paid in-person. You will receive
                        an email confirmation upon placing an order.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">4. Returns and Refunds</h3>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Due to the nature of our products, we do not accept returns once the packaging is opened.</li>
                      <li>
                        If you receive a defective or incorrect product, please contact us within 7 days of delivery at
                        info@mystripy.com to resolve the issue.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">5. Affiliate Program</h3>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>
                        Stripy offers an affiliate program where content creators can earn a commission on sales
                        generated through their unique promo code.
                      </li>
                      <li>
                        Affiliate earnings and sales can be tracked on mystripy.com, and payments are made via bank transfer.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">6. Intellectual Property</h3>
                    <p>
                      All content on mystripy.com, including logos, product images, and text, is the property of Stripy
                      and may not be used without permission.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">7. Limitation of Liability</h3>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>
                        Stripy is not responsible for any personal reactions or unintended effects resulting from
                        product use.
                      </li>
                      <li>
                        We are not liable for any indirect, incidental, or consequential damages arising from the use of
                        our products or website.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">8. Privacy</h3>
                    <p>
                      Your privacy is important to us. Please read our{" "}
                      <Link href="/privacy-policy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>{" "}
                      for details on how we handle your personal data.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">9. Contact</h3>
                    <p>For any questions, feel free to contact us at info@mystripy.com.</p>
                  </div>
                </>
              )}

              {/* Serbian Version */}
              {i18n.language === "sr" && (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">Poslednje ažuriranje: {new Date().getDate()}.{new Date().getMonth()}.{new Date().getFullYear()}.</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">1. Uvod</h3>
                    <p>
                      Dobrodošli na Stripy! Korišćenjem naše web stranice (mystripy.com) i usluga, prihvatate ove Uslove
                      Korišćenja. Ako se ne slažete, molimo vas da ne koristite naše usluge.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">2. Korišćenje Naših Usluga</h3>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Stripy nudi trakice za nos koje poboljšavaju disanje i kvalitet sna.</li>
                      <li>Morate imati najmanje 18 godina da biste kupovali putem našeg sajta.</li>
                      <li>Saglasni ste da naše usluge koristite isključivo u skladu sa zakonima i ovim uslovima.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">3. Porudžbine i Cene</h3>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Sve cene su izražene u EUR (Evro) i RSD (Srpski dinar).</li>
                      <li>Stripy zadržava pravo da u bilo kom trenutku promeni cene bez prethodne najave.</li>
                      <li>
                        Porudžbine se vrše putem našeg sajta i plaćanja se vrši pouzećem. Nakon porudžbine,
                        dobićete email potvrdu.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">4. Povrat i Reklamacije</h3>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Zbog prirode proizvoda, ne prihvatamo povrat nakon otvaranja pakovanja.</li>
                      <li>
                        Ako ste dobili neispravan ili pogrešan proizvod, kontaktirajte nas u roku od 7 dana na
                        info@mystripy.com kako bismo rešili problem.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">5. Affiliate Program</h3>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>
                        Stripy nudi affiliate program gde kreatori sadržaja mogu zarađivati proviziju od prodaja putem
                        svog promo koda.
                      </li>
                      <li>
                        Prodaje i zaradu moguće je pratiti na mystripy.com/admin, a isplate se vrše preko bankovnog računa.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">6. Intelektualna Svojina</h3>
                    <p>
                      Sav sadržaj na sajtu mystripy.com, uključujući logotipe, slike proizvoda i tekstove, vlasništvo je
                      kompanije Stripy i ne sme se koristiti bez dozvole.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">7. Ograničenje Odgovornosti</h3>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Stripy ne odgovara za eventualne neželjene reakcije ili posledice korišćenja proizvoda.</li>
                      <li>
                        Ne snosimo odgovornost za bilo kakve indirektne, slučajne ili posledične štete proizašle iz
                        upotrebe naših proizvoda ili sajta.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">8. Privatnost</h3>
                    <p>
                      Vaša privatnost nam je važna. Molimo vas da pročitate našu{" "}
                      <Link href="/privacy-policy" className="text-primary hover:underline">
                        Politiku Privatnosti
                      </Link>{" "}
                      kako biste saznali kako postupamo sa vašim podacima.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">9. Kontakt</h3>
                    <p>Za sva pitanja, slobodno nas kontaktirajte na info@mystripy.com.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background mt-5">
        <div className="container py-5">
          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <h3 className="mb-3 md:mb-4 text-base md:text-lg font-semibold">{t("aboutStripy")}</h3>
              <p className="text-sm md:text-base text-muted-foreground">{t("heroSubtitle")}</p>
            </div>
            <div>
              <h3 className="mb-3 md:mb-4 text-base md:text-lg font-semibold">{t("contactUs")}</h3>
              <p className="text-sm md:text-base text-muted-foreground">Email: info@mystripy.com</p>
              <div className="mt-3 md:mt-4 flex gap-3 md:gap-4">
                <a href="https://www.facebook.com/profile.php?id=61574093874513" className="text-sm md:text-base text-muted-foreground hover:text-foreground">
                  Facebook
                </a>
                <a href="https://www.instagram.com/mystripy/" className="text-sm md:text-base text-muted-foreground hover:text-foreground">
                  Instagram
                </a>
                <a href="https://www.tiktok.com/@mystripy" className="text-sm md:text-base text-muted-foreground hover:text-foreground">
                  TikTok
                </a>
              </div>
            </div>
            <div>
              <h3 className="mb-3 md:mb-4 text-base md:text-lg font-semibold">{t("quickLinks")}</h3>
              <ul className="space-y-1 md:space-y-2">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-sm md:text-base text-muted-foreground hover:text-foreground"
                  >
                    {t("privacyPolicy")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-sm md:text-base text-muted-foreground hover:text-foreground"
                  >
                    {t("termsOfService")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-5 border-t pt-5 text-center text-xs md:text-sm text-muted-foreground">
            <p>
              <a href="https://www.perceptionuae.com" target="_blank" rel="noopener noreferrer">
                {t("allRightsReserved")} © {new Date().getFullYear()} Perception Creative Agency
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

