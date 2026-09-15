import type { Location } from "@/lib/schemas";

export const locations: Location[] = [
  {
    slug: "overland-park",
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
    orderUrl: "https://order.chownow.com/order/TODO-OVERLAND-PARK/locations",
    comingSoon: false,
    reviews: [
      {
        author: "Alex Iglesias",
        quote:
          "Don Chuy's in Overland Park is an absolute gem! ... And the food? So tasty and on point..!",
      },
    ],
    intro:
      "Step into our Overland Park location and experience the perfect mix of authentic Mexican recipes and fresh, modern flavors.",
    closing: "Come hungry. Leave happy. We'll save you a seat at our Overland Park location.",
  },
  {
    slug: "lees-summit",
    name: "Lee's Summit, MO",
    address: "701 SE Melody Ln, Lee's Summit, MO 64063",
    phone: "+1 816-434-5222",
    hours: [{ days: "Every day", time: "11:00 AM - 10:00 PM" }],
    orderUrl: "https://order.chownow.com/order/TODO-LEES-SUMMIT/locations",
    comingSoon: false,
    reviews: [
      {
        author: "Joseph Herbaug",
        quote:
          "This place blew me away. ... I've reviewed molcajete at other restaurants and this one has been my favorite so far.",
      },
    ],
    intro:
      "Our Lee's Summit spot brings the same bold, charcoal-grilled flavor with a cozy neighborhood feel all its own.",
    closing: "Come hungry. Leave happy. We'll save you a seat at our Lee's Summit location.",
  },
  {
    slug: "johnson-city",
    name: "Johnson City, TN",
    address: "3101 W Market St #101, Johnson City, TN 37604",
    phone: "+1 423-328-3475",
    hours: [
      { days: "Mon-Thu", time: "11:00 AM - 10:00 PM" },
      { days: "Fri-Sat", time: "11:00 AM - 10:30 PM" },
      { days: "Sun", time: "11:00 AM - 9:30 PM" },
    ],
    orderUrl: "https://order.chownow.com/order/TODO-JOHNSON-CITY/locations",
    comingSoon: false,
    reviews: [
      {
        author: "Makayla Parker",
        quote:
          "This place has quickly become mine and my husbands favorite place. ... Always amazed to see this place not have many customers, they deserve more!",
      },
    ],
    intro:
      "Discover our Johnson City location, where authentic Mexican recipes meet fresh, modern flavors under that colorful mural you won't stop looking at.",
    closing: "Come hungry. Leave happy. We'll be ready when you are.",
  },
  {
    slug: "ofallon",
    name: "O'Fallon, IL",
    address: "",
    phone: "",
    hours: [],
    orderUrl: "",
    comingSoon: true,
    reviews: [],
  },
];
