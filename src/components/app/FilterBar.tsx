import type { ReactNode } from "react";

import { buttonClasses } from "@/components/ui/Button";

/** Filtres en GET : l'adresse garde les filtres (partageable, retour arrière). */
export function FilterBar({ children, resetHref }: { children: ReactNode; resetHref: string }) {
  return (
    <form method="get" className="flex flex-wrap items-end gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-4">
      {children}
      <div className="flex gap-2">
        <button type="submit" className={buttonClasses("secondary", undefined, "sm")}>
          Filtrer
        </button>
        <a href={resetHref} className={buttonClasses("ghost", undefined, "sm")}>
          Réinitialiser
        </a>
      </div>
    </form>
  );
}

export function FilterField({ label, children, id }: { label: string; children: ReactNode; id: string }) {
  return (
    <div className="flex min-w-[10rem] flex-1 flex-col gap-1 sm:flex-none">
      <label htmlFor={id} className="text-[0.8125rem] font-semibold text-ink-soft">
        {label}
      </label>
      {children}
    </div>
  );
}

export const filterControl =
  "min-h-11 w-full rounded-[var(--radius-field)] border-[1.5px] border-line-strong bg-white px-3 text-[0.9375rem] text-ink focus-visible:border-maison";

export function param(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}
