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
 * Tant que `reviews` est vide, le site affiche les exemples ci-dessous,
 * signalés comme tels sur chaque carte. Ils disparaissent dès le premier
 * véritable avis ajouté.
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

/** Exemples de mise en page : ce ne sont pas de vrais avis. */
const exampleReviews: Review[] = [
  {
    name: "Prénom",
    city: "Bordeaux",
    category: "proprietaire",
    rating: 5,
    text: "Comme à la Maison s’occupe de tout avec beaucoup de sérieux. Nous avons vraiment gagné en tranquillité.",
  },
  {
    name: "Prénom",
    city: "Lyon",
    category: "voyageur",
    rating: 5,
    text: "Accueil chaleureux, logement impeccable et une box de bienvenue qui fait toute la différence. On s’est sentis comme à la maison.",
  },
  {
    name: "Prénom",
    city: "Mérignac",
    category: "client",
    rating: 5,
    text: "Des interlocuteurs disponibles et transparents, qui prennent le temps d’expliquer leur fonctionnement.",
  },
  {
    name: "Prénom",
    city: "Talence",
    category: "proprietaire",
    rating: 5,
    text: "Un relevé clair chaque mois et un logement toujours impeccable entre deux séjours.",
  },
];

/** Avis affichés : les vrais s'il y en a, sinon les exemples. */
export function publishedReviews(): { items: Review[]; examples: boolean } {
  if (reviews.length > 0) return { items: reviews, examples: false };
  return { items: exampleReviews, examples: true };
}
