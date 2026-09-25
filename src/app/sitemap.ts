import type { MetadataRoute } from "next";

import { site } from "@/content/site";
import { listPublicListings } from "@/server/public-listings";

// Régénéré toutes les heures : les logements publiés depuis le back-office y figurent.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await listPublicListings().catch(() => []);
  const pages = [
    { path: "", priority: 1 },
    { path: "/nos-offres", priority: 0.9 },
    { path: "/nos-biens", priority: 0.8 },
    ...listings.map((listing) => ({ path: `/nos-biens/${listing.slug}`, priority: 0.6 })),
    { path: "/a-propos", priority: 0.7 },
    { path: "/contact", priority: 0.8 },
    { path: "/transparence", priority: 0.5 },
    { path: "/mentions-legales", priority: 0.2 },
    { path: "/politique-confidentialite", priority: 0.2 },
  ];
  return pages.map(({ path, priority }) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
