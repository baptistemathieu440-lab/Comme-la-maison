export type NavItem = { label: string; href: string };

/** Navigation principale (en-tête et menu mobile). */
export const mainNav: NavItem[] = [
  { label: "Accompagnement", href: "/#accompagnement" },
  { label: "Tarifs", href: "/#tarifs" },
  { label: "Simulateur", href: "/#simulateur" },
  { label: "Qui sommes-nous", href: "/#qui-sommes-nous" },
  { label: "Transparence", href: "/transparence" },
  { label: "FAQ", href: "/#faq" },
];

export const primaryCta: NavItem = { label: "Estimer mon logement", href: "/#estimation" };

export const legalNav: NavItem[] = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/confidentialite" },
];
