export const siteContent = {
  hero: {
    headline: "Real Mexican Flavor, Fresh Off the Grill",
    subheadline:
      "Family recipes from León, Mexico. Smoky Josper-grilled favorites. A warm welcome every time you walk in.",
    primaryCta: "Order Online",
    secondaryCta: "View Menu",
  },
  about: {
    body:
      "It started in León, Mexico, with recipes passed down through our family — the same way for generations. Today, Don Chuy's brings that tradition to Kansas City, Lee's Summit, and Johnson City, with fresh ingredients, bold flavors, and the smoky char of our Josper grill in every dish. Come as guests. Leave as family.",
  },
  taglines: [
    "Fresh Mex. Real Flavor. Familia First.",
    "Grilled to Perfection, Served with Cariño.",
    "Three (soon four) locations. One unforgettable experience.",
  ],
  dailySpecials: {
    title: "Daily Specials",
    subtitle: "Every day a special — all day",
    specials: [
      { day: "Monday", item: "Carnitas", price: "$10" },
      { day: "Tuesday", item: "3 Tacos for", price: "$5.75", note: "Ground beef & shredded chicken" },
      { day: "Wednesday", item: "Regular ACP", price: "$13.50" },
      { day: "Thursday", item: "Combos 1 to 4 for", price: "$13" },
    ],
    drinks: [
      { name: "House Margarita 16oz", price: "$5.75", icon: "margarita" as const },
      { name: "Draft Beer 16oz", price: "$4", icon: "beer" as const },
    ],
  },
  seoDefaults: {
    titleTemplate: "%s | Don Chuy's Fresh Mex & Cantina",
    homeTitle: "Don Chuy's Fresh Mex & Cantina | Authentic Mexican Restaurant in Kansas City & Beyond",
    homeDescription:
      "Family-owned Mexican restaurant serving Josper-grilled, authentic dishes in Overland Park KS, Lee's Summit MO, and Johnson City TN.",
  },
} as const;
