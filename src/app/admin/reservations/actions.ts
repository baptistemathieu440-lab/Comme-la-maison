"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { dbErrorMessage, fail, ok, type ActionState } from "@/lib/action-state";
import { adminContext } from "@/lib/auth/admin-context";
import { FormReader } from "@/lib/form-data";
import { processPendingEvents } from "@/server/automation/engine";

const platforms = ["airbnb", "booking", "abritel", "direct", "other"] as const;
const statuses = ["inquiry", "confirmed", "in_progress", "completed", "cancelled"] as const;

function readBooking(form: FormReader) {
  const checkIn = form.date("check_in", true);
  const checkOut = form.date("check_out", true);
  if (checkIn && checkOut && checkOut <= checkIn) form.errors.check_out = "Le départ doit être après l’arrivée.";

  const nights = form.cents("nights_amount", { required: false }) ?? 0;
  let fee = form.cents("platform_fee") ?? null;
  const feePercent = form.bps("platform_fee_percent");
  if (fee === null && feePercent !== null) fee = Math.round((nights * feePercent) / 10000);
  fee = fee ?? 0;
  if (fee > nights) form.errors.platform_fee = "Les frais ne peuvent pas dépasser le prix des nuitées.";

  return {
    property_id: form.id("property_id", true, "Choisissez le bien.") ?? "",
    platform_id: form.choice("platform_id", platforms, "direct"),
    status: form.choice("status", statuses, "confirmed"),
    check_in: checkIn ?? "",
    check_out: checkOut ?? "",
    adults: form.int("adults", { min: 0, max: 50 }) ?? 1,
    children: form.int("children", { min: 0, max: 50 }) ?? 0,
    nights_amount_cents: nights,
    platform_fee_cents: fee,
    cleaning_fee_cents: form.cents("cleaning_fee") ?? 0,
    tourist_tax_cents: form.cents("tourist_tax") ?? 0,
    external_ref: form.optional("external_ref", 80),
    internal_notes: form.optional("internal_notes", 4000),
    cancellation_reason: form.optional("cancellation_reason", 500),
  };
}

function readGuest(form: FormReader) {
  const guest = {
    first_name: form.optional("guest_first_name", 80) ?? "",
    last_name: form.optional("guest_last_name", 80) ?? "",
    email: form.email("guest_email"),
    phone: form.optional("guest_phone", 40),
  };
  return guest.first_name || guest.last_name || guest.email || guest.phone ? guest : null;
}

export async function createBooking(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { session, supabase } = await adminContext();
  const form = new FormReader(formData);
  const values = readBooking(form);
  const guest = readGuest(form);
  const blockId = form.id("block_id");
  if (!form.ok) return fail("Vérifiez les champs indiqués.", form.errors);

  const { data: property } = await supabase.from("properties").select("is_demo").eq("id", values.property_id).single();
  const isDemo = property?.is_demo ?? false;

  let guestId: string | null = null;
  if (guest) {
    const { data: contact, error } = await supabase.from("contacts").insert({ ...guest, is_demo: isDemo, created_by: session.userId }).select("id").single();
    if (error) return fail(dbErrorMessage(error));
    const { data: created, error: guestError } = await supabase.from("guests").insert({ contact_id: contact.id, is_demo: isDemo }).select("id").single();
    if (guestError) return fail(dbErrorMessage(guestError));
    guestId = created.id;
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("id")
    .eq("property_id", values.property_id)
    .eq("platform_id", values.platform_id)
    .maybeSingle();

  let icalUid: string | null = null;
  if (blockId) {
    const { data: block } = await supabase.from("calendar_blocks").select("external_uid, listing_id").eq("id", blockId).maybeSingle();
    if (block?.listing_id === listing?.id) icalUid = block?.external_uid ?? null;
  }

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      ...values,
      guest_id: guestId,
      listing_id: listing?.id ?? null,
      ical_uid: icalUid,
      source: blockId ? "ical" : "manual",
      created_by: session.userId,
      is_demo: isDemo,
    })
    .select("id")
    .single();
  if (error) {
    if (guestId) await supabase.from("guests").delete().eq("id", guestId);
    return fail(dbErrorMessage(error), error.code === "23P01" ? { check_in: "Dates déjà occupées." } : undefined);
  }
  if (blockId) await supabase.from("calendar_blocks").update({ booking_id: booking.id }).eq("id", blockId);

  await processPendingEvents();
  revalidatePath("/admin/reservations");
  redirect(`/admin/reservations/${booking.id}?creee=1`);
}

export async function updateBooking(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await adminContext();
  const form = new FormReader(formData);
  const values = readBooking(form);
  const guest = readGuest(form);
  if (!form.ok) return fail("Vérifiez les champs indiqués.", form.errors);

  const { data: current } = await supabase.from("bookings").select("guest_id, is_demo, property_id, platform_id").eq("id", id).single();
  if (!current) return fail("Réservation introuvable.");

  let guestId = current.guest_id;
  if (guest) {
    if (guestId) {
      const { data: g } = await supabase.from("guests").select("contact_id").eq("id", guestId).single();
      if (g) await supabase.from("contacts").update(guest).eq("id", g.contact_id);
    } else {
      const { data: contact } = await supabase.from("contacts").insert({ ...guest, is_demo: current.is_demo }).select("id").single();
      if (contact) {
        const { data: created } = await supabase.from("guests").insert({ contact_id: contact.id, is_demo: current.is_demo }).select("id").single();
        guestId = created?.id ?? null;
      }
    }
  }

  let listingId: string | null | undefined;
  if (values.property_id !== current.property_id || values.platform_id !== current.platform_id) {
    const { data: listing } = await supabase
      .from("listings")
      .select("id")
      .eq("property_id", values.property_id)
      .eq("platform_id", values.platform_id)
      .maybeSingle();
    listingId = listing?.id ?? null;
  }

  const { error } = await supabase
    .from("bookings")
    .update({ ...values, guest_id: guestId, ...(listingId !== undefined ? { listing_id: listingId } : {}) })
    .eq("id", id);
  if (error) return fail(dbErrorMessage(error));
  await processPendingEvents();
  revalidatePath(`/admin/reservations/${id}`);
  return ok("Réservation enregistrée. Les montants ont été recalculés.");
}

export async function setBookingStatus(id: string, status: (typeof statuses)[number], _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) return fail(dbErrorMessage(error));
  await processPendingEvents();
  revalidatePath(`/admin/reservations/${id}`);
  return ok("Statut mis à jour.");
}

export async function deleteBooking(id: string, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { data: booking } = await supabase.from("bookings").select("statement_id").eq("id", id).single();
  if (booking?.statement_id) return fail("Cette réservation figure dans un relevé finalisé : elle ne peut pas être supprimée.");
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) return fail(dbErrorMessage(error));
  revalidatePath("/admin/reservations");
  redirect("/admin/reservations");
}
