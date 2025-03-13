export interface Product {
  id: string
  nameEn: string
  nameSr: string
  descriptionEn: string
  descriptionSr: string
  price: number
  priceSr: number
  image: string
  hoverImage: string
}

export const products: Product[] = [
  {
    id: "test-pack",
    nameEn: "Test Pack - 10 Strips",
    nameSr: "Test pakovanje - 10 trakica",
    descriptionEn: "Not sure yet? Try it. Feel the difference. One breath is all it takes.",
    descriptionSr: "Nisi siguran? Isprobaj. Oseti razliku već nakon prvog daha.",
    price: 3.9,
    priceSr: 459,
    image: "/hero-sr.png",
    hoverImage: "/websitebackground.png",
  },
  {
    id: "daily-pack",
    nameEn: "Monthly Pack - 30 Strips",
    nameSr: "Mesečno pakovanje - 30 traka",
    descriptionEn:
      "Your daily upgrade for unstoppable energy, better sleep, and peak performance. One month. A lifetime of better breathing.",
    descriptionSr: "Tvoj dnevni upgrade za nezaustavljivu energiju, bolji san i vrhunske performanse.",
    price: 10.99,
    priceSr: 1299,
    image: "/hero-sr.png",
    hoverImage: "/websitebackground.png",
  },
  {
    id: "family-pack",
    nameEn: "His & Hers Pack - 60 Strips",
    nameSr: "Pakovanje za Nju i Njega - 60 trakica",
    descriptionEn: "Because great nights and powerful days shouldn't be a solo mission. Breathe better. Together.",
    descriptionSr: "Jer su mirne noći i moćni dani bolji kada su u dvoje.",
    price: 20.99,
    priceSr: 2499,
    image: "/hero-sr.png",
    hoverImage: "/websitebackground.png",
  },
]

