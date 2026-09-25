import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type Tone = "cream" | "stone" | "surface" | "olive" | "olive-light" | "maison";

const tones: Record<Tone, string> = {
  cream: "bg-cream text-ink",
  stone: "bg-stone text-ink",
  surface: "bg-surface text-ink",
  olive: "bg-olive text-ink",
  "olive-light": "bg-olive-light text-ink",
  maison: "on-dark bg-maison text-cream",
};

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("mx-auto w-full max-w-[76rem] px-5 sm:px-8 lg:px-12", className)}>
      {children}
    </div>
  );
}

/** Espacement vertical : standard, resserré (pages de détail), ou sans marge haute (suite d'une introduction). */
type Spacing = "default" | "compact" | "flush-top";

const spacings: Record<Spacing, string> = {
  default: "py-[4.5rem] sm:py-24 lg:py-32",
  compact: "py-14 sm:py-16 lg:py-20",
  "flush-top": "pb-[4.5rem] sm:pb-24 lg:pb-32",
};

export function Section({
  id,
  labelledBy,
  tone = "cream",
  spacing = "default",
  className,
  children,
}: {
  id?: string;
  labelledBy?: string;
  tone?: Tone;
  spacing?: Spacing;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(spacings[spacing], tones[tone], className)}
    >
      <Container>{children}</Container>
    </section>
  );
}

/** Ton du fond sur lequel est posé un élément : clair, olive ou vert. */
export type Surface = "light" | "olive" | "dark";

const eyebrowText: Record<Surface, string> = {
  light: "text-ink-soft",
  // Sur olive, le gris sauge n'atteint pas 4,5:1 : on passe en encre.
  olive: "text-ink",
  dark: "text-olive-light",
};

/** Sur-titre : annonce la section, précédé du point terracotta (la poignée du logo). */
export function Eyebrow({
  children,
  className,
  surface = "light",
}: {
  children: ReactNode;
  className?: string;
  surface?: Surface;
}) {
  return (
    <p className={cn("text-caption inline-flex items-center gap-2.5", eyebrowText[surface], className)}>
      <span
        aria-hidden="true"
        className={cn(
          "size-2 shrink-0 rounded-full",
          surface === "dark" ? "bg-terra-on-dark" : "bg-terra",
        )}
      />
      {children}
    </p>
  );
}

/** Le point final terracotta des grands titres. */
export function Period({ surface = "light" }: { surface?: Surface }) {
  const color = { light: "text-terra", olive: "text-terra-text", dark: "text-terra-on-dark" }[surface];
  return <span className={color}>.</span>;
}

/** En-tête de section : sur-titre, titre, introduction. */
export function SectionHeader({
  eyebrow,
  title,
  titleId,
  intro,
  surface = "light",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  titleId: string;
  intro?: ReactNode;
  surface?: Surface;
  className?: string;
}) {
  return (
    <div className={cn("flex max-w-[46rem] flex-col gap-5", className)}>
      <Eyebrow surface={surface}>{eyebrow}</Eyebrow>
      <h2 id={titleId} className={cn("text-h2", surface === "dark" ? "text-cream" : "text-maison")}>
        {title}
      </h2>
      {intro ? (
        <div className={cn("text-lead max-w-[40rem]", surface === "dark" ? "text-cream/90" : "text-ink")}>
          {intro}
        </div>
      ) : null}
    </div>
  );
}
