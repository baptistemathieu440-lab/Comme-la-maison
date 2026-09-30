/**
 * Informations légales : source unique des pages Mentions légales, Politique de
 * confidentialité, Politique cookies et Conditions générales.
 *
 * Tout champ à null s'affiche « [À COMPLÉTER — …] » sur ces pages. Remplacer null
 * par la valeur exacte, entre guillemets, dès qu'elle est connue (Kbis, avis de
 * situation INSEE, contrat d'assurance…). Ne jamais saisir une valeur supposée.
 *
 * Les factures PDF lisent l'identité de la société dans le back-office
 * (Paramètres) : renseigner les deux endroits. Liste des démarches : JURIDIQUE_A_FAIRE.md.
 */
export const legal = {
  /** Mise à jour affichée en haut des pages légales. */
  updatedAt: "30 septembre 2026",

  company: {
    /** Dénomination sociale exacte (Kbis ou avis de situation INSEE). */
    legalName: null as string | null,
    /** SAS, SASU, SARL, EURL, entreprise individuelle… */
    legalForm: null as string | null,
    /** Montant du capital social (sociétés uniquement), par exemple "1 000 €". */
    shareCapital: null as string | null,
    /** Adresse complète du siège social. */
    headOffice: null as string | null,
    /** SIREN (9 chiffres). */
    siren: null as string | null,
    /** SIRET du siège (14 chiffres). */
    siret: null as string | null,
    /** Immatriculation : "RCS Bordeaux …" pour une société commerciale, ou mention RNE selon le cas. */
    registration: null as string | null,
    /** Numéro de TVA intracommunautaire, ou la mention de franchise si l'entreprise n'est pas assujettie. */
    vatNumber: null as string | null,
    /** Nom et qualité du directeur ou de la directrice de la publication (représentant légal). */
    publicationDirector: null as string | null,
  },

  /**
   * Réglementation professionnelle. Ne rien renseigner ici tant que la question n'a pas été
   * tranchée par un professionnel du droit ou la CCI (voir JURIDIQUE_A_FAIRE.md, section A).
   */
  regulated: {
    /**
     * Qualification de l'activité au regard de la loi n° 70-9 du 2 janvier 1970 (loi Hoguet).
     * "pending" tant qu'elle n'est pas validée ; "not-required" ou "card" ensuite.
     */
    hoguetStatus: "pending" as "pending" | "not-required" | "card",
    /** Si une carte est nécessaire : numéro, mention (G, T…) et CCI de délivrance. */
    professionalCard: null as string | null,
    /** Si une carte est nécessaire : garant financier et montant de la garantie. */
    financialGuarantee: null as string | null,
    /** Assureur, numéro de contrat et zone couverte de la responsabilité civile professionnelle. */
    liabilityInsurance: null as string | null,
    /** Médiateur de la consommation : nom, site internet et adresse (obligatoire envers les particuliers). */
    consumerMediator: null as string | null,
  },

  /**
   * Demandes de séjour en ligne (page de chaque logement).
   * Recueillir des demandes de voyageurs pour le compte des propriétaires fait partie des
   * activités à qualifier au regard de la loi Hoguet : elles restent fermées tant que ce point
   * n'est pas validé. Passer à true seulement après validation écrite.
   * (STAY_REQUESTS_OPEN=true dans l'environnement a le même effet ; utilisé par les tests.)
   */
  stayRequestsValidated: false as boolean,

  /** Hébergeur du site (vérifié dans la configuration : netlify.toml et projet Netlify). */
  hosting: {
    name: "Netlify, Inc." as string | null,
    /** Adresse indiquée dans la politique de confidentialité de Netlify (mise à jour du 10 avril 2026). */
    address: "101 2nd Street, San Francisco, CA 94105, États-Unis" as string | null,
    /** Téléphone de l'hébergeur : Netlify n'en publie pas dans ses documents légaux. */
    phone: null as string | null,
    website: "www.netlify.com" as string | null,
  },

  /** Hébergement de la base de données et des fichiers de la plateforme. */
  dataHosting: {
    name: "Supabase" as string | null,
    location: "Union européenne, région Paris (eu-west-3)" as string | null,
    website: "supabase.com" as string | null,
  },

  privacy: {
    /** Adresse email pour exercer ses droits. */
    contactEmail: "comme.al.la.maison@gmail.com" as string | null,
    /** Adresse postale pour exercer ses droits (souvent le siège). */
    postalAddress: null as string | null,
    /** Délégué à la protection des données, s'il en est désigné un (facultatif pour une petite structure). */
    dpo: null as string | null,
  },

  /**
   * Durées de conservation. Les durées à null sont à décider par les dirigeants
   * (le référentiel CNIL « gestion commerciale » sert de repère) puis à appliquer réellement.
   */
  retention: {
    prospects: null as string | null,
    stayRequests: null as string | null,
    owners: null as string | null,
    /** Obligation légale : 10 ans (article L123-22 du Code de commerce). */
    accounting: "10 ans à compter de la clôture de l’exercice (obligation comptable)" as string | null,
    guests: null as string | null,
    staff: null as string | null,
    accounts: null as string | null,
    auditLog: null as string | null,
    reviews: null as string | null,
  },

  /** Conditions contractuelles avec les propriétaires : valeurs issues du contrat signé. */
  contract: {
    /** Durée initiale du contrat et renouvellement. */
    duration: null as string | null,
    /** Préavis de résiliation. */
    noticePeriod: null as string | null,
    /** Délai de paiement des relevés-factures. */
    paymentTerms: null as string | null,
    /** Pénalités de retard (taux) applicables. */
    latePenalties: null as string | null,
    /** Tarifs des prestations complémentaires non comprises dans la commission. */
    extraServicesPricing: null as string | null,
    /** Tribunal compétent entre professionnels. */
    court: null as string | null,
  },
};

/** Les demandes de séjour en ligne sont-elles ouvertes ? */
export function stayRequestsOpen() {
  return legal.stayRequestsValidated || process.env.STAY_REQUESTS_OPEN === "true";
}

/** Nom affiché de l'éditeur : la dénomination sociale si elle est connue. */
export function publisherName(fallback: string) {
  return legal.company.legalName ?? fallback;
}
