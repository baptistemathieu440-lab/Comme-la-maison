/**
 * Avis clients.
 *
 * RÈGLE : ne jamais inventer d'avis. Seuls les avis réellement reçus
 * (message, plateforme de réservation, email…) sont publiés, avec l'accord
 * de leur auteur.
 *
 * Pour ajouter un avis, copier un bloc dans `reviews` et le compléter :
 *
 *   {
 *     name: "Sophie",
 *     city: "Bordeaux",          // facultatif (null)
 *     category: "proprietaire",  // "proprietaire", "voyageur" ou "client"
 *     rating: 5,                 // de 1 à 5
 *     text: "Comme à la Maison s’occupe de tout avec beaucoup de sérieux.",
 *     source: "Message reçu",    // facultatif : Airbnb, Booking.com, Google…
 *     date: "septembre 2026",    // facultatif
 *   },
 *
 * Tant que `reviews` est vide, la section « Avis clients » n'apparaît pas
 * sur l'accueil : aucun avis d'exemple n'est jamais montré aux visiteurs.
 */

export type ReviewCategory = "proprietaire" | "voyageur" | "client";

export type Review = {
  name: string;
  city: string | null;
  category: ReviewCategory;
  /** Note sur 5. */
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  source?: string | null;
  date?: string | null;
};

export const reviewCategories: Record<ReviewCategory, { label: string; plural: string }> = {
  proprietaire: { label: "Propriétaire", plural: "Propriétaires" },
  voyageur: { label: "Voyageur", plural: "Voyageurs" },
  client: { label: "Client", plural: "Clients" },
};

/** Véritables avis. */
export const reviews: Review[] = [];

/** Avis publiés sur l'accueil : uniquement de vrais avis. */
export function publishedReviews(): Review[] {
  return reviews;
}
