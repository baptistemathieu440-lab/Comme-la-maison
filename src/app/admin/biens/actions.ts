"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { dbErrorMessage, fail, ok, type ActionState } from "@/lib/action-state";
import { adminContext } from "@/lib/auth/admin-context";
import { FormReader } from "@/lib/form-data";

const propertyTypes = ["studio", "apartment", "house", "villa", "room", "other"] as const;
const propertyStatuses = ["active", "inactive", "onboarding", "maintenance", "unavailable"] as const;
const platforms = ["airbnb", "booking", "abritel", "direct", "other"] as const;

function readProperty(form: FormReader) {
  const visible = form.bool("visible_on_site");
  const slug = form.optional("slug", 80);
  if (slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    form.errors.slug = "Lettres minuscules, chiffres et tirets uniquement (exemple : t2-chartrons).";
  }
  if (visible && !slug) form.errors.slug = "Indiquez une adresse de page pour publier le bien sur le site.";
  const checklist = form
    .optional("cleaning_checklist", 4000)
    ?.split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    owner_id: form.id("owner_id", true, "Choisissez le propriétaire.") ?? "",
    name: form.text("name", "Donnez un nom au bien.", 120),
    status: form.choice("status", propertyStatuses, "onboarding"),
    property_type: form.choice("property_type", propertyTypes, "apartment"),
    address_line: form.optional("address_line", 200),
    postal_code: form.optional("postal_code", 10),
    city: form.text("city", "Indiquez la commune.", 80),
    surface_m2: form.decimal("surface_m2", { min: 1, max: 5000 }),
    bedrooms: form.int("bedrooms", { max: 50 }),
    beds: form.int("beds", { max: 100 }),
    bathrooms: form.decimal("bathrooms", { max: 50 }),
    capacity: form.int("capacity", { min: 1, max: 100 }),
    floor_info: form.optional("floor_info", 120),
    description: form.optional("description", 4000),
    registration_number: form.optional("registration_number", 60),
    is_primary_residence: form.bool("is_primary_residence"),
    commission_rate_bps: form.bps("commission_rate"),
    default_cleaning_fee_cents: form.cents("default_cleaning_fee"),
    check_in_time: form.time("check_in_time"),
    check_out_time: form.time("check_out_time"),
    cleaning_checklist: checklist && checklist.length > 0 ? checklist : null,
    visible_on_site: visible,
    slug,
    public_title: form.optional("public_title", 120),
    public_description: form.optional("public_description", 4000),
    internal_notes: form.optional("internal_notes", 4000),
  };
}

export async function createProperty(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { session, supabase } = await adminContext();
  const form = new FormReader(formData);
  const values = readProperty(form);
  if (!form.ok) return fail("Vérifiez les champs indiqués.", form.errors);

  const { data, error } = await supabase
    .from("properties")
    .insert({ ...values, created_by: session.userId })
    .select("id")
    .single();
  if (error) return fail(dbErrorMessage(error));

  revalidatePath("/admin/biens");
  redirect(`/admin/biens/${data.id}`);
}

export async function updateProperty(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await adminContext();
  const form = new FormReader(formData);
  const values = readProperty(form);
  if (!form.ok) return fail("Vérifiez les champs indiqués.", form.errors);

  const { error } = await supabase.from("properties").update(values).eq("id", id);
  if (error) return fail(dbErrorMessage(error));

  revalidatePath(`/admin/biens/${id}`, "layout");
  return ok("Modifications enregistrées.");
}

export async function deleteProperty(id: string, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) {
    return fail(
      error.code === "23503"
        ? "Ce bien a des réservations enregistrées : passez-le plutôt en statut « Inactif » pour garder l’historique."
        : dbErrorMessage(error),
    );
  }
  revalidatePath("/admin/biens");
  redirect("/admin/biens");
}

