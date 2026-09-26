import Image from "next/image";

import { ListingCard } from "@/components/listings/ListingCard";
import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow, Period, Section, SectionHeader } from "@/components/ui/Section";
import { images } from "@/content/images";
import { featuredListings } from "@/server/public-listings";

const FEATURED_COUNT = 3;

/**
 * Quelques logements accompagnés. Tant qu'aucun bien n'est publié depuis le
 * back-office, la section l'annonce simplement : aucun logement n'est inventé.
 */
export async function FeaturedListings() {
  const listings = await featuredListings(FEATURED_COUNT);

  if (listings.length === 0) {
    return (
      <Section labelledBy="biens-title">
        <div className="grid items-center gap-10 md:grid-cols-[0.8fr_1fr] lg:gap-20">
          <div className="reveal relative mx-auto w-full max-w-[20rem] md:max-w-none">
            <div className="arch relative aspect-[3/4]">
              <Image
                src={images.hero.src}
                alt={images.hero.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 768px) 30vw, 80vw"
                className="object-cover object-[70%_50%]"
              />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <Eyebrow>Nos biens</Eyebrow>
            <h2 id="biens-title" className="text-h2 text-maison">
              Des logements choisis, à Bordeaux et autour
              <Period />
            </h2>
            <p className="text-lead max-w-[32rem] text-ink-soft">
              Les logements que nous accompagnons seront présentés ici, avec leurs photos et leurs
              disponibilités.
            </p>
            <ArrowLink href="/nos-biens" className="self-start">
              Découvrir nos biens
            </ArrowLink>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section labelledBy="biens-title">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          eyebrow="Nos biens"
          titleId="biens-title"
          title={
            <>
              Des logements choisis, à Bordeaux et autour
              <Period />
            </>
          }
        />
        <ArrowLink href="/nos-biens" className="shrink-0 self-start md:self-end">
          Découvrir nos biens
        </ArrowLink>
      </div>
      <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        {listings.map((listing) => (
          <li key={listing.id} className="reveal">
            <ListingCard listing={listing} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
