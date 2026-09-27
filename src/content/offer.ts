import {
  Clock,
  Eye,
  HeartHandshake,
  House,
  KeyRound,
  MapPin,
  Route,
  Sparkles,
  Sun,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

/** Ce que comprend la commission de 20 %. */
export const included = [
  "Estimation",
  "Étude du marché",
  "Photographie",
  "Gestion de l’annonce",
  "Réservations",
  "Communication voyageurs",
  "Accueil",
  "Check-in / check-out",
  "Coordination du ménage",
  "Gestion du linge",
  "Optimisation des tarifs",
  "Box de bienvenue",
  "Suivi du logement",
];

/** Précisions validées par Baptiste et Simon sur ce qui n'entre pas dans la commission. */
export const pricingNotes = [
  {
    title: "Le ménage",
    text: "Il est réglé par les voyageurs, via les frais de ménage de chaque réservation. Il n’entre pas dans le calcul de notre commission et n’est pas prélevé sur vos revenus : vous recevez ces frais avec le versement de la plateforme, et nous vous les refacturons à l’identique.",
  },
  {
    title: "Le linge",
    text: "Il reste à votre charge. Lors de la première visite, nous vous remettons une liste de recommandations pour améliorer la qualité du logement, que vous êtes libre d’accepter ou non.",
  },
];

export type Pillar = { title: string; text: string; icon: LucideIcon };

/** Notre promesse : quatre avantages, sur l'accueil. */
export const promise: Pillar[] = [
  {
    title: "Gestion complète",
    text: "De l’annonce au ménage, chaque étape est prise en charge.",
    icon: Sparkles,
  },
  {
    title: "Voyageurs accompagnés",
    text: "Un accueil soigné et une réponse à chaque question.",
    icon: KeyRound,
  },
  {
    title: "Logement valorisé",
    text: "Des photos, une annonce et des tarifs à la hauteur de votre bien.",
    icon: House,
  },
  {
    title: "Esprit libéré",
    text: "Vous profitez de votre logement, sans ses contraintes.",
    icon: Sun,
  },
];

/** Pourquoi Comme à la Maison : ce qui nous distingue. */
export const pillars: Pillar[] = [
  {
    title: "Un accompagnement humain",
    text: "Deux associés, joignables directement, qui connaissent votre logement.",
    icon: HeartHandshake,
  },
  {
    title: "Disponibles",
    text: "Une réponse rapide pour vous comme pour vos voyageurs.",
    icon: Clock,
  },
  {
    title: "Ancrés à Bordeaux",
    text: "Une présence locale, dans la ville et ses 27 communes voisines.",
    icon: MapPin,
  },
  {
    title: "Attentifs aux voyageurs",
    text: "Un séjour réussi fait les bons avis, et les prochaines réservations.",
    icon: UsersRound,
  },
  {
    title: "Transparents",
    text: "Une commission affichée, un relevé détaillé chaque mois.",
    icon: Eye,
  },
  {
    title: "À vos côtés, de A à Z",
    text: "De l’estimation au suivi, un seul interlocuteur pour tout.",
    icon: Route,
  },
];

/** La box de bienvenue évolue avec le standing et les revenus du logement. */
export const welcomeBoxTiers = [
  {
    title: "Box essentielle",
    audience: "Logement aux revenus locatifs plus modérés",
    text: "Une attention simple et chaleureuse pour bien commencer le séjour.",
  },
  {
    title: "Box premium",
    audience: "Logement aux revenus locatifs plus importants",
    text: "Une sélection plus travaillée, à la hauteur du standing du logement.",
  },
];

/** Types de logements accompagnés. */
export const propertyTypes = [
  "Studio",
  "Appartement",
  "Maison",
  "Résidence secondaire",
  "Logement d’investissement",
  "Résidence principale louée ponctuellement",
];

/** Étapes de la collaboration (FAQ et section contact). */
export const collaborationSteps = [
  { title: "Premier échange", text: "Vous nous présentez votre logement, par le formulaire ou par téléphone." },
  { title: "Visite et estimation", text: "Nous visitons le logement et estimons son potentiel en location courte durée." },
  { title: "Proposition", text: "Nous vous présentons notre accompagnement et ses modalités, avant tout engagement." },
  { title: "Mise en place", text: "Photos, annonce, stratégie tarifaire : nous préparons la mise en location." },
  { title: "Gestion au quotidien", text: "Nous gérons les séjours et vous gardez la visibilité sur votre activité." },
];
