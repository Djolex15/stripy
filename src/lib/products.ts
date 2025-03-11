import type { Product } from "./types"

export const products: Product[] = [
  {
    id: "test-pack",
    nameEn: "Test Pack (10 Strips)",
    nameSr: "Test pakovanje (10 traka)",
    descriptionEn: "Not sure yet? Try it. Feel the difference. One breath is all it takes.",
    descriptionSr: "Nisi siguran? Isprobaj. Oseti razliku već nakon prvog daha.",
    price: 3.9,
    priceSr: 459,
    image: "/hero-sr.png",
  },
  {
    id: "daily-pack",
    nameEn: "Monthly Pack (30 Strips)",
    nameSr: "Mesečno pakovanje (30 traka)",
    descriptionEn: "Your daily upgrade for unstoppable energy, better sleep, and peak performance. One month. A lifetime of better breathing.",
    descriptionSr: "Tvoj dnevni upgrade za nezaustavljivu energiju, bolji san i vrhunske performanse. Jedan mesec, doživotno bolje disanje.",
    price: 10.99,
    priceSr: 1299,
    image: "/hero-sr.png",
  },
  {
    id: "family-pack",
    nameEn: "His & Hers Pack (60 Strips)",
    nameSr: "Pakovanje za Nju & Njega (60 traka)",
    descriptionEn: "Because great nights and powerful days shouldn't be a solo mission. Breathe better. Together.",
    descriptionSr: "Jer su mirne noći i moćni dani bolji kada su u dvoje. Dišite bolje, zajedno.",
    price: 20.99,
    priceSr: 2499,
    image: "/hero-sr.png",
  },
]
