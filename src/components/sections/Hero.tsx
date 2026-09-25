import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import { Container, Period } from "@/components/ui/Section";
import { images } from "@/content/images";
import { primaryCta } from "@/content/navigation";
import { site } from "@/content/site";

const trust = [
  `${site.commission.label} ${site.commission.taxNote} ${site.commission.base}`,
  `${site.area.city} et sa métropole`,
  "Deux associés, un interlocuteur",
];

export function Hero() {
  return (
    <section data-hero aria-labelledby="hero-title" className="overflow-hidden bg-cream">
      <Container className="grid items-center gap-12 pb-16 pt-10 sm:pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:pb-24 lg:pt-16 xl:gap-20">
        <div className="flex flex-col">
          <h1 id="hero-title" className="text-maison">
            <span className="text-caption mb-5 flex items-center gap-2.5 text-ink-soft">
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-terra" />
              Conciergerie Airbnb à Bordeaux
            </span>
            <span className="text-h1 block">
              Votre logement, notre savoir‑faire
              <Period />
            </span>
          </h1>
          <p className="text-lead mt-6 max-w-[34rem] text-ink">
            Conciergerie Airbnb et location courte durée à Bordeaux et dans sa métropole.
          </p>
          <p className="mt-3 max-w-[34rem] text-ink-soft">
            De l’estimation de votre logement à l’accueil des voyageurs, nous nous occupons de tout.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href={primaryCta.href} arrow>
              {primaryCta.label}
            </ButtonLink>
            <ButtonLink href="/#accompagnement" variant="ghost">
              Découvrir notre accompagnement
            </ButtonLink>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-small text-ink-soft">
            {trust.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-olive-deep" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual />
      </Container>
    </section>
  );
}

/**
 * Le logo en grand : un disque olive dans lequel s'ouvre une porte en arche,
 * avec sa poignée terracotta. La photo est vue à travers la porte.
 * Comme dans le logo, l'arche est centrée sur le centre du disque et la porte
 * reste entièrement à l'intérieur (largeur 46 %, hauteur 60 %, format 3:4).
 */
function HeroVisual() {
  return (
    <div className="relative mx-auto mb-20 w-full max-w-[31rem] sm:mb-0 lg:max-w-[36rem]">
      <div className="relative aspect-square rounded-full bg-olive">
        <div className="arch-flat absolute bottom-[13%] left-[27%] right-[27%] top-[27%]">
          <Image
            src={images.hero.src}
            alt={images.hero.alt}
            fill
            loading="eager"
            placeholder="blur"
            sizes="(min-width: 1024px) 17rem, 46vw"
            className="object-cover object-[62%_50%]"
          />
        </div>
        <span
          aria-hidden="true"
          className="absolute left-[64.3%] top-[69.9%] size-[3.2%] min-h-3 min-w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-terra ring-[3px] ring-cream/90"
        />
      </div>

      <div className="absolute -bottom-20 left-1/2 flex w-[15.5rem] -translate-x-1/2 flex-col gap-1 rounded-[1.25rem] bg-surface px-5 py-4 shadow-float sm:bottom-[4%] sm:left-[-1rem] sm:translate-x-0">
        <span className="text-[0.75rem] font-semibold uppercase leading-tight tracking-[0.14em] text-ink-soft">Commission unique</span>
        <span className="font-display text-[2.4rem] font-medium leading-none tracking-[-0.02em] text-maison [font-stretch:92%]">
          {site.commission.label}
        </span>
        <span className="text-small text-ink">
          {site.commission.taxNote} {site.commission.base}, pour une gestion complète
        </span>
      </div>
    </div>
  );
}
