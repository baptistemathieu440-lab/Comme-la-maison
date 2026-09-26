/**
 * Guide voyageurs : vocabulaire commun au site public, au back-office et à la base.
 * Les valeurs (clés) sont celles des contraintes de la table guide_places :
 * en ajouter une ici demande aussi une migration.
 */

export const kinds = {
  patrimoine: { label: "Patrimoine", plural: "Patrimoine" },
  culture: { label: "Culture", plural: "Culture & musées" },
  restaurant: { label: "Restaurant", plural: "Restaurants" },
  bar: { label: "Bar", plural: "Bars & apéros" },
  activite: { label: "Activité", plural: "Activités" },
  nature: { label: "Nature", plural: "Nature & plein air" },
  shopping: { label: "Shopping", plural: "Shopping" },
  sortie: { label: "Sortie", plural: "Sorties" },
  excursion: { label: "Excursion", plural: "Excursions" },
} as const;
export type Kind = keyof typeof kinds;
export const kindKeys = Object.keys(kinds) as Kind[];

/** Budget indicatif par personne. Les montants sont revérifiés régulièrement. */
export const budgets = {
  0: { symbol: "Gratuit", label: "Gratuit", detail: "gratuit" },
  1: { symbol: "€", label: "€", detail: "moins de 15 €" },
  2: { symbol: "€€", label: "€€", detail: "15 à 30 €" },
  3: { symbol: "€€€", label: "€€€", detail: "30 à 60 €" },
  4: { symbol: "€€€€", label: "€€€€", detail: "expérience premium" },
} as const;
export type Budget = keyof typeof budgets;
export const budgetKeys = [0, 1, 2, 3, 4] as const satisfies readonly Budget[];

/** Publics : les six premiers servent de filtre, les deux derniers précisent l'ambiance. */
export const audiences = {
  solo: { label: "Solo" },
  couple: { label: "Couple" },
  famille: { label: "Famille" },
  enfants: { label: "Enfants" },
  ados: { label: "Adolescents" },
  amis: { label: "Amis" },
  fetards: { label: "Fêtards" },
  epicuriens: { label: "Épicuriens" },
} as const;
export type Audience = keyof typeof audiences;
export const audienceKeys = Object.keys(audiences) as Audience[];
export const audienceFilterKeys = ["solo", "couple", "famille", "enfants", "ados", "amis"] as const satisfies readonly Audience[];

/** Distance depuis le centre de Bordeaux. */
export const zones = {
  centre: { label: "Bordeaux centre", short: "Centre" },
  metropole: { label: "Bordeaux Métropole", short: "Métropole" },
  "moins-30": { label: "Moins de 30 min", short: "< 30 min" },
  "30-60": { label: "30 à 60 min", short: "30–60 min" },
  "60-120": { label: "1 h à 2 h", short: "1 h–2 h" },
} as const;
export type Zone = keyof typeof zones;
export const zoneKeys = Object.keys(zones) as Zone[];

/** Intérieur / extérieur : sert au filtre météo. */
export const settings = {
  interieur: { label: "En intérieur" },
  exterieur: { label: "En plein air" },
  mixte: { label: "Intérieur et plein air" },
} as const;
export type Setting = keyof typeof settings;
export const settingKeys = Object.keys(settings) as Setting[];

export const weathers = {
  soleil: { label: "Beau temps" },
  pluie: { label: "Quand il pleut" },
} as const;
export type Weather = keyof typeof weathers;

export function matchesWeather(setting: Setting, weather: Weather) {
  return weather === "pluie" ? setting !== "exterieur" : setting !== "interieur";
}

export const bookings = {
  non: { label: "Sans réservation" },
  conseillee: { label: "Réservation conseillée" },
  obligatoire: { label: "Réservation obligatoire" },
} as const;
export type Booking = keyof typeof bookings;
export const bookingKeys = Object.keys(bookings) as Booking[];

export const statuses = {
  ouvert: { label: "Ouvert" },
  saisonnier: { label: "Ouvert en saison" },
  "ferme-temporairement": { label: "Fermé temporairement" },
  ferme: { label: "Fermé définitivement" },
} as const;
export type Status = keyof typeof statuses;
export const statusKeys = Object.keys(statuses) as Status[];

export const wineRegions = {
  bordeaux: { label: "À Bordeaux" },
  "saint-emilion": { label: "Saint-Émilion" },
  medoc: { label: "Médoc" },
  graves: { label: "Graves" },
  "pessac-leognan": { label: "Pessac-Léognan" },
  "entre-deux-mers": { label: "Entre-deux-Mers" },
  "blaye-bourg": { label: "Blaye et Bourg" },
  sauternes: { label: "Sauternes" },
} as const;
export type WineRegion = keyof typeof wineRegions;
export const wineRegionKeys = Object.keys(wineRegions) as WineRegion[];

/** Étiquettes éditoriales : elles alimentent les rubriques du guide. */
export const tags = {
  incontournable: { label: "Incontournable" },
  vin: { label: "Vins de Bordeaux" },
  ocean: { label: "Océan" },
  specialites: { label: "Spécialités bordelaises" },
  marche: { label: "Marché" },
  photo: { label: "Beau pour les photos" },
  typique: { label: "Typiquement bordelais" },
  "coucher-de-soleil": { label: "Coucher de soleil" },
  terrasse: { label: "Terrasse" },
  vue: { label: "Belle vue" },
  insolite: { label: "Insolite" },
  local: { label: "Adresse locale" },
  "selection-famille": { label: "Sélection « En famille »" },
  "selection-couple": { label: "Sélection « En couple »" },
  "selection-amis": { label: "Sélection « Entre amis »" },
} as const;
export type Tag = keyof typeof tags;
export const tagKeys = Object.keys(tags) as Tag[];

export function isKey<T extends string>(keys: readonly T[], value: unknown): value is T {
  return typeof value === "string" && (keys as readonly string[]).includes(value);
}
