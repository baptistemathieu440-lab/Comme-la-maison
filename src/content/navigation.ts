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

/** Lien vers les logements proposés en réservation directe : affiché seulement s'il y en a. */
export const listingsNav: NavItem = { label: "Logements", href: "/logements" };

/** Navigation principale, avec les logements quand au moins un bien est publié. */
export function siteNav(withListings: boolean): NavItem[] {
  if (!withListings) return mainNav;
  const index = mainNav.findIndex((item) => item.href === "/transparence");
  return [...mainNav.slice(0, index), listingsNav, ...mainNav.slice(index)];
}

export const primaryCta: NavItem = { label: "Estimer mon logement", href: "/#estimation" };

export const legalNav: NavItem[] = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/confidentialite" },
];
