"use server";

import { createClient as createStatelessClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

import { fail, ok, type ActionState } from "@/lib/action-state";
import { requireSession } from "@/lib/auth/session";
import { supabaseUrl, supabasePublishableKey } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/** Nom et téléphone du compte connecté (la base empêche de changer l'email par ce biais). */
export async function updateAccountProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireSession();
  const fullName = text(formData, "full_name");
  const phone = text(formData, "phone");
  const errors: Record<string, string> = {};
  if (!fullName) errors.full_name = "Indiquez votre nom.";
  else if (fullName.length > 80) errors.full_name = "80 caractères au maximum.";
  if (phone && !/^\d{9,15}$/.test(phone.replace(/[\s.\-()]/g, "").replace(/^\+/, ""))) {
    errors.phone = "Ce numéro semble incomplet. Exemple : 06 12 34 56 78.";
  }
  if (Object.keys(errors).length) return fail("Vérifiez les champs indiqués.", errors);

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, phone: phone || null })
    .eq("id", session.userId);
  if (error) return fail("Vos informations n’ont pas pu être enregistrées. Réessayez.");
  revalidatePath("/", "layout");
  return ok("Vos informations sont enregistrées.");
}

/**
 * Changement de mot de passe depuis l'espace connecté. Le mot de passe actuel est
 * vérifié par une connexion séparée, aussitôt fermée : la session en cours (et sa
 * double authentification) n'est pas touchée.
 */
export async function changeAccountPassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireSession();
  const current = String(formData.get("current_password") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");
  const errors: Record<string, string> = {};
  if (!current) errors.current_password = "Indiquez votre mot de passe actuel.";
  if (password.length < 10 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    errors.password = "Au moins 10 caractères, avec des lettres et des chiffres.";
  }
  if (password !== confirmation) errors.confirmation = "Les deux mots de passe ne sont pas identiques.";
  if (Object.keys(errors).length) return fail("Vérifiez les champs indiqués.", errors);

  const check = createStatelessClient(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { data: verified, error: checkError } = await check.auth.signInWithPassword({ email: session.email, password: current });
  if (checkError || !verified.session) {
    return checkError?.status === 429
      ? fail("Trop de tentatives. Patientez quelques minutes avant de réessayer.")
      : fail("Le mot de passe actuel est incorrect.", { current_password: "Mot de passe incorrect." });
  }
  await check.auth.signOut({ scope: "local" });

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return fail(
      error.code === "same_password"
        ? "Choisissez un mot de passe différent de l’actuel."
        : error.code === "weak_password"
          ? "Ce mot de passe est trop simple. Ajoutez des lettres et des chiffres."
          : "Le mot de passe n’a pas pu être enregistré. Réessayez.",
      error.code === "same_password" || error.code === "weak_password" ? { password: "Choisissez un autre mot de passe." } : undefined,
    );
  }
  return ok("Votre mot de passe est modifié. Utilisez-le à votre prochaine connexion.");
}
