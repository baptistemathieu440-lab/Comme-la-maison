"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { dbErrorMessage, fail, ok, type ActionState } from "@/lib/action-state";
import { adminContext } from "@/lib/auth/admin-context";
import { FormReader } from "@/lib/form-data";

function read(form: FormReader) {
  const company = form.optional("company_name", 120);
  const last = form.optional("last_name", 80) ?? "";
  if (!company && !last) form.errors.company_name = "Indiquez une société ou un nom.";
  return {
    contact: {
      company_name: company,
      first_name: form.optional("first_name", 80) ?? "",
      last_name: last,
      email: form.email("email"),
      phone: form.optional("phone", 40),
      address_line: form.optional("address_line", 200),
      city: form.optional("city", 80),
    },
    provider: {
      trade: form.text("trade", "Indiquez le métier.", 80),
      siret: form.optional("siret", 20),
      active: form.bool("active"),
      notes: form.optional("notes", 4000),
    },
  };
}

export async function saveProvider(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { session, supabase } = await adminContext();
  const form = new FormReader(formData);
  const { contact, provider } = read(form);
  if (!form.ok) return fail("Vérifiez les champs indiqués.", form.errors);

  if (id) {
    const { data: current } = await supabase.from("providers").select("contact_id").eq("id", id).single();
    if (!current) return fail("Prestataire introuvable.");
    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from("contacts").update(contact).eq("id", current.contact_id),
      supabase.from("providers").update(provider).eq("id", id),
    ]);
    if (e1 || e2) return fail(dbErrorMessage(e1 ?? e2));
    revalidatePath(`/admin/prestataires/${id}`);
    return ok("Prestataire enregistré.");
  }

  const { data: created, error } = await supabase.from("contacts").insert({ ...contact, created_by: session.userId }).select("id").single();
  if (error) return fail(dbErrorMessage(error));
  const { data: row, error: e2 } = await supabase.from("providers").insert({ ...provider, contact_id: created.id }).select("id").single();
  if (e2) return fail(dbErrorMessage(e2));
  revalidatePath("/admin/prestataires");
  redirect(`/admin/prestataires/${row.id}`);
}
