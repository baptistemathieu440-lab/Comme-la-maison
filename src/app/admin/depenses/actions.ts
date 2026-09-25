"use server";

import { revalidatePath } from "next/cache";

import { dbErrorMessage, fail, ok, type ActionState } from "@/lib/action-state";
import { adminContext } from "@/lib/auth/admin-context";
import { FormReader } from "@/lib/form-data";

const categories = ["cleaning", "maintenance", "repair", "supplies", "linen", "platform", "equipment", "other"] as const;

function readExpense(form: FormReader) {
  const paidBy = form.choice("paid_by", ["company", "owner"] as const, "company");
  return {
    property_id: form.id("property_id", true, "Choisissez le bien.") ?? "",
    category: form.choice("category", categories, "other"),
    label: form.text("label", "Décrivez la dépense.", 200),
    amount_cents: form.cents("amount", { required: true }) ?? 0,
    incurred_on: form.date("incurred_on", true) ?? "",
    paid_by: paidBy,
    rebill_to_owner: paidBy === "company" && form.bool("rebill_to_owner"),
    supplier: form.optional("supplier", 120),
    notes: form.optional("notes", 2000),
  };
}

export async function createExpense(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { session, supabase } = await adminContext();
  const form = new FormReader(formData);
  const values = readExpense(form);
  if (values.amount_cents <= 0) form.errors.amount = "Montant positif attendu.";
  if (!form.ok) return fail("Vérifiez les champs indiqués.", form.errors);
  const { data: property } = await supabase.from("properties").select("is_demo").eq("id", values.property_id).single();
  const { error } = await supabase.from("expenses").insert({ ...values, created_by: session.userId, is_demo: property?.is_demo ?? false });
  if (error) return fail(dbErrorMessage(error));
  revalidatePath("/admin/depenses");
  return ok(values.rebill_to_owner ? "Dépense enregistrée : elle sera refacturée sur le prochain relevé du propriétaire." : "Dépense enregistrée.");
}

export async function deleteExpense(id: string, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { data: expense } = await supabase.from("expenses").select("statement_id").eq("id", id).single();
  if (expense?.statement_id) return fail("Cette dépense figure dans un relevé finalisé : elle ne peut plus être supprimée.");
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) return fail(dbErrorMessage(error));
  revalidatePath("/admin/depenses");
  return ok("Dépense supprimée.");
}
