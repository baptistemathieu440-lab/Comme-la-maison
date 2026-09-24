import { collaborationSteps, included, propertyTypes } from "./offer";
import { site } from "./site";

export type FaqItem = {
  question: string;
  /** Paragraphes de la réponse. */
  answer: string[];
  /** Liste facultative affichée après le premier paragraphe. */
  list?: string[];
};

const communes = site.area.communes.filter((c) => c !== "Bordeaux");

/**
 * Questions fréquentes.
 * Les réponses n'engagent sur aucun élément contractuel encore non défini
 * (durée d'engagement, préavis, frais de mise en place).
 */
export const faq: FaqItem[] = [
  {
    question: "Quel est votre tarif ?",
    answer: [
      "Notre rémunération correspond à 20 % TTC des revenus générés par les locations de votre logement.",
      "Les frais de ménage, réglés par les voyageurs, ne sont pas inclus dans cette base de calcul.",
    ],
  },
  {
    question: "Que comprend la commission de 20 % ?",
    answer: [
      "Elle rémunère l’ensemble de notre accompagnement et de notre gestion :",
      "Le ménage est financé par les frais de ménage payés par les voyageurs. Le linge reste à votre charge : lors de la première visite, nous vous remettons une liste de recommandations, que vous êtes libre d’accepter ou non.",
    ],
    list: included,
  },
  {
    question: "Quels types de logements prenez-vous en charge ?",
    answer: [
      "Tout logement qui peut être loué en courte durée, quelle que soit sa gamme de prix :",
      "Nous adaptons la stratégie, l’annonce et l’accueil à chaque bien.",
    ],
    list: propertyTypes,
  },
  {
    question: "Où intervenez-vous ?",
    answer: [
      `À Bordeaux et dans les communes de Bordeaux Métropole : ${communes.join(", ")}.`,
    ],
  },
  {
    question: "Qui accueille les voyageurs ?",
    answer: [
      "Nous prenons en charge l’accueil et le check-in des voyageurs. Les modalités d’arrivée sont définies avec vous en fonction du logement.",
    ],
  },
  {
    question: "Qui s’occupe du ménage ?",
    answer: [
      "Nous coordonnons le ménage entre chaque séjour. Il est financé par les frais de ménage réglés par les voyageurs lors de leur réservation : il n’est pas prélevé sur vos revenus.",
      "Nous gérons aussi la rotation du linge. Son achat reste à votre charge.",
    ],
  },
  {
    question: "La box de bienvenue est-elle incluse ?",
    answer: [
      "Oui, elle est incluse dans notre commission de 20 %. Son contenu est adapté à la gamme du logement et à l’expérience que nous souhaitons offrir à ses voyageurs.",
    ],
  },
  {
    question: "Comment estimez-vous le potentiel de mon logement ?",
    answer: [
      "Nous étudions votre logement (emplacement, surface, capacité, équipements, niveau de finition) et les logements comparables proposés en location courte durée autour de chez vous, en tenant compte des saisons.",
      "L’estimation est indicative : elle ne constitue pas une garantie de revenus.",
    ],
  },
  {
    question: "Comment fixez-vous les prix ?",
    answer: [
      "Nous définissons une stratégie tarifaire propre à votre logement, puis nous ajustons les prix selon la saison, la demande, les événements à Bordeaux et le remplissage du calendrier.",
    ],
  },
  {
    question: "Puis-je louer uniquement une partie de l’année ?",
    answer: [
      "Oui. Vous pouvez garder certaines périodes pour vous et ne louer votre logement qu’à d’autres dates : nous organisons la gestion autour de votre calendrier.",
      "La location courte durée est encadrée à Bordeaux, avec des règles différentes pour une résidence principale et une résidence secondaire. Nous en parlons ensemble dès le premier échange.",
    ],
  },
  {
    question: "Comment fonctionne la collaboration ?",
    answer: [
      "Elle se déroule en cinq temps :",
      "Les modalités de notre accompagnement vous sont présentées avant tout engagement.",
    ],
    list: collaborationSteps.map((s) => `${s.title} : ${s.text.charAt(0).toLowerCase()}${s.text.slice(1)}`),
  },
];
