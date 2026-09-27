import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";
import { supabaseUrl } from "./env";

/**
 * Client Supabase avec la clé secrète : contourne les règles d'accès.
 *
 * Réservé au serveur, et seulement après une vérification explicite des droits :
 * invitations et comptes, liens signés vers les fichiers privés, envoi de fichiers,
 * tâches planifiées (synchronisation iCal, automatisations), formulaire du site.
 */
export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !secretKey) {
    throw new Error("SUPABASE_SECRET_KEY manquante : impossible d'effectuer cette opération côté serveur.");
  }
  return createClient<Database>(supabaseUrl, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

export function isAdminClientConfigured() {
  return Boolean(supabaseUrl && (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY));
}

export type AdminClient = ReturnType<typeof createAdminClient>;
