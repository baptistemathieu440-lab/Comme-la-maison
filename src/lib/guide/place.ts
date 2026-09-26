import {
  audienceKeys,
  bookingKeys,
  isKey,
  kindKeys,
  settingKeys,
  statusKeys,
  tagKeys,
  wineRegionKeys,
  zoneKeys,
  type Audience,
  type Booking,
  type Budget,
  type Kind,
  type Setting,
  type Status,
  type Tag,
  type WineRegion,
  type Zone,
} from "./taxonomy";

/** Une recommandation du guide, telle qu'elle est affichée aux voyageurs. */
export type GuidePlace = {
  slug: string;
  name: string;
  kind: Kind;
  subcategory: string | null;
  wineRegion: WineRegion | null;
  tags: Tag[];
  audiences: Audience[];
  budget: Budget;
  /** Prix vérifié, en clair (« Entrée 20 € adulte »). */
  priceNote: string | null;
  zone: Zone;
  setting: Setting;
  /** Pourquoi on vous le recommande (2 à 4 lignes). */
  summary: string;
  goodToKnow: string | null;
  /** Notre petit conseil. */
  tip: string | null;
  /** Principales choses à voir (excursions). */
  highlights: string | null;
  /** Où manger sur place (excursions). */
  whereToEat: string | null;
  /** Quartier ou commune. */
  area: string;
  /** Temps de trajet depuis le centre de Bordeaux, en clair. */
  travelTime: string | null;
  duration: string | null;
  bestPeriod: string | null;
  transport: string | null;
  carNeeded: boolean | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  hours: string | null;
  booking: Booking;
  websiteUrl: string | null;
  bookingUrl: string | null;
  mapsUrl: string | null;
  rating: number | null;
  ratingCount: number | null;
  ratingSource: string | null;
  photo: { url: string; alt: string; credit: string | null } | null;
  status: Status;
  isFavorite: boolean;
  position: number;
  verifiedOn: string | null;
  sources: string[];
};

/** Données de départ : les champs facultatifs peuvent être omis. */
export type GuidePlaceSeed = Pick<GuidePlace, "slug" | "name" | "kind" | "budget" | "zone" | "setting" | "summary" | "area"> &
  Partial<Omit<GuidePlace, "slug" | "name" | "kind" | "budget" | "zone" | "setting" | "summary" | "area" | "photo">>;

export function fromSeed(seed: GuidePlaceSeed, position: number): GuidePlace {
  return {
    subcategory: null,
    wineRegion: null,
    tags: [],
    audiences: [],
    priceNote: null,
    goodToKnow: null,
    tip: null,
    highlights: null,
    whereToEat: null,
    travelTime: null,
    duration: null,
    bestPeriod: null,
    transport: null,
    carNeeded: null,
    address: null,
    lat: null,
    lng: null,
    hours: null,
    booking: "non",
    websiteUrl: null,
    bookingUrl: null,
    mapsUrl: null,
    rating: null,
    ratingCount: null,
    ratingSource: null,
    photo: null,
    status: "ouvert",
    isFavorite: false,
    verifiedOn: null,
    sources: [],
    ...seed,
    position: seed.position ?? position,
  };
}

/** Ligne de la table guide_places (colonnes lues par le site). */
export type GuidePlaceRow = {
  slug: string;
  name: string;
  kind: string;
  subcategory: string | null;
  wine_region: string | null;
  tags: string[];
  audiences: string[];
  budget: number;
  price_note: string | null;
  zone: string;
  setting: string;
  summary: string;
  good_to_know: string | null;
  tip: string | null;
  highlights: string | null;
  where_to_eat: string | null;
  area: string;
  travel_time: string | null;
  duration: string | null;
  best_period: string | null;
  transport: string | null;
  car_needed: boolean | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  hours: string | null;
  booking: string;
  website_url: string | null;
  booking_url: string | null;
  maps_url: string | null;
  rating: number | null;
  rating_count: number | null;
  rating_source: string | null;
  photo_path: string | null;
  photo_alt: string | null;
  photo_credit: string | null;
  status: string;
  is_favorite: boolean;
  position: number;
  verified_on: string | null;
  sources: string[];
};

export const guidePlaceColumns =
  "slug, name, kind, subcategory, wine_region, tags, audiences, budget, price_note, zone, setting, summary, good_to_know, tip, highlights, where_to_eat, area, travel_time, duration, best_period, transport, car_needed, address, lat, lng, hours, booking, website_url, booking_url, maps_url, rating, rating_count, rating_source, photo_path, photo_alt, photo_credit, status, is_favorite, position, verified_on, sources";

/** Convertit une ligne de la base en recommandation (valeurs inconnues neutralisées). */
export function fromRow(row: GuidePlaceRow, photoUrl: (path: string) => string): GuidePlace | null {
  if (!isKey(kindKeys, row.kind)) return null;
  const num = (value: number | string | null) => (value === null ? null : Number(value));
  return {
    slug: row.slug,
    name: row.name,
    kind: row.kind,
    subcategory: row.subcategory,
    wineRegion: isKey(wineRegionKeys, row.wine_region) ? row.wine_region : null,
    tags: row.tags.filter((tag): tag is Tag => isKey(tagKeys, tag)),
    audiences: row.audiences.filter((a): a is Audience => isKey(audienceKeys, a)),
    budget: (row.budget >= 0 && row.budget <= 4 ? row.budget : 1) as Budget,
    priceNote: row.price_note,
    zone: isKey(zoneKeys, row.zone) ? row.zone : "centre",
    setting: isKey(settingKeys, row.setting) ? row.setting : "mixte",
    summary: row.summary,
    goodToKnow: row.good_to_know,
    tip: row.tip,
    highlights: row.highlights,
    whereToEat: row.where_to_eat,
    area: row.area,
    travelTime: row.travel_time,
    duration: row.duration,
    bestPeriod: row.best_period,
    transport: row.transport,
    carNeeded: row.car_needed,
    address: row.address,
    lat: num(row.lat),
    lng: num(row.lng),
    hours: row.hours,
    booking: isKey(bookingKeys, row.booking) ? row.booking : "non",
    websiteUrl: row.website_url,
    bookingUrl: row.booking_url,
    mapsUrl: row.maps_url,
    rating: num(row.rating),
    ratingCount: row.rating_count,
    ratingSource: row.rating_source,
    photo: row.photo_path
      ? { url: photoUrl(row.photo_path), alt: row.photo_alt?.trim() || row.name, credit: row.photo_credit }
      : null,
    status: isKey(statusKeys, row.status) ? row.status : "ouvert",
    isFavorite: row.is_favorite,
    position: row.position,
    verifiedOn: row.verified_on,
    sources: row.sources,
  };
}

/** Lien Google Maps : celui saisi dans le back-office, sinon une recherche sur le nom et l'adresse. */
export function googleMapsUrl(place: Pick<GuidePlace, "mapsUrl" | "name" | "address" | "area" | "lat" | "lng">) {
  if (place.mapsUrl) return place.mapsUrl;
  const query = place.address ? `${place.name}, ${place.address}` : `${place.name}, ${place.area}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function placeHref(slug: string) {
  return `/guide/adresse/${slug}`;
}

/** Transforme un nom en identifiant d'adresse (« Café du Port » → « cafe-du-port »). */
export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Date la plus récente de vérification (pied de page du guide). */
export function latestVerification(places: Array<Pick<GuidePlace, "verifiedOn">>) {
  return places.reduce<string | null>((latest, place) => {
    if (!place.verifiedOn) return latest;
    return !latest || place.verifiedOn > latest ? place.verifiedOn : latest;
  }, null);
}
