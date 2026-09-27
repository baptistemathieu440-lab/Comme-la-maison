import { collaborationSteps, included, propertyTypes } from "./offer";
import { site } from "./site";

export type FaqCategory = "fonctionnement" | "tarifs" | "prestations" | "proprietaires" | "voyageurs" | "biens";

export type FaqItem = {
  question: string;
  category: FaqCategory;
  /** Paragraphes de la réponse. */
  answer: string[];
  /** Liste facultative affichée après le premier paragraphe. */
  list?: string[];
  /** Lien facultatif, affiché après la réponse. */
  link?: { label: string; href: string };
};

/** Thèmes de la page FAQ, dans l'ordre d'affichage. */
export const faqCategories: Array<{ id: FaqCategory; label: string }> = [
  { id: "fonctionnement", label: "Fonctionnement" },
  { id: "tarifs", label: "Tarifs" },
  { id: "prestations", label: "Prestations" },
  { id: "proprietaires", label: "Propriétaires" },
  { id: "biens", label: "Nos biens" },
  { id: "voyageurs", label: "Voyageurs" },
];

const communes = site.area.communes.filter((c) => c !== "Bordeaux");

/**
 * Questions fréquentes.
 * Les réponses n'engagent sur aucun élément contractuel encore non défini
 * (durée d'engagement, préavis, frais de mise en place).
 */
