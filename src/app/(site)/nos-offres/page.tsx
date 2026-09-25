import type { Metadata } from "next";
import Link from "next/link";

import { ContactCta } from "@/components/sections/ContactCta";
import { Faq } from "@/components/sections/Faq";
import { Journey } from "@/components/sections/Journey";
import { Pricing } from "@/components/sections/Pricing";
import { SimulatorSection } from "@/components/sections/SimulatorSection";
import { WelcomeBox } from "@/components/sections/WelcomeBox";
import { ServiceGroups } from "@/components/sections/offers/ServiceGroups";
import { PageHero, Period } from "@/components/ui/Section";
import { site } from "@/content/site";
import { JsonLd, faqJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Nos offres · Conciergerie à Bordeaux",
  description: `Gestion complète, accueil des voyageurs, ménage et linge, box de bienvenue, photos et estimation : toutes les prestations de ${site.name} à Bordeaux, pour ${site.commission.label} ${site.commission.taxNote} ${site.commission.base}.`,
  alternates: { canonical: "/nos-offres" },
};

const sections = [
  { label: "Nos services", href: "#services" },
  { label: "Accompagnement", href: "#accompagnement" },
  { label: "Fonctionnement", href: "#fonctionnement" },
  { label: "Box de bienvenue", href: "#box-de-bienvenue" },
  { label: "Simulateur", href: "#simulateur" },
  { label: "Questions", href: "#faq" },
];

export default function OffersPage() {
  return (
    <>
      <JsonLd data={faqJsonLd()} />
      <PageHero
        eyebrow="Nos offres"
        titleId="offres-h1"
        title={
          <>
            Une gestion complète, pensée dans les moindres détails
            <Period />
          </>
        }
        intro="De l’estimation de votre logement à l’accueil de chaque voyageur, nous prenons tout en charge. Voici, en détail, ce que nous faisons pour vous."
      >
        <nav aria-label="Sur cette page" className="mt-4">
          <ul className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <li key={section.href}>
                <Link
                  href={section.href}
                  className="inline-flex min-h-10 items-center rounded-full border border-maison/25 px-4 text-[0.875rem] font-semibold text-maison transition-colors hover:border-maison hover:bg-olive-light"
                >
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>
      <ServiceGroups />
      <Journey />
      <Pricing />
      <WelcomeBox />
      <SimulatorSection />
      <Faq />
      <ContactCta />
    </>
  );
}
