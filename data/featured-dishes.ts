/** Featured dishes from the rebuild guide (Part 3), with its typo fixes applied. `homeDishes` = the 10 on the homepage; `locationDishes` = the 5 shared by the location pages. */
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

export const locationDishes: FeaturedDish[] = [
  { name: "Baked Potato Tijuana Style", description: "Tijuana style: steak, pastor, chorizo and chicken." },
  { name: "Pulpo Zarandeado", description: "Octopus cooked on a charcoal grill, marinated in our traditional zarandeado sauce, with white rice and salad." },
  { name: "La Costa Bowl", description: "Boiled seafood, crab legs, shrimp, crawfish, potatoes and corn." },
  { name: "Arrachera", description: "Skirt steak cooked on a charcoal grill, with grilled onions, mushrooms, a cheese-stuffed pepper and street corn, served with rice and salad." },
  { name: "Rib Eye Tacos", description: "Order of three tacos, served with rice and beans." },
];

export const tequilaShelf = [
  "Herradura Supremo", "Gran Patrón", "Don 1942", "Don Julio Primavera", "Clase Azul", "Clase Azul Gold", "1800", "1800 Milenio", "Don Julio 70",
  "Don Julio Añejo", "Corralejo", "Maestro Dobel", "Avión Extra Añejo", "José Cuervo", "Centenario", "Casamigos", "Herradura Ultra", "Patrón",
];
