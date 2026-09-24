/**
 * Informations générales de Comme à la Maison.
 *
 * Tout ce qui vaut `null` n'est pas encore connu : le site masque l'élément
 * concerné (téléphone, email, réseaux sociaux) tant qu'il n'est pas renseigné.
 * Il suffit de remplacer `null` par la valeur, entre guillemets.
 */

function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  // Netlify fournit l'adresse principale du site (domaine personnalisé compris) dans URL.
  if (process.env.NETLIFY === "true" && process.env.URL) return process.env.URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export const site = {
  name: "Comme à la Maison",
  tagline: "Votre conciergerie",
  url: resolveSiteUrl().replace(/\/$/, ""),
  locale: "fr_FR",

  /** Titre et description par défaut (référencement). */
  seo: {
    title: "Conciergerie Airbnb à Bordeaux · Comme à la Maison",
    description:
      "Conciergerie Airbnb et gestion de location courte durée à Bordeaux et dans sa métropole. De l'estimation à l'accueil des voyageurs : 20 % TTC des revenus locatifs.",
  },

  /** Phrase courte reprise dans le footer et les données structurées. */
  summary: "Conciergerie Airbnb & location courte durée à Bordeaux et sa métropole.",

  commission: {
    rate: 20,
    label: "20 %",
    /** La commission s'entend toutes taxes comprises. */
    taxNote: "TTC",
  },

  contact: {
    /** Numéros directs, affichés avec le prénom. Format : "06 12 34 56 78". */
    phones: [
      { name: "Baptiste", number: "06 26 34 76 77" },
      { name: "Simon", number: "06 51 50 19 34" },
    ] as Array<{ name: string; number: string }>,
    email: "comme.al.la.maison@gmail.com" as string | null,
    /** Exemple : "Du lundi au samedi, de 9 h à 19 h" */
    availability: null as string | null,
  },

  /** Adresses complètes des profils, par exemple "https://www.instagram.com/…". */
  socials: {
    instagram: null as string | null,
    linkedin: null as string | null,
    facebook: null as string | null,
  },

  area: {
    city: "Bordeaux",
    region: "Bordeaux Métropole",
    /** Les 28 communes de Bordeaux Métropole. */
    communes: [
      "Ambarès-et-Lagrave",
      "Ambès",
      "Artigues-près-Bordeaux",
      "Bassens",
      "Bègles",
      "Blanquefort",
      "Bordeaux",
      "Bouliac",
      "Le Bouscat",
      "Bruges",
      "Carbon-Blanc",
      "Cenon",
      "Eysines",
      "Floirac",
      "Gradignan",
      "Le Haillan",
      "Lormont",
      "Martignas-sur-Jalle",
      "Mérignac",
      "Parempuyre",
      "Pessac",
      "Saint-Aubin-de-Médoc",
      "Saint-Louis-de-Montferrand",
      "Saint-Médard-en-Jalles",
      "Saint-Vincent-de-Paul",
      "Le Taillan-Médoc",
      "Talence",
      "Villenave-d'Ornon",
    ],
  },
} as const;

export type Site = typeof site;
