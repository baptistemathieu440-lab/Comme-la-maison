import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BedDouble, MapPin, Users } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow, Period, Section } from "@/components/ui/Section";
import { primaryCta } from "@/content/navigation";
import { site } from "@/content/site";
import { listPublicListings } from "@/server/public-listings";

// Toujours à jour : un bien publié ou retiré depuis le back-office apparaît ou disparaît aussitôt.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nos logements à Bordeaux",
  description:
    "Les logements gérés par Comme à la Maison à Bordeaux et dans sa métropole, à réserver en direct : disponibilités et demande de séjour.",
  alternates: { canonical: "/logements" },
};

export default async function ListingsPage() {
  const listings = await listPublicListings();

  return (
    <>
      <section aria-labelledby="logements-h1" className="bg-cream">
        <Container className="flex flex-col gap-6 pb-10 pt-14 sm:pt-20 lg:pt-24">
          <Eyebrow>Réservation directe</Eyebrow>
          <h1 id="logements-h1" className="text-h1 max-w-[52rem] text-maison">
            Nos logements
            <Period />
          </h1>
          <p className="text-lead max-w-[40rem] text-ink">
            Des logements préparés et suivis par {site.name}, à Bordeaux et dans sa métropole. Consultez les
            disponibilités et envoyez votre demande : nous vous répondons directement.
          </p>
        </Container>
      </section>

      <Section tone="cream" spacing="flush-top">
        {listings.length === 0 ? (
          <div className="flex max-w-[40rem] flex-col items-start gap-5 rounded-[var(--radius-card)] border border-line bg-surface p-8">
            <p className="text-ink">Aucun logement n’est proposé à la réservation directe pour le moment.</p>
            <ButtonLink href={primaryCta.href} variant="secondary" size="sm">
              Vous êtes propriétaire ? {primaryCta.label}
            </ButtonLink>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => {
              const cover = listing.photos[0];
              return (
                <li key={listing.id} className="group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
                  <div className="relative aspect-[4/3] bg-stone">
                    {cover ? (
                      <Image
                        src={`/api/logements/photos/${cover.id}`}
                        alt={cover.caption ?? ""}
                        fill
                        unoptimized
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <h2 className="font-display text-[1.375rem] font-medium leading-snug text-maison [font-stretch:92%]">
                      <Link href={`/logements/${listing.slug}`} className="after:absolute after:inset-0 hover:underline">
                        {listing.title}
                      </Link>
                    </h2>
                    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-small text-ink-soft">
                      <li className="flex items-center gap-1.5">
                        <MapPin aria-hidden="true" className="size-4" />
                        {listing.city}
                      </li>
                      {listing.capacity ? (
                        <li className="flex items-center gap-1.5">
                          <Users aria-hidden="true" className="size-4" />
                          {listing.capacity} voyageur{listing.capacity > 1 ? "s" : ""}
                        </li>
                      ) : null}
                      {listing.bedrooms !== null ? (
                        <li className="flex items-center gap-1.5">
                          <BedDouble aria-hidden="true" className="size-4" />
                          {listing.bedrooms === 0 ? listing.typeLabel : `${listing.bedrooms} chambre${listing.bedrooms > 1 ? "s" : ""}`}
                        </li>
                      ) : null}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Section>
    </>
  );
}
