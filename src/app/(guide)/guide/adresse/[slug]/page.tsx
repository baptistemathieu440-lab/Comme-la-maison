import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarCheck,
  Car,
  Clock,
  ExternalLink,
  Lightbulb,
  Map as MapIcon,
  MapPin,
  Navigation,
  Sparkles,
  Sun,
  Timer,
  TrainFront,
  UtensilsCrossed,
} from "lucide-react";
import type { ReactNode } from "react";

import { BudgetBadge, RatingBadge } from "@/components/guide/badges";
import { ContactBlock } from "@/components/guide/ContactBlock";
import { FavoriteButton } from "@/components/guide/FavoriteButton";
import { GuideContainer, VerifiedNote } from "@/components/guide/layout";
import { PlaceCard } from "@/components/guide/PlaceCard";
import { PlaceVisual } from "@/components/guide/PlaceVisual";
import { buttonClasses } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Section";
import { themes } from "@/content/guide/themes";
import { site } from "@/content/site";
import { audienceIcons } from "@/lib/guide/audience-icons";
import { googleMapsUrl, placeHref, type GuidePlace } from "@/lib/guide/place";
import { toSummary } from "@/lib/guide/summary";
import { audiences, bookings, budgets, kinds, settings, statuses, zones } from "@/lib/guide/taxonomy";
import { JsonLd } from "@/lib/structured-data";
import { getGuidePlace, getGuidePlaces } from "@/server/guide";

export const revalidate = 600;

