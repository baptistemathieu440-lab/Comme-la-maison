import Image, { type StaticImageData } from "next/image";
import { Phone } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow, Period } from "@/components/ui/Section";
import { images } from "@/content/images";
import { primaryCta } from "@/content/navigation";
import { site } from "@/content/site";
import { telHref } from "@/lib/format";

/** Dernière section des pages : une invitation à nous contacter, avec les numéros directs. */
export function ContactCta({
  title = "Et si vous n’aviez plus rien à gérer ?",
  image = images.bordeaux.src,
}: {
  title?: string;
  /** Photo décorative : en choisir une qui n'apparaît pas déjà sur la page. */
  image?: StaticImageData;
}) {
  return (
    <section aria-labelledby="contact-cta-title" className="bg-cream py-[4.5rem] sm:py-24 lg:py-28">
      <Container>
        <div className="on-dark grid overflow-hidden rounded-[var(--radius-panel)] bg-maison text-cream md:grid-cols-[1fr_0.9fr]">
          <div className="flex flex-col gap-6 p-8 sm:p-12 lg:p-16">
            <Eyebrow surface="dark">Contact</Eyebrow>
            <h2 id="contact-cta-title" className="text-h2 text-cream">
              {title}
              {/[?!]$/.test(title) ? null : <Period surface="dark" />}
            </h2>
            <p className="text-lead max-w-[30rem] text-cream/85">
              Parlons de votre logement et de son potentiel. Baptiste ou Simon vous répond personnellement.
            </p>
            <div className="mt-2 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center">
              <ButtonLink href={primaryCta.href} variant="light" arrow>
                {primaryCta.label}
              </ButtonLink>
              {site.contact.phones.length > 0 ? (
                <ul className="flex flex-col gap-1">
                  {site.contact.phones.map((phone) => (
                    <li key={phone.number}>
                      <a
                        href={telHref(phone.number)}
                        className="inline-flex min-h-10 items-center gap-2 text-small font-medium text-cream/90 underline-offset-4 hover:text-cream hover:underline"
                      >
                        <Phone aria-hidden="true" className="size-4 text-olive-light" strokeWidth={1.75} />
                        {phone.name} <span className="whitespace-nowrap">{phone.number}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
          <div className="relative hidden min-h-[22rem] md:block">
            <Image
              src={image}
              alt=""
              fill
              placeholder="blur"
              sizes="(min-width: 1216px) 34rem, 45vw"
              className="object-cover object-[60%_50%]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
