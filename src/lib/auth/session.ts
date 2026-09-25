import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { isPlatformConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type Role = "admin" | "staff" | "owner";

export type Session = {
  userId: string;
  email: string;
  fullName: string;
  /** Niveau d'authentification : aal2 après la double authentification. */
  aal: "aal1" | "aal2";
  roles: Role[];
};

const roleOrder: Role[] = ["admin", "staff", "owner"];

/**
 * Session vérifiée (signature du jeton contrôlée par Supabase) et rôles du compte.
 * Mise en cache pour la durée d'un rendu.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  if (!isPlatformConfigured()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return null;

  const claims = data.claims;
  const userId = claims.sub;
  const [{ data: roleRows }, { data: profile }] = await Promise.all([
    supabase.from("user_roles").select("role").eq("user_id", userId),
    supabase.from("profiles").select("full_name, email").eq("id", userId).maybeSingle(),
  ]);

  const roles = (roleRows ?? [])
    .map((row) => row.role as Role)
    .filter((role) => roleOrder.includes(role))
    .sort((a, b) => roleOrder.indexOf(a) - roleOrder.indexOf(b));

  return {
    userId,
    email: profile?.email || (typeof claims.email === "string" ? claims.email : ""),
    fullName: profile?.full_name ?? "",
    aal: claims.aal === "aal2" ? "aal2" : "aal1",
    roles,
  };
});

/** Page d'accueil d'un compte selon son rôle principal. */
export function homeFor(session: Pick<Session, "roles" | "aal">) {
  if (session.roles.includes("admin")) return "/admin";
  if (session.roles.includes("staff")) return "/staff";
  if (session.roles.includes("owner")) return "/owner";
  return "/connexion?erreur=aucun-role";
}

/** Adresse de retour acceptée après connexion : uniquement un espace de la plateforme. */
export function safeNext(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  return /^\/(admin|owner|staff)(\/|$)/.test(value) ? value : null;
}

async function currentPath() {
  return (await headers()).get("x-pathname") ?? "";
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    const next = safeNext(await currentPath());
    redirect(next ? `/connexion?suite=${encodeURIComponent(next)}` : "/connexion");
  }
  return session;
}

/**
 * Exige un rôle. À appeler dans chaque page ET chaque action serveur :
 * un layout ne suffit pas à protéger une route.
 */
export async function requireRole(role: Role) {
  const session = await requireSession();
  if (!session.roles.includes(role)) {
    const home = homeFor(session);
    redirect(home.startsWith(`/${role}`) ? "/connexion?erreur=acces" : home);
  }
  if (role === "admin" && session.aal !== "aal2") {
    redirect("/connexion/double-authentification");
  }
  return session;
}

export const requireAdmin = () => requireRole("admin");
export const requireStaff = () => requireRole("staff");
export const requireOwner = () => requireRole("owner");
