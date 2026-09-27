import { Compass, Heart, House, Map as MapIcon, type LucideIcon } from "lucide-react";

export type GuideNavItem = { href: string; label: string; icon: LucideIcon; exact?: boolean };

/** Les quatre onglets du guide (barre du bas sur téléphone, en-tête sur ordinateur). */
export const guideNav: GuideNavItem[] = [
  { href: "/guide", label: "Accueil", icon: House, exact: true },
  { href: "/guide/explorer", label: "Explorer", icon: Compass },
  { href: "/guide/carte", label: "Carte", icon: MapIcon },
  { href: "/guide/favoris", label: "Favoris", icon: Heart },
];

export function isGuideNavActive(pathname: string, item: GuideNavItem) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}
