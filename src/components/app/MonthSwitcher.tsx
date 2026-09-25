import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { addMonths, formatMonth } from "@/lib/dates";

/** Choix du mois par liens (?mois=AAAA-MM), utilisable sans JavaScript. */
export function MonthSwitcher({
  month,
  hrefFor,
}: {
  month: string;
  hrefFor: (month: string) => string;
}) {
  const previous = addMonths(month, -1);
  const next = addMonths(month, 1);
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1">
      <Link href={hrefFor(previous)} className="grid size-10 place-items-center rounded-full text-maison hover:bg-olive-light">
        <ChevronLeft aria-hidden="true" className="size-5" />
        <span className="sr-only">Mois précédent ({formatMonth(previous)})</span>
      </Link>
      <span className="min-w-36 px-2 text-center font-semibold capitalize text-maison" aria-live="polite">
        {formatMonth(month)}
      </span>
      <Link href={hrefFor(next)} className="grid size-10 place-items-center rounded-full text-maison hover:bg-olive-light">
        <ChevronRight aria-hidden="true" className="size-5" />
        <span className="sr-only">Mois suivant ({formatMonth(next)})</span>
      </Link>
    </div>
  );
}

/** Lit ?mois=AAAA-MM et renvoie le 1er du mois (mois courant par défaut). */
export function readMonth(value: string | string[] | undefined, fallback: string) {
  return typeof value === "string" && /^\d{4}-\d{2}$/.test(value) ? `${value}-01` : `${fallback.slice(0, 7)}-01`;
}