export async function saveAccess(propertyId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { session, supabase } = await adminContext();
  const form = new FormReader(formData);
  const values = {
    door_code: form.optional("door_code", 80),
    key_box_code: form.optional("key_box_code", 80),
    key_box_location: form.optional("key_box_location", 300),
    alarm_code: form.optional("alarm_code", 80),
    wifi_name: form.optional("wifi_name", 120),
    wifi_password: form.optional("wifi_password", 120),
    parking_info: form.optional("parking_info", 1000),
    access_instructions: form.optional("access_instructions", 4000),
  };
  if (!form.ok) return fail("Vérifiez les champs indiqués.", form.errors);

  const { data: property } = await supabase.from("properties").select("is_demo").eq("id", propertyId).single();
  const { error } = await supabase
    .from("property_access")
    .upsert({ property_id: propertyId, ...values, updated_by: session.userId, is_demo: property?.is_demo ?? false });
  if (error) return fail(dbErrorMessage(error));
  revalidatePath(`/admin/biens/${propertyId}/acces`);
  return ok("Accès enregistrés. Ils ne sont visibles que des administrateurs et, le jour de sa tâche, de l’agent affecté.");
}

export async function saveListing(
  propertyId: string,
  listingId: string | null,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase } = await adminContext();
  const form = new FormReader(formData);
  const values = {
    platform_id: form.choice("platform_id", platforms),
    external_id: form.optional("external_id", 120),
    listing_url: form.url("listing_url"),
    ical_import_url: form.url("ical_import_url"),
    status: form.choice("status", ["active", "inactive"] as const, "active"),
    notes: form.optional("notes", 2000),
  };
  if (!form.ok) return fail("Vérifiez les champs indiqués.", form.errors);

  const { data: property } = await supabase.from("properties").select("is_demo").eq("id", propertyId).single();
  const { error } = listingId
    ? await supabase.from("listings").update(values).eq("id", listingId).eq("property_id", propertyId)
    : await supabase.from("listings").insert({ ...values, property_id: propertyId, is_demo: property?.is_demo ?? false });
  if (error) {
    return fail(error.code === "23505" ? "Ce bien a déjà une annonce sur cette plateforme." : dbErrorMessage(error));
  }
  revalidatePath(`/admin/biens/${propertyId}/annonces`);
  return ok(listingId ? "Annonce mise à jour." : "Annonce ajoutée.");
}

export async function deleteListing(propertyId: string, listingId: string, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { error } = await supabase.from("listings").delete().eq("id", listingId).eq("property_id", propertyId);
  if (error) return fail(dbErrorMessage(error));
  revalidatePath(`/admin/biens/${propertyId}/annonces`);
  return ok("Annonce supprimée. Les blocages importés depuis son calendrier ont été retirés.");
}

export async function regenerateExportToken(propertyId: string, listingId: string, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const token = Array.from(crypto.getRandomValues(new Uint8Array(24)), (b) => b.toString(16).padStart(2, "0")).join("");
  const { error } = await supabase
    .from("listings")
    .update({ ical_export_token: token })
    .eq("id", listingId)
    .eq("property_id", propertyId);
  if (error) return fail(dbErrorMessage(error));
  revalidatePath(`/admin/biens/${propertyId}/annonces`);
  return ok("Nouvelle adresse générée : l’ancienne ne fonctionne plus. Mettez à jour la plateforme concernée.");
}

export async function syncListingNow(propertyId: string, listingId: string, _prev: ActionState): Promise<ActionState> {
  await adminContext();
  const { syncListing } = await import("@/server/ical/sync");
  const result = await syncListing(listingId, "manual");
  revalidatePath(`/admin/biens/${propertyId}/annonces`);
  if (result.status === "error") return fail(`Synchronisation impossible : ${result.error}`);
  const summary = `${result.eventsFound} séjour(s) ou blocage(s) lu(s) : ${result.created} ajouté(s), ${result.updated} modifié(s), ${result.removed} retiré(s).`;
  return result.conflicts.length
    ? fail(`${summary} Attention : ${result.conflicts.length} chevauchement(s) détecté(s), voir la page Synchronisation.`)
    : ok(summary);
}
