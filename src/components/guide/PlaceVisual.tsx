import Image from "next/image";

import { cn } from "@/lib/cn";
import { kindIcons } from "@/lib/guide/icons";
import type { GuidePlace } from "@/lib/guide/place";
import type { Kind } from "@/lib/guide/taxonomy";

const tints: Record<Kind, string> = {
  patrimoine: "bg-stone",
  culture: "bg-olive-light",
  restaurant: "bg-terra-wash",
  bar: "bg-olive-mist",
  activite: "bg-olive-light",
  nature: "bg-olive-mist",
  shopping: "bg-stone",
  sortie: "bg-terra-wash",
  excursion: "bg-olive-light",
};

/**
 * Visuel d'une adresse : sa photo si l'équipe en a ajouté une (droits vérifiés),
 * sinon une illustration aux couleurs de la marque (jamais d'image générée
 * pour représenter un lieu réel).
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
          <span className="grid aspect-[3/4] w-[46%] place-items-end justify-center rounded-t-full bg-cream/70 pb-[18%]">
            <Icon className={cn("size-7 text-maison", iconClassName)} strokeWidth={1.5} />
          </span>
        </div>
      )}
    </div>
  );
}
