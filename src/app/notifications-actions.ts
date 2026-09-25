"use server";

import { revalidatePath } from "next/cache";

import { fail, ok, type ActionState } from "@/lib/action-state";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

/** Marque les notifications du compte connecté comme lues (la base n'autorise que les siennes). */
export async function markAllRead(path: string, _prev: ActionState): Promise<ActionState> {
  const session = await requireSession();
  const supabase = await createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("recipient_id", session.userId)
    .is("read_at", null);
  if (error) return fail("Impossible de mettre à jour les notifications.");
  revalidatePath(path, "layout");
  return ok("Toutes les notifications sont marquées comme lues.");
}
