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

export const aboutText = [
  "Comme à la Maison est née de l’envie de proposer une conciergerie différente : proche de ses propriétaires, attentive aux voyageurs et transparente dans sa manière de travailler.",
  "Nous sommes deux jeunes associés, Baptiste et Simon, animés par l’envie de construire une entreprise locale et durable. Notre approche repose sur la disponibilité, le sérieux, la confiance et l’attention portée aux détails.",
];
