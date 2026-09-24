import Image from "next/image";

import { Eyebrow, Period, Section } from "@/components/ui/Section";
import { images } from "@/content/images";

export function OurPromise() {
  return (
    <Section tone="surface" labelledBy="promesse-title" className="border-y border-line/60">
      <div className="grid items-center gap-12 md:grid-cols-[0.8fr_1fr] lg:gap-20">
        <div className="reveal relative mx-auto w-full max-w-[22rem] md:max-w-none">
          <div className="arch relative aspect-[3/4] w-full">
            <Image
              src={images.promise.src}
              alt={images.promise.alt}
              fill
              placeholder="blur"
              sizes="(min-width: 768px) 30vw, 80vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Eyebrow>Notre promesse</Eyebrow>
          <h2 id="promesse-title" className="text-h2 text-maison">
            Vous louez. Nous gérons
            <Period />
          </h2>
          <p className="text-lead max-w-[36rem] text-ink">
            Votre logement mérite une attention particulière. Nous prenons en charge chaque étape de
            sa location courte durée afin que vous puissiez profiter de votre bien sans en gérer les
            contraintes.
          </p>
          <p className="max-w-[36rem] border-l-2 border-terra pl-5 font-display text-[1.375rem] font-medium leading-snug tracking-[-0.01em] text-maison [font-stretch:92%]">
            Vous profitez de votre logement et de ses revenus. Nous nous occupons du reste.
          </p>
        </div>
      </div>
    </Section>
  );
}
