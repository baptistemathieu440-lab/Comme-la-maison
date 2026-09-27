"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { dbErrorMessage, fail, ok, type ActionState } from "@/lib/action-state";
import { adminContext } from "@/lib/auth/admin-context";
import { FormReader } from "@/lib/form-data";
import { processPendingEvents } from "@/server/automation/engine";

const severities = ["low", "medium", "high", "critical"] as const;
const statuses = ["open", "in_progress", "resolved"] as const;

export async function createIncident(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { session, supabase } = await adminContext();
  const form = new FormReader(formData);
  const values = {
    property_id: form.id("property_id", true, "Choisissez le bien.") ?? "",
    title: form.text("title", "Décrivez le problème en quelques mots.", 160),
    description: form.optional("description", 4000),
    severity: form.choice("severity", severities, "medium"),
    visible_to_owner: form.bool("visible_to_owner"),
  };
  if (!form.ok) return fail("Vérifiez les champs indiqués.", form.errors);
  const { data: property } = await supabase.from("properties").select("is_demo").eq("id", values.property_id).single();
  const { data, error } = await supabase
    .from("incidents")
    .insert({ ...values, reported_by: session.userId, is_demo: property?.is_demo ?? false })
    .select("id")
    .single();
  if (error) return fail(dbErrorMessage(error));
  await processPendingEvents();
  redirect(`/admin/incidents/${data.id}`);
}

export async function updateIncident(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await adminContext();
  const form = new FormReader(formData);
  const values = {
    title: form.text("title", "Titre obligatoire.", 160),
    description: form.optional("description", 4000),
    severity: form.choice("severity", severities, "medium"),
    status: form.choice("status", statuses, "open"),
    resolution: form.optional("resolution", 4000),
    visible_to_owner: form.bool("visible_to_owner"),
  };
  if (!form.ok) return fail("Vérifiez les champs indiqués.", form.errors);
  const { error } = await supabase.from("incidents").update(values).eq("id", id);
  if (error) return fail(dbErrorMessage(error));
  revalidatePath(`/admin/incidents/${id}`);
  return ok("Incident mis à jour.");
}

export async function createMaintenanceFromIncident(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { session, supabase } = await adminContext();
  const form = new FormReader(formData);
  const { data: incident } = await supabase.from("incidents").select("property_id, title, is_demo").eq("id", id).single();
  if (!incident) return fail("Incident introuvable.");
  const values = {
    property_id: incident.property_id,
    incident_id: id,
    provider_id: form.id("provider_id"),
    title: form.optional("title", 160) ?? incident.title,
    scheduled_on: form.date("scheduled_on"),
    cost_cents: form.cents("cost"),
  };
  if (!form.ok) return fail("Vérifiez les champs indiqués.", form.errors);
  const { data, error } = await supabase
    .from("maintenance_jobs")
    .insert({ ...values, created_by: session.userId, is_demo: incident.is_demo })
    .select("id")
    .single();
  if (error) return fail(dbErrorMessage(error));
  await supabase.from("incidents").update({ status: "in_progress" }).eq("id", id).eq("status", "open");
  redirect(`/admin/interventions/${data.id}`);
}

export async function saveMaintenance(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await adminContext();
  const form = new FormReader(formData);
  const values = {
    title: form.text("title", "Titre obligatoire.", 160),
    description: form.optional("description", 4000),
    provider_id: form.id("provider_id"),
    status: form.choice("status", ["planned", "in_progress", "done", "cancelled"] as const, "planned"),
    scheduled_on: form.date("scheduled_on"),
    completed_on: form.date("completed_on"),
    cost_cents: form.cents("cost"),
  };
  if (!form.ok) return fail("Vérifiez les champs indiqués.", form.errors);
  const { error } = await supabase.from("maintenance_jobs").update(values).eq("id", id);
  if (error) return fail(dbErrorMessage(error));
  revalidatePath(`/admin/interventions/${id}`);
  return ok("Intervention enregistrée.");
}

/** Le coût de l'intervention devient une dépense (refacturée au propriétaire si avancée par la conciergerie). */
export async function expenseFromMaintenance(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { session, supabase } = await adminContext();
  const paidBy = formData.get("paid_by") === "owner" ? "owner" : "company";
  const { data: job } = await supabase
    .from("maintenance_jobs")
    .select("property_id, title, cost_cents, is_demo, completed_on, scheduled_on, provider:providers(contact:contacts(company_name, last_name))")
    .eq("id", id)
    .single();
  if (!job?.cost_cents) return fail("Renseignez d’abord le coût de l’intervention.");
  const { data: existing } = await supabase.from("expenses").select("id").eq("maintenance_job_id", id).maybeSingle();
  if (existing) return fail("Une dépense existe déjà pour cette intervention.");
  const { error } = await supabase.from("expenses").insert({
    property_id: job.property_id,
    maintenance_job_id: id,
    category: "repair",
    label: job.title,
    amount_cents: job.cost_cents,
    incurred_on: job.completed_on ?? job.scheduled_on ?? undefined,
    paid_by: paidBy,
    rebill_to_owner: paidBy === "company",
    supplier: job.provider?.contact?.company_name ?? job.provider?.contact?.last_name ?? null,
    created_by: session.userId,
    is_demo: job.is_demo,
  });
  if (error) return fail(dbErrorMessage(error));
  revalidatePath(`/admin/interventions/${id}`);
  return ok(paidBy === "company" ? "Dépense créée : elle sera refacturée sur le prochain relevé." : "Dépense créée (payée par le propriétaire).");
}
