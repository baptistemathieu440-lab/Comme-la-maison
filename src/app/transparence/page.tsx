import type { Metadata } from "next";

import { MetricCard } from "@/components/charts/MetricCard";
import { ButtonLink } from "@/components/ui/Button";
import { DataBadge } from "@/components/ui/DataBadge";
import { Container, Eyebrow, Period, Section, SectionHeader } from "@/components/ui/Section";
import { isPublishable, metrics, natureInfo, type DataNature } from "@/content/metrics";
import { primaryCta } from "@/content/navigation";

export const metadata: Metadata = {
  title: "Nos chiffres, en toute transparence",
  description:
    "Les chiffres de Comme à la Maison, conciergerie Airbnb à Bordeaux : chaque donnée publiée indique sa nature, sa source et sa période.",
  alternates: { canonical: "/transparence" },
};

const natures = Object.keys(natureInfo) as DataNature[];

export default function TransparencePage() {
  const anyPublished = metrics.some(isPublishable);

  return (
    <>
      <section aria-labelledby="transparence-h1" className="bg-cream">
        <Container className="flex flex-col gap-6 pb-14 pt-14 sm:pt-20 lg:pb-20 lg:pt-24">
          <Eyebrow>Transparence</Eyebrow>
          <h1 id="transparence-h1" className="text-h1 max-w-[52rem] text-maison">
            Nos chiffres, en toute transparence
            <Period />
          </h1>
          <p className="text-lead max-w-[40rem] text-ink">
            {anyPublished
              ? "Voici les chiffres de notre activité. Ils sont complétés au fur et à mesure que notre activité se développe."
              : "Nos données seront publiées ici au fur et à mesure que notre activité se développe."}
          </p>
          <p className="max-w-[40rem] text-ink-soft">
            Aucun chiffre n’est publié sans sa nature, sa source et sa période. Tant qu’un indicateur
            n’a pas de données vérifiables, il reste vide.
          </p>
        </Container>
      </section>

      <Section tone="surface" labelledBy="natures-title" className="border-y border-line/60">
        <SectionHeader
          eyebrow="Lire nos chiffres"
          titleId="natures-title"
          title={
            <>
              Quatre natures de données, jamais mélangées
              <Period />
            </>
          }
          intro="Chaque graphique porte un badge. Il se distingue aussi par sa forme : plein, hachuré, en contour ou en pointillés."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {natures.map((nature) => (
            <li key={nature} className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-cream p-6">
              <DataBadge nature={nature} className="self-start" />
              <p className="text-ink">{natureInfo[nature].description}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="indicateurs-title">
        <SectionHeader
          eyebrow="Indicateurs"
          titleId="indicateurs-title"
          title={
            <>
              Ce que nous publierons
              <Period />
            </>
          }
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </Section>

      <Section tone="maison" labelledBy="transparence-cta-title">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-[40rem] flex-col gap-4">
            <h2 id="transparence-cta-title" className="text-h2 text-cream">
              Parlons de votre logement
              <Period surface="dark" />
            </h2>
            <p className="text-lead text-cream/90">
              Nous estimons son potentiel avec vous, sans rien vous promettre que nous ne puissions
              justifier.
            </p>
          </div>
          <ButtonLink href={primaryCta.href} variant="light" arrow>
            {primaryCta.label}
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
