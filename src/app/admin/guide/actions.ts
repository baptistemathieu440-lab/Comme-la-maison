"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { BUDGET_TO_CONFIRM, seedPlaces } from "@/content/guide/places";
import { dbErrorMessage, fail, ok, type ActionState } from "@/lib/action-state";
import { adminContext } from "@/lib/auth/admin-context";
import { todayIso } from "@/lib/dates";
import { FormReader } from "@/lib/form-data";
import { fromSeed, slugify } from "@/lib/guide/place";
import {
  audienceKeys,
  bookingKeys,
  kindKeys,
  settingKeys,
  statusKeys,
  tagKeys,
  wineRegionKeys,
  zoneKeys,
} from "@/lib/guide/taxonomy";
import { createUploadTicket, imageTypes, objectExists, removeObjects, type UploadTicket } from "@/lib/storage";
import type { Database } from "@/lib/supabase/database.types";
import { GUIDE_TAG } from "@/server/guide";

type Insert = Database["public"]["Tables"]["guide_places"]["Insert"];

/** Le guide public se met à jour aussitôt (cache et pages régénérés). */
function refreshGuide(id?: string) {
  updateTag(GUIDE_TAG);
  revalidatePath("/guide", "layout");
  revalidatePath("/admin/guide");
  if (id) revalidatePath(`/admin/guide/${id}`);
}

