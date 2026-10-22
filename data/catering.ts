/** O'Fallon catering menu (client doc). Prices are per person; drinks, desserts and 18% gratuity are extra. */
export interface CateringPackage {
  name: string;
  price: number;
  /** What the bar covers, e.g. "2 tacos per person". */
  serves: string;
  includes: string;
}

export const cateringPackages: CateringPackage[] = [
  { name: "Taco bar", price: 16, serves: "2 tacos per person", includes: "Rice, beans, chips and salsa" },
  { name: "Enchilada bar", price: 16, serves: "2 enchiladas per person", includes: "Rice, beans, chips and salsa" },
  { name: "Burrito bar", price: 16, serves: "2 burritos per person", includes: "Rice, beans, chips and salsa" },
  {
    name: "Fajita bar",
    price: 20,
    serves: "2 proteins: steak and chicken",
    includes: "Rice and beans, lettuce, sour cream, tomato, guacamole, tortillas, pico de gallo",
  },
];

export const cateringTerms = [
  "Available for pick up and dine-in, inside our private spaces.",
  "18% gratuity is added.",
  "Drinks and desserts are not included and are charged separately.",
];
