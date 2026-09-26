import { Period, Section, SectionHeader } from "@/components/ui/Section";
import { promise } from "@/content/offer";

/** Notre promesse : une phrase et quatre avantages. */
export function OurPromise() {
  return (
    <Section labelledBy="promesse-title">
      <SectionHeader
        align="center"
        eyebrow="Notre promesse"
        titleId="promesse-title"
        title={
          <>
            Vous profitez, nous nous occupons du reste
            <Period />
          </>
        }
        intro="Nous prenons en charge chaque étape de la location courte durée de votre logement, avec le soin que l’on porte à sa propre maison."
      />

      <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 lg:mt-20 lg:grid-cols-4">
        {promise.map(({ title, text, icon: Icon }) => (
          <li key={title} className="reveal flex flex-col items-center gap-4 text-center">
            <span className="grid size-14 place-items-center sm:size-16 rounded-full border border-olive-deep/50 text-maison">
              <Icon aria-hidden="true" className="size-6" strokeWidth={1.25} />
            </span>
            <h3 className="font-display text-[1.125rem] font-medium leading-snug text-maison sm:text-[1.25rem]">{title}</h3>
            <p className="max-w-[16rem] text-small text-ink-soft">{text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
