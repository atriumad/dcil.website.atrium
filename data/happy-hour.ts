/** Happy hour, from the two printed cards in the rebuild guide (Part 4). Mon-Thu, all day. Prices in dollars. */
export interface HhRow {
  name: string;
  /** Dollars, shown as $x.xx; text (e.g. "$2 off") goes in `priceText`. */
  price?: number;
  priceText?: string;
  note?: string;
}

export interface HhDay {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday";
  theme: string;
  /** Daily food special. Thursday has none on the printed card. */
  food: HhRow[];
  drinks: HhRow[];
}

export const happyHour = {
  availability: "Monday – Thursday, all day",
  // Same every day. The card says "Ask for draft available.." — worded as "Ask about available drafts".
  always: {
    appetizers: [
      { name: "6 Wings", price: 8 },
      { name: "6 Oysters", price: 10 },
      { name: "Empanada", price: 12 },
      { name: "Don Chuy's Dip", price: 7 },
      { name: "Guacamole", price: 5 },
    ] satisfies HhRow[],
    drinks: [
      { name: "Draft Beer 16 oz", price: 4, note: "Ask about available drafts" },
      { name: "House Margarita 16 oz", price: 6, note: "Rocks and frozen" },
      { name: "Wells: tequila, vodka, whiskey", price: 4.5 },
    ] satisfies HhRow[],
  },
  days: [
    {
      day: "Monday",
      theme: "Margaritas & Martini Monday",
      food: [{ name: "Carnitas", price: 14 }],
      drinks: [
        { name: "Skinny Margarita", price: 13 },
        { name: "Frozen Flight Margarita (4)", price: 17 },
        { name: "French Martini", price: 11 },
        { name: "Chocolate Martini", price: 11 },
        { name: "Ex-Boyfriend Martini", price: 11 },
      ],
    },
    {
      day: "Tuesday",
      theme: "Tacos & Margarita Tuesday",
      // TODO(client): the card lists no margarita deal for Tuesday — confirm before launch.
      food: [
        { name: "ACP", price: 13.5 },
        { name: "ACP Tex", price: 14.5 },
        { name: "2 Street Tacos, rice or beans", price: 9.5, note: "Pick steak, carnitas or pastor" },
        { name: "3 Tacos, hard or soft", price: 7.5, note: "Chicken or ground beef" },
        { name: "2 Quesabirria, rice and consomé", price: 12 },
      ],
      drinks: [],
    },
    {
      day: "Wednesday",
      theme: "Whiskey & Mezcal Wednesday",
      food: [
        { name: "Nachos de Lux", price: 13 },
        { name: "Enchiladas Verdes", price: 14 },
      ],
      drinks: [
        { name: "Old Fashioned, Woodford", price: 15 },
        { name: "Don Blueberry, Buchanan's", price: 13 },
        { name: "Jack and Coke, Jack Daniel's", price: 8 },
        { name: "Rockefeller", priceText: "$2 off" },
        { name: "Mezcalita, 400 Conejos", price: 11 },
        { name: "Tamarindo Mezcal, 400 Conejos", price: 11 },
      ],
    },
    {
      day: "Thursday",
      theme: "Social Thursday: Ladies Night",
      food: [],
      drinks: [
        { name: "Margarita Flight", price: 16, note: "Pick 4 flavors" },
        { name: "Martini", price: 13 },
        { name: "Mojitos", price: 8 },
        { name: "Wine Glass", price: 6 },
      ],
    },
  ] satisfies HhDay[],
};

export const formatHhPrice = (row: HhRow) => row.priceText ?? (row.price != null ? `$${Number.isInteger(row.price) ? row.price : row.price.toFixed(2)}` : "");

/** The headline deals shown in the rose promo block. */
export const promoDeals = [
  { name: "House Margarita 16 oz", price: "$6", icon: "margarita" as const },
  { name: "Draft Beer 16 oz", price: "$4", icon: "beer" as const },
];
