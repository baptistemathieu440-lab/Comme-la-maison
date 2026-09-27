import { readFileSync } from "node:fs";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { generate } from "otplib";

import type { Database } from "../../src/lib/supabase/database.types";

export const AUTH_DIR = "playwright/.auth";
export const PASSWORD = "e2e-motdepasse-2026";

export const accounts = {
  admin: { email: "admin.e2e@example.com", name: "Admin E2E", role: "admin" },
  ownerA: { email: "proprietaire-a.e2e@example.com", name: "Jean Démo", role: "owner", ownerEmail: "jean.demo@example.com" },
  ownerB: { email: "proprietaire-b.e2e@example.com", name: "Claire Démo", role: "owner", ownerEmail: "claire.demo@example.com" },
  staff: { email: "agent.e2e@example.com", name: "Agent E2E", role: "staff" },
} as const;

export type AccountKey = keyof typeof accounts;

const url = () => process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const publishable = () => (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) as string;

/** Client de service (clé secrète) : prépare les données de test, jamais utilisé pour vérifier un droit. */
export function serviceClient(): SupabaseClient<Database> {
  return createClient<Database>(url(), process.env.SUPABASE_SECRET_KEY as string, { auth: { persistSession: false } });
}

/** Client « comme un utilisateur » : clé publiable + session, soumis aux règles d'accès. */
export async function userClient(account: AccountKey, { mfa = true } = {}) {
  const client = createClient<Database>(url(), publishable(), { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await client.auth.signInWithPassword({ email: accounts[account].email, password: PASSWORD });
  if (error) throw error;
  if (account === "admin" && mfa) {
    const { data } = await client.auth.mfa.listFactors();
    const factor = data?.totp[0];
    if (!factor) throw new Error("Facteur TOTP absent pour le compte admin de test.");
    const { error: mfaError } = await client.auth.mfa.challengeAndVerify({ factorId: factor.id, code: await totp() });
    if (mfaError) throw mfaError;
  }
  return client;
}

export function anonymousClient() {
  return createClient<Database>(url(), publishable(), { auth: { persistSession: false } });
}

export async function totp() {
  const { secret } = JSON.parse(readFileSync(`${AUTH_DIR}/totp.json`, "utf8")) as { secret: string };
  return generate({ secret });
}

export function readIds() {
  return JSON.parse(readFileSync(`${AUTH_DIR}/ids.json`, "utf8")) as {
    ownerA: string;
    ownerB: string;
    propertyA: string;
    propertyB: string;
    statementB: string | null;
    statementA: string | null;
    staffTask: string;
    otherTask: string;
  };
}
