import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow, Period, Section } from "@/components/ui/Section";
import { pricingHref } from "@/content/navigation";
import { site } from "@/content/site";

const points = [
  "Conciergerie et gestion complète",
  "Box de bienvenue incluse, adaptée au standing du logement",
  "Un relevé détaillé chaque mois",
];

/** Tarification : l'essentiel en une ligne, le détail sur la page Nos offres. */
export function PricingTeaser() {
  return (
    <Section tone="olive-light" spacing="compact" labelledBy="fonctionnement-title">
      <div className="grid items-center gap-10 lg:grid-cols-[auto_1fr_auto] lg:gap-16">
        <p className="flex items-end gap-4 text-maison">
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

        <div className="flex flex-col gap-4">
          <Eyebrow surface="olive">Transparence</Eyebrow>
          <h2 id="fonctionnement-title" className="text-h3 text-maison">
            Une seule commission, tout compris
            <Period surface="olive" />
          </h2>
          <ul className="flex flex-col gap-1.5 text-ink">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-maison" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <ArrowLink href={pricingHref} className="self-start lg:self-center">
          Comprendre notre fonctionnement
        </ArrowLink>
      </div>
    </Section>
  );
}
