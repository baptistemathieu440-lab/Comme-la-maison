import { Period, Section, SectionHeader } from "@/components/ui/Section";
import { pillars } from "@/content/offer";

/** Pourquoi Comme à la Maison : six raisons, une ligne chacune. */
export function WhyUs() {
  return (
    <Section tone="maison" labelledBy="pourquoi-title">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeader
          surface="dark"
          eyebrow="Pourquoi nous"
          titleId="pourquoi-title"
          title={
            <>
              Pourquoi Comme à la Maison
              <Period surface="dark" />
            </>
          }
          intro="Une conciergerie à taille humaine, chaleureuse et exigeante, qui connaît Bordeaux et prend soin de votre logement comme du sien."
          className="lg:sticky lg:top-32 lg:self-start"
        />

        <ul className="grid gap-x-10 sm:grid-cols-2">
          {pillars.map(({ title, text, icon: Icon }) => (
            <li key={title} className="reveal flex gap-5 border-t border-cream/15 py-7">
              <Icon aria-hidden="true" className="mt-1 size-6 shrink-0 text-olive" strokeWidth={1.25} />
              <div className="flex flex-col gap-1.5">
                <h3 className="font-display text-[1.1875rem] font-medium leading-snug text-cream">{title}</h3>
                <p className="text-small text-cream/80">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
