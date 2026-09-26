import "server-only";

import { unstable_cache } from "next/cache";

import { seedPlaces } from "@/content/guide/places";
import { fromRow, fromSeed, guidePlaceColumns, type GuidePlace, type GuidePlaceRow } from "@/lib/guide/place";
import { supabaseUrl } from "@/lib/supabase/env";
import { createAdminClient, isAdminClientConfigured } from "@/lib/supabase/admin";

/**
 * Adresses du guide voyageurs (/guide).
 *
 * Source : la table guide_places, gérée depuis le back-office (Guide voyageurs).
 * Tant que la base n'est pas branchée ou que la sélection n'y a pas encore été
 * importée, le guide affiche la sélection initiale (src/content/guide/places.ts) :
 * le QR code imprimé fonctionne donc dès le premier jour.
 *
 * Seules les adresses publiées, réelles (hors démo) et non fermées définitivement
 * sont montrées aux voyageurs.
 */

export const GUIDE_TAG = "guide-places";

export const GUIDE_PHOTO_BUCKET = "guide-photos";

export function guidePhotoUrl(path: string) {
  return `${supabaseUrl}/storage/v1/object/public/${GUIDE_PHOTO_BUCKET}/${path
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

function sortPlaces(places: GuidePlace[]) {
  return places.sort((a, b) => a.position - b.position || a.name.localeCompare(b.name, "fr"));
}

export function seedGuidePlaces(): GuidePlace[] {
  return sortPlaces(seedPlaces.map((seed, index) => fromSeed(seed, index * 10)));
}

async function loadFromDatabase(): Promise<GuidePlace[] | null> {
  if (!isAdminClientConfigured()) return null;
  const { data, error } = await createAdminClient()
    .from("guide_places")
    .select(guidePlaceColumns)
    .eq("is_published", true)
    .eq("is_demo", false)
    .neq("status", "ferme");
  // Table absente (migration non appliquée) ou erreur : on garde la sélection initiale.
  if (error || !data) return null;
  if (data.length === 0) return null;
  const places = (data as unknown as GuidePlaceRow[])
    .map((row) => fromRow(row, guidePhotoUrl))
    .filter((place): place is GuidePlace => place !== null);
  return sortPlaces(places);
}

/**
 * Toutes les adresses publiées. Mis en cache 10 minutes et rafraîchi dès qu'une
 * adresse est modifiée dans le back-office (étiquette GUIDE_TAG).
 */
export const getGuidePlaces = unstable_cache(
  async (): Promise<{ places: GuidePlace[]; source: "database" | "seed" }> => {
    try {
      const places = await loadFromDatabase();
      if (places) return { places, source: "database" };
    } catch {
      // Base injoignable : le guide reste consultable avec la sélection initiale.
    }
    return { places: seedGuidePlaces(), source: "seed" };
  },
  ["guide-places"],
  { tags: [GUIDE_TAG], revalidate: 600 },
);

export async function getGuidePlace(slug: string) {
  const { places } = await getGuidePlaces();
  return places.find((place) => place.slug === slug) ?? null;
}
