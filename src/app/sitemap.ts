import type { MetadataRoute } from "next";

import { site } from "@/content/site";
import { themes } from "@/content/guide/themes";
import { placeHref } from "@/lib/guide/place";
import { getGuidePlaces } from "@/server/guide";
import { listPublicListings } from "@/server/public-listings";

// Régénéré toutes les heures : les logements publiés depuis le back-office y figurent.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await listPublicListings().catch(() => []);
  const guidePlaces = await getGuidePlaces()
    .then((result) => result.places)
    .catch(() => []);
  const pages = [
    { path: "", priority: 1 },
    { path: "/nos-offres", priority: 0.9 },
    { path: "/nos-biens", priority: 0.8 },
    ...listings.map((listing) => ({ path: `/nos-biens/${listing.slug}`, priority: 0.6 })),
    { path: "/a-propos", priority: 0.7 },
    { path: "/contact", priority: 0.8 },
    { path: "/transparence", priority: 0.5 },
    { path: "/guide", priority: 0.8 },
    { path: "/guide/itineraires", priority: 0.7 },
    ...themes.map((theme) => ({ path: `/guide/${theme.slug}`, priority: 0.7 })),
    ...guidePlaces.map((place) => ({ path: placeHref(place.slug), priority: 0.5 })),
    { path: "/mentions-legales", priority: 0.2 },
    { path: "/politique-confidentialite", priority: 0.2 },
  ];
  return pages.map(({ path, priority }) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
