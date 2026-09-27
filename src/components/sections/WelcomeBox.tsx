import Image from "next/image";

import { Eyebrow, Period, Section } from "@/components/ui/Section";
import { images } from "@/content/images";
import { welcomeBoxTiers } from "@/content/offer";
import { site } from "@/content/site";

/** La box de bienvenue : incluse, et adaptée au standing du logement. */
export function WelcomeBox() {
  return (
    <Section id="box-de-bienvenue" labelledBy="box-title">
      <div className="grid items-center gap-12 md:grid-cols-[0.75fr_1fr] lg:gap-20">
        <div className="reveal relative mx-auto w-full max-w-[22rem] md:max-w-none">
          <div className="arch relative aspect-[3/4] w-full">
            <Image
              src={images.welcomeBox.src}
              alt={images.welcomeBox.alt}
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 26rem, (min-width: 768px) 38vw, 80vw"
              className="object-cover object-[40%_50%]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Eyebrow>Box de bienvenue</Eyebrow>
          <h2 id="box-title" className="text-h2 text-maison">
            Une attention qui commence dès l’arrivée
            <Period />
          </h2>
          <p className="text-lead max-w-[34rem] text-ink-soft">
            Incluse dans notre commission de {site.commission.label}, la box de bienvenue évolue avec le
            standing et les revenus locatifs du logement.
          </p>

          <div aria-hidden="true" className="relative mt-2 h-1.5 rounded-full bg-linear-to-r from-olive-light via-olive to-maison" />
          <dl className="grid gap-6 sm:grid-cols-2">
            {welcomeBoxTiers.map((tier) => (
              <div key={tier.title} className="flex flex-col gap-1.5">
                <dt className="flex flex-col gap-1">
                  <span className="text-caption text-ink-soft">{tier.audience}</span>
                  <span className="font-display text-[1.3125rem] font-medium leading-tight text-maison">{tier.title}</span>
                </dt>
                <dd className="text-small text-ink">{tier.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
