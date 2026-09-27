"use server";

import { revalidatePath } from "next/cache";

import { dbErrorMessage, fail, ok, type ActionState } from "@/lib/action-state";
import { adminContext } from "@/lib/auth/admin-context";
import { linkValidity } from "@/lib/auth/link-validity";
import { FormReader } from "@/lib/form-data";
import { createAdminClient } from "@/lib/supabase/admin";
import { inviteUser, passwordLink } from "@/server/invitations";

export async function saveSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { session, supabase } = await adminContext();
  const form = new FormReader(formData);
  const checklist = (form.optional("default_cleaning_checklist", 6000) ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const values = {
    company_name: form.text("company_name", "Indiquez le nom commercial.", 120),
    legal_name: form.optional("legal_name", 160),
    legal_form: form.optional("legal_form", 60),
    share_capital: form.optional("share_capital", 60),
    siren: form.optional("siren", 20),
    registration: form.optional("registration", 120),
    vat_number: form.optional("vat_number", 30),
    head_office: form.optional("head_office", 300),
    email: form.email("email"),
    phone: form.optional("phone", 40),
    website: form.optional("website", 200),
    professional_card: form.optional("professional_card", 200),
    liability_insurance: form.optional("liability_insurance", 300),
    default_commission_bps: form.bps("default_commission", true) ?? 2000,
    vat_registered: form.bool("vat_registered"),
    vat_rate_bps: form.bps("vat_rate", true) ?? 2000,
    invoice_prefix: form.text("invoice_prefix", "Indiquez un préfixe.", 10).toUpperCase(),
    payment_terms_days: form.int("payment_terms_days", { required: true, min: 0, max: 90 }) ?? 15,
    late_penalty_note: form.optional("late_penalty_note", 1000),
    bank_details: form.optional("bank_details", 500),
    default_check_in_time: form.time("default_check_in_time") ?? "16:00",
    default_check_out_time: form.time("default_check_out_time") ?? "11:00",
    primary_residence_night_limit: form.int("primary_residence_night_limit", { required: true, max: 366 }) ?? 120,
    default_cleaning_checklist: checklist,
    updated_by: session.userId,
  };
  if (!/^[A-Z0-9-]{1,10}$/.test(values.invoice_prefix)) form.errors.invoice_prefix = "Lettres majuscules, chiffres et tirets (10 au maximum).";
  if (values.invoice_prefix === "DEMO") form.errors.invoice_prefix = "Préfixe réservé aux relevés de démonstration.";
  if (!form.ok) return fail("Vérifiez les champs indiqués.", form.errors);

  const { error } = await supabase.from("settings").update(values).eq("id", true);
  if (error) return fail(dbErrorMessage(error));
  revalidatePath("/admin/parametres");
  return ok("Paramètres enregistrés. Les réservations existantes gardent le taux enregistré à leur création.");
}

export async function inviteMember(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { session } = await adminContext();
  const form = new FormReader(formData);
  const email = form.email("email", true);
  const fullName = form.text("full_name", "Indiquez le nom.", 120);
  const role = form.choice("role", ["admin", "staff"] as const, "staff");
  if (!form.ok || !email) return fail("Vérifiez les champs indiqués.", form.errors);

  const result = await inviteUser({ email, fullName, role, invitedBy: session.userId });
  if (!result.ok) return fail(result.message);
  revalidatePath("/admin/parametres/utilisateurs");
  if (result.existing) return ok("Ce compte existait déjà : le rôle lui a été ajouté.");
  return {
    ...ok(
      result.emailed
        ? "Invitation envoyée par email."
        : `Compte créé. Aucun service d’email n’est configuré : transmettez ce lien (valable ${linkValidity}).`,
    ),
    link: result.link,
  };
}

export async function removeRole(userId: string, role: "admin" | "staff" | "owner", _prev: ActionState): Promise<ActionState> {
  const { session, supabase } = await adminContext();
  if (role === "admin") {
    if (userId === session.userId) return fail("Vous ne pouvez pas retirer votre propre rôle d’administrateur.");
    const { count } = await supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "admin");
    if ((count ?? 0) <= 1) return fail("Il doit rester au moins un administrateur.");
  }
  const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
  if (error) return fail(dbErrorMessage(error));
  if (role === "staff") {
    // Les tâches à venir de l'agent redeviennent à affecter.
    await supabase.from("tasks").update({ assignee_id: null }).eq("assignee_id", userId).in("status", ["todo"]);
  }
  revalidatePath("/admin/parametres/utilisateurs");
  return ok("Rôle retiré.");
}

export async function memberPasswordLink(userId: string, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { data: profile } = await supabase.from("profiles").select("email").eq("id", userId).single();
  if (!profile?.email) return fail("Compte introuvable.");
  const link = await passwordLink(profile.email);
  return link ? { ...ok(`Lien créé, valable ${linkValidity}.`), link } : fail("Le lien n’a pas pu être créé.");
}

/** Déconnecte l'utilisateur partout et supprime ses facteurs de double authentification. */
export async function resetMemberMfa(userId: string, _prev: ActionState): Promise<ActionState> {
  const { session } = await adminContext();
  if (userId === session.userId) return fail("Utilisez un autre compte administrateur pour réinitialiser le vôtre.");
  const admin = createAdminClient();
  const { data } = await admin.auth.admin.mfa.listFactors({ userId });
  for (const factor of data?.factors ?? []) {
    await admin.auth.admin.mfa.deleteFactor({ userId, id: factor.id });
  }
  return ok("Double authentification réinitialisée : elle sera à configurer de nouveau à la prochaine connexion.");
}

export async function seedDemo(_prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { data, error } = await supabase.rpc("seed_demo_data");
  if (error) return fail(dbErrorMessage(error));
  revalidatePath("/admin", "layout");
  const counts = data as { owners: number; properties: number; bookings: number };
  return ok(`Données de démonstration créées : ${counts.owners} propriétaires, ${counts.properties} biens, ${counts.bookings} réservations.`);
}

export async function purgeDemo(_prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { error } = await supabase.rpc("purge_demo_data");
  if (error) return fail(dbErrorMessage(error));
  revalidatePath("/admin", "layout");
  return ok("Toutes les données de démonstration ont été supprimées.");
}
