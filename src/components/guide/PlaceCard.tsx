import Link from "next/link";
import { MapPin } from "lucide-react";

import { cn } from "@/lib/cn";
import { placeHref } from "@/lib/guide/place";
import type { PlaceSummary } from "@/lib/guide/summary";
import { kinds, statuses } from "@/lib/guide/taxonomy";

import { BudgetBadge, RatingBadge } from "./badges";
import { FavoriteButton } from "./FavoriteButton";
import { PlaceVisual } from "./PlaceVisual";

/**
 * Carte d'une adresse, comme dans un guide de voyage : photo au même format pour
 * toutes (3:2), catégorie, nom, une phrase, quartier et budget.
 * « card » : dans une grille ; « tile » : largeur fixe, pour les sélections à faire défiler.
 * Toute la carte mène à la fiche ; le cœur ajoute aux favoris.
 */
export function PlaceCard({
  place,
  variant = "card",
  headingLevel = "h3",
  className,
}: {
  place: PlaceSummary;
  variant?: "card" | "tile";
  headingLevel?: "h2" | "h3" | "h4";
  className?: string;
}) {
  const Heading = headingLevel;
  const category = place.subcategory ?? kinds[place.kind].label;
  const seasonal = place.status !== "ouvert" ? statuses[place.status].label : null;
  const where = place.travelTime && place.zone !== "centre" ? `${place.area} · ${place.travelTime}` : place.area;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line/80 bg-surface transition-[border-color,box-shadow] duration-300 ease-soft hover:border-olive-deep/60 hover:shadow-soft",
        variant === "tile" && "w-[16.5rem] shrink-0 sm:w-[18rem]",
        className,
      )}
    >
      <div className="relative">
        <PlaceVisual
          place={place}
          sizes={variant === "tile" ? "288px" : "(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"}
          className="aspect-[3/2] w-full"
        />
        {seasonal ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-cream/92 px-2.5 py-1 text-[0.75rem] font-semibold text-terra-text backdrop-blur-sm">
            {seasonal}
          </span>
        ) : null}
      </div>
      <div className="absolute right-2 top-2 z-10">
        <FavoriteButton slug={place.slug} name={place.name} className="bg-cream/92 backdrop-blur-sm" />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4 sm:p-5">
        <p className="truncate text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-terra-text">{category}</p>
        <Heading className="font-display text-[1.3125rem] font-semibold leading-tight text-maison">
          <Link
            href={placeHref(place.slug)}
            className="after:absolute after:inset-0 after:rounded-[var(--radius-card)] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-maison"
          >
            {place.name}
          </Link>
        </Heading>
        <p className="line-clamp-2 text-[0.9375rem] leading-snug text-ink-soft">{place.teaser}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <p className="flex min-w-0 items-center gap-1 text-[0.8125rem] text-ink-soft">
            <MapPin aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={1.75} />
            <span className="truncate">{where}</span>
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <RatingBadge rating={place.rating} ratingCount={null} ratingSource={place.ratingSource} />
            <BudgetBadge budget={place.budget} />
          </div>
        </div>
      </div>
    </article>
  );
}
