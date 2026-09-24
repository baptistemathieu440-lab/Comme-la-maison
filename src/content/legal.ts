/**
 * Informations légales.
 *
 * Tout champ à null s'affiche « À compléter » sur les pages
 * Mentions légales et Politique de confidentialité.
 * Remplacer null par la valeur, entre guillemets, dès qu'elle est connue.
 */
export const legal = {
  /** Mise à jour affichée en haut des pages légales. */
  updatedAt: "septembre 2026",

  company: {
    /** Dénomination sociale, par exemple "Comme à la Maison SAS". */
    legalName: null as string | null,
    /** SAS, SARL, EURL… */
    legalForm: null as string | null,
    /** Par exemple "1 000 €". */
    shareCapital: null as string | null,
    /** Adresse complète du siège social. */
    headOffice: null as string | null,
    /** Par exemple "RCS Bordeaux 123 456 789". */
    registration: null as string | null,
    /** Numéro de TVA intracommunautaire. */
    vatNumber: null as string | null,
    /** Nom et qualité du directeur ou de la directrice de la publication. */
    publicationDirector: null as string | null,
  },

  /** Activité réglementée : à renseigner si elle s'applique à votre activité. */
  regulated: {
    /** Carte professionnelle (loi Hoguet) : numéro, mention et CCI de délivrance. */
    professionalCard: null as string | null,
    /** Assureur et numéro de contrat de responsabilité civile professionnelle. */
    liabilityInsurance: null as string | null,
    /** Médiateur de la consommation : nom, site internet et adresse. */
    consumerMediator: null as string | null,
  },

  hosting: {
    /** Par exemple "Vercel Inc." */
    name: null as string | null,
    address: null as string | null,
    contact: null as string | null,
  },

  privacy: {
    /** Personne ou société responsable du traitement des données. */
    controller: null as string | null,
    /** Adresse email pour exercer ses droits. */
    contactEmail: null as string | null,
    /** Durée de conservation des demandes envoyées par le formulaire. */
    retention: null as string | null,
    /** Service utilisé pour recevoir les demandes (par exemple un service d'envoi d'emails). */
    processors: null as string | null,
  },
};
