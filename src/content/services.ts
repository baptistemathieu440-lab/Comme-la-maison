import {
  BedDouble,
  CalendarCheck,
  Camera,
  ChartLine,
  ClipboardCheck,
  DoorOpen,
  Gift,
  KeyRound,
  LifeBuoy,
  MessagesSquare,
  PenLine,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export type Service = { title: string; text: string; icon: LucideIcon };

/** Les 12 services, dans l'ordre du cycle de location. */
export const services: Service[] = [
  {
    title: "Estimation & étude de marché",
    text: "Nous analysons votre logement et les locations comparables autour de lui pour estimer son potentiel.",
    icon: ChartLine,
  },
  {
    title: "Photographie professionnelle",
    text: "Des photos lumineuses et fidèles, qui mettent en valeur chaque pièce et donnent envie de réserver.",
    icon: Camera,
  },
  {
    title: "Création & optimisation de l’annonce",
    text: "Titre, description, équipements, règles : une annonce claire, mise à jour au fil des saisons.",
    icon: PenLine,
  },
  {
    title: "Gestion des réservations",
    text: "Calendrier, demandes, confirmations : nous suivons chaque réservation de près.",
    icon: CalendarCheck,
  },
  {
    title: "Communication voyageurs",
    text: "Nous répondons aux voyageurs avant, pendant et après leur séjour.",
    icon: MessagesSquare,
  },
  {
    title: "Accueil & check-in",
    text: "Nous organisons l’arrivée des voyageurs et leur remettons tout ce qu’il faut pour s’installer.",
    icon: KeyRound,
  },
  {
    title: "Check-out",
    text: "Nous gérons le départ des voyageurs et la restitution des clés.",
    icon: DoorOpen,
  },
  {
    title: "Ménage & linge",
    text: "Nous coordonnons le ménage et la rotation du linge entre chaque séjour.",
    icon: BedDouble,
  },
  {
    title: "Optimisation tarifaire",
    text: "Nous ajustons les prix selon la saison, la demande et les événements à Bordeaux.",
    icon: TrendingUp,
  },
  {
    title: "Suivi du logement",
    text: "Nous veillons à l’état du logement et vous tenons informé de ce qui s’y passe.",
    icon: ClipboardCheck,
  },
  {
    title: "Box de bienvenue",
    text: "Une attention à l’arrivée, adaptée à la gamme du logement.",
    icon: Gift,
  },
  {
    title: "Assistance voyageurs",
    text: "Une question ou un imprévu pendant le séjour : les voyageurs savent qui contacter.",
    icon: LifeBuoy,
  },
];

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
