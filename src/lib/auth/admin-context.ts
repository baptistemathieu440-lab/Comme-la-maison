import "server-only";

import { createClient } from "@/lib/supabase/server";

import { requireAdmin, requireOwner, requireStaff } from "./session";

/** Session administrateur vérifiée + client lié à cette session (règles d'accès actives). */
export async function adminContext() {
  const session = await requireAdmin();
  const supabase = await createClient();
  return { session, supabase };
}

export async function ownerContext() {
  const session = await requireOwner();
  const supabase = await createClient();
  const { data: owner } = await supabase
    .from("owners")
    .select("id, status, is_demo, contact:contacts!inner(first_name, last_name, company_name, email)")
    .maybeSingle();
  return { session, supabase, owner };
}

export async function staffContext() {
  const session = await requireStaff();
  const supabase = await createClient();
  return { session, supabase };
}
