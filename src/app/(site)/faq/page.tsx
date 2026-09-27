import type { Metadata } from "next";
import Link from "next/link";

import { ContactCta } from "@/components/sections/ContactCta";
import { FaqAccordion } from "@/components/sections/Faq";
import { PageHero, Period, Section } from "@/components/ui/Section";
import { faqByCategory, faqCategories } from "@/content/faq";
import { images } from "@/content/images";
import { site } from "@/content/site";
import { JsonLd, faqJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Questions fréquentes · Conciergerie à Bordeaux",
  description: `Fonctionnement, commission de ${site.commission.label}, prestations, propriétaires, logements et voyageurs : les réponses aux questions les plus fréquentes sur ${site.name}.`,
  alternates: { canonical: "/faq" },
};

/** FAQ : toutes les questions, rangées par thème, avec un accès direct à chaque thème. */
export default function FaqPage() {
  const groups = faqCategories
    .map((category) => ({ ...category, items: faqByCategory(category.id) }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <JsonLd data={faqJsonLd()} />
      <PageHero
        eyebrow="FAQ"
        titleId="faq-h1"
        title={
          <>
            Vos questions, nos réponses
            <Period />
          </>
        }
        intro="Le fonctionnement de la conciergerie, notre commission, nos prestations, les logements et les séjours : l’essentiel en quelques lignes."
      >
        <nav aria-label="Thèmes de la FAQ" className="mt-2 lg:hidden">
          <ul className="flex flex-wrap gap-2">
            {groups.map((group) => (
              <li key={group.id}>
                <Link
                  href={`#${group.id}`}
                  className="inline-flex min-h-10 items-center rounded-full border border-maison/25 px-4 text-[0.875rem] font-semibold text-maison transition-colors hover:border-maison hover:bg-olive-light"
                >
                  {group.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      <Section spacing="flush-top">
        <div className="grid gap-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="Thèmes" className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
            <p className="text-caption text-ink-soft">Thèmes</p>
            <ul className="mt-4 flex flex-col border-l border-line">
              {groups.map((group) => (
                <li key={group.id}>
                  <Link
                    href={`#${group.id}`}
                    className="-ml-px flex min-h-11 items-center justify-between gap-3 border-l-2 border-transparent pl-4 pr-1 font-medium text-ink transition-colors hover:border-terra hover:text-maison"
                  >
                    {group.label}
                    <span className="text-[0.8125rem] text-ink-soft">{group.items.length}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex max-w-[52rem] flex-col gap-12 lg:gap-14">
            {groups.map((group) => (
              <section key={group.id} id={group.id} aria-labelledby={`${group.id}-title`} className="flex flex-col gap-5">
                <h2 id={`${group.id}-title`} className="text-h3 flex items-baseline gap-3 text-maison">
                  {group.label}
                  <span className="font-sans text-[0.9375rem] font-normal text-ink-soft">
                    {group.items.length} question{group.items.length > 1 ? "s" : ""}
                  </span>
                </h2>
                <FaqAccordion items={group.items} group={`faq-${group.id}`} headingLevel="h3" openFirst={group === groups[0]} />
              </section>
            ))}
          </div>
        </div>
      </Section>

      <ContactCta title="Une autre question ?" image={images.keys.src} />
    </>
  );
}
