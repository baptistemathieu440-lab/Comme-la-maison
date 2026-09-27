import type { Metadata } from "next";

import { ListingCard } from "@/components/listings/ListingCard";
import { ListingsEmptyState } from "@/components/listings/ListingsEmptyState";
import { ContactCta } from "@/components/sections/ContactCta";
import { PageHero, Period, Section } from "@/components/ui/Section";
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
          <ListingsEmptyState titleId="biens-vide-title" />
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
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
