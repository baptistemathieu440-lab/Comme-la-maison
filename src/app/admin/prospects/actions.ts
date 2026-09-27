"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { dbErrorMessage, fail, ok, type ActionState } from "@/lib/action-state";
import { adminContext } from "@/lib/auth/admin-context";
import { FormReader } from "@/lib/form-data";
import { prospectStatus } from "@/lib/labels";

const statuses = ["new", "contacted", "meeting", "proposal_sent", "thinking", "won", "lost"] as const;
const sources = ["website", "phone", "email", "referral", "event", "other"] as const;

function readProspect(form: FormReader) {
  return {
    status: form.choice("status", statuses, "new"),
    source: form.choice("source", sources, "phone"),
    property_city: form.optional("property_city", 80),
    property_type: form.optional("property_type", 80),
    bedrooms: form.optional("bedrooms", 20),
    capacity: form.optional("capacity", 20),
    message: form.optional("message", 4000),
    next_action: form.optional("next_action", 200),
    next_action_on: form.date("next_action_on"),
    assigned_to: form.id("assigned_to"),
    lost_reason: form.optional("lost_reason", 500),
  };
}

export async function createProspect(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { session, supabase } = await adminContext();
  const form = new FormReader(formData);
  const contact = {
    first_name: form.optional("first_name", 80) ?? "",
    last_name: form.text("last_name", "Indiquez le nom.", 80),
    email: form.email("email"),
    phone: form.optional("phone", 40),
    city: form.optional("city", 80),
    created_by: session.userId,
  };
  const prospect = readProspect(form);
  if (!form.ok) return fail("Vérifiez les champs indiqués.", form.errors);

  const { data: created, error } = await supabase.from("contacts").insert(contact).select("id").single();
  if (error) return fail(dbErrorMessage(error));
  const { data: row, error: prospectError } = await supabase
    .from("prospects")
    .insert({ ...prospect, contact_id: created.id, created_by: session.userId })
    .select("id")
    .single();
  if (prospectError) return fail(dbErrorMessage(prospectError));
  revalidatePath("/admin/prospects");
  redirect(`/admin/prospects/${row.id}`);
}

export async function updateProspect(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { session, supabase } = await adminContext();
  const form = new FormReader(formData);
  const values = readProspect(form);
  const contact = {
    first_name: form.optional("first_name", 80) ?? "",
    last_name: form.text("last_name", "Indiquez le nom.", 80),
    email: form.email("email"),
    phone: form.optional("phone", 40),
    city: form.optional("city", 80),
  };
  if (!form.ok) return fail("Vérifiez les champs indiqués.", form.errors);

  const { data: current } = await supabase.from("prospects").select("status, contact_id").eq("id", id).single();
  if (!current) return fail("Prospect introuvable.");
  const [{ error }, { error: contactError }] = await Promise.all([
    supabase.from("prospects").update(values).eq("id", id),
    supabase.from("contacts").update(contact).eq("id", current.contact_id),
  ]);
  if (error || contactError) return fail(dbErrorMessage(error ?? contactError));

  if (current.status !== values.status) {
    await supabase.from("prospect_activities").insert({
      prospect_id: id,
      kind: "status_change",
      content: `Statut : ${prospectStatus[current.status as keyof typeof prospectStatus]?.label ?? current.status} → ${prospectStatus[values.status].label}`,
      created_by: session.userId,
    });
  }
  revalidatePath(`/admin/prospects/${id}`);
  return ok("Prospect mis à jour.");
}

export async function addProspectActivity(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { session, supabase } = await adminContext();
  const form = new FormReader(formData);
  const kind = form.choice("kind", ["note", "call", "email", "meeting"] as const, "note");
  const content = form.text("content", "Écrivez quelques mots.", 4000);
  if (!form.ok) return fail("Vérifiez les champs indiqués.", form.errors);
  const { data: prospect } = await supabase.from("prospects").select("is_demo").eq("id", id).single();
  const { error } = await supabase
    .from("prospect_activities")
    .insert({ prospect_id: id, kind, content, created_by: session.userId, is_demo: prospect?.is_demo ?? false });
  if (error) return fail(dbErrorMessage(error));
  revalidatePath(`/admin/prospects/${id}`);
  return ok("Ajouté à l’historique.");
}

/** Le prospect signe : sa fiche devient un propriétaire, sans ressaisie. */
export async function convertProspect(id: string, _prev: ActionState): Promise<ActionState> {
  const { session, supabase } = await adminContext();
  const { data: prospect } = await supabase
    .from("prospects")
    .select("contact_id, converted_owner_id, is_demo")
    .eq("id", id)
    .single();
  if (!prospect) return fail("Prospect introuvable.");
  if (prospect.converted_owner_id) redirect(`/admin/proprietaires/${prospect.converted_owner_id}`);

  const { data: existing } = await supabase.from("owners").select("id").eq("contact_id", prospect.contact_id).maybeSingle();
  let ownerId = existing?.id;
  if (!ownerId) {
    const { data: owner, error } = await supabase
      .from("owners")
      .insert({ contact_id: prospect.contact_id, status: "onboarding", created_by: session.userId, is_demo: prospect.is_demo })
      .select("id")
      .single();
    if (error) return fail(dbErrorMessage(error));
    ownerId = owner.id;
  }
  await supabase.from("prospects").update({ status: "won", converted_owner_id: ownerId }).eq("id", id);
  await supabase.from("prospect_activities").insert({
    prospect_id: id,
    kind: "status_change",
    content: "Signé : fiche convertie en propriétaire.",
    created_by: session.userId,
    is_demo: prospect.is_demo,
  });
  revalidatePath("/admin/prospects");
  redirect(`/admin/proprietaires/${ownerId}?cree=1`);
}

export async function deleteProspect(id: string, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { data: prospect } = await supabase.from("prospects").select("contact_id, converted_owner_id").eq("id", id).single();
  if (!prospect) return fail("Prospect introuvable.");
  const { error } = await supabase.from("prospects").delete().eq("id", id);
  if (error) return fail(dbErrorMessage(error));
  if (!prospect.converted_owner_id) await supabase.from("contacts").delete().eq("id", prospect.contact_id);
  revalidatePath("/admin/prospects");
  redirect("/admin/prospects");
}
