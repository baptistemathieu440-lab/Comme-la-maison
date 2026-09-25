import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bath, BedDouble, MapPin, Ruler, Users } from "lucide-react";

import { cn } from "@/lib/cn";
import type { PublicListing } from "@/server/public-listings";

function plural(n: number, word: string) {
  return `${n} ${word}${n > 1 ? "s" : ""}`;
}

/** Caractéristiques principales d'un logement, à partir des champs renseignés dans le back-office. */
export function listingFeatures(listing: PublicListing) {
  return [
    listing.capacity ? { icon: Users, label: plural(listing.capacity, "voyageur") } : null,
    listing.bedrooms !== null
      ? { icon: BedDouble, label: listing.bedrooms === 0 ? "Studio" : plural(listing.bedrooms, "chambre") }
      : null,
    listing.bathrooms !== null
      ? { icon: Bath, label: `${String(listing.bathrooms).replace(".", ",")} salle${listing.bathrooms > 1 ? "s" : ""} de bain` }
      : null,
    listing.surface !== null ? { icon: Ruler, label: `${String(listing.surface).replace(".", ",")} m²` } : null,
  ].filter((f): f is { icon: typeof Users; label: string } => f !== null);
}

/**
 * Carte d'un logement (accueil et page Nos biens).
 * Toute la carte est cliquable : le lien du titre la recouvre.
 */
export function ListingCard({
  listing,
  headingLevel = "h3",
  priority = false,
  className,
}: {
  listing: PublicListing;
  headingLevel?: "h2" | "h3";
  priority?: boolean;
  className?: string;
}) {
  const cover = listing.photos[0];
  const Heading = headingLevel;
  const features = listingFeatures(listing);

  return (
    <article className={cn("group relative flex flex-col gap-5", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-stone">
        {cover ? (
          <Image
            src={`/api/logements/photos/${cover.id}`}
            alt={cover.caption ?? ""}
            fill
            unoptimized
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
          />
        ) : null}
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-cream/92 px-3 py-1.5 text-[0.8125rem] font-semibold text-maison backdrop-blur-sm">
          <MapPin aria-hidden="true" className="size-3.5" strokeWidth={2} />
          {listing.city}
        </span>
      </div>

      <div className="flex flex-col gap-3 px-1">
        <p className="text-caption text-ink-soft">{listing.typeLabel}</p>
        <Heading className="text-h3 text-maison">
          <Link
            href={`/nos-biens/${listing.slug}`}
            className="after:absolute after:inset-0 after:rounded-[var(--radius-card)] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-maison"
          >
            {listing.title}
          </Link>
        </Heading>
        {features.length > 0 ? (
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-small text-ink-soft">
            {features.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-1.5">
                <Icon aria-hidden="true" className="size-4 text-olive-deep" strokeWidth={1.75} />
                {label}
              </li>
            ))}
          </ul>
        ) : null}
        <span aria-hidden="true" className="mt-1 inline-flex items-center gap-2 text-button text-maison">
          En savoir plus
          <ArrowRight className="size-4 transition-transform duration-300 ease-soft group-hover:translate-x-1" strokeWidth={1.75} />
        </span>
      </div>
    </article>
  );
}
