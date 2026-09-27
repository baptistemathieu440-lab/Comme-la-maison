import type { LucideIcon } from "lucide-react";
import {
  Baby,
  Beer,
  CloudRain,
  Grape,
  Heart,
  Landmark,
  Leaf,
  Map as MapIcon,
  Music,
  Palette,
  PiggyBank,
  ShoppingBag,
  Sparkles,
  Star,
  Users,
  UtensilsCrossed,
  Waves,
} from "lucide-react";

import type { GuidePlace } from "@/lib/guide/place";
import { wineRegions, zones, type WineRegion, type Zone } from "@/lib/guide/taxonomy";

/**
 * Rubriques du guide : une page par rubrique (/guide/<slug>), pensée pour être
 * trouvée sur Google. Le contenu se remplit tout seul à partir des étiquettes de
 * chaque adresse (catégorie, budget, météo…) : ajouter une adresse dans le
 * back-office suffit à la faire apparaître dans les bonnes rubriques.
 * « En famille », « En couple » et « Entre amis » sont des sélections éditoriales
 * (étiquettes « Sélection … ») ; le filtre « Pour qui ? » de l'explorateur, lui,
 * utilise les publics de chaque fiche.
 */

export type ThemeGroup = { key: string; label: string };

/** Champs utiles au classement : présents dans la fiche complète comme dans le résumé envoyé au téléphone. */
export type Matchable = Pick<GuidePlace, "kind" | "tags" | "audiences" | "budget" | "setting" | "isFavorite" | "zone" | "subcategory" | "wineRegion">;

export type Theme = {
  slug: string;
  /** Libellé court (tuiles de l'accueil). */
  label: string;
  /** Titre de la page. */
  title: string;
  icon: LucideIcon;
  /** Balise title et meta description. */
  seoTitle: string;
  description: string;
  intro: string;
  match: (place: Matchable) => boolean;
  /** Regroupement des adresses dans la page. */
  groupBy?: (place: Matchable) => ThemeGroup;
  /** Ordre des groupes (clés), les autres suivent. */
  groupOrder?: string[];
  /** Affichée sur la grille de l'accueil. */
  onHome: boolean;
};

const bySubcategory = (fallback: string) => (place: Matchable): ThemeGroup => {
  const label = place.subcategory?.trim() || fallback;
  return { key: label, label };
};

const byZone = (place: Matchable): ThemeGroup => ({ key: place.zone, label: zones[place.zone].label });

const zoneOrder: Zone[] = ["centre", "metropole", "moins-30", "30-60", "60-120"];

const byWineRegion = (place: Matchable): ThemeGroup => {
  const region: WineRegion = place.wineRegion ?? "bordeaux";
  return { key: region, label: wineRegions[region].label };
};

const byMoment = (place: Matchable): ThemeGroup => {
  if (place.kind === "restaurant") return { key: "manger", label: "Où manger" };
  if (place.kind === "bar" || place.kind === "sortie") return { key: "sortir", label: "Boire un verre, sortir" };
  if (place.kind === "excursion") return { key: "excursion", label: "Pour une journée" };
  return { key: "faire", label: "À voir, à faire" };
};

const momentOrder = ["faire", "manger", "sortir", "excursion"];

