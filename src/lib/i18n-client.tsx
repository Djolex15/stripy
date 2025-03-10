"use client"

import i18n from "i18next"
import { initReactI18next, useTranslation as useTranslationOrg } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { useEffect, useState } from "react"

// English translations
const enResources = {
  translation: {
    // Navigation
    home: "Home",
    products: "Products",
    cart: "Cart",

    // Product related
    addToCart: "Add to Cart",
    continueShopping: "Continue Shopping",
    itemAddedToCart: "Item added to cart!",

    // Landing page sections
    heroTitle: "Breathe Better. Sleep Better.",
    heroSubtitle:
      "Stripy nasal strips open your nasal passages for improved breathing, reduced snoring, and better sleep quality.",
    orderNow: "Order Now",
    ourProducts: "Our Products",
    whyUseStripy: "Why Use Stripy?",
    betterSleep: "Better Sleep",
    betterSleepDesc: "Fall asleep faster and enjoy deeper, more restful sleep throughout the night.",
    reducedSnoring: "Reduced Snoring",
    reducedSnoringDesc:
      "Open nasal passages reduce the vibrations that cause snoring, for you and your partner's peace.",
    easierBreathing: "Easier Breathing",
    easierBreathingDesc: "Breathe more freely through your nose, especially during colds, allergies, or congestion.",
    athleticPerformance: "Athletic Performance",
    athleticPerformanceDesc:
      "Optimize your breathing during physical activities for improved endurance and performance.",
    faq: "Frequently Asked Questions",

    // Cart related
    yourCart: "Your Cart",
    cartEmpty: "Your cart is empty",
    cartEmptyMessage: "Looks like you haven't added any products to your cart yet.",
    removeItem: "Remove Item",
    clearCart: "Clear Cart",
    orderSummary: "Order Summary",
    total: "Total",
    proceedToOrder: "Proceed to Order",

    // Order form
    completeYourOrder: "Complete Your Order",
    customerInformation: "Customer Information",
    pleaseProvideYourDetails: "Please provide your details for delivery",
    fullName: "Full Name",
    email: "Email",
    phoneNumber: "Phone Number",
    address: "Address",
    apartmentNumber: "Apartment Number (optional)",
    city: "City",
    postalCode: "Postal Code",
    additionalNotes: "Additional Notes",
    anySpecialInstructions: "Any special instructions or requests?",
    backToCart: "Back to Cart",
    submitInquiry: "Submit Inquiry",
    order: "Order",
    submitting: "Submitting...",

    // Promo code related
    promoCode: "Promo Code",
    enterPromoCode: "Enter promo code",
    apply: "Apply",
    applying: "Applying...",
    promoCodeApplied: "Promo Code Applied",
    discountApplied: "discount applied to your order!",
    invalidPromoCode: "Invalid Promo Code",
    promoCodeNotFound: "The promo code you entered is invalid or expired.",

    // Form validation
    formError: "Form Error",
    pleaseCompleteAllFields: "Please complete all required fields",

    // Order success/error
    orderSuccess: "Order Received",
    orderSuccessMessage: "Thank you for your order! We've received your inquiry and will contact you soon.",
    orderError: "Order Error",
    orderErrorMessage: "There was a problem submitting your order. Please try again.",
    orderReceived: "Order Received!",
    orderConfirmed: "Order Confirmed",
    thankYouForYourOrder: "Thank you for your order!",
    orderConfirmationSentToEmail: "Order confirmation has been sent to your email",
    checkYourInboxForDetails: "Check your inbox for order details and tracking information",
    orderProcessingMessage: "We're processing your order and will notify you when it ships.",
    redirectingToHomepage: "Redirecting to homepage in",
    seconds: "seconds",
    checkEmailForUpdates: "We'll contact you via email with further details about your order.",
    backToHome: "Back to Home",

    // Footer
    aboutStripy: "About Stripy",
    aboutStripyDesc:
      "Stripy is dedicated to improving sleep quality and breathing comfort through innovative nasal strip technology.",
    contactUs: "Contact Us",
    quickLinks: "Quick Links",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    allRightsReserved: "All rights reserved.",

    // Admin
    adminDashboard: "Admin Dashboard",
    promoCodeStats: "Promo Code Statistics",
    promoCodeName: "Promo Code",
    usageCount: "Usage Count",
    lastUsed: "Last Used",
    creatorName: "Creator",
    adminLogin: "Admin Login",
    password: "Password",
    login: "Login",
    invalidPassword: "Invalid password",
    logout: "Logout",
    noPromoCodesUsed: "No promo codes have been used yet.",

    // Creator Dashboard
    creatorDashboard: "Creator Dashboard",
    creatorLogin: "Creator Login",
    enterCreatorCredentials: "Enter your promo code and password to access your dashboard",
    invalidCredentials: "Invalid Credentials",
    invalidCredentialsMessage: "The promo code or password you entered is incorrect.",
    loginError: "Login Error",
    tryAgainLater: "Please try again later.",
    loggingIn: "Logging in...",
    welcome: "Welcome,",
    refresh: "Refresh",
    loading: "Loading...",

    // Creator Stats
    yourPromoCode: "Your Promo Code",
    discountOffered: "Discount Offered",
    totalOrders: "Total Orders",
    yourEarnings: "Your Earnings",
    earningsSummary: "Earnings Summary",
    earningsSummaryDescription: "Overview of your earnings from promo code usage",
    totalSales: "Total Sales",
    yourCommission: "Your Commission",
    totalEarnings: "Total Earnings",
    never: "Never",
    howEarningsWork: "How Earnings Work",
    earningsExplanation:
      "you earn of the total order value when customers use your promo code. This is the same percentage as the discount offered to customers.",

    // Usage Statistics
    usageStatistics: "Usage Statistics",
    usageStatisticsDescription: "Track how your promo code is being used",
    totalUsage: "Total Usage",
    conversionRate: "Conversion Rate",
    promotionTips: "Promotion Tips",
    promotionTip1: "Share your promo code on social media to reach more potential customers.",
    promotionTip2: "Include your promo code in your bio or profile descriptions.",
    promotionTip3: "Remind your audience about the benefits they'll get using your code.",
    noUsageData: "No usage data available yet.",
    loadingData: "Loading data...",

    // Admin Dashboard Additional
    activeCreators: "Active Creators",
    creatorEarnings: "Creator Earnings",
    discountPercentage: "Discount %",
    orderCount: "Order Count",
    noEarningsData: "No earnings data available yet.",

    // Order Details
    orderDetails: "Order Details",
    orderDetailsDescription: "View details of orders placed using your promo code",
    orderId: "Order ID",
    orderDate: "Date",
    orderAmount: "Amount",
    orderCurrency: "Currency",
    yourEarningsPerOrder: "Your Earnings",
    totalLabel: "Total:",
    noOrderData: "No order data available yet.",

    // Table translations
    table: "Table",
    tableHeader: "Table Header",
    tableBody: "Table Body",
    tableFooter: "Table Footer",
    tableEmpty: "No data available",
    tableLoading: "Loading data...",
    tableSearch: "Search",
    tableFilter: "Filter",
    tablePagination: "Pagination",
    tableRowsPerPage: "Rows per page",
    tableRowsSelected: "rows selected",
    tableRowActions: "Actions",
    tableSelectAll: "Select all",
    tableDeselectAll: "Deselect all",
    tablePrevious: "Previous",
    tableNext: "Next",
    tablePage: "Page",
    tableOf: "of",
    tableShowingFrom: "Showing",
    tableShowingTo: "to",
    tableShowingOf: "of",
    tableShowingTotal: "total",
    tableNoResults: "No results found",

    // Language
    language: "Language",

    // Currency
    currency: "EUR",
  },
}

