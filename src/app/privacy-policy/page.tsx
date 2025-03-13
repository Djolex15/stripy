"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "@/src/lib/i18n-client"
import LanguageSwitcher from "@/src/components/language-switcher"
import CartButton from "@/src/components/cart-button"

export default function PrivacyPolicyPage() {
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
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-8">{t("privacyPolicy")}</h1>

            {/* Privacy Policy Content */}
            <div className="space-y-6 text-muted-foreground">
              {/* English Version */}
              {i18n.language === "en" && (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">Effective Date: {new Date().getDate()}.{new Date().getMonth()}.{new Date().getFullYear()}.</p>
                  </div>

                  <p>
                    Your privacy is important to us. This Privacy Policy explains how Stripy collects,
                    uses, and protects your information when you use our website and services.
                  </p>

                  <div>
                    <h3 className="font-semibold mb-2">1. Information We Collect</h3>
                    <p>We collect the following types of data:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>
                        Personal Information: Name, email address, phone number (only when voluntarily provided during
                        ordering or contacting support).
                      </li>
                      <li>Order Information: Details of products purchased and delivery preferences.</li>
                      <li>Technical Data: IP address, browser type, device information.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">2. How We Use Your Information?</h3>
                    <p>We use your data to:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Process and deliver your orders.</li>
                      <li>Communicate with you regarding orders, inquiries, or promotions.</li>
                      <li>Improve our website and services.</li>
                      <li>Comply with legal and security requirements.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">3. Data Sharing</h3>
                    <p>We do not share your personal information with third parties except in the following cases:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>When necessary for order fulfillment (e.g., shipping services).</li>
                      <li>When required by law.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">4. Data Protection</h3>
                    <p>
                      We implement appropriate technical and organizational measures to safeguard your data against
                      unauthorized access or misuse.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">5. Your Rights</h3>
                    <p>You have the right to:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Request access, correction, or deletion of your data.</li>
                      <li>Withdraw consent for data processing.</li>
                      <li>File a complaint with the relevant data protection authority.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">6. Contact</h3>
                    <p>For any questions regarding this Privacy Policy, please contact us at info@mystripy.com.</p>
                  </div>
                </>
              )}

              {/* Serbian Version */}
              {i18n.language === "sr" && (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">Datum stupanja na snagu: {new Date().getDate()}.{new Date().getMonth()}.{new Date().getFullYear()}.</p>
                  </div>

                  <p>
                    Vaša privatnost nam je važna. Ova Politika privatnosti objašnjava kako Stripy prikuplja, koristi i štiti vaše podatke kada koristite našu veb stranicu i usluge.
                  </p>

                  <div>
                    <h3 className="font-semibold mb-2">1. Podaci koje prikupljamo</h3>
                    <p>Prikupljamo sledeće vrste podataka:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>
                        Lični podaci: Ime, email adresa, broj telefona (samo kada ih dobrovoljno unesete prilikom
                        poručivanja ili kontaktiranja podrške).
                      </li>
                      <li>Podaci o narudžbenicama: Informacije o proizvodima koje kupujete i način dostave.</li>
                      <li>Tehnički podaci: IP adresa, tip pretraživača, podaci o uređaju.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">2. Kako koristimo vaše podatke?</h3>
                    <p>Vaše podatke koristimo za:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Obradu i isporuku vaših narudžbina.</li>
                      <li>Komunikaciju sa vama o vašim porudžbinama, pitanjima ili promocijama.</li>
                      <li>Poboljšanje naše veb stranice i usluga.</li>
                      <li>Pravne i bezbednosne svrhe.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">3. Deljenje podataka</h3>
                    <p>Ne delimo vaše lične podatke sa trećim licima osim u sledećim slučajevima:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Kada je to neophodno za isporuku vaših narudžbina (npr. kurirske službe).</li>
                      <li>Kada zakon to zahteva.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">4. Zaštita podataka</h3>
                    <p>
                      Preduzimamo odgovarajuće tehničke i organizacione mere kako bismo zaštitili vaše podatke od
                      neovlašćenog pristupa ili zloupotrebe.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">5. Vaša prava</h3>
                    <p>Imate pravo da:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Zatražite pristup, ispravku ili brisanje svojih podataka.</li>
                      <li>Opozovete saglasnost za obradu podataka.</li>
                      <li>Podnesete prigovor nadležnom telu za zaštitu podataka.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">6. Kontakt</h3>
                    <p>Za sva pitanja u vezi sa ovom Politikom privatnosti, kontaktirajte nas na info@mystripy.com.</p>
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
                  <a href="/terms-of-service" className="text-sm md:text-base text-muted-foreground hover:text-foreground">
                    {t("termsOfService")}
                  </a>
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

