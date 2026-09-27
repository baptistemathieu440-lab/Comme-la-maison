import { BedDouble, Landmark, ReceiptText, Sparkles, Wallet } from "lucide-react";

import { Period, Section, SectionHeader } from "@/components/ui/Section";
import { site } from "@/content/site";

const steps = [
  {
    icon: Landmark,
    title: "La plateforme verse le séjour",
    text: "Airbnb, Booking.com ou Abritel encaissent la réservation, prélèvent leurs frais et vous versent le reste, directement sur votre compte.",
  },
  {
    icon: Wallet,
    title: "Le prix des nuitées perçu",
    text: "C’est la base de calcul : ce que vous percevez réellement pour les nuitées, après les frais de la plateforme.",
  },
  {
    icon: ReceiptText,
    title: `${site.commission.label} ${site.commission.taxNote} pour nous`,
    text: "Chaque mois, un relevé détaillé, réservation par réservation, avec la facture de notre commission.",
  },
];

const outside = [
  {
    icon: Sparkles,
    title: "Frais de ménage",
    text: "Payés par les voyageurs, versés avec le séjour puis refacturés à l’identique.",
  },
  {
    icon: Landmark,
    title: "Taxe de séjour",
    text: "Reversée à la collectivité, elle n’entre pas dans la base de calcul.",
  },
  {
    icon: BedDouble,
    title: "Linge",
    text: "Son achat reste à votre charge ; nous gérons sa rotation.",
  },
];

/** Comment se calcule notre commission : trois étapes, un exemple, et ce qui n'entre pas dans le calcul. */
export function CommissionSteps() {
  return (
    <Section id="calcul" tone="surface" labelledBy="calcul-title" className="border-y border-line/50">
      <SectionHeader
        eyebrow="Le calcul"
        titleId="calcul-title"
        title={
          <>
            Comment se calcule notre commission
            <Period />
          </>
        }
        intro="Une seule règle, appliquée à chaque réservation, et un relevé détaillé chaque mois pour tout vérifier."
      />

      <ol className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-12 lg:gap-6">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="reveal flex flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-cream p-6">
            <div className="flex items-center justify-between">
              <span className="grid size-11 place-items-center rounded-full bg-olive-light text-maison">
                <Icon aria-hidden="true" className="size-5" strokeWidth={1.5} />
              </span>
              <span aria-hidden="true" className="font-display text-[1.75rem] leading-none text-terra-text">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="text-h3 text-maison">{title}</h3>
            <p className="text-small text-ink-soft">{text}</p>
          </li>
        ))}
      </ol>

      <div className="mt-6 grid gap-4 lg:mt-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
        <figure className="flex flex-col gap-5 rounded-[var(--radius-card)] bg-maison p-6 text-cream sm:p-8">
          <figcaption className="text-caption text-olive-light">Exemple illustratif</figcaption>
          <dl className="grid gap-3 sm:grid-cols-3 sm:gap-6">
            <div className="flex items-baseline justify-between gap-4 border-b border-cream/15 pb-3 sm:flex-col sm:justify-start sm:gap-1 sm:border-0 sm:pb-0">
              <dt className="text-small text-cream/80">Nuitées perçues</dt>
              <dd className="font-display text-[1.75rem] leading-none sm:text-[2.25rem]">1 000 €</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-cream/15 pb-3 sm:flex-col sm:justify-start sm:gap-1 sm:border-0 sm:pb-0">
              <dt className="text-small text-cream/80">Commission {site.commission.label}</dt>
              <dd className="font-display text-[1.75rem] leading-none text-terra-light sm:text-[2.25rem]">200 €</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-cream/15 pb-3 sm:flex-col sm:justify-start sm:gap-1 sm:border-0 sm:pb-0">
              <dt className="text-small text-cream/80">Pour vous</dt>
              <dd className="font-display text-[1.75rem] leading-none sm:text-[2.25rem]">800 €</dd>
            </div>
          </dl>
          <p className="text-small text-cream/80">
            Montants TTC, hors frais de ménage et taxe de séjour, avant charges et fiscalité. Un exemple pour
            comprendre le calcul, pas une estimation de revenus.
          </p>
        </figure>

        <div className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-cream p-6 sm:p-8">
          <h3 className="text-caption text-ink-soft">Hors base de calcul</h3>
          <ul className="flex flex-col gap-4">
            {outside.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-3">
                <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-olive-deep" strokeWidth={1.5} />
                <p className="text-small text-ink-soft">
                  <span className="font-semibold text-maison">{title}.</span> {text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
