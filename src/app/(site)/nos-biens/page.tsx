import type { Metadata } from "next";
import Image from "next/image";

import { ListingCard } from "@/components/listings/ListingCard";
import { ContactCta } from "@/components/sections/ContactCta";
import { ArrowLink } from "@/components/ui/Button";
import { PageHero, Period, Section } from "@/components/ui/Section";
import { images } from "@/content/images";
import { site } from "@/content/site";
import { listPublicListings } from "@/server/public-listings";

// Toujours à jour : un bien publié ou retiré depuis le back-office apparaît ou disparaît aussitôt.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nos biens à Bordeaux",
  description: `Les logements accompagnés par ${site.name} à Bordeaux et dans sa métropole : photos, capacité, caractéristiques, disponibilités et demande de séjour en direct.`,
  alternates: { canonical: "/nos-biens" },
};

/**
 * Nos biens : la liste se remplit depuis le back-office (Biens > « Afficher ce bien
 * sur le site public »). Ajouter un logement ne demande aucune modification de code.
 */
export default async function ListingsPage() {
  const listings = await listPublicListings();

  return (
    <>
      <PageHero
        eyebrow="Nos biens"
        titleId="biens-h1"
        title={
          <>
            Des logements choisis et soignés
            <Period />
          </>
        }
        intro={`Appartements et maisons que nous accompagnons à ${site.area.city} et dans sa métropole. Consultez leurs disponibilités et réservez en direct : nous vous répondons personnellement.`}
      />

      <Section spacing="flush-top" labelledBy={listings.length > 0 ? undefined : "biens-vide-title"}>
        {listings.length === 0 ? (
          <div className="grid items-center gap-10 overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface md:grid-cols-[0.8fr_1fr]">
            <div className="relative aspect-[4/3] md:aspect-auto md:h-full md:min-h-[22rem]">
              <Image
                src={images.linen.src}
                alt={images.linen.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-5 p-8 sm:p-10 md:pl-0">
              <h2 id="biens-vide-title" className="text-h3 text-maison">
                Nos premiers logements arrivent bientôt
                <Period />
              </h2>
              <p className="max-w-[30rem] text-ink-soft">
                Aucun logement n’est proposé à la réservation directe pour le moment. Vous êtes propriétaire à{" "}
                {site.area.city} ou dans la métropole ? Votre bien pourrait être le premier présenté ici.
              </p>
              <ArrowLink href="/contact" className="self-start">
                Confier mon bien
              </ArrowLink>
            </div>
          </div>
        ) : (
          <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing, i) => (
              <li key={listing.id}>
                <ListingCard listing={listing} headingLevel="h2" priority={i < 3} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <ContactCta title="Vous souhaitez nous confier votre bien ?" />
    </>
  );
}