export async function generateStaticParams() {
  const { places } = await getGuidePlaces();
  return places.map((place) => ({ slug: place.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guide/adresse/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const place = await getGuidePlace(slug);
  if (!place) return { title: "Adresse introuvable", robots: { index: false } };
  const category = place.subcategory ?? kinds[place.kind].label;
  const description = `${category} · ${place.area}. ${place.summary}`.slice(0, 158);
  return {
    title: `${place.name} (${place.area})`,
    description,
    alternates: { canonical: placeHref(place.slug) },
    openGraph: {
      title: place.name,
      description,
      url: placeHref(place.slug),
      ...(place.photo ? { images: [{ url: place.photo.url, alt: place.photo.alt }] } : {}),
    },
  };
}

/** Rubrique « parente » d'une adresse, pour le lien retour. */
const backTheme: Record<GuidePlace["kind"], string> = {
  patrimoine: "incontournables-bordeaux",
  culture: "culture-musees-bordeaux",
  restaurant: "restaurants-bordeaux",
  bar: "bars-bordeaux",
  activite: "activites-bordeaux",
  nature: "nature-bordeaux",
  shopping: "shopping-bordeaux",
  sortie: "sortir-bordeaux",
  excursion: "autour-de-bordeaux",
};

function schemaType(place: GuidePlace) {
  if (place.kind === "restaurant") return "Restaurant";
  if (place.kind === "bar") return "BarOrPub";
  return "TouristAttraction";
}

function Block({ title, icon: Icon, children, tone = "plain" }: { title: string; icon: typeof Sparkles; children: ReactNode; tone?: "plain" | "tip" }) {
  return (
    <section
      className={
        tone === "tip"
          ? "flex flex-col gap-2 rounded-[var(--radius-card)] border-l-4 border-terra bg-terra-wash/60 p-5"
          : "flex flex-col gap-2"
      }
    >
      <h2 className="flex items-center gap-2 font-display text-[1.25rem] font-medium text-maison">
        <Icon aria-hidden="true" className={tone === "tip" ? "size-5 text-terra-text" : "size-5 text-olive-deep"} strokeWidth={1.8} />
        {title}
      </h2>
      <div className="text-body text-ink">{children}</div>
    </section>
  );
}

function Fact({ icon: Icon, label, children }: { icon: typeof Sparkles; label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col border-b border-line/70 py-3 last:border-b-0">
      <dt className="flex items-center gap-3 text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-ink-soft">
        <Icon aria-hidden="true" className="size-5 shrink-0 text-olive-deep" strokeWidth={1.8} />
        {label}
      </dt>
      <dd className="break-words pl-8 text-ink">{children}</dd>
    </div>
  );
}

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default async function PlacePage({ params }: PageProps<"/guide/adresse/[slug]">) {
  const { slug } = await params;
  const [place, { places }] = await Promise.all([getGuidePlace(slug), getGuidePlaces()]);
  if (!place) notFound();

  const category = place.subcategory ?? kinds[place.kind].label;
  const back = themes.find((theme) => theme.slug === backTheme[place.kind]);
  const mapsHref = googleMapsUrl(place);
  const bookHref = place.bookingUrl ?? (place.booking !== "non" ? place.websiteUrl : null);
  const nearby = places
    .filter((other) => other.slug !== place.slug && other.kind === place.kind && other.zone === place.zone)
    .slice(0, 4);
  const excursionFacts = place.kind === "excursion" || place.zone !== "centre";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": schemaType(place),
          name: place.name,
          description: place.summary,
          url: `${site.url}${placeHref(place.slug)}`,
          ...(place.address ? { address: place.address } : {}),
          ...(place.lat !== null && place.lng !== null
            ? { geo: { "@type": "GeoCoordinates", latitude: place.lat, longitude: place.lng } }
            : {}),
          ...(place.websiteUrl ? { sameAs: place.websiteUrl } : {}),
          ...(place.photo ? { image: place.photo.url } : {}),
          ...(place.kind === "restaurant" || place.kind === "bar" ? { priceRange: budgets[place.budget].symbol } : {}),
          isAccessibleForFree: place.budget === 0,
        }}
      />

      <GuideContainer className="flex flex-col gap-6 pb-4 pt-5 sm:pt-8">
        {back ? (
          <Link href={`/guide/${back.slug}`} className="inline-flex min-h-11 items-center gap-2 self-start font-semibold text-maison hover:underline">
            <ArrowLeft aria-hidden="true" className="size-4" />
            {back.title}
          </Link>
        ) : null}
      </GuideContainer>

      <GuideContainer className="grid gap-8 pb-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div className="flex flex-col gap-7">
          <div className="relative">
            <PlaceVisual place={place} sizes="(min-width: 1024px) 50vw, 100vw" priority className="aspect-[16/10] rounded-[var(--radius-panel)]" iconClassName="size-10" />
            {place.photo?.credit ? (
              <p className="mt-2 text-[0.75rem] text-ink-soft">Photo : {place.photo.credit}</p>
            ) : null}
          </div>

          <header className="flex flex-col gap-3">
            <Eyebrow>{category}</Eyebrow>
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-h1 text-maison">{place.name}</h1>
              <FavoriteButton slug={place.slug} name={place.name} className="mt-1 bg-olive-light" />
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <RatingBadge rating={place.rating} ratingCount={place.ratingCount} ratingSource={place.ratingSource} />
              <BudgetBadge budget={place.budget} />
              <span className="inline-flex items-center gap-1.5 text-small text-ink-soft">
                <MapPin aria-hidden="true" className="size-4" strokeWidth={1.8} />
                {place.area}
              </span>
              {place.travelTime ? (
                <span className="inline-flex items-center gap-1.5 text-small text-ink-soft">
                  <Timer aria-hidden="true" className="size-4" strokeWidth={1.8} />
                  {place.travelTime}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-small text-ink-soft">
                  <Timer aria-hidden="true" className="size-4" strokeWidth={1.8} />
                  {zones[place.zone].label}
                </span>
              )}
            </div>
            {place.status !== "ouvert" ? (
              <p className="self-start rounded-full bg-terra-wash px-3 py-1.5 text-[0.875rem] font-semibold text-terra-deep">
                {statuses[place.status].label}
                {place.bestPeriod ? ` · ${place.bestPeriod}` : ""}
              </p>
            ) : null}
          </header>

          <Block title="Pourquoi on vous le recommande" icon={Sparkles}>
            <p>{place.summary}</p>
          </Block>

          {place.tip ? (
            <Block title="Notre petit conseil" icon={Lightbulb} tone="tip">
              <p>{place.tip}</p>
            </Block>
          ) : null}

          {place.highlights ? (
            <Block title="À voir sur place" icon={MapIcon}>
              <p>{place.highlights}</p>
            </Block>
          ) : null}

          {place.goodToKnow ? (
            <Block title="Bon à savoir" icon={CalendarCheck}>
              <p>{place.goodToKnow}</p>
            </Block>
          ) : null}

          {place.whereToEat ? (
            <Block title="Où manger" icon={UtensilsCrossed}>
              <p>{place.whereToEat}</p>
            </Block>
          ) : null}

          {place.audiences.length > 0 ? (
            <section className="flex flex-col gap-3">
              <h2 className="font-display text-[1.25rem] font-medium text-maison">Pour qui ?</h2>
              <ul className="flex flex-wrap gap-2">
                {place.audiences.map((audience) => {
                  const Icon = audienceIcons[audience];
                  return (
                    <li key={audience} className="inline-flex min-h-9 items-center gap-2 rounded-full bg-olive-light px-3.5 text-[0.9375rem] font-medium text-maison">
                      <Icon aria-hidden="true" className="size-4" strokeWidth={1.9} />
                      {audiences[audience].label}
                    </li>
                  );
                })}
                <li className="inline-flex min-h-9 items-center gap-2 rounded-full border border-line px-3.5 text-[0.9375rem] text-ink-soft">
                  {settings[place.setting].label}
                </li>
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
          <div className="flex flex-col gap-3">
            <a href={mapsHref} target="_blank" rel="noopener noreferrer" className={buttonClasses("primary", "w-full")}>
              <Navigation aria-hidden="true" className="size-[1.125rem]" strokeWidth={1.9} />
              Voir sur Google Maps
              <span className="sr-only"> (nouvel onglet)</span>
            </a>
            {bookHref ? (
              <a href={bookHref} target="_blank" rel="noopener noreferrer" className={buttonClasses("secondary", "w-full")}>
                <CalendarCheck aria-hidden="true" className="size-[1.125rem]" strokeWidth={1.9} />
                Réserver
                <span className="sr-only"> (nouvel onglet)</span>
              </a>
            ) : null}
            {place.lat !== null ? (
              <Link href={`/guide/carte?lieu=${place.slug}`} className={buttonClasses("ghost", "w-full")}>
                <MapIcon aria-hidden="true" className="size-[1.125rem]" strokeWidth={1.9} />
                Voir sur la carte du guide
              </Link>
            ) : null}
          </div>

          <section aria-labelledby="infos-pratiques" className="rounded-[var(--radius-card)] border border-line/80 bg-surface px-5 py-3">
            <h2 id="infos-pratiques" className="pb-1 pt-2 font-display text-[1.25rem] font-medium text-maison">
              Informations pratiques
            </h2>
            <dl>
              {place.address ? (
                <Fact icon={MapPin} label="Adresse">
                  {place.address}
                </Fact>
              ) : null}
              <Fact icon={Clock} label="Horaires">
                {place.hours ?? "Consultez le site officiel avant de venir."}
              </Fact>
              <Fact icon={CalendarCheck} label="Réservation">
                {bookings[place.booking].label}
              </Fact>
              <Fact icon={Sparkles} label="Budget">
                {budgets[place.budget].symbol === "Gratuit" ? "Gratuit" : `${budgets[place.budget].symbol} (${budgets[place.budget].detail}, indicatif)`}
                {place.priceNote ? <span className="block text-small text-ink-soft">{place.priceNote}</span> : null}
              </Fact>
              {excursionFacts && place.duration ? (
                <Fact icon={Timer} label="Durée conseillée">
                  {place.duration}
                </Fact>
              ) : null}
              {excursionFacts && (place.transport || place.carNeeded !== null) ? (
                <Fact icon={place.carNeeded ? Car : TrainFront} label="Y aller">
                  {place.transport ?? (place.carNeeded ? "Voiture conseillée." : "Accessible sans voiture.")}
                </Fact>
              ) : null}
              {place.bestPeriod && place.status === "ouvert" ? (
                <Fact icon={Sun} label="Période idéale">
                  {place.bestPeriod}
                </Fact>
              ) : null}
              {place.websiteUrl ? (
                <Fact icon={ExternalLink} label="Site officiel">
                  <a href={place.websiteUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-maison underline underline-offset-4">
                    {hostname(place.websiteUrl)}
                    <span className="sr-only"> (nouvel onglet)</span>
                  </a>
                </Fact>
              ) : null}
            </dl>
          </section>

          <VerifiedNote date={place.verifiedOn} withLegend={false} />
        </aside>
      </GuideContainer>

      {nearby.length > 0 ? (
        <section aria-labelledby="dans-le-meme-esprit" className="bg-stone py-12">
          <GuideContainer className="flex flex-col gap-5">
            <h2 id="dans-le-meme-esprit" className="text-h2 text-maison">
              Dans le même esprit
            </h2>
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-2">
              {nearby.map((other) => (
                <li key={other.slug}>
                  <PlaceCard place={toSummary(other)} />
                </li>
              ))}
            </ul>
          </GuideContainer>
        </section>
      ) : null}

      <GuideContainer className="py-12">
        <ContactBlock />
      </GuideContainer>
    </>
  );
}
