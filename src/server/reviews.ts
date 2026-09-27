import "server-only";

import { unstable_cache } from "next/cache";

import { publishedReviews, reviewCategories, type Review, type ReviewCategory } from "@/content/reviews";
import { formatMonth } from "@/lib/dates";
import { createAdminClient, isAdminClientConfigured } from "@/lib/supabase/admin";

/**
 * Avis clients du site public (section « Avis » de l'accueil).
 *
 * Source : la table site_reviews, gérée depuis le back-office (Avis clients) :
 * seuls les avis publiés, réels (hors démo) et dont l'auteur a donné son accord.
 * S'y ajoutent les éventuels avis saisis dans src/content/reviews.ts.
 * Sans aucun avis, la section n'est pas affichée : jamais d'avis d'exemple.
 */

export const REVIEWS_TAG = "site-reviews";

type Row = {
  author_name: string;
  city: string | null;
  category: string;
  rating: number;
  body: string;
  source: string | null;
  received_on: string | null;
};

function toReview(row: Row): Review | null {
  if (!(row.category in reviewCategories) || row.rating < 1 || row.rating > 5) return null;
  return {
    name: row.author_name,
    city: row.city,
    category: row.category as ReviewCategory,
    rating: row.rating as Review["rating"],
    text: row.body,
    source: row.source,
    date: row.received_on ? formatMonth(row.received_on) : null,
  };
}

async function loadFromDatabase(): Promise<Review[]> {
  if (!isAdminClientConfigured()) return [];
  const { data, error } = await createAdminClient()
    .from("site_reviews")
    .select("author_name, city, category, rating, body, source, received_on")
    .eq("is_published", true)
    .eq("consent_confirmed", true)
    .eq("is_demo", false)
    .order("position")
    .order("received_on", { ascending: false, nullsFirst: false });
  // Table absente (migration non appliquée) ou erreur : aucun avis de la base.
  if (error || !data) return [];
  return (data as Row[]).map(toReview).filter((review): review is Review => review !== null);
}

/**
 * Avis à afficher. Mis en cache 10 minutes et rafraîchi dès qu'un avis est
 * modifié dans le back-office (étiquette REVIEWS_TAG).
 */
export const getPublishedReviews = unstable_cache(
  async (): Promise<Review[]> => {
    let fromDatabase: Review[] = [];
    try {
      fromDatabase = await loadFromDatabase();
    } catch {
      // Base injoignable : seuls les avis du fichier de contenu restent affichés.
    }
    return [...fromDatabase, ...publishedReviews()];
  },
  ["site-reviews"],
  { tags: [REVIEWS_TAG], revalidate: 600 },
);
