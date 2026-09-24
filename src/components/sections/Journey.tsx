import { Check, RefreshCw } from "lucide-react";

import { Period, Section, SectionHeader } from "@/components/ui/Section";
import { journey } from "@/content/services";

export function Journey() {
  return (
    <Section id="accompagnement" labelledBy="accompagnement-title">
      <SectionHeader
        eyebrow="Notre accompagnement"
        titleId="accompagnement-title"
        title={
          <>
            Avant, pendant, après : tout le cycle est pris en charge
            <Period />
          </>
        }
        intro="De l’estimation de votre logement à la préparation du séjour suivant, nous nous occupons de chaque étape de sa location courte durée."
      />

      <ol className="mt-14 grid gap-0 lg:mt-20 lg:grid-cols-3 lg:gap-6">
        {journey.map((phase, index) => (
          <li key={phase.step} className="reveal relative flex gap-5 pb-10 lg:flex-col lg:gap-0 lg:pb-0">
            {/* Frise : un point terracotta par étape, relié au suivant */}
            <div aria-hidden="true" className="relative flex flex-col items-center lg:mb-8 lg:flex-row">
              <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full bg-maison font-display text-[1.05rem] font-medium text-cream [font-stretch:92%]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="w-px flex-1 bg-line-strong/50 lg:h-px lg:w-auto lg:flex-1 lg:ml-3" />
              <span className="absolute left-1/2 top-[calc(100%-0.25rem)] hidden size-2 -translate-x-1/2 rounded-full bg-terra lg:static lg:block lg:translate-x-0" />
            </div>

            <div className="flex-1 rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-7">
              <p className="text-caption text-terra-text">{phase.step}</p>
              <h3 className="text-h3 mt-2 text-maison">{phase.title}</h3>
              <ul className="mt-5 flex flex-col gap-2.5">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-maison" strokeWidth={2.25} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-2 flex items-center gap-3 rounded-full bg-olive-light px-5 py-3.5 text-ink sm:inline-flex lg:mt-8">
        <RefreshCw aria-hidden="true" className="size-5 shrink-0 text-maison" strokeWidth={1.75} />
        Chaque départ prépare la prochaine arrivée : le cycle recommence à chaque séjour.
      </p>
    </Section>
  );
}
