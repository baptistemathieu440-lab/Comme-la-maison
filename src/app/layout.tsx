import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Instrument_Sans, Playfair_Display } from "next/font/google";

import { site } from "@/content/site";

import "./globals.css";

// Polices auto-hébergées au moment du build : aucun appel à Google pendant la visite.
const instrument = Instrument_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-instrument",
  display: "swap",
});

// Titres du site public : une serif élégante, réservée au site (les espaces connectés gardent Instrument Sans).
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.seo.title,
    template: `%s · ${site.name}`,
  },
  description: site.seo.description,
  applicationName: site.name,
  keywords: [
    "conciergerie Airbnb Bordeaux",
    "conciergerie Bordeaux",
    "gestion Airbnb Bordeaux",
    "gestion location courte durée Bordeaux",
    "conciergerie location saisonnière Bordeaux",
    "conciergerie Bordeaux Métropole",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: site.seo.title,
    description: site.seo.description,
    url: "/",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Comme à la Maison, conciergerie Airbnb à Bordeaux : votre logement, notre savoir-faire.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
    images: ["/og.png"],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f5f0e7",
  colorScheme: "light",
};

/**
 * Layout racine commun au site public et aux espaces connectés.
 * Chaque groupe fournit sa propre structure et un élément #contenu
 * (cible du lien d'évitement).
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${instrument.variable} ${playfair.variable} ${hanken.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#contenu"
          className="text-button fixed left-4 top-3 z-[60] -translate-y-24 rounded-full bg-maison px-5 py-3.5 text-cream shadow-float transition-transform focus:translate-y-0"
        >
          Aller au contenu
        </a>
        {children}
      </body>
    </html>
  );
}
