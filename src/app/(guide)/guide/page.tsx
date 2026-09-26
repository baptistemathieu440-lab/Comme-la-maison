import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CloudRain, Compass, Route } from "lucide-react";

import { ContactBlock } from "@/components/guide/ContactBlock";
import { GuideContainer, GuideSectionHeader, VerifiedNote } from "@/components/guide/layout";
import { PlaceCard } from "@/components/guide/PlaceCard";
import { Eyebrow } from "@/components/ui/Section";
import { guide } from "@/content/guide/guide";
import { itineraries } from "@/content/guide/itineraries";
import { themes } from "@/content/guide/themes";
import { images } from "@/content/images";
import { site } from "@/content/site";
import { latestVerification } from "@/lib/guide/place";
import { toSummary } from "@/lib/guide/summary";
import { JsonLd } from "@/lib/structured-data";
import { getGuidePlaces } from "@/server/guide";

// Régénérée au plus tard toutes les 10 minutes, et aussitôt qu'une adresse change dans le back-office.
export const revalidate = 600;

export const metadata: Metadata = {
  title: { absolute: `${guide.seo.title} · ${site.name}` },
  description: guide.seo.description,
  alternates: { canonical: "/guide" },
};

export default async function GuideHomePage() {
  const { places } = await getGuidePlaces();
  const essentials = places.filter((place) => place.tags.includes("incontournable")).slice(0, 10);
  const favorites = places.filter((place) => place.isFavorite);
  const rainy = places.filter((place) => place.setting === "interieur");
  const verifiedOn = latestVerification(places);
  const homeThemes = themes.filter((theme) => theme.onHome);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: guide.seo.title,
          description: guide.seo.description,
          url: `${site.url}/guide`,
          inLanguage: "fr-FR",
          publisher: { "@type": "Organization", name: site.name, url: site.url },
          ...(verifiedOn ? { dateModified: verifiedOn } : {}),
        }}
      />

      {/* Bienvenue */}
      <section aria-labelledby="bienvenue" className="bg-cream">
        <GuideContainer className="grid items-center gap-8 pb-10 pt-8 sm:pt-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pb-16 lg:pt-16">
          <div className="hero-in flex flex-col gap-5">
            <Eyebrow>{guide.name}</Eyebrow>
            <h1 id="bienvenue" className="text-h1 text-maison">
              {guide.welcome.title} <span aria-hidden="true">{guide.welcome.wave}</span>
            </h1>
            <p className="text-lead max-w-[34rem] text-ink">{guide.welcome.text}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/guide/explorer"
                className="group/btn inline-flex min-h-[3.125rem] items-center gap-2.5 rounded-full bg-maison px-6 text-button text-cream transition-colors hover:bg-maison-hover"
              >
                <Compass aria-hidden="true" className="size-[1.125rem]" strokeWidth={1.9} />
                Explorer toutes les adresses
              </Link>
              <Link
                href="/guide/itineraires"
                className="inline-flex min-h-[3.125rem] items-center gap-2.5 rounded-full border-[1.5px] border-maison px-6 text-button text-maison transition-colors hover:bg-olive-light"
              >
                <Route aria-hidden="true" className="size-[1.125rem]" strokeWidth={1.9} />
                24 h, 48 h, 72 h
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="arch relative mx-auto aspect-[3/4] w-full max-w-[22rem] bg-stone">
              <Image src={images.bordeaux.src} alt={images.bordeaux.alt} fill priority sizes="352px" className="object-cover" placeholder="blur" />
            </div>
          </div>
        </GuideContainer>
      </section>

      {/* Catégories */}
      <section aria-labelledby="categories" className="bg-cream pb-12 lg:pb-20">
        <GuideContainer className="flex flex-col gap-5">
          <h2 id="categories" className="sr-only">
            Catégories
          </h2>
          <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-7">
            {homeThemes.map((theme) => {
              const Icon = theme.icon;
              return (
                <li key={theme.slug}>
                  <Link
                    href={`/guide/${theme.slug}`}
                    className="flex h-full min-h-[6.5rem] flex-col items-center justify-center gap-2.5 rounded-[1.25rem] border border-line/80 bg-surface px-2 py-4 text-center text-[0.875rem] font-semibold leading-tight text-maison transition-colors hover:border-olive-deep hover:bg-olive-light/50"
                  >
                    <span className="grid size-11 place-items-center rounded-full bg-olive-light">
                      <Icon aria-hidden="true" className="size-[1.375rem]" strokeWidth={1.7} />
                    </span>
                    {theme.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </GuideContainer>
      </section>

      {/* Incontournables */}
      <section aria-labelledby="incontournables" className="bg-stone py-12 lg:py-20">
        <GuideContainer className="flex flex-col gap-6">
          <GuideSectionHeader
            eyebrow="Pour un premier séjour"
            title="Nos incontournables"
            titleId="incontournables"
            moreHref="/guide/incontournables-bordeaux"
          />
        </GuideContainer>
        <div className="mx-auto w-full max-w-[76rem]">
          <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 pt-6 [scrollbar-width:none] sm:px-8 lg:px-12">
            {essentials.map((place) => (
              <li key={place.slug} className="snap-start">
                <PlaceCard place={toSummary(place)} variant="tile" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Itinéraires */}
      <section aria-labelledby="itineraires" className="bg-cream py-12 lg:py-20">
        <GuideContainer className="flex flex-col gap-6">
          <GuideSectionHeader
            eyebrow="Des parcours prêts à suivre"
            title="Combien de temps avez-vous ?"
            titleId="itineraires"
            intro="Des journées pensées pour marcher plus que rouler, du matin jusqu’au dernier verre."
          />
          <ul className="grid gap-3 sm:grid-cols-3">
            {itineraries.map((itinerary) => (
              <li key={itinerary.slug}>
                <Link
                  href={`/guide/itineraires#${itinerary.slug}`}
                  className="group flex h-full items-center gap-4 rounded-[var(--radius-card)] bg-olive p-5 text-ink transition-colors hover:bg-olive-strong"
                >
                  <span className="font-display text-[2.25rem] leading-none text-maison">{itinerary.label}</span>
                  <span className="flex-1 text-small">{itinerary.teaser}</span>
                  <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-maison transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </GuideContainer>
      </section>

      {/* Il pleut */}
      <section aria-labelledby="pluie" className="bg-cream pb-12 lg:pb-20">
        <GuideContainer>
          <Link
            href="/guide/bordeaux-quand-il-pleut"
            className="group flex items-center gap-5 rounded-[var(--radius-card)] border border-line bg-surface p-5 transition-colors hover:border-olive-deep sm:p-7"
          >
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-olive-light text-maison">
              <CloudRain aria-hidden="true" className="size-7" strokeWidth={1.6} />
            </span>
            <span className="flex flex-1 flex-col gap-1">
              <span id="pluie" className="font-display text-[1.375rem] leading-tight text-maison">
                Pas de chance, il pleut ?
              </span>
              <span className="text-small text-ink-soft">{rainy.length} idées à l’abri : musées, ateliers, cinéma, bonnes tables…</span>
            </span>
            <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-maison transition-transform group-hover:translate-x-1" />
          </Link>
        </GuideContainer>
      </section>

      {/* Coups de cœur */}
      {favorites.length > 0 ? (
        <section aria-labelledby="coups-de-coeur" className="bg-olive-light py-12 lg:py-20">
          <GuideContainer className="flex flex-col gap-6">
            <GuideSectionHeader
              eyebrow="L’esprit bordelais"
              title="Nos coups de cœur"
              titleId="coups-de-coeur"
              intro="Les adresses qu’on recommande à nos proches quand ils viennent nous voir. Sans classement : on les aime toutes."
              moreHref="/guide/coups-de-coeur"
            />
          </GuideContainer>
          <div className="mx-auto w-full max-w-[76rem]">
            <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 pt-6 [scrollbar-width:none] sm:px-8 lg:px-12">
              {favorites.map((place) => (
                <li key={place.slug} className="snap-start">
                  <PlaceCard place={toSummary(place)} variant="tile" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Contact */}
      <section aria-label="Contact" className="bg-cream py-12 lg:py-20">
        <GuideContainer className="flex flex-col gap-8">
          <ContactBlock />
          <VerifiedNote date={verifiedOn} />
        </GuideContainer>
      </section>
    </>
  );
}
