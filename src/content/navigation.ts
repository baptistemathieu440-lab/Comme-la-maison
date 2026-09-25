export type NavItem = { label: string; href: string };

/** Navigation principale (en-tête et menu mobile). */
export const mainNav: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Nos biens", href: "/nos-biens" },
  { label: "Nos offres", href: "/nos-offres" },
  { label: "À propos", href: "/a-propos" },
];

export const contactNav: NavItem = { label: "Contact", href: "/contact" };

/** L'unique appel à l'action du site : confier son logement. */
export const primaryCta: NavItem = { label: "Confier mon bien", href: "/contact" };

/** Détail de la commission, sur la page Nos offres. */
export const pricingHref = "/nos-offres#fonctionnement";

export const legalNav: NavItem[] = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/politique-confidentialite" },
];

/** Plan du site, dans le pied de page. */
export const footerNav: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Nos biens", href: "/nos-biens" },
  { label: "Nos offres", href: "/nos-offres" },
  { label: "À propos de nous", href: "/a-propos" },
  contactNav,
  { label: "Transparence", href: "/transparence" },
];
