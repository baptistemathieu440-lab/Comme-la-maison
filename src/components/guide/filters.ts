import { themeBySlug } from "@/content/guide/themes";

import type { PlaceSummary } from "@/lib/guide/summary";
import {
  audienceFilterKeys,
  budgetKeys,
  isKey,
  kindKeys,
  matchesWeather,
  zoneKeys,
  type Audience,
  type Budget,
  type Kind,
  type Weather,
  type Zone,
} from "@/lib/guide/taxonomy";

/** Filtres de l'explorateur, lus et écrits dans l'adresse de la page (partageable). */
export type Filters = {
  q: string;
  rubrique: string | null;
  budget: Budget[];
  type: Kind[];
  pour: Audience[];
  distance: Zone[];
  meteo: Weather | null;
};

export const emptyFilters: Filters = { q: "", rubrique: null, budget: [], type: [], pour: [], distance: [], meteo: null };

function list(params: URLSearchParams, name: string) {
  return (params.get(name) ?? "").split(",").filter(Boolean);
}

export function parseFilters(params: URLSearchParams): Filters {
  const rubrique = params.get("rubrique");
  const meteo = params.get("meteo");
  return {
    q: (params.get("q") ?? "").slice(0, 80),
    rubrique: rubrique && themeBySlug(rubrique) ? rubrique : null,
    budget: list(params, "budget")
      .map(Number)
      .filter((value): value is Budget => (budgetKeys as readonly number[]).includes(value)),
    type: list(params, "type").filter((value): value is Kind => isKey(kindKeys, value)),
    pour: list(params, "pour").filter((value): value is Audience => isKey(audienceFilterKeys, value)),
    distance: list(params, "distance").filter((value): value is Zone => isKey(zoneKeys, value)),
    meteo: meteo === "pluie" || meteo === "soleil" ? meteo : null,
  };
}

export function serializeFilters(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (filters.rubrique) params.set("rubrique", filters.rubrique);
  if (filters.budget.length) params.set("budget", filters.budget.join(","));
  if (filters.type.length) params.set("type", filters.type.join(","));
  if (filters.pour.length) params.set("pour", filters.pour.join(","));
  if (filters.distance.length) params.set("distance", filters.distance.join(","));
  if (filters.meteo) params.set("meteo", filters.meteo);
  return params.toString();
}

export function countActive(filters: Filters) {
  return filters.budget.length + filters.type.length + filters.pour.length + filters.distance.length + (filters.meteo ? 1 : 0);
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function applyFilters(places: PlaceSummary[], filters: Filters) {
  const theme = filters.rubrique ? themeBySlug(filters.rubrique) : null;
  const words = normalize(filters.q).split(/\s+/).filter(Boolean);
  return places.filter((place) => {
    if (theme && !theme.match(place)) return false;
    if (filters.budget.length && !filters.budget.includes(place.budget)) return false;
    if (filters.type.length && !filters.type.includes(place.kind)) return false;
    if (filters.pour.length && !filters.pour.some((audience) => place.audiences.includes(audience))) return false;
    if (filters.distance.length && !filters.distance.includes(place.zone)) return false;
    if (filters.meteo && !matchesWeather(place.setting, filters.meteo)) return false;
    if (words.length) {
      const haystack = normalize(`${place.name} ${place.area} ${place.subcategory ?? ""} ${place.teaser}`);
      if (!words.every((word) => haystack.includes(word))) return false;
    }
    return true;
  });
}
