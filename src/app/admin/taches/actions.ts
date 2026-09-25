"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { dbErrorMessage, fail, ok, type ActionState } from "@/lib/action-state";
import { adminContext } from "@/lib/auth/admin-context";
import { FormReader } from "@/lib/form-data";
import { taskType } from "@/lib/labels";
import { removeObjects } from "@/lib/storage";
import { processPendingEvents } from "@/server/automation/engine";

const types = ["cleaning", "inspection", "check_in", "check_out", "maintenance", "linen", "other"] as const;
const statuses = ["todo", "in_progress", "done", "validated", "cancelled"] as const;

function readTask(form: FormReader) {
  const checklist = (form.optional("checklist", 6000) ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return {
    type: form.choice("type", types, "cleaning"),
    property_id: form.id("property_id", true, "Choisissez le bien.") ?? "",
    booking_id: form.id("booking_id"),
    assignee_id: form.id("assignee_id"),
    title: form.optional("title", 160),
    instructions: form.optional("instructions", 4000),
    due_date: form.date("due_date", true) ?? "",
    window_start: form.time("window_start"),
    window_end: form.time("window_end"),
    checklist,
  };
}

async function defaultChecklist(supabase: Awaited<ReturnType<typeof adminContext>>["supabase"], propertyId: string) {
  const [{ data: property }, { data: settings }] = await Promise.all([
    supabase.from("properties").select("name, cleaning_checklist, is_demo").eq("id", propertyId).single(),
    supabase.from("settings").select("default_cleaning_checklist").single(),
  ]);
  const labels = (Array.isArray(property?.cleaning_checklist) ? property.cleaning_checklist : settings?.default_cleaning_checklist) as string[] | null;
  return { property, labels: labels ?? [] };
}

export async function createTask(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { session, supabase } = await adminContext();
  const form = new FormReader(formData);
  const values = readTask(form);
  if (!form.ok) return fail("Vérifiez les champs indiqués.", form.errors);

  const { property, labels } = await defaultChecklist(supabase, values.property_id);
  const checklistLabels = values.checklist.length ? values.checklist : values.type === "cleaning" ? labels : [];
  const { data: task, error } = await supabase
    .from("tasks")
    .insert({
      ...values,
      title: values.title ?? `${taskType[values.type]} · ${property?.name ?? ""}`.trim(),
      checklist: checklistLabels.map((label) => ({ label, done: false })),
      created_by: session.userId,
      is_demo: property?.is_demo ?? false,
    })
    .select("id")
    .single();
  if (error) return fail(dbErrorMessage(error));
  await processPendingEvents();
  revalidatePath("/admin/taches");
  redirect(`/admin/taches/${task.id}`);
}

export async function updateTask(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await adminContext();
  const form = new FormReader(formData);
  const values = readTask(form);
  if (!form.ok) return fail("Vérifiez les champs indiqués.", form.errors);

  const { data: current } = await supabase.from("tasks").select("checklist").eq("id", id).single();
  const previous = (Array.isArray(current?.checklist) ? current.checklist : []) as Array<{ label: string; done: boolean }>;
  const checklist = values.checklist.map((label) => ({ label, done: previous.find((item) => item.label === label)?.done ?? false }));
  const { error } = await supabase
    .from("tasks")
    .update({ ...values, title: values.title ?? undefined, checklist })
    .eq("id", id);
  if (error) return fail(dbErrorMessage(error));
  await processPendingEvents();
  revalidatePath(`/admin/taches/${id}`);
  return ok("Tâche enregistrée.");
}

export async function setTaskStatus(id: string, status: (typeof statuses)[number], _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { error } = await supabase.from("tasks").update({ status }).eq("id", id);
  if (error) return fail(dbErrorMessage(error));
  await processPendingEvents();
  revalidatePath(`/admin/taches/${id}`);
  revalidatePath("/admin/taches");
  return ok(status === "validated" ? "Tâche validée." : "Statut mis à jour.");
}

export async function assignTask(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await adminContext();
  const assignee = String(formData.get("assignee_id") ?? "") || null;
  const { error } = await supabase.from("tasks").update({ assignee_id: assignee }).eq("id", id);
  if (error) return fail(dbErrorMessage(error));
  await processPendingEvents();
  revalidatePath("/admin/taches");
  revalidatePath(`/admin/taches/${id}`);
  return ok(assignee ? "Agent affecté et prévenu." : "Affectation retirée.");
}

export async function deleteTask(id: string, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { data: photos } = await supabase.from("task_photos").select("storage_path").eq("task_id", id);
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) return fail(dbErrorMessage(error));
  await removeObjects("field-photos", (photos ?? []).map((p) => p.storage_path));
  revalidatePath("/admin/taches");
  redirect("/admin/taches");
}
