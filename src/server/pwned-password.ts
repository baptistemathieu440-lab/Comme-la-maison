import "server-only";

import { createHash } from "node:crypto";

/**
 * Refuse les mots de passe déjà divulgués lors de fuites de données, en interrogeant
 * le service Pwned Passwords de Have I Been Pwned (même source que l'option Supabase,
 * réservée à l'offre Pro).
 *
 * Méthode « k-anonymity » : seuls les 5 premiers caractères de l'empreinte SHA-1 du mot de
 * passe sont envoyés ; le service renvoie toutes les empreintes commençant ainsi et la
 * comparaison se fait ici. Le mot de passe et son empreinte complète ne quittent jamais le
 * serveur. L'en-tête Add-Padding masque aussi la taille de la réponse.
 *
 * Service injoignable : le mot de passe n'est pas bloqué (null), pour ne jamais empêcher
 * quelqu'un de choisir son mot de passe à cause d'une panne extérieure.
 */
const RANGE_URL = "https://api.pwnedpasswords.com/range/";

export async function isPwnedPassword(password: string): Promise<boolean | null> {
  const hash = createHash("sha1").update(password, "utf8").digest("hex").toUpperCase();
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  try {
    const response = await fetch(`${RANGE_URL}${prefix}`, {
      headers: { "Add-Padding": "true", "User-Agent": "Comme-a-la-Maison-plateforme" },
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return null;
    const body = await response.text();
    return body.split("\n").some((line) => {
      const [candidate, count] = line.trim().split(":");
      // Les lignes de remplissage (Add-Padding) ont un compteur à 0.
      return candidate === suffix && Number(count) > 0;
    });
  } catch {
    return null;
  }
}

export const pwnedPasswordMessage =
  "Ce mot de passe figure dans des fuites de données connues : choisissez-en un autre, que vous n’utilisez nulle part ailleurs.";
