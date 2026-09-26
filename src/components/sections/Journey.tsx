import { Period, Section, SectionHeader } from "@/components/ui/Section";
import { journey } from "@/content/services";

/** Avant, pendant, après : le cycle de chaque séjour. */
export function Journey() {
  return (
    <Section id="accompagnement" tone="surface" labelledBy="accompagnement-title" className="border-y border-line/50">
      <SectionHeader
        eyebrow="Notre accompagnement"
        titleId="accompagnement-title"
        title={
          <>
            Avant, pendant, après : tout le cycle est pris en charge
            <Period />
          </>
        }
        intro="Chaque départ prépare la prochaine arrivée : le cycle recommence à chaque séjour."
      />

      <ol className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-3 lg:gap-10">
        {journey.map((phase, index) => (
          <li key={phase.step} className="reveal flex flex-col gap-5 border-t border-maison/25 pt-7">
            <div className="flex items-baseline gap-4">
              <span className="font-display text-[2.5rem] leading-none text-terra-text" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-caption text-terra-text">{phase.step}</p>
                <h3 className="text-h3 text-maison">{phase.title}</h3>
              </div>
            </div>
            <ul className="flex flex-col gap-2 text-ink">
              {phase.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-olive-deep" />
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}
