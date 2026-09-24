import { ButtonLink } from "@/components/ui/Button";
import { DataBadge } from "@/components/ui/DataBadge";
import { Period, Section, SectionHeader } from "@/components/ui/Section";
import { natureInfo, type DataNature } from "@/content/metrics";

const natures = Object.keys(natureInfo) as DataNature[];

export function TransparencyTeaser() {
  return (
    <Section tone="maison" labelledBy="transparence-title">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div className="flex flex-col gap-8">
          <SectionHeader
            surface="dark"
            eyebrow="Transparence"
            titleId="transparence-title"
            title={
              <>
                Nos chiffres, en toute transparence
                <Period surface="dark" />
              </>
            }
            intro="Nos données seront publiées ici au fur et à mesure que notre activité se développe."
          />
          <p className="max-w-[34rem] text-cream/90">
            Chaque chiffre indiquera sa nature, sa source et sa période. Nous n’affichons aucun chiffre
            que nous ne pouvons pas justifier.
          </p>
          <ButtonLink href="/transparence" variant="light" arrow className="self-start">
            Voir la page Transparence
          </ButtonLink>
        </div>

        <ul className="grid content-start gap-3 sm:grid-cols-2">
          {natures.map((nature) => (
            <li key={nature} className="reveal flex flex-col gap-3 rounded-[var(--radius-card)] border border-cream/20 p-5">
              <DataBadge nature={nature} onDark className="self-start" />
              <p className="text-small text-cream/85">{natureInfo[nature].description}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
