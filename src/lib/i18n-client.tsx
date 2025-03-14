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
    heroTitle: "Breathe better. Live better",
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

    // Science of Breathing Section
    scienceOfBreathingTitle: "The Science of Breathing, The Art of Performance",
    trainBodyMind: "You train your body. You train your mind. But what about your breath?",
    topPerformers:
      "From NBA players to UFC fighters, biohackers to business moguls, the world's top performers know that better breathing = better everything.",
    takeControl: "It's time to take control. To own your air. To breathe like you were meant to.",
    joinMovement: "Join the Stripy movement.",
    everyBreathChoice: "Because every breath is a choice.",
    chooseToWin: "And with Stripy, you choose to win.",

    // What Stripy Does Section
    whatStripyDoesTitle: "💨 What Stripy Does for You:",
    opensAirways: "Opens up your airways",
    opensAirwaysDesc: "More oxygen, more endurance, more energy.",
    reducesSnoring: "Reduces snoring",
    reducesSnoringSleepDesc: "So you (and everyone around you) can sleep like a champion.",
    maximizesOxygen: "Maximizes oxygen intake",
    maximizesOxygenDesc: "For better workouts, sharper focus, and faster recovery.",
    nonInvasive: "Non-invasive, drug-free",
    nonInvasiveDesc: "Just pure breathing power, whenever you need it.",

    // Product Descriptions
    testPackName: "Test Pack (10 Strips)",
    testPackDesc: "Not sure yet? Try it. Feel the difference. One breath is all it takes.",
    monthlyPackName: "Monthly Pack (30 Strips)",
    monthlyPackDesc:
      "Your daily upgrade for unstoppable energy, better sleep, and peak performance. One month. A lifetime of better breathing.",
    himHerPackName: "Him & Her Pack (60 Strips)",
    himHerPackDesc: "Because great nights and powerful days shouldn't be a solo mission. Breathe better. Together.",

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

    // Payment related
    paymentMethod: "Payment Method",
    pouzecem: "Cash on Delivery",
    inPerson: "In-Person Pickup",
    selectPaymentMethod: "Select Payment Method",
    ourRecommendation: "Our Recommendation",
    mostPopular: "Our Recommendation",
    aboutStripyNew: "Join the Stripy movement. Because every breath is a choice, and with Stripy, you choose to win.",
    freeShipping: "Is shipping free for every order?",
    freeShippingAnswer:
      "Yes! Shipping is 100% free when you order the His & Hers Pack - 60 strips. For the other two options, we've ensured the lowest possible shipping cost to make your experience affordable.",
    safeForDailyUse: "Are Stripy nasal strips safe for daily use?",
    safeForDailyUseAnswer:
      "Yes! Stripy is non-invasive and completely safe for daily use. Whether you use them for sleeping, working out, or improving breathing during the day, you can wear them as much as you want.",
    stayInPlace: "Will the nasal strips stay in place during the night or intense workout?",
    stayInPlaceAnswer:
      "Yes! Stripy is made with a strong, skin-friendly adhesive layer that ensures the strip stays in place whether you're sleeping soundly or breaking records at the gym.",
    deviated: "Can I use nasal strips if I have a deviated septum?",
    deviatedAnswer:
      "Yes! While it can't correct a deviated septum, Stripy helps increase airflow and makes breathing easier for people with mild to moderate nasal obstruction.",
    howWork: "How do nasal strips work?",
    howWorkAnswer: "Nasal strips gently lift and open the nasal passages, allowing for greater airflow.",
    notDelivered: "What if my order isn't delivered?",
    notDeliveredAnswer:
      "If your order doesn't arrive on time, our support team is here to help. Just contact us, and we'll personally track your shipment, update you on its status, or arrange a quick reshipment if needed. We're always here for you!",
    whatStripyDoes: "What Stripy Does for You?",

    // Investor Dashboard
    investorDashboard: "Investor Dashboard",
    investmentOverview: "Investment overview and business performance",
    initialInvestment: "Initial Investment",
    investedOn: "Invested on",
    ownershipPercentage: "Ownership Percentage",
    ofTotalBusinessEquity: "Of total business equity",
    totalReturn: "Total Return",
    roi: "ROI",
    returnPerOrder: "Return Per Order",
    averagePerCompletedOrder: "Average per completed order",
    businessPerformance: "Business Performance",
    businessMetricsDescription: "Overall business metrics and performance indicators",
    totalRevenue: "Total Revenue",
    affiliatePayouts: "Affiliate Payouts",
    businessProfitBreakdown: "Business Profit Breakdown",
    grossRevenue: "Gross Revenue",
    affiliateCosts: "Affiliate Costs",
    netProfit: "Net Profit",
    yourShare: "Your Share",
    orderHistory: "Order History",
    orderHistoryDescription: "Detailed view of all orders and your returns",
    yourReturn: "Your Return",

    // Business Overview Dashboard
    businessOverview: "Business Overview",
    completeBusinessPerformance: "Complete business performance and financial metrics",
    grossProfit: "Gross Profit",
    afterAffiliatePayouts: "After affiliate payouts",
    companyProfit: "Company Profit",
    afterInvestorPayouts: "After investor payouts",
    financialBreakdown: "Financial Breakdown",
    financialMetricsDescription: "Detailed financial metrics and distribution",
    operatingCosts: "Operating Costs",
    investorEarnings: "Investor Earnings",
    profitDistribution: "Profit Distribution",
    ofRevenue: "of revenue",
    ofNetProfit: "of net profit",
    affiliatePerformance: "Affiliate Performance",
    affiliatePerformanceDescription: "Earnings by affiliate/creator",
    commission: "Commission",
    earnings: "Earnings",
    businessMetrics: "Business Metrics",
    businessMetricsAndHealth: "Key performance indicators and business health",
    profitMargin: "Profit Margin",
    averageOrderValue: "Average Order Value",

    // Add these new translation keys to both English and Serbian resources
    edit: "Edit",
    editInvestorData: "Edit Investor Data",
    updateInvestorDataDescription: "Update the investor information and metrics",
    investorName: "Investor Name",
    investmentDate: "Investment Date",
    percentageOfBusinessOwned: "Percentage of business owned",
    returnPerOrderPercentage: "Return Per Order",
    percentageReturnPerOrder: "Percentage return per order (0-1)",
    saveChanges: "Save Changes",
    from: "From",
    orders: "orders",
    afterOperatingCosts: "After operating costs",
    editBusinessMetrics: "Edit Business Metrics",
    updateBusinessMetricsDescription: "Update the business metrics and financial data",
    monthlyOperatingCosts: "Monthly Operating Costs",
    investorPercentage: "Investor Percentage",
    percentageToInvestors: "Percentage that goes to investors",
    affiliatePercentage: "Affiliate Percentage",
    averagePercentageToAffiliates: "Average percentage to affiliates",
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
    heroTitle: "Diši bolje. Živi punim plućima.",
    heroSubtitle:
      "Stripy nosne trake otvaraju tvoje nazalne kanale za bolje disanje, smanjeno hrkanje i bolji kvalitet sna.",
    orderNow: "Poručite odmah",
    ourProducts: "Naši proizvodi",
    whyUseStripy: "Šta Stripy radi za tebe?",
    betterSleep: "Poboljšava san",
    betterSleepDesc: "Brže zaspite i uživajte u dubljem, kvalitetnijem snu tokom cele noći.",
    reducedSnoring: "Smanjuje hrkanje",
    reducedSnoringDesc:
      "Otvoreni disajni putevi ublažavaju vibracije koje uzrokuju hrkanje, za tvoj i mir tvog partnera.",
    easierBreathing: "Otvara disajne puteve",
    easierBreathingDesc: "Više kiseonika, više izdržljivosti, više energije.",
    athleticPerformance: "Poboljšava sportski performans",
    athleticPerformanceDesc: "Za bolje treninge, oštriji fokus i brži oporavak.",
    faq: "Često postavljana pitanja",

    // Science of Breathing Section
    scienceOfBreathingTitle: "Nauka disanja, umetnost performansa",
    trainBodyMind: "Treniraš svoje telo. Treniraš svoj um. Ali šta je sa tvojim dahom?",
    topPerformers:
      "Od NBA igrača do UFC boraca, biohakera do poslovnih lidera – najbolji na svetu znaju da bolje disanje znači bolji učinak u svemu.",
    takeControl: "Vreme je da preuzmeš kontrolu. Da ovladaš svojim dahom. Da dišeš onako kako je prirodno.",
    joinMovement: "Pridruži se Stripy pokretu.",
    everyBreathChoice: "Jer svaki dah je izbor.",
    chooseToWin: "A sa Stripyjem, biraš pobedu.",

    // What Stripy Does Section
    whatStripyDoesTitle: "Šta Stripy radi za tebe:",
    opensAirways: "Otvara disajne puteve",
    opensAirwaysDesc: "Više kiseonika, više izdržljivosti, više energije.",
    reducesSnoring: "Smanjuje hrkanje",
    reducesSnoringSleepDesc:
      "Otvoreni disajni putevi ublažavaju vibracije koje uzrokuju hrkanje, za tvoj i mir tvog partnera.",
    maximizesOxygen: "Poboljšava sportski performans",
    maximizesOxygenDesc: "Za bolje treninge, oštriji fokus i brži oporavak.",
    nonInvasive: "Neinvazivno i bez lekova",
    nonInvasiveDesc: "Samo čista moć disanja, kad god ti zatreba.",

    // Product Descriptions
    testPackName: "Test pakovanje (10 traka)",
    testPackDesc: "Nisi siguran? Isprobaj. Oseti razliku već nakon prvog daha.",
    monthlyPackName: "Mesečno pakovanje (30 traka)",
    monthlyPackDesc:
      "Tvoj dnevni upgrade za nezaustavljivu energiju, bolji san i vrhunske performanse. Jedan mesec, doživotno bolje disanje.",
    himHerPackName: "Him & Her pakovanje (60 traka)",
    himHerPackDesc: "Jer su mirne noći i moćni dani bolji kada su u dvoje. Dišite bolje, zajedno.",

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
    mostPopular: "Naša preporuka",
    ourRecommendation: "Naša preporuka",
    aboutStripyNew: "Pridruži se Stripy pokretu. Jer svaki dah je izbor, a sa Stripy-jem, biraš pobedu.",
    freeShipping: "Da li je dostava besplatna za svaku porudžbinu?",
    freeShippingAnswer:
      "Da! Dostava je 100% besplatna kada naručiš Pakovanje za Nju i Njega - 60 trakica. Za preostale dve opcije, obezbedili smo što nižu cenu dostave kako bismo tvoje iskustvo učinili pristupačnim.",
    safeForDailyUse: "Da li su Stripy nosne trakice bezbedne za svakodnevnu upotrebu?",
    safeForDailyUseAnswer:
      "Da! Stripy neinvazivan i potpuno bezbedan za svakodnevnu upotrebu. Bilo da ih koristiš za spavanje, trening ili poboljšanje disanja tokom dana, možeš ih nositi koliko god želiš.",
    stayInPlace: "Da li će nosne trakice ostati na mestu tokom cele noći ili intenzivnog treninga?",
    stayInPlaceAnswer:
      "Da! Stripy je napravljen sa jakim, koži prijatnim lepljivim slojem koji osigurava da trakica ostane na mestu bilo da čvrsto spavaš ili obaraš rekorde u teretani.",
    deviated: "Mogu li koristiti nosne trakice ako imam devijaciju septuma?",
    deviatedAnswer:
      "Da! Iako ne može ispraviti devijaciju septuma, Stripy pomaže u povećanju protoka vazduha i olakšava disanje osobama sa blagom do umerenom opstrukcijom nosa.",
    howWork: "Kako funkcionišu nosne trakice?",
    howWorkAnswer: "Nosne trakice nežno podižu i otvaraju nosne kanale i omogućavajući veći protok vazduha.",
    notDelivered: "Šta ako moja porudžbina ne bude isporučena?",
    notDeliveredAnswer:
      "Ako tvoja porudžbina ne stigne na vreme, naš tim za podršku je tu da pomogne. Samo nas kontaktiraj, i lično ćemo pratiti tvoju pošiljku, obavestiti te o statusu ili organizovati brzu ponovnu isporuku ako je potrebno. Uvek smo uz tebe!",

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

    // Payment related
    paymentMethod: "Način plaćanja",
    pouzecem: "Pouzećem",
    inPerson: "Lično preuzimanje",
    selectPaymentMethod: "Izaberite način plaćanja",

    // Investor Dashboard
    investorDashboard: "Investitorski Panel",
    investmentOverview: "Pregled investicije i poslovni učinak",
    initialInvestment: "Početna Investicija",
    investedOn: "Investirano",
    ownershipPercentage: "Procenat Vlasništva",
    ofTotalBusinessEquity: "Od ukupnog kapitala firme",
    totalReturn: "Ukupan Povrat",
    roi: "ROI",
    returnPerOrder: "Povrat Po Porudžbini",
    averagePerCompletedOrder: "Prosek po završenoj porudžbini",
    businessPerformance: "Poslovni Učinak",
    businessMetricsDescription: "Opšti poslovni pokazatelji i indikatori učinka",
    totalRevenue: "Ukupan Prihod",
    affiliatePayouts: "Isplate Saradnicima",
    businessProfitBreakdown: "Pregled Poslovnog Profita",
    grossRevenue: "Bruto Prihod",
    affiliateCosts: "Troškovi Saradnika",
    netProfit: "Neto Profit",
    yourShare: "Vaš Udeo",
    orderHistory: "Istorija Porudžbina",
    orderHistoryDescription: "Detaljan pregled svih porudžbina i vaših povrata",
    yourReturn: "Vaš Povrat",

    // Business Overview Dashboard
    businessOverview: "Poslovni Pregled",
    completeBusinessPerformance: "Kompletan poslovni učinak i finansijski pokazatelji",
    grossProfit: "Bruto Profit",
    afterAffiliatePayouts: "Nakon isplata saradnicima",
    companyProfit: "Profit Kompanije",
    afterInvestorPayouts: "Nakon isplata investitorima",
    financialBreakdown: "Finansijski Pregled",
    financialMetricsDescription: "Detaljni finansijski pokazatelji i distribucija",
    operatingCosts: "Operativni Troškovi",
    investorEarnings: "Zarada Investitora",
    profitDistribution: "Distribucija Profita",
    ofRevenue: "od prihoda",
    ofNetProfit: "od neto profita",
    affiliatePerformance: "Učinak Saradnika",
    affiliatePerformanceDescription: "Zarada po saradniku/kreatoru",
    commission: "Provizija",
    earnings: "Zarada",
    businessMetrics: "Poslovni Pokazatelji",
    businessMetricsAndHealth: "Ključni indikatori učinka i zdravlje poslovanja",
    profitMargin: "Profitna Marža",
    averageOrderValue: "Prosečna Vrednost Porudžbine",
    whatStripyDoes: "Šta Stripy radi za tebe?",

    // Add these new translation keys to both English and Serbian resources
    edit: "Izmeni",
    editInvestorData: "Izmeni Podatke Investitora",
    updateInvestorDataDescription: "Ažurirajte informacije i metrike investitora",
    investorName: "Ime Investitora",
    investmentDate: "Datum Investicije",
    percentageOfBusinessOwned: "Procenat vlasništva u firmi",
    returnPerOrderPercentage: "Povrat Po Porudžbini",
    percentageReturnPerOrder: "Procenat povrata po porudžbini (0-1)",
    saveChanges: "Sačuvaj Promene",
    from: "Od",
    orders: "porudžbina",
    afterOperatingCosts: "Nakon operativnih troškova",
    editBusinessMetrics: "Izmeni Poslovne Metrike",
    updateBusinessMetricsDescription: "Ažurirajte poslovne metrike i finansijske podatke",
    monthlyOperatingCosts: "Mesečni Operativni Troškovi",
    investorPercentage: "Procenat Investitora",
    percentageToInvestors: "Procenat koji ide investitorima",
    affiliatePercentage: "Procenat Saradnika",
    averagePercentageToAffiliates: "Prosečan procenat za saradnike",
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

