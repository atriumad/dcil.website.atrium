import type { Location } from "@/lib/schemas";

export function buildLocationJsonLd(location: Location) {
  const [streetAddress, ...rest] = location.address.split(",");

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: `Don Chuy's Fresh Mex & Cantina - ${location.name}`,
    telephone: location.phone,
    servesCuisine: "Mexican",
    address: {
      "@type": "PostalAddress",
      streetAddress: streetAddress?.trim() ?? "",
      addressLocality: rest.join(",").trim(),
    },
    openingHoursSpecification: location.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.time.split(" - ")[0],
      closes: h.time.split(" - ")[1],
    })),
  };
}

export function locationMetaTitle(location: Location) {
  return `Mexican Restaurant in ${location.name} | Don Chuy's Fresh Mex & Cantina`;
}

export function locationMetaDescription(location: Location, signatureDish: string) {
  return `Visit Don Chuy's in ${location.name} for authentic, Josper-grilled Mexican food. Try our ${signatureDish} and order online for pickup.`;
}
