/**
 * Données de la page « Nos chiffres, en toute transparence ».
 *
 * RÈGLE : ne jamais inventer de données. Une série sans points affiche
 * « Données à venir ». Chaque série publiée doit indiquer sa nature,
 * sa source et sa période : le site refuse d'afficher un graphique
 * qui n'a pas de source ou de période.
 *
 * Pour publier une série, remplir `points`, `source` et `period`, par exemple :
 *
 *   points: [
 *     { label: "janv.", value: 1840 },
 *     { label: "févr.", value: 2210 },
 *   ],
 *   source: "Relevés de versements Airbnb et Booking",
 *   period: "janvier à juin 2027",
 */

/** Nature d'une donnée. Chacune a son propre badge et son propre style graphique. */
export type DataNature = "reel" | "simulation" | "estimation" | "projection";

export const natureInfo: Record<DataNature, { label: string; description: string }> = {
  reel: {
    label: "Donnée réelle",
    description: "Mesurée sur notre activité, à partir d’une source vérifiable.",
  },
  simulation: {
    label: "Simulation",
    description: "Calcul à partir d’hypothèses que vous choisissez, comme dans notre simulateur.",
  },
  estimation: {
    label: "Estimation",
    description: "Évaluation d’une situation actuelle à partir de données partielles ou comparables.",
  },
  projection: {
    label: "Projection",
    description: "Hypothèse sur l’avenir. Elle ne constitue jamais une promesse.",
  },
};

export type MetricPoint = { label: string; value: number };

export type Metric = {
  id: string;
  title: string;
  nature: DataNature;
  /** Unité affichée après la valeur : "€", "%", "nuits"… */
  unit: string;
  /** "bar" pour des montants par période, "line" pour une évolution. */
  chart: "bar" | "line" | "value";
  points: MetricPoint[];
  source: string | null;
  period: string | null;
  /** Mise à jour de la série, par exemple "juillet 2027". */
  updatedAt: string | null;
};

export const metrics: Metric[] = [
  {
    id: "revenus",
    title: "Revenus générés",
    nature: "reel",
    unit: "€",
    chart: "bar",
    points: [],
    source: null,
    period: null,
    updatedAt: null,
  },
  {
    id: "occupation",
    title: "Taux d’occupation",
    nature: "reel",
    unit: "%",
    chart: "line",
    points: [],
    source: null,
    period: null,
    updatedAt: null,
  },
  {
    id: "evolution-revenus",
    title: "Évolution des revenus",
    nature: "reel",
    unit: "€",
    chart: "line",
    points: [],
    source: null,
    period: null,
    updatedAt: null,
  },
  {
    id: "logements",
    title: "Logements gérés",
    nature: "reel",
    unit: "logements",
    chart: "value",
    points: [],
    source: null,
    period: null,
    updatedAt: null,
  },
  {
    id: "nuits",
    title: "Nuits réservées",
    nature: "reel",
    unit: "nuits",
    chart: "bar",
    points: [],
    source: null,
    period: null,
    updatedAt: null,
  },
  {
    id: "voyageurs",
    title: "Voyageurs accueillis",
    nature: "reel",
    unit: "voyageurs",
    chart: "value",
    points: [],
    source: null,
    period: null,
    updatedAt: null,
  },
  {
    id: "note",
    title: "Note moyenne",
    nature: "reel",
    unit: "/ 5",
    chart: "value",
    points: [],
    source: null,
    period: null,
    updatedAt: null,
  },
];

/** Une série n'est publiable que si elle a des points, une source et une période. */
export function isPublishable(metric: Metric) {
  return metric.points.length > 0 && Boolean(metric.source) && Boolean(metric.period);
}
