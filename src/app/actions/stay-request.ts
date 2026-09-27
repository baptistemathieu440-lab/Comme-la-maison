"use server";

import { fail, ok, type ActionState } from "@/lib/action-state";
import { directContactMessage } from "@/lib/contact";
import { addDays, diffDays, formatDateShort, isIsoDate, todayIso } from "@/lib/dates";
import { createAdminClient, isAdminClientConfigured } from "@/lib/supabase/admin";
import { adminIds, notify } from "@/server/notifications";
import { getPublicListing, unavailableNights } from "@/server/public-listings";

/** Délai minimal entre l'affichage du formulaire et son envoi (anti-robots). */
const MIN_FILL_MS = 2500;
const MAX_NIGHTS = 90;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Demande de séjour envoyée depuis la page publique d'un logement. Rien n'est
 * réservé ni payé : la demande arrive dans le back-office (réservation au statut
 * « Demande ») et Baptiste ou Simon recontactent le voyageur.
 */
export async function requestStay(slug: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const firstName = text(formData, "first_name");
  const honeypot = text(formData, "website");
  const startedAt = Number(formData.get("startedAt"));
  if (honeypot || !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return ok("Merci, votre demande est bien envoyée.");
  }

  const listing = await getPublicListing(slug);
  if (!listing || !isAdminClientConfigured()) {
    return fail(`Les demandes en ligne ne sont pas disponibles pour ce logement. ${directContactMessage()}`);
  }

  const checkIn = text(formData, "check_in");
  const checkOut = text(formData, "check_out");
  const adults = Number(text(formData, "adults") || "0");
  const children = Number(text(formData, "children") || "0");
  const lastName = text(formData, "last_name");
  const email = text(formData, "email").toLowerCase();
  const phone = text(formData, "phone");
  const message = text(formData, "message");
  const today = todayIso();

  const errors: Record<string, string> = {};
  if (!isIsoDate(checkIn)) errors.check_in = "Indiquez la date d’arrivée.";
  else if (checkIn < today) errors.check_in = "La date d’arrivée est déjà passée.";
  else if (checkIn > addDays(today, 540)) errors.check_in = "Les demandes sont ouvertes sur 18 mois.";
  if (!isIsoDate(checkOut)) errors.check_out = "Indiquez la date de départ.";
  else if (isIsoDate(checkIn) && checkOut <= checkIn) errors.check_out = "Le départ doit suivre l’arrivée.";
  else if (isIsoDate(checkIn) && diffDays(checkIn, checkOut) > MAX_NIGHTS) {
    errors.check_out = `${MAX_NIGHTS} nuits au maximum par demande.`;
  }
  if (!Number.isInteger(adults) || adults < 1) errors.adults = "Au moins un adulte.";
  if (!Number.isInteger(children) || children < 0) errors.children = "Nombre d’enfants invalide.";
  if (listing.capacity && adults + children > listing.capacity) {
    errors.adults = `Ce logement accueille ${listing.capacity} personne${listing.capacity > 1 ? "s" : ""} au maximum.`;
  }
  if (!firstName) errors.first_name = "Indiquez votre prénom.";
  else if (firstName.length > 60) errors.first_name = "60 caractères au maximum.";
  if (!lastName) errors.last_name = "Indiquez votre nom.";
  else if (lastName.length > 80) errors.last_name = "80 caractères au maximum.";
  if (!EMAIL.test(email) || email.length > 120) errors.email = "Indiquez une adresse email valide.";
  if (!/^\d{9,15}$/.test(phone.replace(/[\s.\-()]/g, "").replace(/^\+/, ""))) {
    errors.phone = "Indiquez un numéro de téléphone complet. Exemple : 06 12 34 56 78.";
  }
  if (message.length > 2000) errors.message = "2 000 caractères au maximum.";
  if (Object.keys(errors).length) return fail("Certains champs sont à corriger avant l’envoi.", errors);

  const taken = await unavailableNights(listing.id, checkIn, checkOut);
  if (taken.size > 0) {
    return fail("Ces dates ne sont plus toutes disponibles. Choisissez d’autres dates dans le calendrier.", {
      check_in: "Dates indisponibles.",
    });
  }

  const supabase = createAdminClient();
  const { data: contact, error: contactError } = await supabase
    .from("contacts")
    .insert({ first_name: firstName, last_name: lastName, email, phone })
    .select("id")
    .single();
  if (contactError || !contact) return fail(`Votre demande n’a pas pu être enregistrée. ${directContactMessage()}`);
  const { data: guest } = await supabase.from("guests").insert({ contact_id: contact.id }).select("id").single();

  const nights = diffDays(checkIn, checkOut);
  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      property_id: listing.id,
      platform_id: "direct",
      guest_id: guest?.id ?? null,
      status: "inquiry",
      source: "website",
      check_in: checkIn,
      check_out: checkOut,
      adults,
      children,
      internal_notes: ["Demande envoyée depuis la page du logement sur le site.", message && `Message : ${message}`]
        .filter(Boolean)
        .join("\n"),
    })
    .select("id")
    .single();
  if (error || !booking) return fail(`Votre demande n’a pas pu être enregistrée. ${directContactMessage()}`);

  const travellers = adults + children;
  await notify(supabase, {
    recipients: await adminIds(supabase),
    kind: "booking.inquiry",
    title: `Demande de séjour · ${listing.title}`,
    body: `${firstName} ${lastName} · du ${formatDateShort(checkIn)} au ${formatDateShort(checkOut)} (${nights} nuit${
      nights > 1 ? "s" : ""
    }) · ${travellers} voyageur${travellers > 1 ? "s" : ""} · ${phone} · ${email}`,
    link: `/admin/reservations/${booking.id}`,
  });

  return ok(
    `Merci ${firstName}, votre demande est bien envoyée. Nous revenons vers vous pour confirmer la disponibilité et le tarif : rien n’est réservé ni payé à ce stade.`,
  );
}
