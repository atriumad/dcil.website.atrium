/** Cocktail menu, from the printed 2-sided card in the rebuild guide (Part 4), with the guide's typo fixes applied. */
export interface DrinkRow {
  name: string;
  /** Dollars. Left out when the card prints none (Con Clase, 1942, Cantarito, Cazuelitas, beer, wine). */
  price?: number;
  description?: string;
}

export interface DrinkList {
  title?: string;
  names: string[];
}

export interface DrinkGroup {
  slug: string;
  name: string;
  subhead?: string;
  intro?: string;
  rows?: DrinkRow[];
  lists?: DrinkList[];
  note?: string;
  callout?: string;
}

export const drinkGroups: DrinkGroup[] = [
  {
    slug: "signature-margaritas",
    name: "Signature Margaritas",
    subhead: "Margaritas made the way they were meant to be: from scratch!",
    intro: "Treat yourself to a taste of our handmade signature margaritas made right from scratch with fresh ingredients!",
    rows: [
      { name: "Perfecta", price: 16, description: "Tequila Don Julio Blanco, Grand Marnier, organic agave nectar, citrus juice and rocks." },
      { name: "Pineapple", price: 16, description: "1800 coconut tequila, Malibu, pineapple juice, agave nectar and fresh lime." },
      { name: "La Fresa", price: 16, description: "Strawberry syrup made from scratch, Tequila Espolón Silver, organic agave nectar, fresh orange and lime juice." },
      { name: "Legendaria", price: 16, description: "Tequila Don Julio Añejo, Grand Marnier, citrus juice and rocks." },
      { name: "Con Clase", description: "Tequila Clase Azul, agave nectar, lime, orange and Grand Marnier." },
      { name: "1942", description: "1942 Tequila, agave nectar, lime, orange and orange liqueur." },
      { name: "Jalapeño Margarita", price: 16, description: "Tequila Espolón Silver, organic agave nectar, fresh jalapeño, citrus juice and rocks." },
      { name: "Flaquita Margarita", price: 16, description: "(Skinny Margarita) Tequila Espolón Silver, organic agave nectar, fresh orange and lime juice." },
      { name: "Cucumber Mint", price: 16, description: "Tequila Jimador, orange liqueur, lime, orange, agave nectar, cucumber and mint." },
      { name: "Blueberry", price: 16, description: "Blueberry syrup made from scratch, Tequila Hornitos Blanco, triple sec, agave nectar and lime juice." },
      { name: "Coconut Margarita", price: 16, description: "Tequila Espolón, orange liqueur, crema de coco, pineapple, lime." },
      { name: "Jamaica Margarita", price: 16, description: "Tequila Jimador, fresh lime, jamaica (hibiscus) syrup, Tajín rim." },
    ],
  },
  {
    slug: "house-margaritas",
    name: "House Margaritas 16 oz",
    subhead: "$7.75",
    intro: "Crafted with passion and precision, our margaritas are the perfect blend of refreshing flavors and vibrant spirits.",
    rows: [
      { name: "Strong Texas", price: 14, description: "Tequila and Grand Marnier." },
      { name: "Razz", price: 9.99, description: "Tequila and raspberry." },
      { name: "Tropical Sunrise", price: 9.99, description: "Tequila, melon liqueur, pineapple juice, sweet and sour and a splash of grenadine." },
      { name: "Italian", price: 9.99, description: "Tequila and amaretto." },
      { name: "Midnight", price: 9.99, description: "Tequila and Blue Curaçao." },
      { name: "Add flavor", price: 1, description: "Mango, strawberry, peach." },
    ],
  },
  {
    slug: "flight-margaritas",
    name: "Flight Margaritas",
    subhead: "Come fly with us!",
    intro: "Our Flight Margarita experience offers a fun and interactive way to engage with the flavors and nuances of our different margarita styles.",
    rows: [
      { name: "4 Margaritas", price: 19 },
      { name: "6 Margaritas", price: 28 },
    ],
    note: "Flavors available: mango, strawberry, passion fruit, tamarind, lime, blackberry. Frozen only.",
  },
  {
    slug: "tequila",
    name: "Tequila",
    rows: [
      { name: "Perloma", price: 14, description: "Jimador tequila, mezcal, lime and grapefruit juice, sea salt and Squirt." },
      { name: "Cantarito", description: "Tequila reposado, fresh squeezed lime, orange, salt and Squirt, pineapple juice." },
      { name: "Cazuelitas", description: "Tequila, fresh grapefruit, pineapple, orange and lime juice with Squirt." },
      { name: "Mexican Mule", price: 10, description: "Tequila Espolón, lime bitters and ginger beer." },
      { name: "Tequila Sunrise", price: 8, description: "Tequila, orange juice and grenadine." },
    ],
    lists: [
      {
        title: "Top shelf tequilas",
        names: [
          "Herradura Supremo", "Gran Patrón", "Don 1942", "Don Julio Primavera", "Clase Azul", "Clase Azul Gold", "1800", "1800 Milenio", "Don Julio 70",
          "Don Julio Añejo", "Corralejo", "Maestro Dobel", "Avión Extra Añejo", "José Cuervo", "Centenario", "Casamigos", "Herradura Ultra", "Patrón",
        ],
      },
    ],
  },
  {
    slug: "beer",
    name: "Beer",
    lists: [
      { title: "Imported", names: ["Corona", "Corona Light", "XX Lager", "XX Ambar", "Victoria", "Pacifico", "Modelo Especial", "Negra Modelo"] },
      { title: "Domestic", names: ["Bud Light", "Budweiser", "Michelob Ultra", "Coors Light", "Miller Lite"] },
      { title: "Draft beer 16 and 24 oz", names: ["Bud Light", "Miller Lite", "Michelob Ultra", "XX Ambar", "Modelo Especial"] },
    ],
  },
  {
    slug: "whiskey",
    name: "Whiskey",
    rows: [
      { name: "Whiskey Sour", price: 10, description: "Jim Beam, fresh homemade sour mix, bitters." },
      { name: "Old Fashioned", price: 18, description: "Jack Daniel's, bitters and orange peel." },
      { name: "Dark Ginger", price: 10, description: "Crown Royal, lime, ginger and a splash of Coke." },
      { name: "Black Jack", price: 16, description: "Jack Daniel's, lime, Kahlúa and triple sec." },
      { name: "Jack and Coke", price: 9, description: "Jack Daniel's and Coke." },
      { name: "Don Blueberry", price: 14, description: "Buchanan's, blueberries, Razzmatazz liqueur, agave nectar and fresh lime juice." },
    ],
  },
  {
    slug: "vodka",
    name: "Vodka",
    rows: [
      { name: "Moscow Mule", price: 10 },
      { name: "Strawberry Lemonade", price: 8.5 },
      { name: "Blue Lagoon", price: 8.5 },
      { name: "Sex on the Beach", price: 8.5 },
      { name: "Bloody Mary", price: 8 },
      { name: "Long Island Iced Tea", price: 10 },
    ],
  },
  {
    slug: "gin",
    name: "Gin",
    rows: [
      { name: "Gin Tonic", price: 8, description: "Gin, lime, tonic water." },
      { name: "Gin Fizz", price: 8, description: "Gin, triple sec, lemon and simple syrup." },
      { name: "Cucumber Cooler", price: 10, description: "Gin, fresh cucumber, fresh mint, lime, simple syrup." },
      { name: "Tom Collins", price: 8, description: "Gin, lemon juice, simple syrup and club soda." },
      { name: "Pineapple Passion Fruit Collins", price: 10, description: "Gin, passion fruit nectar, pineapple juice, lime and lemon." },
    ],
  },
  {
    slug: "wine",
    name: "Wine",
    lists: [
      { title: "Red", names: ["Cabernet", "Sangria", "Pinot Noir", "Merlot"] },
      { title: "White", names: ["Chardonnay", "Moscato", "Pinot Grigio"] },
    ],
  },
  {
    slug: "rum",
    name: "Rum",
    rows: [
      { name: "Piña Colada", price: 10.5, description: "Rum piña colada." },
      { name: "Bahama Mama", price: 10.5, description: "Coconut rum, dark rum, orange and pineapple juice and grenadine." },
      { name: "Liquid Marijuana", price: 10.5, description: "Melon liqueur, Blue Curaçao, coconut Malibu, fresh lemon and pineapple juice." },
      { name: "Mai Tai", price: 9, description: "Light and dark rum, amaretto, pineapple and grenadine." },
      { name: "Mojitos", price: 10, description: "Made with club soda, fresh lime and mint. Flavors: strawberry, peach, mango, watermelon." },
      // TODO(client): the card's Hurricane line is cut off ("either passion fruit syrup") — confirm the second ingredient.
      { name: "Hurricane", price: 10, description: "Transport yourself to the streets of New Orleans with this iconic NOLA drink. Rum, lemon juice and passion fruit syrup." },
    ],
  },
  {
    slug: "martinis",
    name: "Martinis",
    rows: [
      { name: "French Martini", price: 12, description: "Vodka, pineapple juice and Razz liqueur." },
      { name: "Lemon Drop Martini", price: 12, description: "Vodka, orange liqueur and lemon juice." },
      { name: "Chocolate Martini", price: 12, description: "Chocolate liqueur, vanilla, vodka and Irish cream." },
      { name: "Passion Fruit Martini", price: 12, description: "Vodka, vanilla and passion fruit." },
      { name: "Hawaiian Breeze Martini", price: 12, description: "Vanilla vodka, coconut, rum, pineapple juice and sweet and sour." },
    ],
  },
  {
    slug: "mezcal",
    name: "Mezcal",
    rows: [
      // TODO(client): "Abelita" is hard to read on the card — confirm spelling (Abuelita?).
      { name: "Abelita", price: 14, description: "Mezcal and pineapple juice." },
      { name: "Smokey Paloma", price: 14, description: "Hornitos tequila, mezcal, fresh lime, sea salt, Squirt." },
      { name: "Mezcal Sour", price: 14, description: "Mezcal and homemade sour mix, bitters." },
      { name: "Island Mango Breeze", price: 14, description: "Mezcal, mango juice, pineapple, fresh lemon and lime." },
      { name: "Jamaical", price: 14, description: "Mezcal and jamaica." },
    ],
    callout: "Similar to tequila, mezcal has Denomination of Origin (DO) status, which means it must be produced in specific regions of Mexico to be labeled as such.",
  },
];

export const formatDrinkPrice = (price: number) => (Number.isInteger(price) ? `$${price}` : `$${price.toFixed(2)}`);
