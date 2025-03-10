import type { Product } from "./types"

export const products: Product[] = [
  {
    id: "test-pack",
    nameEn: "Test Pack (10 strips)",
    nameSr: "Test Pack (10 kom)",
    descriptionEn: "Try our nasal strips with this small pack. Perfect for first-time users.",
    descriptionSr: "Isprobajte naše nazalne trake sa ovim malim paketom. Savršeno za nove korisnike.",
    price: 3.9,
    priceSr: 459,
    image: "/hero-sr.png",
  },
  {
    id: "daily-pack",
    nameEn: "Daily Pack (30 strips)",
    nameSr: "Naša Preporuka (30 kom)",
    descriptionEn: "Our most popular option. A month's supply of premium nasal strips for better sleep.",
    descriptionSr: "Naša najpopularnija opcija. Mesečna zaliha premium nazalnih traka za bolji san.",
    price: 10.99,
    priceSr: 1299,
    image: "/hero-sr.png",
  },
  {
    id: "family-pack",
    nameEn: "Family Pack (60 strips)",
    nameSr: "Porodični Paket (Za Nju i Njega) (60 kom)",
    descriptionEn: "Best value pack for couples or families. Share the benefits of better breathing.",
    descriptionSr: "Najbolja vrednost za parove ili porodice. Podelite prednosti boljeg disanja.",
    price: 20.99,
    priceSr: 2499,
    image: "/hero-sr.png",
  },
]

