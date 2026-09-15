import type { MenuCategory } from "@/lib/schemas";

const reviewedItem = (name: string, description: string) => ({
  name,
  description,
  price: null,
  tags: [] as MenuCategory["items"][number]["tags"],
  needsCopyReview: false,
});

const pendingItem = (name: string) => ({
  name,
  description: "TODO: write final copy and confirm price with client.",
  price: null,
  tags: [] as MenuCategory["items"][number]["tags"],
  needsCopyReview: true,
});

export const menu: MenuCategory[] = [
  {
    slug: "botanas",
    name: "Botanas / Dips",
    items: [
      pendingItem("Don Chuy's Dip"),
      pendingItem("Cheese Dip"),
      pendingItem("Queso Fundido"),
      pendingItem("Guacamole"),
      pendingItem("Spinach Crab Dip"),
      pendingItem("Calamari"),
      pendingItem("Coconut Shrimp"),
      pendingItem("Empanadas"),
      pendingItem("Oysters Rockefeller"),
    ],
  },
  { slug: "nachos-wings", name: "Nachos / Wings and Fries", items: [pendingItem("Nachos"), pendingItem("Wings and Fries")] },
  {
    slug: "sopas-ensaladas",
    name: "Sopas y Ensaladas",
    items: [
      pendingItem("Chicken Tortilla Soup"),
      pendingItem("7 Mares"),
      pendingItem("Menudo"),
      pendingItem("Caldo de Camarón"),
      pendingItem("Del Sur Salad"),
      pendingItem("Cali Salad"),
      pendingItem("Taco Salad"),
    ],
  },
  { slug: "a-la-carta", name: "A La Carta", items: [pendingItem("Tamales"), pendingItem("Chile Relleno"), pendingItem("Quesadillas Individuales")] },
  { slug: "the-grill", name: "The Grill / Build Your Own / Combinations / Vegetarian", items: [pendingItem("Build Your Own"), pendingItem("Combinations"), pendingItem("Vegetarian Dishes")] },
  {
    slug: "pollo",
    name: "Pollo",
    items: [pendingItem("Choripollo"), pendingItem("Pollo Chipotlecream"), pendingItem("Mole de Pollo"), pendingItem("Famous ACP's (Arroz, Cheese, Protein)")],
  },
  {
    slug: "steak-house",
    name: "Don Chuy's Steak House",
    items: [
      reviewedItem("Steak & Lobster", "A 12 oz. ribeye grilled to order, paired with 6 oz. of butter-garlic lobster."),
      pendingItem("Ribeye"),
      pendingItem("Cowboy Steak"),
      pendingItem("Steak Vallarta"),
      pendingItem("Tomahawk"),
      pendingItem("Steak Tulum"),
    ],
  },
  { slug: "burgers", name: "Burgers", items: [pendingItem("Classic"), pendingItem("Diablo"), pendingItem("Revolution"), pendingItem("Country Burger")] },
  {
    slug: "tacos",
    name: "Tacos",
    items: [
      pendingItem("Los Pinchis Tacos (Street Tacos)"),
      pendingItem("Tacos Ribeye"),
      pendingItem("Tacos Gobernador"),
      pendingItem("Tacos Regios al Carbón"),
      pendingItem("Tacos Los Cabos"),
    ],
  },
  { slug: "tortas-fajitas", name: "Tortas / Fajitas", items: [pendingItem("Tortas"), pendingItem("Fajitas")] },
  {
    slug: "burritos-enchiladas",
    name: "Burritos y Enchiladas",
    items: [
      pendingItem("Burrito Sinaloa"),
      pendingItem("Burrito California"),
      pendingItem("Burrito King"),
      pendingItem("Burrito Michoacano"),
      pendingItem("Enchiladas Poblanas"),
      pendingItem("Enchiladas Verdes"),
      pendingItem("Enchiladas de Camarón"),
      pendingItem("Enchiladas Seafood"),
    ],
  },
  {
    slug: "cevicheria",
    name: "La Cevichería",
    items: [
      pendingItem("Aguachiles"),
      pendingItem("Cocteles"),
      pendingItem("Molcajete del Mar"),
      pendingItem("Seafood Tower"),
      { ...reviewedItem("La Costa Bowl", "Boiled seafood, crab legs, shrimp, crawfish, potatoes, and corn."), tags: ["seafood"] },
      { ...reviewedItem("Pulpo Zarandeado", "Charcoal-grilled octopus marinated in our traditional zarandeado sauce, served with white rice and salad."), tags: ["seafood"] },
    ],
  },
  {
    slug: "pescados-ostras",
    name: "Pescados y Ostras",
    items: [
      pendingItem("Zarandeado"),
      { ...reviewedItem("Salmón Mango", "8 oz. salmon grilled over charcoal and glazed in our house mango sauce, served over spinach, avocado, and mango pico with rice."), tags: ["seafood"] },
      pendingItem("Mahi Mahi"),
      pendingItem("Oysters"),
    ],
  },
  {
    slug: "quesadillas-mas",
    name: "Quesadillas, Chimichangas, Sides",
    items: [pendingItem("Quesadillas"), pendingItem("Chimichangas"), pendingItem("Sides"), pendingItem("Baked Potato Tijuana Style")],
  },
  { slug: "drinks", name: "Drinks", items: [pendingItem("Refrescos")] },
  {
    slug: "desserts",
    name: "Desserts",
    items: [pendingItem("Flan"), pendingItem("Churros"), pendingItem("Tres Leches"), pendingItem("Chocolava Cake")],
  },
  {
    slug: "especiales",
    name: "Platos a la Carta",
    items: [pendingItem("Chiles Rellenos"), pendingItem("Carne Asada"), pendingItem("Arrachera"), pendingItem("Molcajete"), pendingItem("Parrillada")],
  },
  { slug: "kids", name: "Kids Menu", items: [pendingItem("Kids Menu")], },
  { slug: "lunch-specials", name: "Lunch Specials", items: [pendingItem("Lunch Specials")] },
  { slug: "brunch", name: "Eggs / Huevos / Brunch", items: [pendingItem("Build Your Own Brunch"), pendingItem("Breakfast Burrito"), pendingItem("Chilaquiles Supreme")] },
  {
    slug: "tostadas",
    name: "Tostadas",
    items: [
      {
        ...reviewedItem("Tostada de Ceviche", "Our signature tostada, piled high with octopus, shrimp, or a mix of both — for the truly hungry."),
        tags: ["seafood"],
      },
    ],
  },
];
