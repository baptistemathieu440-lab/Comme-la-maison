import "server-only";

import { addDays, todayIso } from "@/lib/dates";
import { createAdminClient, type AdminClient } from "@/lib/supabase/admin";

import { isUnavailabilityOnly, parseIcal } from "./parse";

const MAX_BYTES = 2_000_000;
const TIMEOUT_MS = 15_000;

export type SyncResult = {
  listingId: string;
  status: "success" | "partial" | "error";
  eventsFound: number;
  created: number;
  updated: number;
  removed: number;
  conflicts: Array<{ start: string; end: string; with: string }>;
  error?: string;
};

async function fetchCalendar(url: string) {
  const parsed = new URL(url);
  const localDev = process.env.NODE_ENV !== "production" && ["localhost", "127.0.0.1"].includes(parsed.hostname);
  if (parsed.protocol !== "https:" && !localDev) throw new Error("Seules les adresses https:// sont acceptées.");
  const response = await fetch(parsed, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { Accept: "text/calendar, text/plain;q=0.8", "User-Agent": "CommeALaMaison-Calendrier/1.0" },
    redirect: "follow",
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`La plateforme a répondu ${response.status}.`);
  const text = await response.text();
  if (text.length > MAX_BYTES) throw new Error("Calendrier trop volumineux.");
  if (!text.includes("BEGIN:VCALENDAR")) throw new Error("Le contenu reçu n’est pas un calendrier iCal.");
  return text;
}

/**
 * Importe le calendrier iCal d'une annonce :
 * crée, met à jour ou retire les blocages correspondants, relie ceux qui
 * correspondent à une réservation saisie et signale les chevauchements.
 */