// Serbian translations
const srResources = {
  translation: {
    // Navigation
    home: "Početna",
    products: "Proizvodi",
    cart: "Korpa",

    // Product related
    addToCart: "Dodaj u korpu",
    continueShopping: "Nastavi kupovinu",
    itemAddedToCart: "Proizvod dodat u korpu!",

    // Landing page sections
    heroTitle: "Dišite bolje. Spavajte bolje.",
    heroSubtitle:
      "Stripy nazalne trake otvaraju vaše nosne prolaze za poboljšano disanje, smanjeno hrkanje i bolji kvalitet sna.",
    orderNow: "Poručite odmah",
    ourProducts: "Naši proizvodi",
    whyUseStripy: "Zašto koristiti Stripy?",
    betterSleep: "Bolji san",
    betterSleepDesc: "Brže zaspite i uživajte u dubljem, kvalitetnijem snu tokom cele noći.",
    reducedSnoring: "Smanjeno hrkanje",
    reducedSnoringDesc: "Otvoreni nosni prolazi smanjuju vibracije koje uzrokuju hrkanje, za vaš i mir vašeg partnera.",
    easierBreathing: "Lakše disanje",
    easierBreathingDesc: "Dišite slobodnije kroz nos, posebno tokom prehlade, alergija ili zapušenosti.",
    athleticPerformance: "Sportske performanse",
    athleticPerformanceDesc: "Optimizujte disanje tokom fizičkih aktivnosti za poboljšanu izdržljivost i performanse.",
    faq: "Često postavljana pitanja",

    // Cart related
    yourCart: "Vaša korpa",
    cartEmpty: "Vaša korpa je prazna",
    cartEmptyMessage: "Izgleda da još niste dodali proizvode u korpu.",
    removeItem: "Ukloni",
    clearCart: "Isprazni korpu",
    orderSummary: "Pregled porudžbine",
    total: "Ukupno",
    proceedToOrder: "Nastavi na porudžbinu",

    // Order form
    completeYourOrder: "Završite porudžbinu",
    customerInformation: "Informacije o kupcu",
    pleaseProvideYourDetails: "Molimo unesite vaše podatke za dostavu",
    fullName: "Ime i prezime",
    email: "Email",
    phoneNumber: "Broj telefona",
    address: "Adresa",
    apartmentNumber: "Broj stana (opciono)",
    city: "Grad",
    postalCode: "Poštanski broj",
    additionalNotes: "Dodatne napomene",
    anySpecialInstructions: "Posebne instrukcije ili zahtevi?",
    backToCart: "Nazad na korpu",
    submitInquiry: "Pošalji upit",
    order: "Poruči",
    submitting: "Slanje...",

    // Promo code related
    promoCode: "Promo Kod",
    enterPromoCode: "Unesite promo kod",
    apply: "Primeni",
    applying: "Primenjujem...",
    promoCodeApplied: "Promo Kod Primenjen",
    discountApplied: "popusta primenjeno na vašu porudžbinu!",
    invalidPromoCode: "Nevažeći Promo Kod",
    promoCodeNotFound: "Promo kod koji ste uneli je nevažeći ili istekao.",

    // Form validation
    formError: "Greška u formi",
    pleaseCompleteAllFields: "Molimo popunite sva obavezna polja",

    // Order success/error
    orderSuccess: "Porudžbina primljena",
    orderSuccessMessage: "Hvala na porudžbini! Primili smo vaš upit i kontaktiraćemo vas uskoro.",
    orderError: "Greška u porudžbini",
    orderErrorMessage: "Došlo je do problema prilikom slanja porudžbine. Molimo pokušajte ponovo.",
    orderReceived: "Porudžbina primljena!",
    orderConfirmed: "Porudžbina potvrđena",
    thankYouForYourOrder: "Hvala vam na porudžbini!",
    orderConfirmationSentToEmail: "Potvrda porudžbine je poslata na vaš email",
    checkYourInboxForDetails: "Proverite vaše sanduče za detalje porudžbine i informacije o praćenju",
    orderProcessingMessage: "Obrađujemo vašu porudžbinu i obavestićemo vas kada bude poslata.",
    redirectingToHomepage: "Preusmeravanje na početnu stranicu za",
    seconds: "sekundi",
    checkEmailForUpdates: "Kontaktiraćemo vas putem email-a sa daljim detaljima o vašoj porudžbini.",
    backToHome: "Nazad na početnu",

    // Footer
    aboutStripy: "O Stripy",
    aboutStripyDesc:
      "Stripy je posvećen poboljšanju kvaliteta sna i udobnosti disanja kroz inovativnu tehnologiju nazalnih traka.",
    contactUs: "Kontaktirajte nas",
    quickLinks: "Brzi linkovi",
    privacyPolicy: "Politika privatnosti",
    termsOfService: "Uslovi korišćenja",
    allRightsReserved: "Sva prava zadržana.",

    // Admin
    adminDashboard: "Admin Panel",
    promoCodeStats: "Statistika Promo Kodova",
    promoCodeName: "Promo Kod",
    usageCount: "Broj Korišćenja",
    lastUsed: "Poslednje Korišćenje",
    creatorName: "Kreator",
    adminLogin: "Admin Prijava",
    password: "Lozinka",
    login: "Prijava",
    invalidPassword: "Nevažeća lozinka",
    logout: "Odjava",
    noPromoCodesUsed: "Još uvek nema korišćenih promo kodova.",

    // Creator Dashboard
    creatorDashboard: "Panel Kreatora",
    creatorLogin: "Prijava Kreatora",
    enterCreatorCredentials: "Unesite vaš promo kod i lozinku za pristup vašem panelu",
    invalidCredentials: "Nevažeći Podaci",
    invalidCredentialsMessage: "Promo kod ili lozinka koju ste uneli su netačni.",
    loginError: "Greška pri prijavi",
    tryAgainLater: "Molimo pokušajte ponovo kasnije.",
    loggingIn: "Prijavljivanje...",
    welcome: "Dobrodošli,",
    refresh: "Osveži",
    loading: "Učitavanje...",

    // Creator Stats
    yourPromoCode: "Vaš Promo Kod",
    discountOffered: "Ponuđeni Popust",
    totalOrders: "Ukupno Porudžbina",
    yourEarnings: "Vaša Zarada",
    earningsSummary: "Pregled Zarade",
    earningsSummaryDescription: "Pregled vaše zarade od korišćenja promo koda",
    totalSales: "Ukupna Prodaja",
    yourCommission: "Vaša Provizija",
    totalEarnings: "Ukupna Zarada",
    never: "Nikada",
    howEarningsWork: "Kako Funkcioniše Zarada",
    earningsExplanation:
      "zarađujete od ukupne vrednosti porudžbine kada kupci koriste vaš promo kod. Ovo je isti procenat kao i popust koji se nudi kupcima.",

    // Usage Statistics
    usageStatistics: "Statistika Korišćenja",
    usageStatisticsDescription: "Pratite kako se koristi vaš promo kod",
    totalUsage: "Ukupno Korišćenje",
    conversionRate: "Stopa Konverzije",
    promotionTips: "Saveti za Promociju",
    promotionTip1: "Podelite vaš promo kod na društvenim mrežama da biste došli do više potencijalnih kupaca.",
    promotionTip2: "Uključite vaš promo kod u vašu biografiju ili opise profila.",
    promotionTip3: "Podsetite vašu publiku o prednostima koje će dobiti korišćenjem vašeg koda.",
    noUsageData: "Još uvek nema dostupnih podataka o korišćenju.",
    loadingData: "Učitavanje podataka...",

    // Admin Dashboard Additional
    activeCreators: "Aktivni Kreatori",
    creatorEarnings: "Zarada Kreatora",
    discountPercentage: "Popust %",
    orderCount: "Broj Porudžbina",
    noEarningsData: "Još uvek nema dostupnih podataka o zaradi.",

    // Order Details
    orderDetails: "Detalji Porudžbina",
    orderDetailsDescription: "Pregledajte detalje porudžbina napravljenih korišćenjem vašeg promo koda",
    orderId: "ID Porudžbine",
    orderDate: "Datum",
    orderAmount: "Iznos",
    orderCurrency: "Valuta",
    yourEarningsPerOrder: "Vaša Zarada",
    totalLabel: "Ukupno:",
    noOrderData: "Još uvek nema dostupnih podataka o porudžbinama.",

    // Table translations
    table: "Tabela",
    tableHeader: "Zaglavlje tabele",
    tableBody: "Telo tabele",
    tableFooter: "Podnožje tabele",
    tableEmpty: "Nema dostupnih podataka",
    tableLoading: "Učitavanje podataka...",
    tableSearch: "Pretraga",
    tableFilter: "Filter",
    tablePagination: "Paginacija",
    tableRowsPerPage: "Redova po stranici",
    tableRowsSelected: "redova izabrano",
    tableRowActions: "Akcije",
    tableSelectAll: "Izaberi sve",
    tableDeselectAll: "Poništi izbor",
    tablePrevious: "Prethodno",
    tableNext: "Sledeće",
    tablePage: "Strana",
    tableOf: "od",
    tableShowingFrom: "Prikazuje se",
    tableShowingTo: "do",
    tableShowingOf: "od",
    tableShowingTotal: "ukupno",
    tableNoResults: "Nema pronađenih rezultata",

    // FAQ
    howDoStripyWork: "Kako funkcionišu Stripy nazalne trake?",
    howDoStripyWorkAnswer:
      "Stripy nazalne trake funkcionišu tako što nežno otvaraju nosne prolaze spolja. Fleksibilna traka prianja na kožu nosa i podiže nosne prolaze, omogućavajući poboljšan protok vaz  Fleksibilna traka prianja na kožu nosa i podiže nosne prolaze, omogućavajući poboljšan protok vazduha i lakše disanje.",
    areStripyComfortable: "Da li su Stripy nazalne trake udobne za nošenje?",
    areStripyComfortableAnswer:
      "Da, naše trake su dizajnirane sa udobnošću na umu. Napravljene su od hipoalergenih materijala i imaju nežan lepak koji osigurava traku na mestu bez izazivanja nelagodnosti ili iritacije.",
    howLongCanIWear: "Koliko dugo mogu nositi Stripy nazalnu traku?",
    howLongCanIWearAnswer:
      "Svaka traka je dizajnirana da se nosi do 12 sati. Preporučujemo da stavite traku neposredno pre spavanja i uklonite je ujutru.",
    canStripyHelpSnoring: "Da li Stripy pomaže kod hrkanja?",
    canStripyHelpSnoringAnswer:
      "Mnogi korisnici prijavljuju smanjeno hrkanje kada koriste Stripy nazalne trake. Otvaranjem nosnih prolaza, trake mogu pomoći u smanjenju vibracija tkiva koje uzrokuju hrkanje.",
    howDoIApply: "Kako da primenim Stripy nazalne trake?",
    howDoIApplyAnswer:
      "Očistite i osušite nos, zatim uklonite zaštitnu foliju sa trake. Postavite traku preko mosta nosa, nežno pritisnite da je pričvrstite na mesto. Traka bi trebalo da stvori nežan osećaj podizanja kada se pravilno primeni.",

    // Language
    language: "Jezik",

    // Currency
    currency: "RSD",
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: enResources,
      sr: srResources,
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  })

export function useTranslation() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const ret = useTranslationOrg()

  // Block translation on server side
  if (!mounted) return { ...ret, t: (key: string) => key }

  return ret
}

export default i18n

