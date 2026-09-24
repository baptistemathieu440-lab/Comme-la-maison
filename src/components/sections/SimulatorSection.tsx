import { Section, SectionHeader } from "@/components/ui/Section";

import { Simulator } from "./Simulator";

export function SimulatorSection() {
  return (
    <Section id="simulateur" labelledBy="simulateur-title">
      <SectionHeader
        eyebrow="Simulateur"
        titleId="simulateur-title"
        title="Quel pourrait être le potentiel de votre logement ?"
        intro="Indiquez un prix moyen par nuit et un nombre de nuits louées : le calcul applique notre commission de 20 %."
      />
      <Simulator />
    </Section>
  );
}
