import type { Metadata } from "next";
import Link from "next/link";

import { CommissionSteps } from "@/components/sections/CommissionSteps";
import { ContactCta } from "@/components/sections/ContactCta";
import { Faq } from "@/components/sections/Faq";
import { Pricing } from "@/components/sections/Pricing";
import { SimulatorSection } from "@/components/sections/SimulatorSection";
import { PageHero, Period } from "@/components/ui/Section";
import { faqByCategory } from "@/content/faq";
import { images } from "@/content/images";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Tarifs · Commission de 20 % TTC, tout compris",
  description: `Comment fonctionne la rémunération de ${site.name} : ${site.commission.label} ${site.commission.taxNote} ${site.commission.base}, ce qui est inclus (box de bienvenue comprise), le calcul pas à pas et un simulateur.`,
  alternates: { canonical: "/tarifs" },
};

const sections = [
  { label: "Notre commission", href: "#fonctionnement" },
  { label: "Le calcul", href: "#calcul" },
  { label: "Simulateur", href: "#simulateur" },
  { label: "Questions", href: "#faq" },
];

/**
 * Tarifs : la commission, ce qu'elle comprend, son calcul et le simulateur.
 * (Ces sections vivaient auparavant sur la page Nos offres.)
 */
export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Tarifs"
        titleId="tarifs-h1"
        title={
          <>
            Une seule commission, tout compris
            <Period />
          </>
        }
        intro={`Notre rémunération : ${site.commission.label} ${site.commission.taxNote} ${site.commission.base}. Voici ce qu’elle comprend, comment elle se calcule, et ce qu’elle pourrait représenter pour votre logement.`}
      >
        <nav aria-label="Sur cette page" className="mt-2">
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
      <Pricing />
      <CommissionSteps />
      <SimulatorSection />
      <Faq items={faqByCategory("tarifs")} title="Questions sur nos tarifs" />
      <ContactCta title="Parlons de votre logement" image={images.keys.src} />
    </>
  );
}
