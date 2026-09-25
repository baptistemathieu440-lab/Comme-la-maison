import "server-only";

import type { ContactValues } from "@/lib/contact";
import { createAdminClient, isAdminClientConfigured } from "@/lib/supabase/admin";

/**
 * Enregistre une demande d'estimation du site dans le CRM (prospect).
 * Si l'adresse email est déjà connue comme prospect ouvert, la demande est ajoutée
 * à son historique au lieu de créer un doublon.
 * Utilise la clé de service : le site public n'a aucun accès direct à la base.
 */
export async function saveLead(values: ContactValues): Promise<"saved" | "not-configured" | "failed"> {
  if (!isAdminClientConfigured()) return "not-configured";
  const supabase = createAdminClient();
  const email = values.email.toLowerCase();
  const summary = [
    values.propertyType && `Type : ${values.propertyType}`,
    values.bedrooms && `Chambres : ${values.bedrooms}`,
    values.capacity && `Capacité : ${values.capacity}`,
    values.message && `Message : ${values.message}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const { data: existing } = await supabase
      .from("prospects")
      .select("id, contact:contacts!inner(email)")
      .eq("contact.email", email)
      .not("status", "in", "(won,lost)")
      .limit(1)
      .maybeSingle();

    if (existing) {
      await supabase.from("prospect_activities").insert({
        prospect_id: existing.id,
        kind: "note",
        content: `Nouvelle demande envoyée depuis le site (${values.city}).\n${summary}`.trim(),
      });
      await supabase.from("prospects").update({ status: "new" }).eq("id", existing.id).eq("status", "thinking");
      return "saved";
    }

    const { data: contact, error } = await supabase
      .from("contacts")
      .insert({
        first_name: values.firstName,
        last_name: values.lastName,
        email,
        phone: values.phone,
        city: values.city,
      })
      .select("id")
      .single();
    if (error || !contact) return "failed";

    const { error: prospectError } = await supabase.from("prospects").insert({
      contact_id: contact.id,
      status: "new",
      source: "website",
      property_city: values.city,
      property_type: values.propertyType || null,
      bedrooms: values.bedrooms || null,
      capacity: values.capacity || null,
      message: values.message || null,
      next_action: "Rappeler pour qualifier la demande",
    });
    return prospectError ? "failed" : "saved";
  } catch {
    return "failed";
  }
}
