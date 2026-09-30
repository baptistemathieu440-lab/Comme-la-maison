import type { ReactNode } from "react";
import Link from "next/link";

import { Container, Eyebrow, Period } from "@/components/ui/Section";
import { legalNav } from "@/content/navigation";

/** Affiche la valeur, ou un repère « [À COMPLÉTER — …] » tant qu'elle n'est pas connue. */
export function Value({ value, label }: { value: string | null; label: string }) {
  if (value) return <>{value}</>;
  return (
    <span className="inline-flex items-center rounded-md border border-dashed border-terra-text/70 bg-surface px-2 py-0.5 text-small font-semibold text-terra-text">
      [À COMPLÉTER — {label.toUpperCase()}]
    </span>
  );
}

/** Encadré pour un point en attente de validation (juridique, administrative). */
export function PendingNotice({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[var(--radius-field)] border-2 border-dashed border-terra-text/60 bg-surface p-4 text-ink">
      <p className="font-semibold text-terra-text">Point en cours de vérification</p>
      <div className="mt-1 flex flex-col gap-2">{children}</div>
    </div>
  );
}

export function LegalSection({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-28 flex-col gap-3 border-t border-line pt-8">
      <h2 className="text-h3 text-maison">{title}</h2>
      <div className="flex flex-col gap-3 text-ink [&_a]:text-maison [&_a]:underline [&_a]:underline-offset-2 [&_li]:pl-1 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}

/**
 * Tableau lisible sur mobile : chaque ligne devient une carte sous 40rem,
 * les intitulés de colonne étant répétés devant chaque valeur.
 */
export function LegalTable({ caption, columns, rows }: { caption: string; columns: string[]; rows: ReactNode[][] }) {
  return (
    <div className="flex flex-col gap-2">
      <table className="w-full border-collapse text-left text-small max-[40rem]:block">
        <caption className="mb-2 text-left font-semibold text-ink">{caption}</caption>
        <thead className="max-[40rem]:sr-only">
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col" className="border-b-2 border-line-strong bg-stone/50 px-3 py-2 align-bottom font-semibold text-ink">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="max-[40rem]:flex max-[40rem]:flex-col max-[40rem]:gap-3">
          {rows.map((row, index) => (
            <tr
              key={index}
              className="max-[40rem]:flex max-[40rem]:flex-col max-[40rem]:gap-2 max-[40rem]:rounded-[var(--radius-field)] max-[40rem]:border max-[40rem]:border-line max-[40rem]:bg-surface max-[40rem]:p-3"
            >
              {row.map((cell, cellIndex) =>
                cellIndex === 0 ? (
                  <th key={cellIndex} scope="row" className="border-b border-line px-3 py-2.5 align-top font-semibold text-ink max-[40rem]:border-0 max-[40rem]:p-0">
                    {cell}
                  </th>
                ) : (
                  <td key={cellIndex} className="border-b border-line px-3 py-2.5 align-top text-ink max-[40rem]:border-0 max-[40rem]:p-0">
                    <span aria-hidden="true" className="hidden font-medium text-ink-soft max-[40rem]:block">
                      {columns[cellIndex]}
                    </span>
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LegalPage({
  title,
  updatedAt,
  intro,
  toc,
  current,
  children,
}: {
  title: string;
  updatedAt: string;
  intro?: ReactNode;
  /** Sommaire : ancres des sections de la page. */
  toc?: Array<{ id: string; label: string }>;
  /** Adresse de la page, pour la retirer des « autres documents ». */
  current: string;
  children: ReactNode;
}) {
  const others = legalNav.filter((item) => item.href !== current);

  return (
    <div className="bg-cream">
      <Container className="flex max-w-[52rem] flex-col gap-10 pb-24 pt-14 sm:pt-20">
        <header className="flex flex-col gap-5">
          <Eyebrow>Informations légales</Eyebrow>
          <h1 className="text-h1 break-words text-maison">
            {title}
            <Period />
          </h1>
          <p className="text-small text-ink-soft">Dernière mise à jour : {updatedAt}</p>
          {intro ? <div className="text-lead flex flex-col gap-3 text-ink">{intro}</div> : null}
        </header>

        {toc && toc.length > 0 ? (
          <nav aria-label="Sommaire" className="rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:p-6">
            <h2 className="text-caption text-ink-soft">Sommaire</h2>
            <ol className="mt-3 grid gap-x-8 gap-y-1 sm:grid-cols-2">
              {toc.map((item, index) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="inline-flex min-h-10 items-center gap-2 text-maison underline-offset-4 hover:underline">
                    <span className="tabular-nums text-ink-soft">{index + 1}.</span> {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        {children}

        <nav aria-label="Autres documents légaux" className="flex flex-col gap-3 border-t border-line pt-8">
          <h2 className="text-h3 text-maison">Autres documents</h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {others.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-10 items-center text-maison underline underline-offset-2">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </div>
  );
}
