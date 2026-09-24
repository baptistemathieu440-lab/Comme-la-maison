import { Check } from "lucide-react";

import { Period, Section, SectionHeader } from "@/components/ui/Section";
import { site } from "@/content/site";
import { ownerTasks } from "@/content/offer";

export function Comparison() {
  return (
    <Section tone="stone" labelledBy="controle-title">
      <SectionHeader
        eyebrow="Ce qui change pour vous"
        titleId="controle-title"
        title={
          <>
            Vous gardez le contrôle. Nous prenons en charge le quotidien
            <Period />
          </>
        }
      />

      <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-2 lg:gap-6">
        <div className="reveal flex flex-col rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-9">
          <h3 className="text-h3 text-maison">Sans conciergerie</h3>
          <p className="mt-2 text-ink-soft">Le propriétaire doit gérer :</p>
          <ul className="mt-7 flex flex-wrap gap-2.5">
            {ownerTasks.map((task) => (
              <li
                key={task}
                className="inline-flex min-h-10 items-center gap-2.5 rounded-full border border-line-strong/60 px-4 text-[0.9375rem] text-ink"
              >
                <span aria-hidden="true" className="size-2.5 rounded-full border-[1.5px] border-line-strong" />
                {task}
              </li>
            ))}
          </ul>
        </div>

        <div className="reveal on-dark flex flex-col rounded-[var(--radius-card)] bg-maison p-6 text-cream sm:p-9">
          <h3 className="text-h3 text-cream">Avec {site.name}</h3>
          <p className="mt-2 text-cream/85">Nous nous occupons de la gestion :</p>
          <ul className="mt-7 flex flex-wrap gap-2.5">
            {ownerTasks.map((task) => (
              <li
                key={task}
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-cream/10 px-4 text-[0.9375rem] text-cream"
              >
                <Check aria-hidden="true" className="size-4 text-olive" strokeWidth={2.25} />
                {task}
              </li>
            ))}
          </ul>
          <p className="mt-auto pt-8 text-cream/90">
            Vous gardez la visibilité sur votre activité tout en déléguant l’opérationnel.
          </p>
        </div>
      </div>
    </Section>
  );
}
