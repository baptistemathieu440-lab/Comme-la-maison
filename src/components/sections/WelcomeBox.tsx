import Image from "next/image";

import { Eyebrow, Period, Section } from "@/components/ui/Section";
import { images } from "@/content/images";
import { site } from "@/content/site";

export function WelcomeBox() {
  return (
    <Section id="box-de-bienvenue" tone="stone" labelledBy="box-title">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
        <div className="flex flex-col gap-6 lg:order-2">
          <Eyebrow>Box de bienvenue</Eyebrow>
          <h2 id="box-title" className="text-h2 text-maison">
            Une attention qui commence dès l’arrivée
            <Period />
          </h2>
          <p className="text-lead max-w-[36rem] text-ink">
            Chaque logement a son propre positionnement. Nous adaptons donc la box de bienvenue à la
            gamme du bien et à l’expérience que nous souhaitons offrir à ses voyageurs.
          </p>

          <figure className="mt-2 flex flex-col gap-4 rounded-[var(--radius-card)] bg-surface p-6 sm:p-7">
            <figcaption className="text-small text-ink-soft">
              La qualité de la box évolue avec le positionnement et les revenus du logement.
            </figcaption>
            <div aria-hidden="true" className="relative h-2 rounded-full bg-linear-to-r from-olive-light via-olive to-maison">
              <span className="absolute left-0 top-1/2 size-4 -translate-y-1/2 rounded-full border-[3px] border-surface bg-olive-strong" />
              <span className="absolute right-0 top-1/2 size-4 -translate-y-1/2 rounded-full border-[3px] border-surface bg-maison" />
            </div>
            <dl className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <dt className="text-caption text-ink-soft">Logement à revenus plus modérés</dt>
                <dd className="font-medium text-maison">Une box adaptée</dd>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <dt className="text-caption text-ink-soft">Logement premium</dt>
                <dd className="font-medium text-maison">Une box plus travaillée et premium</dd>
              </div>
            </dl>
          </figure>

          <p className="inline-flex items-center gap-3 self-start rounded-full bg-maison px-5 py-3 text-cream">
            <span aria-hidden="true" className="size-2 rounded-full bg-terra-on-dark" />
            Incluse dans notre commission de {site.commission.label}.
          </p>
        </div>

        <div className="reveal relative mx-auto w-full max-w-[26rem] lg:order-1 lg:max-w-none">
          <div className="arch relative aspect-[3/4] w-full">
            <Image
              src={images.welcomeBox.src}
              alt={images.welcomeBox.alt}
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 34vw, 85vw"
              className="object-cover object-[40%_50%]"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
