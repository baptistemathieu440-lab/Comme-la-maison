import { horizontal, symbol, symbolSmall, vertical } from "./logo-paths";

type Tone = "light" | "dark" | "mono";

type LogoProps = {
  /** Mise en page : verticale (logo d'origine), horizontale (navigation) ou symbole seul. */
  layout?: "vertical" | "horizontal" | "symbol";
  /** light : sur fond clair. dark : sur fond vert. mono : une seule couleur. */
  tone?: Tone;
  /** Le logo fourni écrit « maison » en minuscule ; passer à true pour « Maison ». */
  capitalized?: boolean;
  /** Symbole simplifié pour les très petites tailles. */
  small?: boolean;
  className?: string;
  /** Laisser vide si le logo est décoratif (un texte voisin porte déjà le nom). */
  title?: string;
};

const palettes: Record<
  Tone,
  { disc: string; door: string; knob: string; wordmark: string; tagline: string }
> = {
  light: {
    disc: "var(--color-maison)",
    door: "var(--color-cream)",
    knob: "var(--color-terra)",
    wordmark: "var(--color-maison)",
    tagline: "var(--color-terra)",
  },
  // Sur fond vert, la porte reprend la couleur du fond : elle reste « le vide », comme dans l'original.
  dark: {
    disc: "var(--color-cream)",
    door: "var(--color-maison)",
    knob: "var(--color-terra-on-dark)",
    wordmark: "var(--color-cream)",
    tagline: "var(--color-terra-light)",
  },
  mono: {
    disc: "currentColor",
    door: "none",
    knob: "currentColor",
    wordmark: "currentColor",
    tagline: "currentColor",
  },
};

function LogoSymbol({ tone, small }: { tone: Tone; small?: boolean }) {
  const c = palettes[tone];
  const door = small ? symbolSmall.door : symbol.door;
  const knob = small ? symbolSmall.knob : symbol.knob;
  if (tone === "mono") {
    // La porte est découpée dans le disque pour laisser voir le fond.
    return (
      <>
        <path
          fillRule="evenodd"
          fill={c.disc}
          d={`M50 0a50 50 0 1 0 0 100A50 50 0 1 0 50 0z${door}`}
        />
        <circle {...knob} fill={c.knob} />
      </>
    );
  }
  return (
    <>
      <circle {...symbol.disc} fill={c.disc} />
      <path d={door} fill={c.door} />
      <circle {...knob} fill={c.knob} />
    </>
  );
}

export function Logo({
  layout = "horizontal",
  tone = "light",
  capitalized = false,
  small = false,
  className,
  title,
}: LogoProps) {
  const c = palettes[tone];
  const a11y = title
    ? { role: "img" as const, "aria-label": title }
    : { "aria-hidden": true as const };

  if (layout === "symbol") {
    return (
      <svg viewBox="0 0 100 100" className={className} focusable="false" {...a11y}>
        <LogoSymbol tone={tone} small={small} />
      </svg>
    );
  }

  const set = layout === "vertical" ? vertical : horizontal;
  return (
    <svg viewBox={set.viewBox} className={className} focusable="false" {...a11y}>
      <LogoSymbol tone={tone} small={small} />
      <path d={capitalized ? set.wordmarkCapitalized : set.wordmark} fill={c.wordmark} />
      <path d={set.tagline} fill={c.tagline} />
    </svg>
  );
}
