import { Check } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow, Period, Section } from "@/components/ui/Section";
import { included, pricingNotes } from "@/content/offer";
import { primaryCta } from "@/content/navigation";
import { site } from "@/content/site";

export function Pricing() {
  return (
    <Section id="tarifs" tone="olive" labelledBy="tarifs-title">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div className="flex flex-col">
          <Eyebrow surface="olive">Tarification</Eyebrow>
          <h2 id="tarifs-title" className="text-h2 mt-5 text-maison">
            Une commission simple. Une gestion complète
            <Period surface="olive" />
          </h2>

          <p className="mt-10 flex flex-wrap items-end gap-x-5 gap-y-2 text-maison">
            <span className="text-display">
              {site.commission.rate}
              <span className="text-[0.5em] tracking-normal"> %</span>
            </span>
            <span className="text-caption mb-3 text-ink">
              {site.commission.taxNote}
              <br />
              {site.commission.base}
            </span>
          </p>

          <div className="mt-8 flex max-w-[34rem] flex-col gap-4 text-ink">
            <p className="text-lead">
              Notre rémunération correspond à {site.commission.rate} % {site.commission.taxNote} des
              revenus locatifs que vous percevez.
            </p>
            <p>{site.commission.baseDetail}</p>
            <p>{site.commission.payment}</p>
            <p>
              Cette commission rémunère notre accompagnement et notre gestion, de l’estimation de
              votre logement à la préparation de chaque séjour.
            </p>
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href="/#simulateur" arrow>
              Simuler mes revenus
            </ButtonLink>
            <ButtonLink href={primaryCta.href} variant="ghost">
              {primaryCta.label}
            </ButtonLink>
          </div>
        </div>

        <div className="reveal flex flex-col gap-8 rounded-[var(--radius-panel)] bg-surface p-6 shadow-soft sm:p-10">
          <div>
            <h3 className="text-h3 text-maison">Inclus dans la commission</h3>
            <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-olive-light text-maison">
                    <Check aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-line pt-7">
            <h3 className="text-caption text-ink-soft">Bon à savoir</h3>
            <dl className="mt-4 flex flex-col gap-4">
              {pricingNotes.map((note) => (
                <div key={note.title} className="flex flex-col gap-1">
                  <dt className="font-semibold text-maison">{note.title}</dt>
                  <dd className="text-small text-ink-soft">{note.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </Section>
  );
}
