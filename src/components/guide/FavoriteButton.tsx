"use client";

import { Heart } from "lucide-react";

import { cn } from "@/lib/cn";
import { useFavorites } from "@/lib/guide/favorites";

/** Ajoute ou retire une adresse des favoris (enregistrés sur le téléphone). */
export function FavoriteButton({ slug, name, className, withLabel = false }: { slug: string; name: string; className?: string; withLabel?: boolean }) {
  const { favorites, toggle } = useFavorites();
  const active = favorites.includes(slug);
  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      aria-pressed={active}
      aria-label={withLabel ? undefined : active ? `Retirer ${name} de mes favoris` : `Ajouter ${name} à mes favoris`}
      className={cn(
        "relative z-10 inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-full transition-colors",
        withLabel ? "border-[1.5px] border-maison px-5 text-button text-maison hover:bg-olive-light" : "text-maison hover:bg-olive-light",
        className,
      )}
    >
      <Heart
        aria-hidden="true"
        className={cn("size-5 transition-transform duration-200 ease-soft", active ? "scale-110 fill-terra text-terra" : "")}
        strokeWidth={1.75}
      />
      {withLabel ? <span>{active ? "Dans mes favoris" : "Ajouter à mes favoris"}</span> : null}
    </button>
  );
}
