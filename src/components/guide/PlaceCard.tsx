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
 * Carte d'une adresse. « row » : ligne compacte pour les listes (lisible d'une
 * main sur téléphone) ; « tile » : grande carte pour les sélections à faire défiler.
 * Toute la carte mène à la fiche ; le cœur ajoute aux favoris.
 */
export function PlaceCard({
  place,
  variant = "row",
  headingLevel = "h3",
  className,
}: {
  place: PlaceSummary;
  variant?: "row" | "tile";
  headingLevel?: "h2" | "h3" | "h4";
  className?: string;
}) {
  const Heading = headingLevel;
  const category = place.subcategory ?? kinds[place.kind].label;
  const link = (
    <Link
      href={placeHref(place.slug)}
      className="after:absolute after:inset-0 after:rounded-[var(--radius-card)] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-maison"
    >
      {place.name}
    </Link>
  );
  const seasonal = place.status !== "ouvert" ? statuses[place.status].label : null;

  if (variant === "tile") {
    return (
      <article className={cn("group relative flex w-[15.5rem] shrink-0 flex-col gap-3 sm:w-[17rem]", className)}>
        <PlaceVisual place={place} sizes="272px" className="aspect-[4/3] rounded-[var(--radius-card)]" />
        <div className="absolute right-2 top-2">
          <FavoriteButton slug={place.slug} name={place.name} className="bg-cream/92 backdrop-blur-sm" />
        </div>
        <div className="flex flex-col gap-1.5 px-1">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-soft">{category}</p>
          <Heading className="font-display text-[1.25rem] leading-tight text-maison">{link}</Heading>
          <p className="line-clamp-2 text-small text-ink-soft">{place.teaser}</p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <BudgetBadge budget={place.budget} />
            <RatingBadge rating={place.rating} ratingCount={place.ratingCount} ratingSource={place.ratingSource} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group relative flex gap-4 rounded-[var(--radius-card)] border border-line/80 bg-surface p-3 transition-colors hover:border-olive-deep",
        className,
      )}
    >
      <PlaceVisual place={place} sizes="96px" className="h-32 w-24 shrink-0 rounded-[1rem] sm:w-28" iconClassName="size-6" />
      <div className="flex min-w-0 flex-1 flex-col gap-1 py-0.5 pr-1">
        <p className="truncate text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-soft">{category}</p>
        <Heading className="font-display text-[1.125rem] font-medium leading-snug text-maison">{link}</Heading>
        <p className="line-clamp-2 text-[0.875rem] leading-snug text-ink-soft">{place.teaser}</p>
        <p className="flex items-center gap-1 text-[0.8125rem] text-ink-soft">
          <MapPin aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={1.75} />
          <span className="truncate">{place.travelTime && place.zone !== "centre" ? `${place.area} · ${place.travelTime}` : place.area}</span>
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-1">
          <BudgetBadge budget={place.budget} />
          <RatingBadge rating={place.rating} ratingCount={place.ratingCount} ratingSource={place.ratingSource} />
          {seasonal ? <span className="text-[0.8125rem] font-semibold text-terra-text">{seasonal}</span> : null}
        </div>
      </div>
      <FavoriteButton slug={place.slug} name={place.name} className="-mr-1 -mt-1 self-start" />
    </article>
  );
}
