import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import { Container, Period } from "@/components/ui/Section";
import { images } from "@/content/images";
import { primaryCta } from "@/content/navigation";
import { site } from "@/content/site";

/**
 * Premier écran de l'accueil : une grande photo, le nom, une phrase, deux boutons.
 * Qui (le nom), quoi (la phrase), où (Bordeaux et sa métropole) en un coup d'œil.
 */
export function Hero() {
  return (
    <section data-hero aria-labelledby="hero-title" className="on-dark relative isolate overflow-hidden bg-maison text-cream">
      <Image
        src={images.hero.src}
        alt={images.hero.alt}
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="-z-20 object-cover object-[62%_50%]"
      />
      {/* Voile dégradé : le texte reste lisible quelle que soit la photo. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-ink/85 via-ink/45 to-ink/15 lg:bg-linear-to-r lg:from-ink/80 lg:via-ink/40 lg:to-ink/5"
      />

      <Container className="flex min-h-[calc(100svh-4.5rem)] flex-col justify-end pb-14 pt-32 sm:pb-20 lg:min-h-[min(calc(100svh-5rem),54rem)] lg:justify-center lg:pb-24">
        <div className="hero-in flex max-w-[40rem] flex-col">
          <p className="text-caption flex items-center gap-2.5 text-cream/90">
            <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-terra-on-dark" />
            {site.name}
          </p>
          <h1 id="hero-title" className="text-h1 mt-6 text-cream">
            Votre logement, soigné comme à la maison
            <Period surface="dark" />
          </h1>
          <p className="text-lead mt-6 max-w-[32rem] text-cream/90">
            Conciergerie et gestion de location courte durée à {site.area.city} et dans sa métropole.
          </p>
          <div className="mt-10 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
            <ButtonLink href="/nos-offres" variant="light" arrow>
              Découvrir nos offres
            </ButtonLink>
            <ButtonLink href={primaryCta.href} variant="ghost-light">
              {primaryCta.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
