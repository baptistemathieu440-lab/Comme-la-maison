import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";

import { ContactBlock } from "@/components/guide/ContactBlock";
import { GuideContainer, VerifiedNote } from "@/components/guide/layout";
import { PlaceCard } from "@/components/guide/PlaceCard";
import { Eyebrow } from "@/components/ui/Section";
import { groupPlaces, themeBySlug, themes } from "@/content/guide/themes";
import { site } from "@/content/site";
import { latestVerification, placeHref, slugify } from "@/lib/guide/place";
import { toSummary } from "@/lib/guide/summary";
import { JsonLd } from "@/lib/structured-data";
import { getGuidePlaces } from "@/server/guide";

export const revalidate = 600;
export const dynamicParams = false;

export function generateStaticParams() {
  return themes.map((theme) => ({ theme: theme.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guide/[theme]">): Promise<Metadata> {
  const { theme: slug } = await params;
  const theme = themeBySlug(slug);
  if (!theme) return {};
  return {
    title: theme.seoTitle,
    description: theme.description,
    alternates: { canonical: `/guide/${theme.slug}` },
    openGraph: { title: theme.seoTitle, description: theme.description, url: `/guide/${theme.slug}` },
  };
}

/** Une rubrique du guide : adresses regroupées (par type, distance, vignoble…). */
export default async function ThemePage({ params }: PageProps<"/guide/[theme]">) {
  const { theme: slug } = await params;
  const theme = themeBySlug(slug);
  if (!theme) notFound();

  const { places } = await getGuidePlaces();
  const groups = groupPlaces(theme, places).filter((group) => group.places.length > 0);
  const total = groups.reduce((sum, group) => sum + group.places.length, 0);
  const verifiedOn = latestVerification(groups.flatMap((group) => group.places));
  const Icon = theme.icon;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: theme.title,
          description: theme.description,
          url: `${site.url}/guide/${theme.slug}`,
          numberOfItems: total,
          itemListElement: groups
            .flatMap((group) => group.places)
            .map((place, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: place.name,
              url: `${site.url}${placeHref(place.slug)}`,
            })),
        }}
      />
      <GuideContainer className="flex flex-col gap-6 pb-6 pt-6 sm:pt-10">
        <Link href="/guide" className="inline-flex min-h-11 items-center gap-2 self-start font-semibold text-maison hover:underline">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Accueil du guide
        </Link>
        <div className="flex items-start gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-olive-light text-maison">
            <Icon aria-hidden="true" className="size-7" strokeWidth={1.6} />
          </span>
          <div className="flex flex-col gap-3">
            <Eyebrow>
              {total} adresse{total > 1 ? "s" : ""}
            </Eyebrow>
            <h1 className="text-h1 text-maison">{theme.title}</h1>
          </div>
        </div>
        <p className="text-lead max-w-[42rem] text-ink">{theme.intro}</p>
        <Link
          href={`/guide/explorer?rubrique=${theme.slug}`}
          className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border-[1.5px] border-maison px-5 text-button text-maison transition-colors hover:bg-olive-light"
        >
          <SlidersHorizontal aria-hidden="true" className="size-4" strokeWidth={1.9} />
          Filtrer par budget, distance, public…
        </Link>
      </GuideContainer>

      <GuideContainer className="flex flex-col gap-10 pb-14 pt-4">
        {groups.length === 0 ? (
          <p className="rounded-[var(--radius-card)] bg-surface p-6 text-ink-soft">Cette rubrique se remplit bientôt. En attendant, écrivez-nous : on vous conseille volontiers.</p>
        ) : (
          groups.map((group) => (
            <section key={group.key} aria-labelledby={group.label ? `groupe-${slugify(group.key)}` : undefined} className="flex flex-col gap-4">
              {group.label ? (
                <h2 id={`groupe-${slugify(group.key)}`} className="text-h3 text-maison">
                  {group.label}
                  <span className="ml-2 font-sans text-[0.9375rem] font-normal text-ink-soft">({group.places.length})</span>
                </h2>
              ) : null}
              <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-2">
                {group.places.map((place) => (
                  <li key={place.slug}>
                    <PlaceCard place={toSummary(place)} headingLevel={group.label ? "h3" : "h2"} />
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
        <VerifiedNote date={verifiedOn} />
        <ContactBlock />
      </GuideContainer>
    </>
  );
}
