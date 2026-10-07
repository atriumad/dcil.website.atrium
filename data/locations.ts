import type { Location } from "@/lib/schemas";

export const locations: Location[] = [
  {
    slug: "overland-park-ks",
    name: "Overland Park, KS",
    address: "8725 Metcalf Ave, Overland Park, KS 66212",
    phone: "+1 816-603-2124",
    // Source audit lists Wed hours inconsistent with the Mon-Thu range —
    // confirm real hours with client before launch (design doc, Out of Scope).
    hours: [
      { days: "Mon-Tue, Thu", time: "11:00 AM - 10:00 PM" },
      { days: "Wed", time: "10:00 AM - 10:30 PM" },
      { days: "Fri-Sun", time: "11:00 AM - 10:30 PM" },
    ],
    // ChowNow is live for Overland Park only; the other locations order by phone (tel: link).
    orderUrl: "https://order.chownow.com/order/42367/locations/64005",
    comingSoon: false,
    reviews: [
      {
        author: "Alex Iglesias",
        quote:
          "Don Chuy's in Overland Park is an absolute gem! From the moment you walk in, the ambiance is excellent, with a vibrant and welcoming atmosphere. The service is truly top-notch; our server's advice was invaluable in navigating the menu, making our experience even better. And the food? So tasty and on point..!",
      },
    ],
    intro:
      "Step into our Overland Park location and experience the perfect mix of authentic Mexican recipes and fresh, modern flavors.",
    closing: "Come hungry. Leave happy. We'll save you a seat at our Overland Park location.",
  },
  {
    slug: "lees-summit-mo",
    name: "Lee's Summit, MO",
    address: "701 SE Melody Ln, Lee's Summit, MO 64063",
    phone: "+1 816-434-5222",
    hours: [{ days: "Every day", time: "11:00 AM - 10:00 PM" }],
    orderUrl: "",
    comingSoon: false,
    reviews: [
      {
        author: "Joseph Herbaug",
        quote:
          "This place blew me away. We stopped in expecting another basic Mexican restaurant, the staff, the atmosphere, the art, and especially the food proved me wrong. I ordered the molcajete, steak, shrimp, chicken, chorizo, beans, cactus leaf, served in a hot bowl with red sauce was absolutely perfect. I've reviewed molcajete at other restaurants and this one has been my favorite so far.",
      },
    ],
    intro:
      "Our Lee's Summit spot brings the same bold, charcoal-grilled flavor with a cozy neighborhood feel all its own.",
    closing: "Come hungry. Leave happy. We'll save you a seat at our Lee's Summit location.",
  },
  {
    slug: "johnson-city-tn",
    name: "Johnson City, TN",
    address: "3101 W Market St #101, Johnson City, TN 37604",
    phone: "+1 423-328-3475",
    hours: [
      { days: "Mon-Thu", time: "11:00 AM - 10:00 PM" },
      { days: "Fri-Sat", time: "11:00 AM - 10:30 PM" },
      { days: "Sun", time: "11:00 AM - 9:30 PM" },
    ],
    orderUrl: "",
    comingSoon: false,
    reviews: [
      {
        author: "Makayla Parker",
        quote:
          "This place has quickly become mine and my husbands favorite place. The cheese and bean dip are awesome and the margaritas are so good and decently cheap! I always get the classic ACP with flour tortillas and am never disappointed. Portions are large and the staff is very kind.",
      },
    ],
    intro:
      "Discover our Johnson City location, where authentic Mexican recipes meet fresh, modern flavors under that colorful mural you won't stop looking at.",
    closing: "Come hungry. Leave happy. We'll be ready when you are.",
  },
  {
    slug: "ofallon-il",
    name: "O'Fallon, IL",
    address: "",
    phone: "",
    hours: [],
    orderUrl: "",
    comingSoon: true,
    reviews: [],
  },
];

/** Phone as a tel: link ("+1 816-603-2124" -> "tel:+18166032124"). */
export const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, "")}`;

/** Where "Order Now" goes: ChowNow when the location has it, otherwise a tap-to-call link. Empty for coming-soon locations. */
export const orderHref = (location: Location) => location.orderUrl || (location.phone ? telHref(location.phone) : "");