export const faq: FaqItem[] = [
  {
    question: "Que fait concrètement une conciergerie ?",
    category: "fonctionnement",
    answer: [
      "Nous gérons la location courte durée de votre logement à votre place : estimation, photos et annonce, réservations, échanges avec les voyageurs, accueil, ménage entre les séjours, linge et suivi du logement.",
      "Vous gardez la main sur votre calendrier et la visibilité sur votre activité ; nous nous occupons du quotidien.",
    ],
    link: { label: "Voir le détail de nos offres", href: "/nos-offres" },
  },
  {
    question: "Comment fonctionne la collaboration ?",
    category: "fonctionnement",
    answer: [
      "Elle se déroule en cinq temps :",
      "Les modalités de notre accompagnement vous sont présentées avant tout engagement.",
    ],
    list: collaborationSteps.map((s) => `${s.title} : ${s.text.charAt(0).toLowerCase()}${s.text.slice(1)}`),
  },
  {
    question: "Où intervenez-vous ?",
    category: "fonctionnement",
    answer: [
      `À Bordeaux et dans les communes de Bordeaux Métropole : ${communes.join(", ")}.`,
    ],
  },
  {
    question: "Quel est votre tarif ?",
    category: "tarifs",
    answer: [
      "Notre rémunération correspond à 20 % TTC du prix des nuitées que vous percevez réellement, c’est-à-dire après déduction des frais prélevés par la plateforme (Airbnb, Booking.com, Abritel…).",
      "Les frais de ménage, réglés par les voyageurs, et la taxe de séjour ne sont pas inclus dans cette base de calcul.",
    ],
  },
  {
    question: "Que comprend la commission de 20 % ?",
    category: "tarifs",
    answer: [
      "Elle rémunère l’ensemble de notre accompagnement et de notre gestion :",
      "Le ménage est financé par les frais de ménage payés par les voyageurs. Le linge reste à votre charge : lors de la première visite, nous vous remettons une liste de recommandations, que vous êtes libre d’accepter ou non.",
    ],
    list: included,
  },
  {
    question: "Comment se calcule la commission, sur un exemple ?",
    category: "tarifs",
    answer: [
      "Exemple illustratif : sur un mois, la plateforme vous verse 1 000 € pour les nuitées, après avoir prélevé ses propres frais. Notre commission est de 20 % TTC de ce montant, soit 200 €.",
      "Les frais de ménage, payés par les voyageurs, et la taxe de séjour ne sont pas comptés dans ce calcul.",
    ],
    link: { label: "Essayer le simulateur", href: "/tarifs#simulateur" },
  },
  {
    question: "Qui reçoit l’argent des réservations ?",
    category: "tarifs",
    answer: [
      "Vous. Les plateformes versent le prix des séjours directement sur votre compte bancaire : l’argent de vos locations ne transite pas par nous.",
      "Chaque mois, nous vous adressons un relevé détaillé, réservation par réservation, avec la facture de notre commission.",
    ],
  },
  {
    question: "La box de bienvenue est-elle incluse ?",
    category: "tarifs",
    answer: [
      "Oui, elle est incluse dans notre commission de 20 %. Son contenu est adapté à la gamme du logement et à l’expérience que nous souhaitons offrir à ses voyageurs.",
    ],
  },
  {
    question: "Le simulateur garantit-il un niveau de revenus ?",
    category: "tarifs",
    answer: [
      "Non. Le simulateur applique notre commission aux montants que vous saisissez : c’est une simulation indicative. Les revenus réels varient selon la saison, la demande, le logement, sa localisation et son taux d’occupation.",
      "Pour une estimation propre à votre logement, nous le visitons et l’étudions avec vous.",
    ],
  },
  {
    question: "Quels types de logements prenez-vous en charge ?",
    category: "biens",
    answer: [
      "Tout logement qui peut être loué en courte durée, quelle que soit sa gamme de prix :",
      "Nous adaptons la stratégie, l’annonce et l’accueil à chaque bien.",
    ],
    list: propertyTypes,
  },
  {
    question: "Qui accueille les voyageurs ?",
    category: "prestations",
    answer: [
      "Nous prenons en charge l’accueil et le check-in des voyageurs. Les modalités d’arrivée sont définies avec vous en fonction du logement.",
    ],
  },
  {
    question: "Qui s’occupe du ménage ?",
    category: "prestations",
    answer: [
      "Nous coordonnons le ménage entre chaque séjour. Il est financé par les frais de ménage réglés par les voyageurs lors de leur réservation : il n’est pas prélevé sur vos revenus.",
      "Nous gérons aussi la rotation du linge. Son achat reste à votre charge.",
    ],
  },
  {
    question: "Comment estimez-vous le potentiel de mon logement ?",
    category: "proprietaires",
    answer: [
      "Nous étudions votre logement (emplacement, surface, capacité, équipements, niveau de finition) et les logements comparables proposés en location courte durée autour de chez vous, en tenant compte des saisons.",
      "L’estimation est indicative : elle ne constitue pas une garantie de revenus.",
    ],
  },
  {
    question: "Comment fixez-vous les prix ?",
    category: "prestations",
    answer: [
      "Nous définissons une stratégie tarifaire propre à votre logement, puis nous ajustons les prix selon la saison, la demande, les événements à Bordeaux et le remplissage du calendrier.",
    ],
  },
  {
    question: "Puis-je louer uniquement une partie de l’année ?",
    category: "proprietaires",
    answer: [
      "Oui. Vous pouvez garder certaines périodes pour vous et ne louer votre logement qu’à d’autres dates : nous organisons la gestion autour de votre calendrier.",
      "La location courte durée est encadrée à Bordeaux, avec des règles différentes pour une résidence principale et une résidence secondaire. Nous en parlons ensemble dès le premier échange.",
    ],
  },
  {
    question: "Comment suivre l’activité de mon logement ?",
    category: "proprietaires",
    answer: [
      "Vous disposez d’un espace en ligne pour suivre votre activité : réservations, calendrier, relevés et documents. Chaque mois, vous recevez aussi un relevé détaillé, réservation par réservation.",
      "Votre espace est accessible depuis le bouton « Connexion », en haut de chaque page.",
    ],
  },
  {
    question: "Où voir les logements que vous accompagnez ?",
    category: "biens",
    answer: [
      "Sur la page Nos biens, avec leurs photos, leurs caractéristiques et leurs disponibilités. Les logements y apparaissent au fur et à mesure qu’ils sont proposés à la réservation directe.",
    ],
    link: { label: "Découvrir nos biens", href: "/nos-biens" },
  },
  {
    question: "Je suis voyageur : puis-je réserver un logement en direct ?",
    category: "voyageurs",
    answer: [
      "Oui. Sur la fiche d’un logement, choisissez vos dates et envoyez votre demande de séjour. Rien n’est réservé ni payé à ce stade : nous vous recontactons personnellement pour confirmer la disponibilité et le tarif.",
    ],
    link: { label: "Voir les logements", href: "/nos-biens" },
  },
  {
    question: "Qui contacter pendant mon séjour ?",
    category: "voyageurs",
    answer: [
      "Nous répondons aux voyageurs avant, pendant et après leur séjour : pour une question ou un imprévu, vous savez qui contacter, et nous vous répondons personnellement.",
    ],
  },
  {
    question: "Avez-vous des conseils pour découvrir Bordeaux ?",
    category: "voyageurs",
    answer: [
      "Oui : notre carnet de bonnes adresses, accessible par QR code dans nos logements, réunit nos visites, restaurants, bars, balades et excursions préférés, ainsi que des itinéraires de 24, 48 et 72 heures.",
    ],
    link: { label: "Ouvrir le guide du voyageur", href: "/guide" },
  },
];

/** Questions d'un thème, dans l'ordre de la liste. */
export function faqByCategory(category: FaqCategory) {
  return faq.filter((item) => item.category === category);
}
