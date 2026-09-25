"use server";

import { revalidatePath } from "next/cache";

import { dbErrorMessage, fail, ok, type ActionState } from "@/lib/action-state";
import { adminContext } from "@/lib/auth/admin-context";
import { processPendingEvents } from "@/server/automation/engine";

export async function toggleRule(key: string, enabled: boolean, _prev: ActionState): Promise<ActionState> {
  const { session, supabase } = await adminContext();
  const { error } = await supabase.from("automation_rules").update({ enabled, updated_by: session.userId }).eq("key", key);
  if (error) return fail(dbErrorMessage(error));
  revalidatePath("/admin/automatisations");
  return ok(enabled ? "Règle activée." : "Règle désactivée.");
}

export async function processNow(_prev: ActionState): Promise<ActionState> {
  await adminContext();
  const { processed } = await processPendingEvents(200);
  revalidatePath("/admin/automatisations");
  return ok(`${processed} événement(s) traité(s).`);
}
