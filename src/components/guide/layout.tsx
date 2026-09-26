import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import type { ReactNode } from "react";

import { Eyebrow } from "@/components/ui/Section";
import { guide } from "@/content/guide/guide";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/dates";
import { budgetKeys, budgets } from "@/lib/guide/taxonomy";

/** Conteneur des pages du guide : marges réduites sur téléphone. */
export function GuideContainer({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[76rem] px-4 sm:px-8 lg:px-12", className)}>{children}</div>;
}

/** En-tête de section du guide : sur-titre, titre, lien « Tout voir ». */
export function GuideSectionHeader({
  eyebrow,
  title,
  titleId,
  intro,
  moreHref,
  moreLabel = "Tout voir",
}: {
  eyebrow?: string;
  title: ReactNode;
  titleId: string;
  intro?: ReactNode;
  moreHref?: string;
  moreLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <div className="flex items-end justify-between gap-4">
        <h2 id={titleId} className="text-h2 text-maison">
          {title}
        </h2>
        {moreHref ? (
          <Link href={moreHref} className="group/more hidden min-h-11 shrink-0 items-center gap-2 text-button text-maison sm:inline-flex">
            <span className="border-b border-current/35 pb-1 group-hover/more:border-current">{moreLabel}</span>
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        ) : null}
      </div>
      {intro ? <p className="max-w-[40rem] text-ink-soft">{intro}</p> : null}
      {moreHref ? (
        <Link href={moreHref} className="inline-flex min-h-11 items-center gap-2 self-start text-button text-maison sm:hidden">
          <span className="border-b border-current/35 pb-1">{moreLabel}</span>
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}

/** « Informations vérifiées le … » et rappel des budgets. */
export function VerifiedNote({ date, className, withLegend = true }: { date: string | null; className?: string; withLegend?: boolean }) {
  return (
    <div className={cn("flex flex-col gap-2 text-small text-ink-soft", className)}>
      {date ? (
        <p className="flex items-center gap-2 font-semibold text-maison">
          <BadgeCheck aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.9} />
          Informations vérifiées le : {formatDate(date)}
        </p>
      ) : null}
      {withLegend ? (
        <p>
          Budgets indicatifs par personne :{" "}
          {budgetKeys
            .filter((key) => key > 0)
            .map((key) => `${budgets[key].symbol} ${budgets[key].detail}`)
            .join(" · ")}
          .
        </p>
      ) : null}
      <p>{guide.disclaimer}</p>
    </div>
  );
}
