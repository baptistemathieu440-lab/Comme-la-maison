import "server-only";

import { unstable_cache } from "next/cache";

import { addDays, parseIsoDate, toIso } from "@/lib/dates";
import { propertyType } from "@/lib/labels";
import { createAdminClient, isAdminClientConfigured, type AdminClient } from "@/lib/supabase/admin";

/**
 * Logements présentés sur le site public (réservation directe).
 *
 * Un bien apparaît seulement s'il est actif, publié depuis le back-office
 * (« Afficher ce bien sur le site public ») et réel : les biens de démonstration
 * ne sont jamais montrés aux visiteurs. Seules les informations publiques sortent
 * de la base : ni adresse, ni propriétaire, ni montant, ni voyageur.
 */

export const PUBLIC_LISTINGS_TAG = "public-listings";

const columns =
  "id, slug, name, public_title, public_description, city, property_type, capacity, bedrooms, beds, bathrooms, surface_m2, check_in_time, check_out_time, registration_number";

export type PublicListing = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  city: string;
  typeLabel: string;
  capacity: number | null;
  bedrooms: number | null;
  beds: number | null;
  bathrooms: number | null;
  surface: number | null;
  checkInTime: string | null;
  checkOutTime: string | null;
  registrationNumber: string | null;
  photos: Array<{ id: string; caption: string | null }>;
};

type Row = {
  id: string;
  slug: string | null;
  name: string;
  public_title: string | null;
  public_description: string | null;
  city: string;
  property_type: string;
  capacity: number | null;
  bedrooms: number | null;
  beds: number | null;
  bathrooms: number | null;
  surface_m2: number | null;
  check_in_time: string | null;
  check_out_time: string | null;
  registration_number: string | null;
};

function published(supabase: AdminClient) {
  return supabase
    .from("properties")
    .select(columns)
    .eq("visible_on_site", true)
    .eq("is_demo", false)
    .eq("status", "active")
    .not("slug", "is", null);
}

function toListing(row: Row, photos: PublicListing["photos"]): PublicListing {
  const typeLabel = propertyType[row.property_type as keyof typeof propertyType] ?? "Logement";
  return {
    id: row.id,
    slug: row.slug ?? "",
    // Le nom interne peut contenir des informations privées : sans titre public, un titre neutre.
    title: row.public_title?.trim() || `${typeLabel} à ${row.city}`,
    description: row.public_description?.trim() || null,
    city: row.city,
    typeLabel,
    capacity: row.capacity,
    bedrooms: row.bedrooms,
    beds: row.beds,
    bathrooms: row.bathrooms === null ? null : Number(row.bathrooms),
    surface: row.surface_m2 === null ? null : Number(row.surface_m2),
    checkInTime: row.check_in_time,
    checkOutTime: row.check_out_time,
    registrationNumber: row.registration_number,
    photos,
  };
}

async function publicPhotos(supabase: AdminClient, propertyIds: string[]) {
  if (propertyIds.length === 0) return new Map<string, PublicListing["photos"]>();
  const { data } = await supabase
    .from("property_photos")
    .select("id, property_id, caption, position")
    .in("property_id", propertyIds)
    .eq("is_public", true)
    .order("position")
    .order("created_at");
  const byProperty = new Map<string, PublicListing["photos"]>();
  for (const photo of data ?? []) {
    const list = byProperty.get(photo.property_id) ?? [];
    list.push({ id: photo.id, caption: photo.caption });
    byProperty.set(photo.property_id, list);
  }
  return byProperty;
}

/** Au moins un logement publié ? (lien « Logements » de l'en-tête, mis en cache 10 minutes). */
export const hasPublicListings = unstable_cache(
  async () => {
    if (!isAdminClientConfigured()) return false;
    try {
      const { count } = await createAdminClient()
        .from("properties")
        .select("id", { count: "exact", head: true })
        .eq("visible_on_site", true)
        .eq("is_demo", false)
        .eq("status", "active")
        .not("slug", "is", null);
      return (count ?? 0) > 0;
    } catch {
      return false;
    }
  },
  ["public-listings-exist"],
  { tags: [PUBLIC_LISTINGS_TAG], revalidate: 600 },
);

export async function listPublicListings(): Promise<PublicListing[]> {
  if (!isAdminClientConfigured()) return [];
  const supabase = createAdminClient();
  const { data } = await published(supabase).order("public_title").order("name");
  const rows = (data ?? []) as Row[];
  const photos = await publicPhotos(
    supabase,
    rows.map((row) => row.id),
  );
  return rows.map((row) => toListing(row, photos.get(row.id) ?? []));
}

export async function getPublicListing(slug: string): Promise<PublicListing | null> {
  if (!isAdminClientConfigured() || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return null;
  const supabase = createAdminClient();
  const { data } = await published(supabase).eq("slug", slug).maybeSingle();
  if (!data) return null;
  const row = data as Row;
  const photos = await publicPhotos(supabase, [row.id]);
  return toListing(row, photos.get(row.id) ?? []);
}

/**
 * Nuits indisponibles d'un logement entre deux dates (réservations actives et
 * blocages, y compris ceux importés des plateformes). Une nuit est désignée par
 * la date d'arrivée : le 12 indisponible = nuit du 12 au 13.
 */
export async function unavailableNights(propertyId: string, from: string, to: string): Promise<Set<string>> {
  const nights = new Set<string>();
  if (!isAdminClientConfigured()) return nights;
  const supabase = createAdminClient();
  const [{ data: bookings }, { data: blocks }] = await Promise.all([
    supabase
      .from("bookings")
      .select("check_in, check_out")
      .eq("property_id", propertyId)
      .in("status", ["confirmed", "in_progress", "completed"])
      .lt("check_in", to)
      .gt("check_out", from),
    supabase
      .from("calendar_blocks")
      .select("start_date, end_date")
      .eq("property_id", propertyId)
      .lt("start_date", to)
      .gt("end_date", from),
  ]);
  const spans = [
    ...(bookings ?? []).map((b) => [b.check_in, b.check_out] as const),
    ...(blocks ?? []).map((b) => [b.start_date, b.end_date] as const),
  ];
  for (const [start, end] of spans) {
    let day = start < from ? from : start;
    const stop = end > to ? to : end;
    while (day < stop) {
      nights.add(day);
      day = addDays(day, 1);
    }
  }
  return nights;
}

/** Chemin de stockage d'une photo publique d'un logement publié (sinon null). */
export async function publicPhotoPath(photoId: string): Promise<string | null> {
  if (!isAdminClientConfigured() || !/^[0-9a-f-]{36}$/.test(photoId)) return null;
  const { data } = await createAdminClient()
    .from("property_photos")
    .select("storage_path, property:properties!inner(visible_on_site, is_demo, status)")
    .eq("id", photoId)
    .eq("is_public", true)
    .maybeSingle();
  if (!data) return null;
  const property = data.property;
  if (!property.visible_on_site || property.is_demo || property.status !== "active") return null;
  return data.storage_path;
}

/** Premier jour de chacun des `count` mois à partir du mois de `startIso` (calendrier public). */
export function monthsFrom(startIso: string, count: number) {
  const months: string[] = [];
  const first = parseIsoDate(`${startIso.slice(0, 7)}-01`);
  for (let i = 0; i < count; i += 1) {
    const month = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + i, 1));
    months.push(toIso(month));
  }
  return months;
}
