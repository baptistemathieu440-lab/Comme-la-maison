"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { fail, ok, type ActionState } from "@/lib/action-state";
import { staffContext } from "@/lib/auth/admin-context";
import { FormReader } from "@/lib/form-data";
import { createUploadTicket, imageTypes, objectExists, type UploadTicket } from "@/lib/storage";
import { processPendingEvents } from "@/server/automation/engine";

/** La tâche est-elle confiée à l'agent connecté ? (vue filtrée par la base) */
async function ownTask(taskId: string) {
  const { supabase, session } = await staffContext();
  const { data: task } = await supabase.from("staff_tasks").select("id, property_id, checklist, status, is_demo").eq("id", taskId).maybeSingle();
  return { supabase, session, task };
}

export async function updateMyTask(taskId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase, task } = await ownTask(taskId);
  if (!task) return fail("Tâche introuvable.");
  const intent = String(formData.get("intent") ?? "save");
  const items = (Array.isArray(task.checklist) ? task.checklist : []) as Array<{ label: string; done: boolean }>;
  const checklist = items.map((_, index) => ({ done: formData.get(`item-${index}`) === "on" }));
  const notes = String(formData.get("agent_notes") ?? "").slice(0, 4000);
  const status = intent === "start" ? "in_progress" : intent === "finish" ? "done" : intent === "reopen" ? "in_progress" : null;

  if (intent === "finish" && checklist.some((item) => !item.done)) {
    const missing = checklist.filter((item) => !item.done).length;
    if (formData.get("confirm_incomplete") !== "on") {
      return fail(`${missing} point(s) de la liste ne sont pas cochés. Cochez-les, ou cochez « Terminer malgré tout » et expliquez pourquoi dans les notes.`);
    }
  }

  const { error } = await supabase.rpc("staff_update_task", {
    p_task: taskId,
    p_status: status ?? undefined,
    p_checklist: checklist,
    p_notes: notes,
  });
  if (error) return fail(error.message);
  await processPendingEvents();
  revalidatePath(`/staff/taches/${taskId}`);
  revalidatePath("/staff");
  return ok(intent === "start" ? "Tâche commencée." : intent === "finish" ? "Tâche terminée : l’équipe va la valider. Merci !" : "Enregistré.");
}

export async function requestTaskPhotoUpload(taskId: string, file: { name: string; type: string; size: number }): Promise<UploadTicket> {
  const { task } = await ownTask(taskId);
  if (!task) return { ok: false, message: "Tâche introuvable." };
  return createUploadTicket("field-photos", `tasks/${taskId}`, file.type, file.size, imageTypes);
}

export async function confirmTaskPhotoUpload(
  taskId: string,
  path: string,
  meta: { fields: Record<string, string> },
): Promise<{ ok: boolean; message?: string }> {
  const { supabase, session, task } = await ownTask(taskId);
  if (!task || !path.startsWith(`tasks/${taskId}/`)) return { ok: false, message: "Emplacement invalide." };
  if (!(await objectExists("field-photos", path))) return { ok: false, message: "Photo non reçue." };
  const kind = ["before", "after", "issue"].includes(meta.fields.kind) ? meta.fields.kind : "after";
  const { error } = await supabase
    .from("task_photos")
    .insert({ task_id: taskId, storage_path: path, kind, uploaded_by: session.userId, is_demo: task.is_demo ?? false });
  if (error) return { ok: false, message: "Photo non enregistrée." };
  revalidatePath(`/staff/taches/${taskId}`);
  return { ok: true };
}

export async function reportIncident(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase, session } = await staffContext();
  const form = new FormReader(formData);
  const taskId = form.id("task_id");
  const propertyId = form.id("property_id", true, "Choisissez le logement.");
  const values = {
    title: form.text("title", "Décrivez le problème en quelques mots.", 160),
    description: form.optional("description", 4000),
    severity: form.choice("severity", ["low", "medium", "high", "critical"] as const, "medium"),
  };
  if (!form.ok || !propertyId) return fail("Vérifiez les champs indiqués.", form.errors);

  const { data: property } = await supabase.from("properties").select("is_demo").eq("id", propertyId).maybeSingle();
  if (!property) return fail("Logement introuvable.");
  const { data, error } = await supabase
    .from("incidents")
    .insert({ ...values, property_id: propertyId, task_id: taskId, reported_by: session.userId, is_demo: property.is_demo })
    .select("id")
    .single();
  if (error) return fail("Le signalement n’a pas pu être enregistré.");
  await processPendingEvents();
  revalidatePath("/staff/incidents");
  redirect(`/staff/incidents/${data.id}?nouveau=1`);
}

export async function requestIncidentPhotoUpload(incidentId: string, file: { name: string; type: string; size: number }): Promise<UploadTicket> {
  const { supabase } = await staffContext();
  const { data: incident } = await supabase.from("incidents").select("id").eq("id", incidentId).maybeSingle();
  if (!incident) return { ok: false, message: "Signalement introuvable." };
  return createUploadTicket("field-photos", `incidents/${incidentId}`, file.type, file.size, imageTypes);
}

export async function confirmIncidentPhotoUpload(incidentId: string, path: string): Promise<{ ok: boolean; message?: string }> {
  const { supabase, session } = await staffContext();
  const { data: incident } = await supabase.from("incidents").select("id, is_demo").eq("id", incidentId).maybeSingle();
  if (!incident || !path.startsWith(`incidents/${incidentId}/`)) return { ok: false, message: "Emplacement invalide." };
  if (!(await objectExists("field-photos", path))) return { ok: false, message: "Photo non reçue." };
  const { error } = await supabase
    .from("incident_photos")
    .insert({ incident_id: incidentId, storage_path: path, uploaded_by: session.userId, is_demo: incident.is_demo });
  if (error) return { ok: false, message: "Photo non enregistrée." };
  revalidatePath("/staff/incidents");
  return { ok: true };
}
