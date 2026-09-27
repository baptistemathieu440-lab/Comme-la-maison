"use server";

import { revalidatePath } from "next/cache";

import { dbErrorMessage, fail, ok, type ActionState } from "@/lib/action-state";
import { adminContext } from "@/lib/auth/admin-context";
import { FormReader } from "@/lib/form-data";
import { createAdminClient } from "@/lib/supabase/admin";
import { processPendingEvents, runMonthlyStatements } from "@/server/automation/engine";
import { loadStatementDocument } from "@/server/statements/load";
import { renderStatementPdf } from "@/server/statements/pdf";

export async function regenerateStatement(id: string, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { data: statement } = await supabase.from("owner_statements").select("owner_id, period_month").eq("id", id).single();
  if (!statement) return fail("Relevé introuvable.");
  const { error } = await supabase.rpc("generate_statement", { p_owner: statement.owner_id, p_month: statement.period_month });
  if (error) return fail(dbErrorMessage(error));
  revalidatePath(`/admin/releves/${id}`);
  return ok("Relevé recalculé à partir des réservations et dépenses actuelles.");
}

export async function createStatement(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await adminContext();
  const form = new FormReader(formData);
  const owner = form.id("owner_id", true, "Choisissez le propriétaire.");
  const month = form.raw("month");
  if (!/^\d{4}-\d{2}$/.test(month)) form.errors.month = "Choisissez le mois.";
  if (!form.ok || !owner) return fail("Vérifiez les champs indiqués.", form.errors);
  const { error } = await supabase.rpc("generate_statement", { p_owner: owner, p_month: `${month}-01` });
  if (error) return fail(dbErrorMessage(error));
  revalidatePath("/admin/releves");
  return ok("Brouillon prêt.");
}

export async function prepareMonth(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await adminContext();
  const month = String(formData.get("month") ?? "");
  if (!/^\d{4}-\d{2}$/.test(month)) return fail("Choisissez le mois.");
  // Même traitement que la tâche du 1er du mois, pour le mois choisi.
  const next = new Date(Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 1)).toISOString().slice(0, 10);
  const result = await runMonthlyStatements(next);
  revalidatePath("/admin/releves");
  return "skipped" in result && result.skipped
    ? fail("La règle « Brouillons des relevés mensuels » est désactivée dans les automatisations.")
    : ok(`${result.drafts} brouillon(s) préparé(s) ou mis à jour.`);
}

export async function addAdjustment(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await adminContext();
  const form = new FormReader(formData);
  const label = form.text("label", "Décrivez l’ajustement.", 200);
  const amount = form.cents("amount", { required: true, allowNegative: true });
  if (!form.ok || amount === null) return fail("Vérifiez les champs indiqués.", form.errors);
  const { data: statement } = await supabase.from("owner_statements").select("owner_id, period_month, is_demo").eq("id", id).single();
  if (!statement) return fail("Relevé introuvable.");
  const { error } = await supabase.from("statement_lines").insert({
    statement_id: id,
    kind: "adjustment",
    label,
    amount_cents: amount,
    position: 200000,
    is_demo: statement.is_demo,
  });
  if (error) return fail(dbErrorMessage(error));
  await supabase.rpc("generate_statement", { p_owner: statement.owner_id, p_month: statement.period_month });
  revalidatePath(`/admin/releves/${id}`);
  return ok("Ajustement ajouté et totaux recalculés.");
}

export async function removeAdjustment(id: string, lineId: string, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { data: statement } = await supabase.from("owner_statements").select("owner_id, period_month").eq("id", id).single();
  const { error } = await supabase.from("statement_lines").delete().eq("id", lineId).eq("statement_id", id).eq("kind", "adjustment");
  if (error) return fail(dbErrorMessage(error));
  if (statement) await supabase.rpc("generate_statement", { p_owner: statement.owner_id, p_month: statement.period_month });
  revalidatePath(`/admin/releves/${id}`);
  return ok("Ajustement retiré.");
}

/** Finalisation : numéro définitif, identités figées, PDF archivé dans le stockage privé. */
export async function finalizeStatement(id: string, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { data: number, error } = await supabase.rpc("finalize_statement", { p_statement: id });
  if (error) return fail(dbErrorMessage(error));

  const admin = createAdminClient();
  const document = await loadStatementDocument(admin, id);
  if (document) {
    const pdf = await renderStatementPdf(document);
    const path = `${document.statement.owner_id}/${id}.pdf`;
    const { error: uploadError } = await admin.storage.from("statements").upload(path, pdf, { contentType: "application/pdf", upsert: true });
    if (!uploadError) await admin.from("owner_statements").update({ pdf_path: path }).eq("id", id);
  }
  await processPendingEvents();
  revalidatePath(`/admin/releves/${id}`);
  return ok(`Relevé finalisé : facture ${number}. Le propriétaire le retrouve dans son espace.`);
}

export async function markSent(id: string, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { error } = await supabase
    .from("owner_statements")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "final");
  if (error) return fail(dbErrorMessage(error));
  revalidatePath(`/admin/releves/${id}`);
  return ok("Marqué comme envoyé.");
}

export async function recordPayment(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { session, supabase } = await adminContext();
  const form = new FormReader(formData);
  const values = {
    amount_cents: form.cents("amount", { required: true }) ?? 0,
    paid_on: form.date("paid_on", true) ?? "",
    method: form.choice("method", ["transfer", "sepa_debit", "airbnb_split", "card", "cash", "other"] as const, "transfer"),
    reference: form.optional("reference", 120),
    notes: form.optional("notes", 1000),
  };
  if (values.amount_cents === 0) form.errors.amount = "Montant non nul attendu.";
  if (!form.ok) return fail("Vérifiez les champs indiqués.", form.errors);
  const { data: statement } = await supabase.from("owner_statements").select("is_demo").eq("id", id).single();
  const { error } = await supabase.from("payments").insert({ ...values, statement_id: id, created_by: session.userId, is_demo: statement?.is_demo ?? false });
  if (error) return fail(dbErrorMessage(error));
  revalidatePath(`/admin/releves/${id}`);
  return ok("Règlement enregistré.");
}

export async function deletePayment(id: string, paymentId: string, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { error } = await supabase.from("payments").delete().eq("id", paymentId).eq("statement_id", id);
  if (error) return fail(dbErrorMessage(error));
  revalidatePath(`/admin/releves/${id}`);
  return ok("Règlement supprimé.");
}

export async function deleteDraft(id: string, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { error } = await supabase.from("owner_statements").delete().eq("id", id).eq("status", "draft");
  if (error) return fail(dbErrorMessage(error));
  revalidatePath("/admin/releves");
  return ok("Brouillon supprimé.");
}
