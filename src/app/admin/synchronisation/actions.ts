"use server";

import { revalidatePath } from "next/cache";

import { fail, ok, type ActionState } from "@/lib/action-state";
import { adminContext } from "@/lib/auth/admin-context";
import { processPendingEvents } from "@/server/automation/engine";
import { syncAllListings } from "@/server/ical/sync";

export async function syncEverything(_prev: ActionState): Promise<ActionState> {
  await adminContext();
  const results = await syncAllListings("manual");
  await processPendingEvents();
  revalidatePath("/admin/synchronisation");
  if (results.length === 0) return fail("Aucun calendrier à importer : renseignez-les dans les annonces des biens.");
  const errors = results.filter((r) => r.status === "error").length;
  const conflicts = results.reduce((sum, r) => sum + r.conflicts.length, 0);
  const summary = `${results.length} calendrier(s) synchronisé(s)${errors ? `, ${errors} en erreur` : ""}${conflicts ? `, ${conflicts} chevauchement(s)` : ""}.`;
  return errors || conflicts ? fail(summary) : ok(summary);
}
