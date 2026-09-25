import type { Metadata } from "next";

import { LegalPage, LegalSection, Value } from "@/components/legal/LegalPage";
import { legal } from "@/content/legal";
import { site } from "@/content/site";
import { fieldLabels, requiredFields } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment Comme à la Maison traite les informations envoyées par le formulaire d’estimation, et comment exercer vos droits.",
  alternates: { canonical: "/confidentialite" },
};

export default function ConfidentialitePage() {
  const { privacy } = legal;
  const fields = Object.entries(fieldLabels);

  return (
    <LegalPage
      title="Politique de confidentialité"
      updatedAt={legal.updatedAt}
      intro="Nous collectons uniquement les informations nécessaires pour vous recontacter au sujet de votre logement."
    >
      <LegalSection title="Responsable du traitement">
        <p>
          <Value value={privacy.controller} label="personne ou société responsable" />
          <br />
          Contact : <Value value={privacy.contactEmail} label="adresse email pour les demandes" />
        </p>
      </LegalSection>

      <LegalSection title="Données collectées">
        <p>Le formulaire d’estimation recueille les informations suivantes :</p>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          {fields.map(([key, label]) => (
            <li key={key}>
              {label}
              {requiredFields.includes(key as (typeof requiredFields)[number]) ? " (obligatoire)" : " (facultatif)"}
            </li>
          ))}
        </ul>
        <p>Nous ne collectons aucune autre information à votre sujet par l’intermédiaire de ce site.</p>
      </LegalSection>

      <LegalSection title="Finalité et base légale">
        <p>
          Ces informations servent uniquement à répondre à votre demande : vous recontacter, estimer le
          potentiel de votre logement et vous présenter notre accompagnement. Ce traitement repose sur
          les mesures précontractuelles prises à votre demande (article 6.1.b du RGPD).
        </p>
        <p>Vos informations ne sont ni vendues, ni louées, ni utilisées à des fins publicitaires.</p>
      </LegalSection>

      <LegalSection title="Destinataires">
        <p>
          Vos informations sont destinées à Baptiste et Simon, associés de {site.name}. Pour les
          acheminer, nous faisons appel au prestataire suivant :{" "}
          <Value value={privacy.processors} label="service d’envoi des demandes" />.
        </p>
      </LegalSection>

      <LegalSection title="Durée de conservation">
        <p>
          <Value value={privacy.retention} label="durée de conservation" />
        </p>
      </LegalSection>

      <LegalSection title="Vos droits">
        <p>
          Vous pouvez accéder à vos données, les faire rectifier ou effacer, vous opposer à leur
          traitement, en demander la limitation ou la portabilité. Écrivez-nous à{" "}
          <Value value={privacy.contactEmail} label="adresse email pour les demandes" />.
        </p>
        <p>
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à
          la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">cnil.fr</a>).
        </p>
      </LegalSection>

      <LegalSection title="Cookies et mesure d’audience">
        <p>
          Ce site ne dépose aucun cookie publicitaire ni de mesure d’audience. Les polices de caractères
          sont hébergées avec le site : votre navigateur ne contacte aucun service tiers pour les
          afficher.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
