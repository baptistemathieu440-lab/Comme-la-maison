/**
 * Variables d'environnement Supabase.
 *
 * Publiques (lisibles par le navigateur) : l'adresse du projet et la clé publiable,
 * qui ne donnent accès qu'à ce que les règles d'accès (RLS) autorisent.
 * La clé secrète est lue uniquement dans src/lib/supabase/admin.ts (côté serveur).
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** La plateforme (espaces connectés) est-elle branchée sur une base ? */
export function isPlatformConfigured() {
  return Boolean(supabaseUrl && supabasePublishableKey);
}
