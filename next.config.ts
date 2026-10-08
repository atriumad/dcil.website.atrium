import type { NextConfig } from "next";

// Old Wix URLs from the previous site (rebuild guide, "Sitemap and URLs") -> permanent redirects.
const wixRedirects = [
  { source: "/menu-1", destination: "/menu" },
  { source: "/general-clean", destination: "/locations/overland-park-ks" },
  { source: "/copia-de-overlandpark", destination: "/locations/lees-summit-mo" },
  { source: "/jonhson-city", destination: "/locations/johnson-city-tn" },
  { source: "/o-fallen", destination: "/locations/ofallon-il" },
  { source: "/catering", destination: "/contact?type=catering" },
];

const nextConfig: NextConfig = {
  images: { qualities: [75, 80, 90] },
  async redirects() {
    return wixRedirects.map((r) => ({ ...r, permanent: true }));
  },
};

export default nextConfig;
