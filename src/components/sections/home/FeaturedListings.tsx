import { ListingCard } from "@/components/listings/ListingCard";
import { ListingsEmptyState } from "@/components/listings/ListingsEmptyState";
import { ArrowLink } from "@/components/ui/Button";
import { Period, Section, SectionHeader } from "@/components/ui/Section";
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
        <div className="mt-10 lg:mt-12">
          <ListingsEmptyState titleId="biens-vide-title" headingLevel="h3" image={images.welcomeBox} />
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
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6">
        {listings.map((listing) => (
          <li key={listing.id} className="reveal">
            <ListingCard listing={listing} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
