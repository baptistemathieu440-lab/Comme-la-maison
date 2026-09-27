import Image from "next/image";

import { cn } from "@/lib/cn";
import { kindIcons } from "@/lib/guide/icons";
import type { GuidePlace } from "@/lib/guide/place";
import type { Kind } from "@/lib/guide/taxonomy";

// Fonds doux, tous dans la même gamme (pierre et olive) pour que les cartes sans photo restent homogènes.
const tints: Record<Kind, string> = {
  patrimoine: "bg-stone",
  culture: "bg-olive-light",
  restaurant: "bg-stone",
  bar: "bg-olive-light",
  activite: "bg-olive-light",
  nature: "bg-olive-light",
  shopping: "bg-stone",
  sortie: "bg-stone",
  excursion: "bg-olive-light",
};

/**
 * Visuel d'une adresse : sa photo (ajoutée depuis le back-office, ou photo libre de droits
 * livrée avec le site), sinon un emplacement aux couleurs de la marque, au même format
 * (jamais d'image générée ni d'image d'un autre lieu).
 */
export function PlaceVisual({
  place,
  sizes,
  className,
  iconClassName,
  priority = false,
}: {
  place: Pick<GuidePlace, "kind" | "photo" | "name">;
  sizes: string;
  className?: string;
  iconClassName?: string;
  priority?: boolean;
}) {
  const Icon = kindIcons[place.kind];
  return (
    <div className={cn("relative overflow-hidden", place.photo ? "bg-stone" : tints[place.kind], className)}>
      {place.photo ? (
        <Image
          src={place.photo.url}
          alt={place.photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
          <span className="grid aspect-[3/4] h-[62%] place-items-center rounded-t-full border border-maison/15 bg-cream/60">
            <span className="grid aspect-square w-[46%] place-items-center rounded-full bg-surface text-maison">
              <Icon className={iconClassName ?? "size-6"} strokeWidth={1.5} />
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
