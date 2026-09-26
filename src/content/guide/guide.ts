/**
 * Textes du guide voyageurs (/guide). Les adresses sont dans places.ts
 * (sélection initiale) puis dans le back-office ; les rubriques dans themes.ts.
 */
export const guide = {
  name: "Le carnet de bonnes adresses",
  /** Accroche (carte QR code, partage). */
  tagline: "Votre carnet de bonnes adresses bordelaises",
  /** Signature (pied de page, partage). */
  signature: "Votre carnet de bonnes adresses bordelaises, préparé par Comme à la Maison.",
  welcome: {
    title: "Bienvenue à Bordeaux",
    wave: "👋",
    text: "Nous avons sélectionné pour vous nos bonnes adresses et nos expériences préférées pour profiter pleinement de Bordeaux et de ses alentours.",
  },
  seo: {
    title: "Guide de Bordeaux : nos bonnes adresses pour les voyageurs",
    description:
      "Le carnet de bonnes adresses bordelaises de Comme à la Maison : que visiter, où manger, où boire un verre, que faire en famille, en couple ou quand il pleut, vignobles et plages autour de Bordeaux.",
  },
  help: {
    title: "Besoin d’un conseil ?",
    questions: [
      "Vous hésitez entre plusieurs restaurants ?",
      "Vous cherchez une activité avec les enfants ?",
      "Vous voulez découvrir un endroit un peu moins touristique ?",
    ],
    cta: "Écrivez-nous, on vous conseille !",
  },
  /** Rappel affiché sous chaque liste. */
  disclaimer: "Horaires, prix et conditions peuvent changer : vérifiez sur le site officiel avant de vous déplacer.",
} as const;
