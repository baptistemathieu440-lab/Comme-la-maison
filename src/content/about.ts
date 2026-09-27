import type { StaticImageData } from "next/image";

export type Founder = {
  name: string;
  role: string;
  /** Deux lignes sur le parcours ou le rôle. Laisser null tant que ce n'est pas rédigé. */
  bio: string | null;
  /**
   * Photo réelle uniquement (jamais d'image de banque).
   * Pour l'ajouter : déposer le fichier dans src/assets/images/,
   * l'importer en haut de ce fichier, puis remplacer null par la variable importée.
   */
  photo: StaticImageData | null;
};

export const founders: Founder[] = [
  { name: "Baptiste", role: "Co-fondateur", bio: null, photo: null },
  { name: "Simon", role: "Co-fondateur", bio: null, photo: null },
];

/** Présentation courte, reprise sur l'accueil et en tête de la page À propos. */
export const aboutText = [
  "Comme à la Maison est née de l’envie de proposer une conciergerie différente : proche de ses propriétaires, attentive aux voyageurs et transparente dans sa manière de travailler.",
  "Nous sommes deux jeunes associés, Baptiste et Simon, animés par l’envie de construire une entreprise locale et durable. Notre approche repose sur la disponibilité, le sérieux, la confiance et l’attention portée aux détails.",
];

/** Page À propos : notre histoire. */
export const story = {
  title: "Notre histoire",
  paragraphs: [
    "Tout est parti d’un constat simple : louer son logement en courte durée demande du temps, de la disponibilité et beaucoup d’attention. Messages à toute heure, arrivées tardives, ménage entre deux séjours… Beaucoup de propriétaires renoncent, ou s’épuisent.",
    "Nous avons créé Comme à la Maison pour leur simplifier la vie : prendre en charge tout le quotidien de la location, avec le soin que l’on porterait à sa propre maison.",
  ],
};

/** Page À propos : notre vision, notre manière de travailler, notre philosophie. */
export const values = [
  {
    title: "Notre vision",
    text: "Une conciergerie à taille humaine, où chaque logement est suivi de près et chaque propriétaire connaît ses interlocuteurs.",
  },
  {
    title: "Notre manière de travailler",
    text: "Une stratégie propre à chaque bien, un suivi régulier et une information claire : vous savez toujours ce qui se passe chez vous.",
  },
  {
    title: "Notre philosophie",
    text: "Traiter chaque logement comme s’il était le nôtre, et chaque voyageur comme un invité. C’est tout le sens de notre nom.",
  },
];

/** Page À propos : Bordeaux et sa métropole. */
export const territory = {
  title: "Bordeaux, notre terrain",
  text: "Nous intervenons à Bordeaux et dans les communes de sa métropole. Connaître les quartiers, les saisons et les événements de la ville nous permet de positionner chaque logement au bon prix et de conseiller au mieux les voyageurs.",
};
