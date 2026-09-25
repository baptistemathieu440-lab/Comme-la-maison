import type { Metadata } from "next";
import Image from "next/image";
import { Phone } from "lucide-react";

import { ContactCta } from "@/components/sections/ContactCta";
import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow, PageHero, Period, Section, SectionHeader } from "@/components/ui/Section";
import { aboutText, founders, story, territory, values } from "@/content/about";
import { images } from "@/content/images";
import { site } from "@/content/site";
import { telHref } from "@/lib/format";

export const metadata: Metadata = {
  title: "À propos de nous · Baptiste et Simon",
  description: `${site.name}, conciergerie à Bordeaux fondée par Baptiste et Simon : notre histoire, notre vision, notre manière de travailler et notre connaissance de Bordeaux et de sa métropole.`,
  alternates: { canonical: "/a-propos" },
};

export default function AboutPage() {
  const communes = site.area.communes.filter((c) => c !== site.area.city);

  return (
    <>
      <PageHero
        eyebrow="À propos de nous"
        titleId="a-propos-h1"
        title={
          <>
            Deux associés, une même attention
            <Period />
          </>
        }
        intro={aboutText[0]}
        image={
          <div className="arch relative mx-auto aspect-[3/4] w-full max-w-[22rem] lg:max-w-[26rem]">
            <Image
              src={images.promise.src}
              alt={images.promise.alt}
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 1024px) 26rem, 80vw"
              className="object-cover"
            />
          </div>
        }
      />

      {/* Notre histoire */}
      <Section tone="surface" labelledBy="histoire-title" className="border-y border-line/50">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="flex flex-col gap-5">
            <Eyebrow>Notre histoire</Eyebrow>
            <h2 id="histoire-title" className="text-h2 text-maison">
              Simplifier la vie des propriétaires
              <Period />
            </h2>
          </div>
          <div className="flex max-w-[38rem] flex-col gap-5 text-ink">
            {story.paragraphs.map((paragraph, i) => (
              <p key={i} className={i === 0 ? "text-lead" : undefined}>
                {paragraph}
              </p>
            ))}
            <p>{aboutText[1]}</p>
          </div>
        </div>
      </Section>

      {/* Vision, manière de travailler, philosophie */}
      <Section labelledBy="valeurs-title">
        <SectionHeader
          align="center"
          eyebrow="Ce qui nous guide"
          titleId="valeurs-title"
          title={
            <>
              Notre façon d’être conciergerie
              <Period />
            </>
          }
        />
        <ul className="mt-14 grid gap-10 md:grid-cols-3 lg:mt-20 lg:gap-12">
          {values.map((value, i) => (
            <li key={value.title} className="reveal flex flex-col gap-4 border-t border-maison/25 pt-7">
              <span aria-hidden="true" className="font-display text-[2.25rem] leading-none text-terra-text">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-h3 text-maison">{value.title}</h3>
              <p className="text-ink-soft">{value.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Bordeaux */}
      <section aria-labelledby="bordeaux-title" className="on-dark relative isolate overflow-hidden bg-maison text-cream">
        <Image
          src={images.bordeaux.src}
          alt={images.bordeaux.alt}
          fill
          placeholder="blur"
          sizes="100vw"
          className="-z-20 object-cover object-[60%_50%]"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-ink/90 via-ink/60 to-ink/30" />
        <div className="mx-auto flex min-h-[34rem] w-full max-w-[76rem] flex-col justify-end gap-6 px-5 py-20 sm:px-8 lg:min-h-[40rem] lg:px-12 lg:py-24">
          <Eyebrow surface="dark">Notre territoire</Eyebrow>
          <h2 id="bordeaux-title" className="text-h2 max-w-[36rem] text-cream">
            {territory.title}
            <Period surface="dark" />
          </h2>
          <p className="text-lead max-w-[36rem] text-cream/90">{territory.text}</p>
          <details className="accordion group max-w-[44rem]">
            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 font-semibold text-cream underline underline-offset-4 [&::-webkit-details-marker]:hidden">
              Voir les {communes.length + 1} communes où nous intervenons
            </summary>
            <p className="pt-3 text-small text-cream/85">
              {site.area.city}, {communes.join(", ")}.
            </p>
          </details>
        </div>
      </section>

      {/* Baptiste et Simon */}
      <Section labelledBy="fondateurs-title">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="flex flex-col gap-6">
            <Eyebrow>Les fondateurs</Eyebrow>
            <h2 id="fondateurs-title" className="text-h2 text-maison">
              Baptiste et Simon
              <Period />
            </h2>
            <p className="max-w-[28rem] text-ink-soft">
              Deux associés impliqués au quotidien, joignables directement. Ce sont eux qui visitent votre
              logement, répondent à vos questions et veillent au bon déroulement de chaque séjour.
            </p>
          </div>

          <ul className="grid grid-cols-2 gap-4 sm:gap-8">
            {founders.map((founder) => {
              const phone = site.contact.phones.find((p) => p.name === founder.name);
              return (
                <li key={founder.name} className="reveal flex flex-col gap-4">
                  <div className="arch relative grid aspect-[3/4] place-items-center bg-olive-light">
                    {founder.photo ? (
                      <Image
                        src={founder.photo}
                        alt={`Portrait de ${founder.name}, ${founder.role.toLowerCase()} de ${site.name}`}
                        fill
                        sizes="(min-width: 1024px) 20vw, 45vw"
                        className="object-cover"
                      />
                    ) : (
                      <span aria-hidden="true" className="font-display text-[clamp(3.5rem,9vw,6rem)] leading-none text-maison">
                        {founder.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 px-1">
                    <h3 className="text-h3 text-maison">{founder.name}</h3>
                    <p className="text-caption text-ink-soft">{founder.role}</p>
                    {founder.bio ? <p className="mt-2 text-small text-ink">{founder.bio}</p> : null}
                    {phone ? (
                      <a
                        href={telHref(phone.number)}
                        className="mt-2 inline-flex min-h-11 items-center gap-2 text-small font-semibold text-maison underline-offset-4 hover:underline"
                      >
                        <Phone aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.75} />
                        <span className="whitespace-nowrap">{phone.number}</span>
                      </a>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      {/* Transparence */}
      <Section tone="olive-light" spacing="compact" labelledBy="transparence-title">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div className="flex max-w-[40rem] flex-col gap-3">
            <h2 id="transparence-title" className="text-h3 text-maison">
              Nos chiffres, en toute transparence
              <Period surface="olive" />
            </h2>
            <p className="text-ink">
              Chaque chiffre publié indique sa nature, sa source et sa période. Nous n’affichons aucun chiffre
              que nous ne pouvons pas justifier.
            </p>
          </div>
          <ArrowLink href="/transparence" className="shrink-0 self-start md:self-center">
            Voir la page Transparence
          </ArrowLink>
        </div>
      </Section>

      <ContactCta title="Faisons connaissance" image={images.keys.src} />
    </>
  );
}
