import {
  Eye,
  HeartHandshake,
  MapPin,
  MessageCircle,
  ShieldCheck,
  SlidersHorizontal,
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

/** Pourquoi Comme à la Maison : les 6 piliers. */
export const pillars: Pillar[] = [
  {
    title: "Proximité",
    text: "Une présence locale à Bordeaux et dans sa métropole.",
    icon: MapPin,
  },
  {
    title: "Transparence",
    text: "Une commission clairement affichée à 20 %.",
    icon: Eye,
  },
  {
    title: "Simplicité",
    text: "Un interlocuteur pour l’ensemble de la gestion.",
    icon: MessageCircle,
  },
  {
    title: "Soin",
    text: "Une attention portée au logement et à l’expérience voyageur.",
    icon: HeartHandshake,
  },
  {
    title: "Personnalisation",
    text: "Une stratégie adaptée à chaque logement.",
    icon: SlidersHorizontal,
  },
  {
    title: "Confiance",
    text: "Une relation directe avec deux associés impliqués.",
    icon: ShieldCheck,
  },
];

/** Ce qu'un propriétaire gère seul, et que nous prenons en charge. */
export const ownerTasks = [
  "Messages",
  "Réservations",
  "Calendrier",
  "Tarifs",
  "Arrivées",
  "Départs",
  "Ménage",
  "Linge",
  "Voyageurs",
  "Imprévus",
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
