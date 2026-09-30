/**
 * Libellés français et tonalités des statuts.
 * Chaque tonalité s'accompagne d'une icône et d'un texte : jamais la couleur seule.
 */

export type Tone = "neutral" | "positive" | "warning" | "danger" | "info" | "muted";

export type Labelled = { label: string; tone: Tone };

function map<T extends string>(entries: Record<T, Labelled>) {
  return entries;
}

export const propertyStatus = map({
  active: { label: "Actif", tone: "positive" },
  onboarding: { label: "En préparation", tone: "info" },
  maintenance: { label: "En maintenance", tone: "warning" },
  unavailable: { label: "Indisponible", tone: "muted" },
  inactive: { label: "Inactif", tone: "muted" },
});

export const propertyType = {
  studio: "Studio",
  apartment: "Appartement",
  house: "Maison",
  villa: "Villa",
  room: "Chambre",
  other: "Autre",
} as const;

export const ownerStatus = map({
  onboarding: { label: "Arrivée en cours", tone: "info" },
  active: { label: "Actif", tone: "positive" },
  inactive: { label: "Inactif", tone: "muted" },
});

export const prospectStatus = map({
  new: { label: "Nouveau", tone: "info" },
  contacted: { label: "Contacté", tone: "neutral" },
  meeting: { label: "Rendez-vous", tone: "neutral" },
  proposal_sent: { label: "Proposition envoyée", tone: "warning" },
  thinking: { label: "En réflexion", tone: "warning" },
  won: { label: "Signé", tone: "positive" },
  lost: { label: "Refusé", tone: "muted" },
});

export const prospectSource = {
  website: "Site internet",
  phone: "Téléphone",
  email: "Email",
  referral: "Recommandation",
  event: "Événement",
  other: "Autre",
} as const;

export const bookingStatus = map({
  inquiry: { label: "Demande", tone: "info" },
  confirmed: { label: "Confirmée", tone: "positive" },
  in_progress: { label: "En cours", tone: "positive" },
  completed: { label: "Terminée", tone: "neutral" },
  cancelled: { label: "Annulée", tone: "muted" },
});

export const bookingSource = {
  manual: "Saisie manuelle",
  ical: "Calendrier iCal",
  channel_manager: "Channel manager",
  website: "Site internet",
} as const;

export const blockKind = map({
  owner_stay: { label: "Séjour du propriétaire", tone: "info" },
  maintenance: { label: "Travaux / maintenance", tone: "warning" },
  blocked: { label: "Dates bloquées", tone: "muted" },
  platform_reservation: { label: "Réservation importée (iCal)", tone: "neutral" },
});

export const taskType = {
  cleaning: "Ménage",
  inspection: "Contrôle",
  check_in: "Accueil (check-in)",
  check_out: "Départ (check-out)",
  maintenance: "Maintenance",
  linen: "Linge",
  other: "Autre",
} as const;

export const taskStatus = map({
  todo: { label: "À faire", tone: "info" },
  in_progress: { label: "En cours", tone: "warning" },
  done: { label: "Terminée, à valider", tone: "neutral" },
  validated: { label: "Validée", tone: "positive" },
  cancelled: { label: "Annulée", tone: "muted" },
});

export const incidentSeverity = map({
  low: { label: "Faible", tone: "neutral" },
  medium: { label: "Moyenne", tone: "warning" },
  high: { label: "Élevée", tone: "danger" },
  critical: { label: "Critique", tone: "danger" },
});

export const incidentStatus = map({
  open: { label: "Ouvert", tone: "danger" },
  in_progress: { label: "En traitement", tone: "warning" },
  resolved: { label: "Résolu", tone: "positive" },
});

export const maintenanceStatus = map({
  planned: { label: "Planifiée", tone: "info" },
  in_progress: { label: "En cours", tone: "warning" },
  done: { label: "Terminée", tone: "positive" },
  cancelled: { label: "Annulée", tone: "muted" },
});

export const expenseCategory = {
  cleaning: "Ménage",
  maintenance: "Entretien",
  repair: "Réparation",
  supplies: "Consommables",
  linen: "Linge",
  platform: "Plateforme",
  equipment: "Équipement",
  other: "Autre",
} as const;

export const statementStatus = map({
  draft: { label: "Brouillon", tone: "muted" },
  final: { label: "Finalisé", tone: "info" },
  sent: { label: "Envoyé", tone: "warning" },
  paid: { label: "Réglé", tone: "positive" },
});

export const paymentMethod = {
  transfer: "Virement",
  sepa_debit: "Prélèvement SEPA",
  airbnb_split: "Part co-hôte Airbnb",
  card: "Carte bancaire",
  cash: "Espèces",
  other: "Autre",
} as const;

export const documentCategory = {
  contract: "Contrat",
  invoice: "Facture",
  statement: "Relevé",
  receipt: "Justificatif",
  identity: "Pièce d’identité",
  insurance: "Assurance",
  diagnostic: "Diagnostic",
  inventory: "État des lieux / inventaire",
  photo: "Photo",
  compliance: "Conformité du logement",
  other: "Autre",
} as const;

/**
 * Conformité d'un logement : suivi interne des justificatifs fournis par le propriétaire.
 * Aucun libellé ne dit « conforme » : la plateforme ne certifie rien.
 */
export const complianceStatus = map({
  to_check: { label: "À vérifier", tone: "warning" },
  in_progress: { label: "Vérification en cours", tone: "info" },
  documents_received: { label: "Justificatifs reçus", tone: "positive" },
  issue: { label: "Point bloquant", tone: "danger" },
});

export const changeOfUseStatus = map({
  to_check: { label: "À vérifier", tone: "warning" },
  not_required: { label: "Non requise (selon le propriétaire)", tone: "muted" },
  pending: { label: "Demandée, en attente", tone: "info" },
  granted: { label: "Obtenue", tone: "positive" },
  refused: { label: "Refusée", tone: "danger" },
});

export const condoRulesStatus = map({
  to_check: { label: "À vérifier", tone: "warning" },
  not_applicable: { label: "Pas de copropriété", tone: "muted" },
  allowed: { label: "Location courte durée permise", tone: "positive" },
  forbidden: { label: "Location courte durée interdite", tone: "danger" },
});

export const contractStatus = map({
  draft: { label: "Brouillon", tone: "muted" },
  active: { label: "Actif", tone: "positive" },
  ended: { label: "Terminé", tone: "neutral" },
});

export const roleLabel = {
  admin: "Administrateur",
  staff: "Agent",
  owner: "Propriétaire",
} as const;

export const syncStatus = map({
  running: { label: "En cours", tone: "info" },
  success: { label: "Réussie", tone: "positive" },
  partial: { label: "Partielle", tone: "warning" },
  error: { label: "Échec", tone: "danger" },
});

export function labelOf<T extends Record<string, Labelled>>(entries: T, key: string | null | undefined): Labelled {
  return (key && entries[key as keyof T]) || { label: key ?? "—", tone: "neutral" };
}

export function textOf<T extends Record<string, string>>(entries: T, key: string | null | undefined) {
  return (key && entries[key as keyof T]) || key || "—";
}

/** Options de liste déroulante à partir d'un dictionnaire de libellés. */
export function optionsOf(entries: Record<string, Labelled | string>) {
  return Object.entries(entries).map(([value, entry]) => ({
    value,
    label: typeof entry === "string" ? entry : entry.label,
  }));
}
