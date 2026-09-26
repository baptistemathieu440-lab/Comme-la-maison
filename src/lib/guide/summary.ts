import type { GuidePlace } from "./place";

/**
 * Version allégée d'une adresse, envoyée au téléphone pour les listes filtrables,
 * la carte et les favoris (pas de textes longs : la fiche complète est une page).
 */
export type PlaceSummary = Pick<
  GuidePlace,
  | "slug"
  | "name"
  | "kind"
  | "subcategory"
  | "wineRegion"
  | "budget"
  | "audiences"
  | "zone"
  | "setting"
  | "area"
  | "travelTime"
  | "rating"
  | "ratingCount"
  | "ratingSource"
  | "photo"
  | "isFavorite"
  | "tags"
  | "lat"
  | "lng"
  | "status"
> & { teaser: string };

/** Première phrase du texte « Pourquoi on vous le recommande ». */
export function teaser(summary: string, max = 140) {
  const first = summary.split(/(?<=[.!?])\s/)[0] ?? summary;
  return first.length > max ? `${first.slice(0, max - 1).trimEnd()}…` : first;
}

export function toSummary(place: GuidePlace): PlaceSummary {
  return {
    slug: place.slug,
    name: place.name,
    kind: place.kind,
    subcategory: place.subcategory,
    wineRegion: place.wineRegion,
    budget: place.budget,
    audiences: place.audiences,
    zone: place.zone,
    setting: place.setting,
    area: place.area,
    travelTime: place.travelTime,
    rating: place.rating,
    ratingCount: place.ratingCount,
    ratingSource: place.ratingSource,
    photo: place.photo,
    isFavorite: place.isFavorite,
    tags: place.tags,
    lat: place.lat,
    lng: place.lng,
    status: place.status,
    teaser: teaser(place.summary),
  };
}
