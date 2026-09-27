import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ContactBlock } from "@/components/guide/ContactBlock";
import { GuideContainer } from "@/components/guide/layout";
import { Eyebrow } from "@/components/ui/Section";
import { itineraries } from "@/content/guide/itineraries";
import { placeHref } from "@/lib/guide/place";
import { getGuidePlaces } from "@/server/guide";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "24 h, 48 h ou 72 h à Bordeaux : nos itinéraires",
  description:
    "Que faire à Bordeaux en 24 h, 48 h ou 72 h ? Des itinéraires réalistes, du matin au soir, préparés par Comme à la Maison.",
  alternates: { canonical: "/guide/itineraires" },
};

export default async function ItinerariesPage() {
  const { places } = await getGuidePlaces();
  const known = new Set(places.map((place) => place.slug));
  // Une journée déjà détaillée dans un itinéraire plus court n'est pas répétée : on y renvoie.
  const firstShown = new Map<string, string>();
  for (const itinerary of itineraries) {
    for (const day of itinerary.days) if (!firstShown.has(day.title)) firstShown.set(day.title, itinerary.slug);
  }

  return (
    <>
      <GuideContainer className="flex flex-col gap-4 pb-6 pt-6 sm:pt-10">
        <Eyebrow>Itinéraires</Eyebrow>
        <h1 className="text-h1 text-maison">Combien de temps avez-vous ?</h1>
        <p className="text-lead max-w-[40rem] text-ink-soft">
          Chaque journée reste dans un même secteur : on marche beaucoup, on roule peu.
        </p>
        <nav aria-label="Durée du séjour" className="sticky top-16 z-30 -mx-4 flex gap-2 bg-cream/95 px-4 py-2 backdrop-blur lg:top-20">
          {itineraries.map((itinerary) => (
            <a
              key={itinerary.slug}
              href={`#${itinerary.slug}`}
              className="inline-flex min-h-11 items-center rounded-full border-[1.5px] border-maison px-5 text-button text-maison hover:bg-olive-light"
            >
              {itinerary.label}
            </a>
          ))}
        </nav>
      </GuideContainer>

      <GuideContainer className="flex flex-col gap-16 pb-14">
        {itineraries.map((itinerary) => (
          <section key={itinerary.slug} id={itinerary.slug} aria-labelledby={`${itinerary.slug}-titre`} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 id={`${itinerary.slug}-titre`} className="text-h2 text-maison">
                {itinerary.title}
              </h2>
              <p className="max-w-[40rem] text-ink-soft">{itinerary.intro}</p>
            </div>
            {itinerary.days.map((day, index) =>
              firstShown.get(day.title) !== itinerary.slug ? (
                <a
                  key={`${itinerary.slug}-${index}`}
                  href={`#${firstShown.get(day.title)}`}
                  className="group flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-surface px-5 py-4 hover:border-olive-deep"
                >
                  <span className="flex flex-1 flex-col">
                    <span className="text-caption text-terra-text">Jour {index + 1}</span>
                    <span className="font-display text-[1.125rem] text-maison">{day.title}</span>
                    <span className="text-small text-ink-soft">Programme détaillé plus haut</span>
                  </span>
                  <ArrowRight aria-hidden="true" className="size-5 -rotate-90 text-maison" />
                </a>
              ) : (
              <div key={`${itinerary.slug}-${index}`} className="flex flex-col gap-4 rounded-[var(--radius-panel)] bg-surface p-5 sm:p-7">
                <div className="flex flex-col gap-1">
                  {itinerary.days.length > 1 ? <p className="text-caption text-terra-text">Jour {index + 1}</p> : null}
                  <h3 className="text-h3 text-maison">{day.title}</h3>
                  <p className="text-small text-ink-soft">{day.area}</p>
                </div>
                <ol className="relative flex flex-col gap-5 border-l-2 border-olive pl-5">
                  {day.steps.map((step) => (
                    <li key={step.moment + step.title} className="relative flex flex-col gap-1">
                      <span aria-hidden="true" className="absolute -left-[1.6rem] top-1.5 size-2.5 rounded-full bg-terra" />
                      <p className="text-caption text-ink-soft">{step.moment}</p>
                      <p className="font-display text-[1.1875rem] leading-snug text-maison">{step.title}</p>
                      <p className="text-ink">{step.text}</p>
                      {step.place && known.has(step.place) ? (
                        <Link href={placeHref(step.place)} className="group inline-flex min-h-11 items-center gap-2 self-start text-[0.9375rem] font-semibold text-maison">
                          <span className="border-b border-current/35 pb-0.5 group-hover:border-current">Voir la fiche</span>
                          <ArrowRight aria-hidden="true" className="size-4" />
                        </Link>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </div>
              ),
            )}
          </section>
        ))}
        <ContactBlock />
      </GuideContainer>
    </>
  );
}