export async function syncListing(listingId: string, trigger: "schedule" | "manual", client?: AdminClient): Promise<SyncResult> {
  const supabase = client ?? createAdminClient();
  const { data: listing } = await supabase
    .from("listings")
    .select("id, property_id, platform_id, ical_import_url, is_demo, status")
    .eq("id", listingId)
    .single();

  const result: SyncResult = { listingId, status: "success", eventsFound: 0, created: 0, updated: 0, removed: 0, conflicts: [] };
  if (!listing?.ical_import_url) {
    return { ...result, status: "error", error: "Aucune adresse de calendrier iCal à importer." };
  }

  const { data: run } = await supabase
    .from("sync_runs")
    .insert({ listing_id: listingId, kind: "ical_import", trigger, is_demo: listing.is_demo })
    .select("id")
    .single();

  try {
    const text = await fetchCalendar(listing.ical_import_url);
    const today = todayIso();
    const horizonStart = addDays(today, -30);
    const events = parseIcal(text).filter((event) => !event.cancelled && event.end >= horizonStart);
    result.eventsFound = events.length;

    const { data: existing } = await supabase
      .from("calendar_blocks")
      .select("id, external_uid, start_date, end_date, kind, summary")
      .eq("listing_id", listingId)
      .not("external_uid", "is", null);
    const byUid = new Map((existing ?? []).map((block) => [block.external_uid as string, block]));
    const seen = new Set<string>();

    for (const event of events) {
      seen.add(event.uid);
      const kind = isUnavailabilityOnly(event.summary) ? "blocked" : "platform_reservation";
      const current = byUid.get(event.uid);
      if (!current) {
        const { error } = await supabase.from("calendar_blocks").insert({
          property_id: listing.property_id,
          listing_id: listingId,
          kind,
          start_date: event.start,
          end_date: event.end,
          summary: event.summary || null,
          external_uid: event.uid,
          is_demo: listing.is_demo,
        });
        if (!error) result.created += 1;
      } else if (current.start_date !== event.start || current.end_date !== event.end || current.kind !== kind) {
        const { error } = await supabase
          .from("calendar_blocks")
          .update({ start_date: event.start, end_date: event.end, kind, summary: event.summary || null })
          .eq("id", current.id);
        if (!error) result.updated += 1;
      }
    }

    // Retire les séjours disparus du flux (annulés sur la plateforme), sans toucher à l'historique passé.
    const stale = (existing ?? []).filter((block) => !seen.has(block.external_uid as string) && block.end_date >= today);
    if (stale.length) {
      const { error } = await supabase.from("calendar_blocks").delete().in("id", stale.map((block) => block.id));
      if (!error) result.removed = stale.length;
    }

    // Relie chaque blocage à la réservation saisie pour le même séjour et la même annonce.
    const { data: blocks } = await supabase
      .from("calendar_blocks")
      .select("id, start_date, end_date, booking_id")
      .eq("listing_id", listingId)
      .eq("kind", "platform_reservation")
      .gte("end_date", today);
    const { data: bookings } = await supabase
      .from("bookings")
      .select("id, check_in, check_out, listing_id, platform_id, reference")
      .eq("property_id", listing.property_id)
      .in("status", ["confirmed", "in_progress", "completed"])
      .gte("check_out", today);
    const { data: otherBlocks } = await supabase
      .from("calendar_blocks")
      .select("id, start_date, end_date, listing_id, kind")
      .eq("property_id", listing.property_id)
      .neq("listing_id", listingId)
      .eq("kind", "platform_reservation")
      .gte("end_date", today);

    for (const block of blocks ?? []) {
      const match = (bookings ?? []).find(
        (booking) =>
          booking.check_in === block.start_date &&
          booking.check_out === block.end_date &&
          (booking.listing_id === listingId || booking.platform_id === listing.platform_id),
      );
      if (match && block.booking_id !== match.id) {
        await supabase.from("calendar_blocks").update({ booking_id: match.id }).eq("id", block.id);
      }
      if (match) continue;

      const overlapsBooking = (bookings ?? []).find(
        (booking) => booking.check_in < block.end_date && booking.check_out > block.start_date && booking.platform_id !== listing.platform_id,
      );
      const overlapsBlock = (otherBlocks ?? []).find(
        (other) => other.start_date < block.end_date && other.end_date > block.start_date,
      );
      if (overlapsBooking) {
        result.conflicts.push({ start: block.start_date, end: block.end_date, with: `réservation ${overlapsBooking.reference}` });
      } else if (overlapsBlock) {
        result.conflicts.push({ start: block.start_date, end: block.end_date, with: "une réservation importée d’une autre plateforme" });
      }
    }

    result.status = result.conflicts.length ? "partial" : "success";
  } catch (error) {
    result.status = "error";
    result.error = error instanceof Error ? error.message : "Erreur inconnue.";
  }

  await supabase
    .from("sync_runs")
    .update({
      status: result.status,
      finished_at: new Date().toISOString(),
      events_found: result.eventsFound,
      created_count: result.created,
      updated_count: result.updated,
      removed_count: result.removed,
      conflicts: result.conflicts,
      error: result.error ?? null,
    })
    .eq("id", run?.id ?? "");
  await supabase
    .from("listings")
    .update({
      last_import_at: new Date().toISOString(),
      last_import_status: result.status,
      last_import_error: result.error ?? (result.conflicts.length ? `${result.conflicts.length} chevauchement(s) détecté(s).` : null),
    })
    .eq("id", listingId);

  if (result.conflicts.length) {
    await supabase.from("domain_events").insert({
      type: "sync.conflict",
      entity_table: "listings",
      entity_id: listingId,
      payload: { property_id: listing.property_id, conflicts: result.conflicts },
      is_demo: listing.is_demo,
    });
  }

  return result;
}

/** Synchronise toutes les annonces actives qui ont un calendrier à importer. */
export async function syncAllListings(trigger: "schedule" | "manual" = "schedule") {
  const supabase = createAdminClient();
  const { data: listings } = await supabase
    .from("listings")
    .select("id")
    .eq("status", "active")
    .not("ical_import_url", "is", null);
  const results: SyncResult[] = [];
  for (const listing of listings ?? []) {
    results.push(await syncListing(listing.id, trigger, supabase));
  }
  return results;
}
