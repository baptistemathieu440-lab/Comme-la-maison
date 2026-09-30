export type NavItem = { label: string; href: string };

/** Navigation principale (en-tête et menu mobile). */
export const mainNav: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Nos biens", href: "/nos-biens" },
  { label: "Nos offres", href: "/nos-offres" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "À propos", href: "/a-propos" },
  { label: "FAQ", href: "/faq" },
];

export const contactNav: NavItem = { label: "Contact", href: "/contact" };

/** L'unique appel à l'action du site : confier son logement. */
export const primaryCta: NavItem = { label: "Confier mon bien", href: "/contact" };

/** Commission, simulateur et fonctionnement : la page Tarifs. */
export const pricingHref = "/tarifs";

/**
 * Accès aux espaces connectés (back-office, propriétaires, agents) : bouton « Connexion »
 * de l'en-tête (avec une icône), menu mobile et pied de page.
 */
export const loginNav: NavItem = { label: "Connexion à votre espace", href: "/connexion" };

/** Documents légaux : pied de page, guide voyageurs, page de connexion et pages légales entre elles. */
export const legalNav: NavItem[] = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/politique-confidentialite" },
  { label: "Politique cookies", href: "/politique-cookies" },
  { label: "Conditions générales", href: "/conditions-generales-vente" },
];

/** Plan du site, dans le pied de page. */
export const footerNav: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Nos biens", href: "/nos-biens" },
  { label: "Nos offres", href: "/nos-offres" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "À propos de nous", href: "/a-propos" },
  { label: "FAQ", href: "/faq" },
  contactNav,
  { label: "Transparence", href: "/transparence" },
];
