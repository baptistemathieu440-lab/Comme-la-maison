import { addDays, todayIso } from "@/lib/dates";
import { createAdminClient, isAdminClientConfigured } from "@/lib/supabase/admin";
import { buildIcal, type ExportEvent } from "@/server/ical/build";

/**
 * Calendrier exporté vers une plateforme (adresse secrète propre à chaque annonce).
 * Contient les réservations et blocages du bien, sauf ceux importés depuis cette même
 * annonce (pour éviter l'écho). Aucune donnée personnelle : dates et « Réservé » seulement.
 */
export async function GET(_request: Request, { params }: RouteContext<"/api/ical/[token]">) {
  const { token: raw } = await params;
  const token = raw.replace(/\.ics$/, "");
  if (!/^[a-f0-9]{32,64}$/.test(token) || !isAdminClientConfigured()) {
    return new Response("Calendrier introuvable.", { status: 404 });
  }

  const supabase = createAdminClient();
  const { data: listing } = await supabase
    .from("listings")
    .select("id, property_id, status, property:properties!inner(name, reference)")
    .eq("ical_export_token", token)
    .maybeSingle();
  if (!listing || listing.status !== "active") return new Response("Calendrier introuvable.", { status: 404 });

  const since = addDays(todayIso(), -30);
  const [{ data: bookings }, { data: blocks }] = await Promise.all([
    supabase
      .from("bookings")
      .select("id, check_in, check_out, listing_id")
      .eq("property_id", listing.property_id)
      .in("status", ["confirmed", "in_progress", "completed"])
      .gte("check_out", since),
    supabase
      .from("calendar_blocks")
      .select("id, start_date, end_date, listing_id, kind, booking_id")
      .eq("property_id", listing.property_id)
      .gte("end_date", since),
  ]);

  const events: ExportEvent[] = [
    ...(bookings ?? [])
      .filter((booking) => booking.listing_id !== listing.id)
      .map((booking) => ({ uid: `${booking.id}@comme-a-la-maison`, start: booking.check_in, end: booking.check_out, summary: "Réservé" })),
    ...(blocks ?? [])
      .filter((block) => block.listing_id !== listing.id && !block.booking_id)
      .map((block) => ({
        uid: `${block.id}@comme-a-la-maison`,
        start: block.start_date,
        end: block.end_date,
        summary: block.kind === "platform_reservation" ? "Réservé" : "Indisponible",
      })),
  ];

  return new Response(buildIcal(`${listing.property.name} (${listing.property.reference})`, events), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="${listing.property.reference}.ics"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