export const themes: Theme[] = [
  {
    slug: "incontournables-bordeaux",
    label: "Visiter",
    title: "Les incontournables de Bordeaux",
    icon: Landmark,
    seoTitle: "Que visiter à Bordeaux ? Les incontournables",
    description:
      "Place de la Bourse, Miroir d’eau, Grosse Cloche, Cité du Vin, Saint-Émilion… Les incontournables de Bordeaux sélectionnés par Comme à la Maison, conciergerie bordelaise.",
    intro: "Les lieux à ne pas manquer lors d’un premier séjour. La plupart sont gratuits et se font à pied.",
    match: (p) => p.tags.includes("incontournable"),
    groupBy: byZone,
    groupOrder: zoneOrder,
    onHome: true,
  },
  {
    slug: "restaurants-bordeaux",
    label: "Manger",
    title: "Où manger à Bordeaux",
    icon: UtensilsCrossed,
    seoTitle: "Où manger à Bordeaux ? Nos bonnes adresses de restaurants",
    description:
      "Cuisine bordelaise, huîtres au marché, bistrots, tables étoilées, brunch, végétarien : nos restaurants préférés à Bordeaux, pour tous les budgets.",
    intro: "Des institutions, des bistrots de quartier et quelques grandes tables : il y en a pour tous les budgets.",
    match: (p) => p.kind === "restaurant",
    groupBy: bySubcategory("Restaurants"),
    groupOrder: [
      "Cuisine bordelaise",
      "Petit budget",
      "Bon rapport qualité/prix",
      "Bistrot",
      "Poissons et fruits de mer",
      "Terrasse avec vue",
      "Restaurant avec vue",
      "Brunch et café",
      "Street-food et cantine",
      "Burgers et street-food",
      "Italien",
      "Asiatique",
      "Végétarien",
      "Gastronomique",
    ],
    onHome: true,
  },
  {
    slug: "bars-bordeaux",
    label: "Boire un verre",
    title: "Où boire un verre à Bordeaux",
    icon: Beer,
    seoTitle: "Bars à Bordeaux : vin, cocktails, rooftops et terrasses",
    description:
      "Bars à vin, bars à cocktails, rooftops, pubs et terrasses : où boire un verre à Bordeaux, selon Comme à la Maison.",
    intro: "Un verre de bordeaux au comptoir, un cocktail sur un toit ou une pinte entre amis : nos adresses pour l’apéritif et la soirée.",
    match: (p) => p.kind === "bar",
    groupBy: bySubcategory("Bars"),
    groupOrder: ["Bar à vin", "Bar à cocktails", "Rooftop", "Bar à bières", "Bar animé", "Bar insolite"],
    onHome: true,
  },
  {
    slug: "culture-musees-bordeaux",
    label: "Culture",
    title: "Culture et musées à Bordeaux",
    icon: Palette,
    seoTitle: "Musées et culture à Bordeaux : que voir ?",
    description:
      "Cité du Vin, Bassins des Lumières, musée d’Aquitaine, CAPC, Cap Sciences : les lieux culturels de Bordeaux, avec les jours de gratuité.",
    intro: "Bon à savoir : les musées municipaux sont gratuits le premier dimanche du mois (sauf en juillet et août).",
    match: (p) => p.kind === "culture",
    groupBy: bySubcategory("Culture"),
    onHome: true,
  },
  {
    slug: "bordeaux-en-famille",
    label: "En famille",
    title: "Bordeaux en famille",
    icon: Baby,
    seoTitle: "Que faire à Bordeaux avec des enfants ?",
    description:
      "Guignol, Miroir d’eau, Cap Sciences, zoo, plage du lac, Dune du Pilat : les activités à faire en famille à Bordeaux, avec des enfants ou des ados.",
    intro: "Des idées testées pour les petits comme pour les ados, par beau temps comme par temps de pluie.",
    match: (p) => p.tags.includes("selection-famille"),
    groupBy: byMoment,
    groupOrder: momentOrder,
    onHome: true,
  },
  {
    slug: "bordeaux-en-couple",
    label: "En couple",
    title: "Bordeaux en amoureux",
    icon: Heart,
    seoTitle: "Bordeaux en couple : idées romantiques",
    description:
      "Couchers de soleil sur les quais, restaurants avec vue, dégustations, rooftops, Saint-Émilion : nos idées pour un séjour en amoureux à Bordeaux.",
    intro: "Des balades au coucher du soleil, des tables avec vue et quelques expériences à deux.",
    match: (p) => p.tags.includes("selection-couple"),
    groupBy: byMoment,
    groupOrder: momentOrder,
    onHome: true,
  },
  {
    slug: "bordeaux-entre-amis",
    label: "Entre amis",
    title: "Bordeaux entre amis",
    icon: Users,
    seoTitle: "Que faire à Bordeaux entre amis ?",
    description:
      "Escape game, bowling, comedy club, guinguette, bars et marchés : les meilleures idées de sorties à Bordeaux entre amis.",
    intro: "Pour les week-ends entre amis : activités, bonnes tables à partager et soirées.",
    match: (p) => p.tags.includes("selection-amis"),
    groupBy: byMoment,
    groupOrder: momentOrder,
    onHome: false,
  },
  {
    slug: "sortir-bordeaux",
    label: "Sortir",
    title: "Sortir à Bordeaux",
    icon: Music,
    seoTitle: "Sortir à Bordeaux : concerts, spectacles et soirées",
    description:
      "Concerts, comedy club, guinguette, spectacles, quartiers festifs : où sortir le soir à Bordeaux, pour les fêtards comme pour les plus calmes.",
    intro: "Des soirées animées aux concerts plus calmes. Pensez à regarder l’agenda de chaque salle.",
    match: (p) => p.kind === "sortie" || (p.kind === "bar" && p.audiences.includes("fetards")),
    groupBy: bySubcategory("Sorties"),
    onHome: true,
  },
  {
    slug: "nature-bordeaux",
    label: "Nature",
    title: "Nature et plein air",
    icon: Leaf,
    seoTitle: "Parcs, jardins et balades nature à Bordeaux",
    description:
      "Quais de Garonne, Jardin Public, Parc Bordelais, plage du lac, balades à vélo : où prendre l’air à Bordeaux et autour.",
    intro: "Des parcs pour pique-niquer, des quais pour marcher et des pistes pour pédaler.",
    match: (p) => p.kind === "nature" || (p.kind === "activite" && p.setting === "exterieur" && p.budget === 0),
    groupBy: byZone,
    groupOrder: zoneOrder,
    onHome: true,
  },
  {
    slug: "activites-bordeaux",
    label: "Activités",
    title: "Activités à Bordeaux",
    icon: Sparkles,
    seoTitle: "Que faire à Bordeaux ? Nos idées d’activités",
    description:
      "Bateau sur la Garonne, escape game, ateliers de dégustation, Darwin, zoo, bowling : les activités à faire à Bordeaux selon Comme à la Maison.",
    intro: "De quoi remplir vos journées, entre découvertes, sport et expériences originales.",
    match: (p) => p.kind === "activite",
    groupBy: bySubcategory("Activités"),
    onHome: true,
  },
  {
    slug: "vignobles-bordeaux",
    label: "Vignobles",
    title: "Découvrir les vins de Bordeaux",
    icon: Grape,
    seoTitle: "Vignobles de Bordeaux : visites de châteaux et dégustations",
    description:
      "Saint-Émilion, Médoc, Pessac-Léognan, Sauternes, Blaye, Entre-deux-Mers : où déguster et visiter les châteaux autour de Bordeaux, avec ou sans voiture.",
    intro:
      "De la dégustation abordable en ville au grand cru classé : les réservations sont presque toujours nécessaires dans les châteaux.",
    match: (p) => p.tags.includes("vin"),
    groupBy: byWineRegion,
    groupOrder: ["bordeaux", "pessac-leognan", "saint-emilion", "medoc", "sauternes", "graves", "entre-deux-mers", "blaye-bourg"],
    onHome: true,
  },
  {
    slug: "plages-bordeaux",
    label: "Océan",
    title: "Une envie d’océan ?",
    icon: Waves,
    seoTitle: "Plages près de Bordeaux : Arcachon, Dune du Pilat, Lacanau…",
    description:
      "Arcachon, Dune du Pilat, Cap Ferret, Lacanau, Le Porge, Soulac : les plages et destinations océanes à une heure de Bordeaux, avec temps de trajet et accès.",
    intro:
      "L’océan est à une heure de route. Sur les plages océanes, baignez-vous uniquement dans les zones surveillées : les courants (baïnes) sont puissants.",
    match: (p) => p.tags.includes("ocean"),
    groupBy: byZone,
    groupOrder: zoneOrder,
    onHome: true,
  },
  {
    slug: "autour-de-bordeaux",
    label: "Autour de Bordeaux",
    title: "Une journée autour de Bordeaux",
    icon: MapIcon,
    seoTitle: "Excursions autour de Bordeaux : idées de sorties à la journée",
    description:
      "Saint-Émilion, Arcachon, Blaye, Cap Ferret, Médoc, Sauternes : les plus belles excursions autour de Bordeaux, classées par temps de trajet.",
    intro: "Classées par temps de trajet depuis le centre de Bordeaux. Les durées sont indicatives, hors bouchons.",
    match: (p) => p.zone !== "centre" && (p.kind === "excursion" || p.kind === "nature"),
    groupBy: byZone,
    groupOrder: zoneOrder,
    onHome: true,
  },
  {
    slug: "bordeaux-petit-budget",
    label: "Petit budget",
    title: "Bordeaux à petit budget",
    icon: PiggyBank,
    seoTitle: "Bordeaux pas cher : visites gratuites et bons plans",
    description:
      "Visites gratuites, balades, marchés, parcs, points de vue, musées gratuits le premier dimanche du mois : profiter de Bordeaux sans se ruiner.",
    intro: "Tout ce qui est gratuit ou coûte moins de 15 € par personne. Bordeaux se découvre très bien à pied.",
    match: (p) => p.budget <= 1,
    groupBy: byMoment,
    groupOrder: momentOrder,
    onHome: true,
  },
  {
    slug: "bordeaux-quand-il-pleut",
    label: "Il pleut",
    title: "Pas de chance, il pleut ?",
    icon: CloudRain,
    seoTitle: "Que faire à Bordeaux quand il pleut ?",
    description:
      "Musées, Bassins des Lumières, Cité du Vin, escape game, bowling, cinéma, marché couvert : que faire à Bordeaux par temps de pluie.",
    intro: "Les activités à l’abri : musées, ateliers, bonnes tables et quelques idées pour occuper les enfants.",
    match: (p) => p.setting === "interieur",
    groupBy: byMoment,
    groupOrder: momentOrder,
    onHome: true,
  },
  {
    slug: "coups-de-coeur",
    label: "Nos coups de cœur",
    title: "Les coups de cœur de Comme à la Maison",
    icon: Star,
    seoTitle: "Nos coups de cœur à Bordeaux",
    description: "Les lieux que l’équipe de Comme à la Maison recommande à ses proches : l’esprit bordelais, sans classement.",
    intro:
      "Ceux qu’on recommande à nos proches quand ils viennent nous voir. Pas de classement : ils nous plaisent tous autant.",
    match: (p) => p.isFavorite,
    onHome: false,
  },
  {
    slug: "shopping-bordeaux",
    label: "Shopping",
    title: "Shopping, marchés et spécialités",
    icon: ShoppingBag,
    seoTitle: "Shopping à Bordeaux : marchés, spécialités et souvenirs",
    description:
      "Canelés, chocolats, vins, antiquaires des Chartrons, marché des Capucins, rue Sainte-Catherine : où faire du shopping à Bordeaux.",
    intro: "Des souvenirs qui ont du goût, des marchés vivants et quelques boutiques à ne pas manquer.",
    match: (p) => p.kind === "shopping",
    groupBy: bySubcategory("Boutiques"),
    groupOrder: ["Spécialités et souvenirs", "Marché", "Cave à vin", "Brocante et antiquités", "Boutiques", "Grandes enseignes", "Shopping premium"],
    onHome: false,
  },
];

export function themeBySlug(slug: string) {
  return themes.find((theme) => theme.slug === slug) ?? null;
}

/** Adresses d'une rubrique, regroupées et triées. */
export function groupPlaces<T extends Matchable>(theme: Theme, places: T[]) {
  const matching = places.filter((place) => theme.match(place));
  if (!theme.groupBy) return [{ key: "all", label: "", places: matching }];
  const groups = new Map<string, { key: string; label: string; places: T[] }>();
  for (const place of matching) {
    const group = theme.groupBy(place);
    const entry = groups.get(group.key) ?? { ...group, places: [] };
    entry.places.push(place);
    groups.set(group.key, entry);
  }
  const order = theme.groupOrder ?? [];
  const rank = (key: string) => (order.includes(key) ? order.indexOf(key) : order.length);
  return [...groups.values()].sort((a, b) => rank(a.key) - rank(b.key) || a.label.localeCompare(b.label, "fr"));
}
