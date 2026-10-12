/** Featured dishes from the rebuild guide (Part 3), with its typo fixes applied. `homeDishes` = the 10 on the homepage; */
export interface FeaturedDish {
  name: string;
  description: string;
}

export const homeDishes: FeaturedDish[] = [
  { name: "Steak & Lobster", description: "12 oz ribeye paired with 6 oz lobster cooked with garlic butter." },
  { name: "Revolution", description: "Steak burger with pineapple, bacon, caramelized onions and cheese, served with fries." },
  { name: "La Costa Bowl", description: "Boiled seafood, crab legs, shrimp, crawfish, potatoes and corn." },
  { name: "Pulpo Zarandeado", description: "Octopus cooked on a charcoal grill, marinated in our traditional zarandeado sauce, with white rice and salad." },
  { name: "Steak a la Mexicana", description: "T-bone steak topped with peppers, onions, tomato and shrimp, served with rice, beans, tortillas and salad." },
  { name: "Salmón Mango", description: "8 oz salmon cooked on a charcoal grill, marinated in our special mango sauce, served on a bed of spinach and avocado with mango pico and rice." },
  { name: "Tostada de Ceviche", description: "Our traditional tostada, served with octopus, shrimp or a mix of both, for demanding palates." },
  { name: "Camarones Zarandeados", description: "Shrimp marinated in our traditional zarandeado sauce, cooked on a charcoal grill." },
  { name: "Empanada de Ribeye", description: "3 mini empanadas stuffed with mozzarella cheese and picadillo ribeye." },
  { name: "Burrito Michoacano", description: "Stuffed with carnitas and rice, topped with cheese dip, pico de gallo and chorizo." },
];

/** Home "Featured dishes" cards. Swap `src`/`alt` when the dedicated dish photos arrive. */
export interface DishCard extends FeaturedDish {
  src: string;
  alt: string;
  focus?: string;
}

export const dishCardsLarge: DishCard[] = [
  { name: "Steak & Lobster", description: "12 oz ribeye paired with 6 oz lobster cooked with garlic butter.", src: "/images/ofallon/surf-and-turf-wine.webp", alt: "Steak and shrimp with asparagus and a glass of red wine", focus: "50% 70%" },
  { name: "La Costa Bowl", description: "Boiled seafood, crab legs, shrimp, crawfish, potatoes and corn.", src: "/images/dcop/crab-boil-pan.webp", alt: "A hand lifting a crab leg from a pan of boiled seafood with mussels and crawfish", focus: "50% 45%" },
];

export const dishCardsMedium: DishCard[] = [
  { name: "Pulpo Zarandeado", description: "Octopus cooked on a charcoal grill, marinated in our traditional zarandeado sauce.", src: "/images/ofallon/seafood-molcajete.webp", alt: "A molcajete of seafood with crab legs beside carne asada" },
  { name: "Tostada de Ceviche", description: "Our traditional tostada with octopus, shrimp or a mix of both.", src: "/images/ofallon/shrimp-ceviche.webp", alt: "Shrimp ceviche arranged around an avocado rose" },
  { name: "Steak a la Mexicana", description: "T-bone topped with peppers, onions, tomato and shrimp.", src: "/images/ofallon/steak-shrimp-board.webp", alt: "Steak with bacon-wrapped shrimp, asparagus and a baked potato" },
];

/** Names of the remaining home dishes, listed under the cards. */
export const dishesMore = homeDishes
  .map((d) => d.name)
  .filter((n) => ![...dishCardsLarge, ...dishCardsMedium].some((c) => c.name === n));

export const tequilaShelf = [
  "Herradura Supremo", "Gran Patrón", "Don 1942", "Don Julio Primavera", "Clase Azul", "Clase Azul Gold", "1800", "1800 Milenio", "Don Julio 70",
  "Don Julio Añejo", "Corralejo", "Maestro Dobel", "Avión Extra Añejo", "José Cuervo", "Centenario", "Casamigos", "Herradura Ultra", "Patrón",
];

/** Most recognised brands from the shelf, shown as white logos in the home marquee. */
export const tequilaBrands = [
  { name: "Patrón", src: "/images/tequila/patron.webp", width: 398, height: 240 },
  { name: "Don Julio", src: "/images/tequila/don-julio.webp", width: 355, height: 240 },
  { name: "Clase Azul", src: "/images/tequila/clase-azul.webp", width: 332, height: 164 },
  { name: "Casamigos", src: "/images/tequila/casamigos.webp", width: 264, height: 240 },
  { name: "1800", src: "/images/tequila/1800.webp", width: 413, height: 240 },
  { name: "Herradura", src: "/images/tequila/herradura.webp", width: 288, height: 201 },
  { name: "Maestro Dobel", src: "/images/tequila/maestro-dobel.webp", width: 600, height: 217 },
  { name: "Avión", src: "/images/tequila/avion.webp", width: 311, height: 240 },
  { name: "José Cuervo", src: "/images/tequila/jose-cuervo.webp", width: 562, height: 240 },
];
