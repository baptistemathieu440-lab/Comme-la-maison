import type { Metadata } from "next";
import Link from "next/link";

import { ContactCta } from "@/components/sections/ContactCta";
import { Journey } from "@/components/sections/Journey";
import { WelcomeBox } from "@/components/sections/WelcomeBox";
import { PricingTeaser } from "@/components/sections/home/PricingTeaser";
import { ServiceGroups } from "@/components/sections/offers/ServiceGroups";
import { PageHero, Period } from "@/components/ui/Section";
import { images } from "@/content/images";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Nos offres · Conciergerie à Bordeaux",
  description: `Gestion complète, accueil des voyageurs, ménage et linge, box de bienvenue, photos et estimation : toutes les prestations de ${site.name} à Bordeaux, pour ${site.commission.label} ${site.commission.taxNote} ${site.commission.base}.`,
  alternates: { canonical: "/nos-offres" },
};

const sections = [
  { label: "Nos services", href: "#services" },
  { label: "Accompagnement", href: "#accompagnement" },
  { label: "Box de bienvenue", href: "#box-de-bienvenue" },
  { label: "Tarifs et simulateur", href: "/tarifs" },
  { label: "Questions", href: "/faq" },
];

export default function OffersPage() {
  return (
    <>
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
      <WelcomeBox />
      <PricingTeaser />
      <ContactCta image={images.hero.src} />
    </>
  );
}