function read(form: FormReader) {
  const name = form.text("name", "Indiquez le nom du lieu.", 120);
  const rawSlug = form.optional("slug", 80);
  const slug = rawSlug ? slugify(rawSlug) : slugify(name);
  if (!slug) form.errors.slug = "Identifiant invalide (lettres, chiffres et tirets).";

  const lat = form.decimal("lat", { min: -90, max: 90 });
  const lng = form.decimal("lng", { min: -180, max: 180 });
  if ((lat === null) !== (lng === null)) form.errors.lng = "Renseignez la latitude et la longitude, ou aucune des deux.";

  const rating = form.decimal("rating", { min: 0, max: 5 });
  const ratingSource = form.optional("rating_source", 60);
  if (rating !== null && !ratingSource) form.errors.rating_source = "Indiquez d’où vient la note (Google, Tripadvisor…).";

  const sources = form
    .raw("sources")
    .split(/\s+/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (sources.length > 12) form.errors.sources = "12 sources au maximum.";
  if (sources.some((url) => !/^https?:\/\/\S+$/.test(url))) form.errors.sources = "Une adresse complète (https://…) par ligne.";

  const car = form.raw("car_needed");
  const budget = Number(form.choice("budget", ["0", "1", "2", "3", "4"] as const, "1"));
  const wineRegion = form.raw("wine_region");

  const values: Omit<Insert, "created_by"> = {
    name,
    slug,
    kind: form.choice("kind", kindKeys),
    subcategory: form.optional("subcategory", 80),
    wine_region: wineRegion ? form.choice("wine_region", wineRegionKeys) : null,
    tags: form.list("tags", tagKeys),
    audiences: form.list("audiences", audienceKeys),
    budget,
    price_note: form.optional("price_note", 200),
    zone: form.choice("zone", zoneKeys, "centre"),
    setting: form.choice("setting", settingKeys, "mixte"),
    summary: form.text("summary", "Expliquez en quelques lignes pourquoi vous le recommandez.", 700),
    good_to_know: form.optional("good_to_know", 700),
    tip: form.optional("tip", 400),
    highlights: form.optional("highlights", 700),
    where_to_eat: form.optional("where_to_eat", 400),
    area: form.text("area", "Indiquez le quartier ou la commune.", 120),
    travel_time: form.optional("travel_time", 160),
    duration: form.optional("duration", 160),
    best_period: form.optional("best_period", 160),
    transport: form.optional("transport", 300),
    car_needed: car === "oui" ? true : car === "non" ? false : null,
    address: form.optional("address", 200),
    lat,
    lng,
    hours: form.optional("hours", 300),
    booking: form.choice("booking", bookingKeys, "non"),
    website_url: form.url("website_url"),
    booking_url: form.url("booking_url"),
    maps_url: form.url("maps_url"),
    rating,
    rating_count: form.int("rating_count", { min: 0, max: 10_000_000 }),
    rating_source: ratingSource,
    photo_alt: form.optional("photo_alt", 200),
    photo_credit: form.optional("photo_credit", 200),
    status: form.choice("status", statusKeys, "ouvert"),
    is_published: form.bool("is_published"),
    is_favorite: form.bool("is_favorite"),
    position: form.int("position", { min: 0, max: 100000 }) ?? 0,
    verified_on: form.date("verified_on"),
    sources,
    internal_notes: form.optional("internal_notes", 2000),
  };
  return values;
}

export async function saveGuidePlace(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { session, supabase } = await adminContext();
  const form = new FormReader(formData);
  const values = read(form);
  if (!form.ok) return fail("Vérifiez les champs indiqués.", form.errors);

  if (id) {
    const { error } = await supabase.from("guide_places").update(values).eq("id", id);
    if (error) return fail(error.code === "23505" ? "Cet identifiant est déjà utilisé par une autre adresse." : dbErrorMessage(error));
    refreshGuide(id);
    return ok("Adresse enregistrée. Le guide est à jour.");
  }

  const { data, error } = await supabase
    .from("guide_places")
    .insert({ ...values, created_by: session.userId })
    .select("id")
    .single();
  if (error) return fail(error.code === "23505" ? "Cet identifiant est déjà utilisé par une autre adresse." : dbErrorMessage(error));
  refreshGuide();
  redirect(`/admin/guide/${data.id}`);
}

export async function setGuidePlacePublished(id: string, published: boolean, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { error } = await supabase.from("guide_places").update({ is_published: published }).eq("id", id);
  if (error) return fail(dbErrorMessage(error));
  refreshGuide(id);
  return ok(published ? "Adresse visible dans le guide." : "Adresse masquée du guide.");
}

export async function markGuidePlaceVerified(id: string, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { error } = await supabase.from("guide_places").update({ verified_on: todayIso() }).eq("id", id);
  if (error) return fail(dbErrorMessage(error));
  refreshGuide(id);
  return ok("Vérification enregistrée à la date du jour.");
}

export async function deleteGuidePlace(id: string, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { data: place } = await supabase.from("guide_places").select("photo_path").eq("id", id).maybeSingle();
  if (!place) return fail("Adresse introuvable.");
  const { error } = await supabase.from("guide_places").delete().eq("id", id);
  if (error) return fail(dbErrorMessage(error));
  if (place.photo_path) await removeObjects("guide-photos", [place.photo_path]);
  refreshGuide();
  redirect("/admin/guide");
}

/**
 * Importe la sélection initiale (src/content/guide/places.ts). Seules les adresses
 * absentes sont ajoutées : celles déjà présentes (même identifiant) ne sont jamais écrasées.
 */
export async function importGuideSeed(_prev: ActionState): Promise<ActionState> {
  const { session, supabase } = await adminContext();
  const { data: existing, error: readError } = await supabase.from("guide_places").select("slug");
  if (readError) return fail(dbErrorMessage(readError));
  const known = new Set((existing ?? []).map((row) => row.slug));
  const toConfirm = new Set<string>(BUDGET_TO_CONFIRM);

  const rows: Insert[] = seedPlaces
    .map((seed, index) => fromSeed(seed, index * 10))
    .filter((place) => !known.has(place.slug))
    .map((place) => ({
      slug: place.slug,
      name: place.name,
      kind: place.kind,
      subcategory: place.subcategory,
      wine_region: place.wineRegion,
      tags: place.tags,
      audiences: place.audiences,
      budget: place.budget,
      price_note: place.priceNote,
      zone: place.zone,
      setting: place.setting,
      summary: place.summary,
      good_to_know: place.goodToKnow,
      tip: place.tip,
      highlights: place.highlights,
      where_to_eat: place.whereToEat,
      area: place.area,
      travel_time: place.travelTime,
      duration: place.duration,
      best_period: place.bestPeriod,
      transport: place.transport,
      car_needed: place.carNeeded,
      address: place.address,
      lat: place.lat,
      lng: place.lng,
      hours: place.hours,
      booking: place.booking,
      website_url: place.websiteUrl,
      booking_url: place.bookingUrl,
      maps_url: place.mapsUrl,
      status: place.status,
      is_published: true,
      is_favorite: place.isFavorite,
      position: place.position,
      verified_on: place.verifiedOn,
      sources: place.sources,
      internal_notes: toConfirm.has(place.slug) ? "Budget estimé, à confirmer (aucun prix publié trouvé lors de la sélection)." : null,
      created_by: session.userId,
    }));

  if (rows.length === 0) return ok("La sélection initiale est déjà entièrement importée.");
  const { error } = await supabase.from("guide_places").insert(rows);
  if (error) return fail(dbErrorMessage(error));
  refreshGuide();
  return ok(`${rows.length} adresse${rows.length > 1 ? "s" : ""} importée${rows.length > 1 ? "s" : ""}.`);
}

/* ---------- Photo ---------- */

export async function requestGuidePhotoUpload(id: string, file: { name: string; type: string; size: number }): Promise<UploadTicket> {
  const { supabase } = await adminContext();
  const { data } = await supabase.from("guide_places").select("id").eq("id", id).maybeSingle();
  if (!data) return { ok: false, message: "Adresse introuvable." };
  return createUploadTicket("guide-photos", id, file.type, file.size, imageTypes);
}

export async function confirmGuidePhotoUpload(id: string, path: string): Promise<{ ok: boolean; message?: string }> {
  const { supabase } = await adminContext();
  if (!path.startsWith(`${id}/`)) return { ok: false, message: "Emplacement invalide." };
  if (!(await objectExists("guide-photos", path))) return { ok: false, message: "Fichier non reçu." };
  const { data: place } = await supabase.from("guide_places").select("photo_path").eq("id", id).maybeSingle();
  if (!place) return { ok: false, message: "Adresse introuvable." };
  const { error } = await supabase.from("guide_places").update({ photo_path: path }).eq("id", id);
  if (error) return { ok: false, message: dbErrorMessage(error) };
  if (place.photo_path && place.photo_path !== path) await removeObjects("guide-photos", [place.photo_path]);
  refreshGuide(id);
  return { ok: true };
}

export async function removeGuidePhoto(id: string, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { data: place } = await supabase.from("guide_places").select("photo_path").eq("id", id).maybeSingle();
  if (!place?.photo_path) return fail("Aucune photo à retirer.");
  const { error } = await supabase.from("guide_places").update({ photo_path: null }).eq("id", id);
  if (error) return fail(dbErrorMessage(error));
  await removeObjects("guide-photos", [place.photo_path]);
  refreshGuide(id);
  return ok("Photo retirée.");
}
