import {
  Landmark,
  Leaf,
  Map as MapIcon,
  Music,
  Palette,
  ShoppingBag,
  Sparkles,
  UtensilsCrossed,
  Wine,
  type LucideIcon,
} from "lucide-react";

import type { Kind } from "./taxonomy";

/** Icône de chaque catégorie (cartes, carte interactive, filtres). */
export const kindIcons: Record<Kind, LucideIcon> = {
  patrimoine: Landmark,
  culture: Palette,
  restaurant: UtensilsCrossed,
  bar: Wine,
  activite: Sparkles,
  nature: Leaf,
  shopping: ShoppingBag,
  sortie: Music,
  excursion: MapIcon,
};
