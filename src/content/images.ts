import type { StaticImageData } from "next/image";

import boxPetitDejeuner from "@/assets/images/box-petit-dejeuner.jpg";
import bordeauxPontDePierre from "@/assets/images/bordeaux-pont-de-pierre.jpg";
import chambreLin from "@/assets/images/chambre-lin.jpg";
import clesPorte from "@/assets/images/cles-porte.jpg";
import fauteuilPlaid from "@/assets/images/fauteuil-plaid.jpg";
import salonLumiere from "@/assets/images/salon-lumiere.jpg";

export type SiteImage = {
  src: StaticImageData;
  alt: string;
  /** true tant que la photo n'est pas une photo de Comme à la Maison. */
  placeholder: boolean;
  credit: string;
};

/**
 * Photographies du site.
 *
 * Les photos actuelles sont PROVISOIRES : images du domaine public (licence CC0),
 * choisies pour l'ambiance recherchée. Pour les remplacer par vos photos :
 * 1. déposer le fichier dans src/assets/images/ ;
 * 2. changer l'import correspondant ci-dessus ;
 * 3. mettre à jour le texte alternatif (alt), qui décrit la photo pour les
 *    personnes aveugles et pour Google, et passer placeholder à false.
 */
export const images = {
  hero: {
    src: salonLumiere,
    alt: "Salon baigné de lumière du soir, canapé vert, coussins terracotta et parquet en bois clair",
    placeholder: true,
    credit: "Travel Adventures, StockSnap (CC0)",
  },
  promise: {
    src: fauteuilPlaid,
    alt: "Fauteuil capitonné avec coussin, plaid en laine et tasse posée à côté, dans une lumière douce",
    placeholder: true,
    credit: "rawpixel (CC0, domaine public)",
  },
  welcomeBox: {
    src: boxPetitDejeuner,
    alt: "Panier en osier, viennoiserie, jus d’orange et café dressés sur une table près d’une fenêtre",
    placeholder: true,
    credit: "Matt Bango, StockSnap et rawpixel (CC0)",
  },
  bordeaux: {
    src: bordeauxPontDePierre,
    alt: "Le pont de pierre de Bordeaux illuminé à la tombée de la nuit, au-dessus de la Garonne",
    placeholder: true,
    credit: "rawpixel (CC0, domaine public)",
  },
  keys: {
    src: clesPorte,
    alt: "Trousseau de clés glissé dans la serrure d’une porte d’entrée ouverte sur un jardin",
    placeholder: true,
    credit: "WDnet Studio, StockSnap (CC0)",
  },
  linen: {
    src: chambreLin,
    alt: "Chambre lumineuse, lit fait de linge blanc, lampe de chevet et petit bouquet",
    placeholder: true,
    credit: "Burst, StockSnap (CC0)",
  },
} satisfies Record<string, SiteImage>;
