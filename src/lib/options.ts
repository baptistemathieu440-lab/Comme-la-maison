import "server-only";

import type { ServerClient } from "@/lib/supabase/server";

import { displayName } from "./people";

export type Option = { value: string; label: string };

export async function ownerOptions(supabase: ServerClient): Promise<Option[]> {
  const { data } = await supabase
    .from("owners")
    .select("id, is_demo, contact:contacts!inner(first_name, last_name, company_name, email)")
    .neq("status", "inactive");
  return (data ?? [])
    .map((row) => ({ value: row.id, label: `${displayName(row.contact)}${row.is_demo ? " (démo)" : ""}` }))
    .sort((a, b) => a.label.localeCompare(b.label, "fr"));
}

export async function propertyOptions(supabase: ServerClient, { activeOnly = false } = {}): Promise<Option[]> {
  let query = supabase.from("properties").select("id, name, reference").order("name");
  if (activeOnly) query = query.in("status", ["active", "onboarding", "maintenance"]);
  const { data } = await query;
  return (data ?? []).map((row) => ({ value: row.id, label: `${row.name} (${row.reference})` }));
}

/** Comptes ayant le rôle agent (pour l'affectation des tâches). */
export async function staffOptions(supabase: ServerClient): Promise<Option[]> {
  const { data } = await supabase
    .from("user_roles")
    .select("user_id, profile:profiles!user_roles_user_id_fkey(full_name, email)")
    .eq("role", "staff");
  return (data ?? [])
    .map((row) => ({ value: row.user_id, label: row.profile?.full_name || row.profile?.email || "Agent" }))
    .sort((a, b) => a.label.localeCompare(b.label, "fr"));
}

export async function providerOptions(supabase: ServerClient): Promise<Option[]> {
  const { data } = await supabase
    .from("providers")
    .select("id, trade, contact:contacts!inner(first_name, last_name, company_name)")
    .eq("active", true);
  return (data ?? [])
    .map((row) => ({ value: row.id, label: `${displayName(row.contact)} · ${row.trade}` }))
    .sort((a, b) => a.label.localeCompare(b.label, "fr"));
}

export async function platformOptions(supabase: ServerClient): Promise<Option[]> {
  const { data } = await supabase.from("platforms").select("id, name").order("position");
  return (data ?? []).map((row) => ({ value: row.id, label: row.name }));
}
