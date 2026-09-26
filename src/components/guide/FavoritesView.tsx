"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { useFavorites } from "@/lib/guide/favorites";
import type { PlaceSummary } from "@/lib/guide/summary";

import { PlaceCard } from "./PlaceCard";

/** Les adresses enregistrées sur ce téléphone. */
export function FavoritesView({ places }: { places: PlaceSummary[] }) {
  const { favorites } = useFavorites();
  const saved = favorites
    .map((slug) => places.find((place) => place.slug === slug))
    .filter((place): place is PlaceSummary => place !== undefined);

  if (saved.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-6">
        <span className="grid size-12 place-items-center rounded-full bg-olive-light text-maison">
          <Heart aria-hidden="true" className="size-6" strokeWidth={1.7} />
        </span>
        <p className="text-ink">
          Touchez le cœur sur une adresse pour la retrouver ici. Vos favoris restent sur votre téléphone : pas besoin de compte.
        </p>
        <Link href="/guide/explorer" className="inline-flex min-h-11 items-center rounded-full bg-maison px-5 text-button text-cream hover:bg-maison-hover">
          Explorer les adresses
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p role="status" className="font-semibold text-ink">
        {saved.length} adresse{saved.length > 1 ? "s" : ""} enregistrée{saved.length > 1 ? "s" : ""}
      </p>
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-2">
        {saved.map((place) => (
          <li key={place.slug}>
            <PlaceCard place={place} headingLevel="h2" />
          </li>
        ))}
      </ul>
    </div>
  );
}
