import type { ReactNode } from "react";

import { Container, Eyebrow, Period } from "@/components/ui/Section";

/** Affiche la valeur, ou un repère « À compléter » tant qu'elle n'est pas connue. */
export function Value({ value, label }: { value: string | null; label: string }) {
  if (value) return <>{value}</>;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-terra-text/60 bg-surface px-2.5 py-0.5 text-small font-medium text-terra-text">
      À compléter : {label}
    </span>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-t border-line pt-8">
      <h2 className="text-h3 text-maison">{title}</h2>
      <div className="flex flex-col gap-3 text-ink [&_a]:text-maison [&_a]:underline [&_a]:underline-offset-2">
        {children}
      </div>
    </section>
  );
}

export function LegalPage({
  title,
  updatedAt,
  intro,
  children,
}: {
  title: string;
  updatedAt: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="bg-cream">
      <Container className="flex max-w-[52rem] flex-col gap-10 pb-24 pt-14 sm:pt-20">
        <header className="flex flex-col gap-5">
          <Eyebrow>Informations légales</Eyebrow>
          <h1 className="text-h1 text-maison">
            {title}
            <Period />
          </h1>
          <p className="text-small text-ink-soft">Dernière mise à jour : {updatedAt}</p>
          {intro ? <div className="text-lead text-ink">{intro}</div> : null}
        </header>
        {children}
      </Container>
    </div>
  );
}
