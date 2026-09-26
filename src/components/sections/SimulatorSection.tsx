import { Section, SectionHeader } from "@/components/ui/Section";

import { Simulator } from "./Simulator";

export function SimulatorSection() {
  return (
    <Section id="simulateur" tone="stone" labelledBy="simulateur-title">
      <SectionHeader
        eyebrow="Simulateur"
        titleId="simulateur-title"
        title="Quel pourrait être le potentiel de votre logement ?"
        intro="Indiquez un prix moyen par nuit, un nombre de nuits louées et, si vous le connaissez, le pourcentage prélevé par la plateforme : le calcul applique notre commission de 20 % TTC sur les revenus que vous percevez."
      />
      <Simulator />
    </Section>
  );
}
