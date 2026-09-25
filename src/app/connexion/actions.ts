"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { fail, ok, type ActionState } from "@/lib/action-state";
import { linkValidity } from "@/lib/auth/link-validity";
import { homeFor, safeNext, type Role } from "@/lib/auth/session";
import { createAdminClient, isAdminClientConfigured } from "@/lib/supabase/admin";
import { createClient, type ServerClient } from "@/lib/supabase/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function origin() {
  const h = await headers();
  const fromHeader = h.get("origin");
  if (fromHeader) return fromHeader;
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

async function rolesOf(supabase: ServerClient, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  return (data ?? []).map((row) => row.role as Role);
}

/**
 * Après une connexion : les administrateurs passent par la double authentification
 * (configuration la première fois), les autres vont directement dans leur espace.
 */
async function destinationAfterSignIn(supabase: ServerClient, userId: string, next: string | null) {
  const roles = await rolesOf(supabase, userId);
  if (roles.length === 0) {
    await supabase.auth.signOut();
    return "/connexion?erreur=aucun-role";
  }
  if (roles.includes("admin")) {
    const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (data?.nextLevel !== "aal2") return "/connexion/double-authentification/configuration";
    if (data.currentLevel !== "aal2") {
      return next ? `/connexion/double-authentification?suite=${encodeURIComponent(next)}` : "/connexion/double-authentification";
    }
  }
  const home = homeFor({ roles, aal: "aal1" });
  return next && roles.some((role) => next.startsWith(`/${role}`)) ? next : home;
}

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = field(formData, "email").toLowerCase();
  const password = typeof formData.get("password") === "string" ? String(formData.get("password")) : "";
  const errors: Record<string, string> = {};
  if (!EMAIL.test(email)) errors.email = "Indiquez l’adresse email de votre compte.";
  if (!password) errors.password = "Indiquez votre mot de passe.";
  if (Object.keys(errors).length) return fail("Vérifiez les champs indiqués.", errors);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return fail(
      error?.status === 429
        ? "Trop de tentatives. Patientez quelques minutes avant de réessayer."
        : "Email ou mot de passe incorrect.",
    );
  }

  // Compte créé avec un mot de passe provisoire : il est remplacé avant tout le reste.
  if (data.user.user_metadata?.must_change_password === true) redirect("/connexion/nouveau-mot-de-passe");

  redirect(await destinationAfterSignIn(supabase, data.user.id, safeNext(field(formData, "suite"))));
}

export async function sendMagicLink(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = field(formData, "email").toLowerCase();
  if (!EMAIL.test(email)) return fail("Indiquez une adresse email valide.", { email: "Indiquez une adresse email valide." });

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false, emailRedirectTo: `${await origin()}/auth/confirm` },
  });
  if (error?.status === 429) return fail("Trop de demandes. Patientez quelques minutes avant de réessayer.");
  // Même réponse que le compte existe ou non : on ne révèle pas quelles adresses ont un compte.
  return ok(`Si un compte existe pour cette adresse, un lien de connexion vient de lui être envoyé. Il est valable ${linkValidity}.`);
}

export async function requestPasswordReset(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = field(formData, "email").toLowerCase();
  if (!EMAIL.test(email)) return fail("Indiquez une adresse email valide.", { email: "Indiquez une adresse email valide." });

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await origin()}/auth/confirm?suite=/connexion/nouveau-mot-de-passe`,
  });
  if (error?.status === 429) return fail("Trop de demandes. Patientez quelques minutes avant de réessayer.");
  return ok("Si un compte existe pour cette adresse, un lien pour choisir un nouveau mot de passe vient de lui être envoyé.");
}

export async function updatePassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");
  const errors: Record<string, string> = {};
  if (password.length < 10 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    errors.password = "Au moins 10 caractères, avec des lettres et des chiffres.";
  }
  if (password !== confirmation) errors.confirmation = "Les deux mots de passe ne sont pas identiques.";
  if (Object.keys(errors).length) return fail("Vérifiez les champs indiqués.", errors);

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return fail("Votre lien a expiré. Demandez un nouveau lien pour choisir votre mot de passe.");

  const { error } = await supabase.auth.updateUser({ password, data: { must_change_password: false } });
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

  // Nouveau jeton de session : il ne porte plus l'obligation de changer le mot de passe.
  await supabase.auth.refreshSession();

  // L'invitation est acceptée dès que la personne a choisi son mot de passe.
  if (isAdminClientConfigured()) {
    await createAdminClient()
      .from("invitations")
      .update({ accepted_at: new Date().toISOString() })
      .eq("user_id", userId)
      .is("accepted_at", null);
  }

  redirect(await destinationAfterSignIn(supabase, userId, null));
}

/** Démarre l'ajout d'une application d'authentification (TOTP). */
export async function startTotpEnrollment(): Promise<
  { ok: true; factorId: string; qrCode: string; secret: string } | { ok: false; message: string }
> {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) return { ok: false, message: "Votre session a expiré. Reconnectez-vous." };

  // Retire les essais non terminés pour repartir d'un code neuf.
  const { data: factors } = await supabase.auth.mfa.listFactors();
  for (const factor of factors?.all ?? []) {
    if (factor.status !== "verified") await supabase.auth.mfa.unenroll({ factorId: factor.id });
  }

  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    friendlyName: `Application d’authentification ${new Date().toISOString().slice(0, 16)}`,
    issuer: "Comme à la Maison",
  });
  if (error || !data) return { ok: false, message: "Le code n’a pas pu être généré. Réessayez." };
  return { ok: true, factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret };
}

function readCode(formData: FormData) {
  return String(formData.get("code") ?? "").replace(/\s/g, "");
}

export async function confirmTotpEnrollment(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const factorId = String(formData.get("factorId") ?? "");
  const code = readCode(formData);
  if (!/^\d{6}$/.test(code)) return fail("Saisissez les 6 chiffres affichés par l’application.", { code: "6 chiffres." });

  const supabase = await createClient();
  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
  if (error) return fail("Code incorrect ou expiré. Saisissez le code affiché en ce moment.", { code: "Code incorrect." });
  redirect("/admin");
}

export async function verifyTotp(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const code = readCode(formData);
  if (!/^\d{6}$/.test(code)) return fail("Saisissez les 6 chiffres affichés par l’application.", { code: "6 chiffres." });

  const supabase = await createClient();
  const { data: factors } = await supabase.auth.mfa.listFactors();
  const factor = factors?.totp?.find((f) => f.status === "verified");
  if (!factor) redirect("/connexion/double-authentification/configuration");

  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: factor.id, code });
  if (error) return fail("Code incorrect ou expiré. Saisissez le code affiché en ce moment.", { code: "Code incorrect." });

  const next = safeNext(field(formData, "suite"));
  redirect(next?.startsWith("/admin") ? next : "/admin");
}
