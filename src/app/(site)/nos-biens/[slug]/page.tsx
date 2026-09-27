import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { requestStay } from "@/app/actions/stay-request";
import { AvailabilityCalendar } from "@/components/listings/AvailabilityCalendar";
import { StayRequestForm } from "@/components/listings/StayRequestForm";
import { Container, Eyebrow, Period, Section } from "@/components/ui/Section";
import { addMonths, formatTime, todayIso } from "@/lib/dates";
import { getPublicListing, monthsFrom, unavailableNights } from "@/server/public-listings";

// Disponibilités lues à chaque visite.
export const dynamic = "force-dynamic";

const MONTHS_SHOWN = 3;

export async function generateMetadata({ params }: PageProps<"/nos-biens/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getPublicListing(slug);
  if (!listing) return { title: "Logement introuvable", robots: { index: false } };
  return {
    title: `${listing.title} · ${listing.city}`,
    description:
      listing.description?.slice(0, 155) ??
      `${listing.typeLabel} à ${listing.city} géré par Comme à la Maison : disponibilités et demande de séjour.`,
    alternates: { canonical: `/nos-biens/${listing.slug}` },
  };
}

export default async function ListingPage({ params }: PageProps<"/nos-biens/[slug]">) {
  const { slug } = await params;
  const listing = await getPublicListing(slug);
  if (!listing) notFound();

  const today = todayIso();
  const months = monthsFrom(today, MONTHS_SHOWN);
  const unavailable = await unavailableNights(listing.id, today, addMonths(today, MONTHS_SHOWN));
  const [cover, ...others] = listing.photos;

  const facts = [
    { label: "Type", value: listing.typeLabel },
    { label: "Commune", value: listing.city },
    listing.capacity ? { label: "Voyageurs", value: `${listing.capacity} au maximum` } : null,
    listing.bedrooms !== null ? { label: "Chambres", value: String(listing.bedrooms) } : null,
    listing.beds !== null ? { label: "Lits", value: String(listing.beds) } : null,
    listing.bathrooms !== null ? { label: "Salles de bain", value: String(listing.bathrooms).replace(".", ",") } : null,
    listing.surface !== null ? { label: "Surface", value: `${String(listing.surface).replace(".", ",")} m²` } : null,
    listing.checkInTime ? { label: "Arrivée", value: `à partir de ${formatTime(listing.checkInTime)}` } : null,
    listing.checkOutTime ? { label: "Départ", value: `avant ${formatTime(listing.checkOutTime)}` } : null,
    listing.registrationNumber ? { label: "Numéro d’enregistrement", value: listing.registrationNumber } : null,
  ].filter((fact): fact is { label: string; value: string } => fact !== null);

  return (
    <>
      <section aria-labelledby="logement-h1" className="bg-cream">
        <Container className="flex flex-col gap-6 pb-10 pt-10 sm:pt-14">
          <Link href="/nos-biens" className="inline-flex min-h-11 items-center gap-2 self-start font-semibold text-maison hover:underline">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Tous nos biens
          </Link>
          <Eyebrow>{listing.city}</Eyebrow>
          <h1 id="logement-h1" className="text-h1 max-w-[52rem] text-maison">
            {listing.title}
            <Period />
          </h1>

          {cover ? (
            <div className="grid gap-3 lg:grid-cols-[2fr_1fr]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-stone lg:aspect-auto lg:min-h-[26rem]">
                <Image
                  src={`/api/logements/photos/${cover.id}`}
                  alt={cover.caption ?? ""}
                  fill
                  unoptimized
                  priority
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="object-cover"
                />
              </div>
              {others.length > 0 ? (
                <ul className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                  {others.slice(0, 4).map((photo) => (
                    <li key={photo.id} className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-stone">
                      <Image
                        src={`/api/logements/photos/${photo.id}`}
                        alt={photo.caption ?? ""}
                        fill
                        unoptimized
                        sizes="(min-width: 1024px) 33vw, 50vw"
                        className="object-cover"
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </Container>
      </section>

      <Section tone="surface" labelledBy="logement-description" spacing="compact" className="border-y border-line/60">
        <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
          <div className="flex flex-col gap-4">
            <h2 id="logement-description" className="text-h2 text-maison">
              Le logement
              <Period />
            </h2>
            {listing.description ? (
              <p className="max-w-[40rem] whitespace-pre-line text-ink">{listing.description}</p>
            ) : null}
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 self-start rounded-[var(--radius-card)] border border-line bg-cream p-6">
            {facts.map((fact) => (
              <div key={fact.label} className="flex min-w-0 flex-col gap-0.5">
                <dt className="text-small text-ink-soft">{fact.label}</dt>
                <dd className="break-words font-semibold text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section labelledBy="logement-disponibilites" spacing="compact">
        <div className="flex flex-col gap-8">
          <h2 id="logement-disponibilites" className="text-h2 text-maison">
            Disponibilités
            <Period />
          </h2>
          <AvailabilityCalendar months={months} unavailable={unavailable} today={today} />
        </div>
      </Section>

      <Section tone="stone" labelledBy="logement-demande" spacing="compact">
        <div className="grid gap-10 lg:grid-cols-[2fr_3fr]">
          <div className="flex flex-col gap-4">
            <h2 id="logement-demande" className="text-h2 text-maison">
              Demander un séjour
              <Period />
            </h2>
            <p className="max-w-[28rem] text-ink">
              Indiquez vos dates et vos coordonnées. Nous vérifions la disponibilité et revenons vers vous avec le tarif
              du séjour.
            </p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-8">
            <StayRequestForm action={requestStay.bind(null, listing.slug)} capacity={listing.capacity} today={today} />
          </div>
        </div>
      </Section>
    </>
  );
}
