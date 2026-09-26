import { Star } from "lucide-react";

import { cn } from "@/lib/cn";
import { budgets, type Budget } from "@/lib/guide/taxonomy";

/** Budget : symbole visible, montant en clair pour les lecteurs d'écran et au survol. */
export function BudgetBadge({ budget, className }: { budget: Budget; className?: string }) {
  const { symbol, detail } = budgets[budget];
  return (
    <span
      title={`Budget indicatif : ${detail}`}
      className={cn(
        "inline-flex min-h-7 items-center rounded-full px-2.5 text-[0.8125rem] font-semibold leading-none",
        budget === 0 ? "bg-olive-light text-maison" : "bg-stone text-ink",
        className,
      )}
    >
      <span aria-hidden="true">{symbol}</span>
      <span className="sr-only">Budget indicatif : {detail}</span>
    </span>
  );
}

const count = new Intl.NumberFormat("fr-FR");

/** Note publique, toujours avec sa source (jamais affichée sans). */
export function RatingBadge({
  rating,
  ratingCount,
  ratingSource,
  className,
}: {
  rating: number | null;
  ratingCount: number | null;
  ratingSource: string | null;
  className?: string;
}) {
  if (rating === null || !ratingSource) return null;
  const value = rating.toFixed(1).replace(".", ",");
  return (
    <span className={cn("inline-flex min-h-7 items-center gap-1 text-[0.8125rem] font-semibold text-ink", className)}>
      <Star aria-hidden="true" className="size-3.5 fill-terra text-terra" strokeWidth={1.5} />
      <span>
        {value}
        <span className="sr-only"> sur 5</span>
      </span>
      <span className="font-normal text-ink-soft">
        {ratingCount ? `(${count.format(ratingCount)} avis ${ratingSource})` : `(${ratingSource})`}
      </span>
    </span>
  );
}
