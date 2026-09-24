import Image from "next/image";

import { Eyebrow, Period, Section } from "@/components/ui/Section";
import { aboutText, founders } from "@/content/about";
import { images } from "@/content/images";

export function About() {
  return (
    <Section id="qui-sommes-nous" tone="surface" labelledBy="qui-title" className="border-y border-line/60">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div className="flex flex-col gap-6">
          <Eyebrow>Qui sommes-nous</Eyebrow>
          <h2 id="qui-title" className="text-h2 text-maison">
            Deux associés, une même ambition
            <Period />
          </h2>
          {aboutText.map((paragraph, i) => (
            <p key={i} className={i === 0 ? "text-lead max-w-[36rem] text-ink" : "max-w-[36rem] text-ink"}>
              {paragraph}
            </p>
          ))}
        </div>

        <ul className="grid grid-cols-2 gap-4 self-end sm:gap-6">
          {founders.map((founder) => (
            <li key={founder.name} className="reveal flex flex-col gap-4">
              <div className="arch relative grid aspect-[3/4] place-items-center bg-olive-light">
                {founder.photo ? (
                  <Image
                    src={founder.photo}
                    alt={`Portrait de ${founder.name}, ${founder.role.toLowerCase()} de Comme à la Maison`}
                    fill
                    sizes="(min-width: 1024px) 18vw, 45vw"
                    className="object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="font-display text-[clamp(3.5rem,10vw,6rem)] font-medium leading-none text-maison [font-stretch:92%]"
                  >
                    {founder.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-0.5 px-1">
                <h3 className="text-h3 text-maison">{founder.name}</h3>
                <p className="text-ink-soft">{founder.role}</p>
                {founder.bio ? <p className="mt-2 text-small text-ink">{founder.bio}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <figure className="reveal relative mt-16 overflow-hidden rounded-[var(--radius-panel)] lg:mt-24">
        <div className="relative aspect-[4/3] sm:aspect-[21/9]">
          <Image
            src={images.bordeaux.src}
            alt={images.bordeaux.alt}
            fill
            placeholder="blur"
            sizes="(min-width: 1216px) 72rem, 100vw"
            className="object-cover object-[60%_50%]"
          />
        </div>
        <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/80 via-ink/40 to-transparent px-6 pb-6 pt-16 text-cream sm:px-10 sm:pb-8">
          <span className="font-display text-[1.375rem] font-medium leading-snug tracking-[-0.01em] [font-stretch:92%] sm:text-[1.75rem]">
            Une présence locale à Bordeaux et dans sa métropole.
          </span>
        </figcaption>
      </figure>
    </Section>
  );
}
