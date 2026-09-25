import type { StaticImageData } from "next/image";
import {
  BedDouble,
  CalendarCheck,
  Camera,
  ChartLine,
  ClipboardCheck,
  DoorOpen,
  Gift,
  Handshake,
  KeyRound,
  LifeBuoy,
  MessagesSquare,
  PenLine,
  Search,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { images } from "./images";

export type Service = { title: string; text: string; icon: LucideIcon };

export type ServiceGroup = {
  /** Ancre sur la page Nos offres. */
  id: string;
  title: string;
  /** Une phrase, pour la carte de l'accueil. */
  summary: string;
  image: { src: StaticImageData; alt: string };
  services: Service[];
};

/**
 * Nos offres, en quatre familles.
 * L'accueil n'affiche que le titre et la phrase de chaque famille ;
 * la page Nos offres détaille chaque service.
 */
export const serviceGroups: ServiceGroup[] = [
  {
    id: "gestion-complete",
    title: "Gestion complète",
    summary: "Réservations, calendrier, tarifs : la location courte durée de votre logement, de A à Z.",
    image: images.keys,
    services: [
      {
        title: "Gestion complète de la location",
        text: "Nous prenons en charge chaque étape de la location courte durée, pour que vous n’ayez plus rien à gérer.",
        icon: Sparkles,
      },
      {
        title: "Gestion des réservations",
        text: "Calendrier, demandes, confirmations : nous suivons chaque réservation de près, sur toutes les plateformes.",
        icon: CalendarCheck,
      },
      {
        title: "Optimisation tarifaire",
        text: "Nous ajustons les prix selon la saison, la demande, les événements à Bordeaux et le remplissage du calendrier.",
        icon: TrendingUp,
      },
      {
        title: "Accompagnement du propriétaire",
        text: "Un interlocuteur direct, un espace en ligne pour suivre votre activité et un relevé détaillé chaque mois.",
        icon: Handshake,
      },
    ],
  },
  {
    id: "accueil-voyageurs",
    title: "Accueil & voyageurs",
    summary: "Des voyageurs accueillis, accompagnés et écoutés, de la réservation au départ.",
    image: images.welcomeBox,
    services: [
      {
        title: "Accueil des voyageurs",
        text: "Nous organisons l’arrivée des voyageurs et leur remettons tout ce qu’il faut pour s’installer.",
        icon: KeyRound,
      },
      {
        title: "Arrivées et départs",
        text: "Check-in, check-out, restitution des clés : chaque passage est préparé et vérifié.",
        icon: DoorOpen,
      },
      {
        title: "Communication avec les voyageurs",
        text: "Nous répondons aux voyageurs avant, pendant et après leur séjour.",
        icon: MessagesSquare,
      },
      {
        title: "Assistance pendant le séjour",
        text: "Une question ou un imprévu : les voyageurs savent qui contacter.",
        icon: LifeBuoy,
      },
    ],
  },
  {
    id: "entretien-linge",
    title: "Entretien & linge",
    summary: "Un logement impeccable entre chaque séjour, et une attention à l’arrivée.",
    image: images.linen,
    services: [
      {
        title: "Ménage entre chaque séjour",
        text: "Nous coordonnons le ménage et contrôlons le logement avant chaque arrivée.",
        icon: ClipboardCheck,
      },
      {
        title: "Gestion du linge",
        text: "Nous gérons la rotation du linge de lit et de toilette entre les séjours.",
        icon: BedDouble,
      },
      {
        title: "Box de bienvenue",
        text: "Une attention à l’arrivée, adaptée au standing du logement.",
        icon: Gift,
      },
    ],
  },
  {
    id: "valorisation",
    title: "Valorisation du logement",
    summary: "Estimation, étude du marché, photos et annonce : votre bien sous son meilleur jour.",
    image: images.promise,
    services: [
      {
        title: "Estimation du bien",
        text: "Nous étudions votre logement pour estimer son potentiel en location courte durée.",
        icon: ChartLine,
      },
      {
        title: "Étude du marché",
        text: "Nous analysons les logements comparables autour de chez vous, saison par saison.",
        icon: Search,
      },
      {
        title: "Photographie professionnelle",
        text: "Des photos lumineuses et fidèles, qui mettent en valeur chaque pièce et donnent envie de réserver.",
        icon: Camera,
      },
      {
        title: "Création de l’annonce",
        text: "Titre, description, équipements, règles : une annonce claire, mise à jour au fil des saisons.",
        icon: PenLine,
      },
    ],
  },
];

/** Tous les services, dans l'ordre des familles. */
export const services: Service[] = serviceGroups.flatMap((group) => group.services);

/** Le parcours Avant / Pendant / Après. */
export const journey = [
  {
    step: "Avant",
    title: "La mise en location",
    items: [
      "Estimation du potentiel",
      "Étude du marché",
      "Photographie professionnelle",
      "Création de l’annonce",
      "Mise en place de la stratégie tarifaire",
    ],
  },
  {
    step: "Pendant",
    title: "Chaque séjour",
    items: [
      "Gestion des réservations",
      "Communication voyageurs",
      "Optimisation des tarifs",
      "Accueil",
      "Check-in",
      "Assistance",
    ],
  },
  {
    step: "Après",
    title: "Entre deux séjours",
    items: [
      "Check-out",
      "Ménage",
      "Gestion du linge",
      "Contrôle du logement",
      "Préparation du prochain séjour",
      "Box de bienvenue",
    ],
  },
] as const;
