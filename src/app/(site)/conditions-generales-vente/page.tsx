import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage, LegalSection, PendingNotice, Value } from "@/components/legal/LegalPage";
import { legal } from "@/content/legal";
import { included, pricingNotes } from "@/content/offer";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Conditions générales de prestation de services",
  description:
    "Conditions générales des prestations de conciergerie de Comme à la Maison pour les propriétaires de logements loués en courte durée à Bordeaux.",
  alternates: { canonical: "/conditions-generales-vente" },
  robots: { index: false, follow: true },
};

const toc = [
  { id: "objet", label: "Objet et champ d’application" },
  { id: "prestations", label: "Prestations" },
  { id: "limites", label: "Ce que nous ne faisons pas" },
  { id: "prix", label: "Prix et commission" },
  { id: "facturation", label: "Relevé mensuel, facturation et paiement" },
  { id: "duree", label: "Durée et résiliation" },
  { id: "retractation", label: "Droit de rétractation" },
  { id: "proprietaire", label: "Obligations du propriétaire" },
  { id: "conciergerie", label: "Nos engagements" },
  { id: "responsabilite", label: "Responsabilité et assurances" },
  { id: "donnees", label: "Données personnelles" },
  { id: "reclamations", label: "Réclamations et médiation" },
  { id: "droit", label: "Droit applicable" },
];

export default function ConditionsGeneralesPage() {
  const { company, regulated, contract } = legal;
  const { commission } = site;
  const cleaning = pricingNotes.find((note) => note.title === "Le ménage");
  const linen = pricingNotes.find((note) => note.title === "Le linge");

  return (
    <LegalPage
      title="Conditions générales de prestation de services"
      updatedAt={legal.updatedAt}
      toc={toc}
      current="/conditions-generales-vente"
      intro={
        <p>
          Ces conditions s’adressent aux propriétaires qui confient à {site.name} l’accompagnement de leur logement loué en
          courte durée. Elles ne concernent pas les voyageurs, dont le séjour est régi par les conditions de la plateforme
          de réservation utilisée et par celles du propriétaire.
        </p>
      }
    >
      <PendingNotice>
        <p>
          Ces conditions générales sont en cours de validation par un professionnel du droit. Elles ne constituent pas une
          offre : seul le contrat signé avec chaque propriétaire, et ses conditions particulières, engagent les parties.
        </p>
      </PendingNotice>

      <LegalSection id="objet" title="1. Objet et champ d’application">
        <p>
          Les présentes conditions définissent les modalités selon lesquelles <Value value={company.legalName} label="dénomination sociale" />{" "}
          (« {site.name} »), SIREN <Value value={company.siren} label="SIREN" />, dont le siège est situé{" "}
          <Value value={company.headOffice} label="adresse du siège" />, réalise des prestations de conciergerie pour le
          compte de propriétaires de logements meublés situés à {site.area.city} et dans {site.area.region} (le « propriétaire »).
        </p>
        <p>
          Elles sont remises au propriétaire avant la signature du contrat et en font partie. En cas de contradiction, les
          conditions particulières du contrat signé prévalent.
        </p>
      </LegalSection>

      <LegalSection id="prestations" title="2. Prestations">
        <p>La commission comprend les prestations suivantes, dont le détail est précisé au contrat :</p>
        <ul>
          {included.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>
          Les prestations complémentaires éventuelles (interventions techniques, achats, prestations sur mesure) font l’objet
          d’un accord préalable du propriétaire et sont facturées selon les tarifs suivants :{" "}
          <Value value={contract.extraServicesPricing} label="tarifs des prestations complémentaires" />.
        </p>
      </LegalSection>

      <LegalSection id="limites" title="3. Ce que nous ne faisons pas">
        <ul>
          <li>
            Nous n’encaissons pas les loyers, les cautions ni aucune somme destinée au propriétaire : les plateformes versent
            le prix des séjours directement au propriétaire.
          </li>
          <li>Nous ne garantissons aucun niveau de revenu, de taux d’occupation ou de prix par nuit.</li>
          <li>
            Nous ne sommes pas propriétaire des logements et ne délivrons aucune attestation de conformité d’un logement
            à la réglementation.
          </li>
        </ul>
        {regulated.hoguetStatus === "pending" ? (
          <p>
            Le périmètre exact des prestations liées aux annonces et aux réservations (création et mise à jour des annonces,
            fixation des prix, acceptation des réservations) est défini au contrat, dans les limites permises par la
            réglementation des activités immobilières, dont l’application est en cours de vérification.
          </p>
        ) : null}
      </LegalSection>

      <LegalSection id="prix" title="4. Prix et commission">
        <p>
          La rémunération de {site.name} est une commission de {commission.label} {commission.taxNote} {commission.base}.{" "}
          {commission.baseDetail}
        </p>
        <p>
          Le taux applicable est celui du contrat signé ; il est figé pour chaque réservation au moment où elle est enregistrée.
        </p>
        {cleaning ? <p>Ménage : {cleaning.text}</p> : null}
        {linen ? <p>Linge : {linen.text}</p> : null}
        <p>
          Les frais avancés par {site.name} pour le compte du propriétaire (consommables, petites réparations) sont
          refacturés à l’euro près, sur justificatif, dans les conditions prévues au contrat. La taxe de séjour n’entre pas
          dans la base de la commission.
        </p>
        <p>
          TVA : <Value value={company.vatNumber} label="numéro de TVA ou mention de franchise en base" />.
        </p>
      </LegalSection>

      <LegalSection id="facturation" title="5. Relevé mensuel, facturation et paiement">
        <p>
          Chaque mois, {site.name} adresse au propriétaire un relevé détaillé, réservation par réservation, valant facture :
          commission, ménage refacturé, frais avancés. Un relevé finalisé n’est plus modifié ; une erreur fait l’objet d’une
          régularisation sur le relevé suivant.
        </p>
        <p>
          Délai de paiement : <Value value={contract.paymentTerms} label="délai de paiement" />. Pénalités en cas de retard :{" "}
          <Value value={contract.latePenalties} label="taux des pénalités de retard" />. Lorsque le propriétaire agit en
          qualité de professionnel, une indemnité forfaitaire pour frais de recouvrement de 40 € est en outre due (article
          L441-10 du Code de commerce).
        </p>
      </LegalSection>

      <LegalSection id="duree" title="6. Durée et résiliation">
        <p>
          Durée du contrat : <Value value={contract.duration} label="durée initiale et renouvellement" />.
          <br />
          Préavis de résiliation : <Value value={contract.noticePeriod} label="préavis" />.
        </p>
        <p>
          À la fin du contrat, les réservations déjà confirmées sont traitées selon les modalités prévues au contrat, les clés,
          badges et documents sont restitués au propriétaire et un dernier relevé est établi.
        </p>
      </LegalSection>

      <LegalSection id="retractation" title="7. Droit de rétractation">
        <p>
          Lorsque le propriétaire est un consommateur et que le contrat est conclu à distance ou hors établissement (par
          exemple au domicile du propriétaire ou dans le logement), il dispose d’un délai de quatorze jours à compter de la
          conclusion du contrat pour se rétracter, sans avoir à se justifier (articles L221-18 et suivants du Code de la
          consommation). Le formulaire de rétractation est joint au contrat.
        </p>
        <p>
          Si le propriétaire demande expressément que les prestations commencent avant la fin de ce délai, il reste redevable,
          en cas de rétractation, du montant correspondant aux prestations fournies jusqu’à sa décision.
        </p>
      </LegalSection>

      <LegalSection id="proprietaire" title="8. Obligations du propriétaire">
        <p>Le propriétaire reste seul responsable des obligations attachées à son logement, et notamment :</p>
        <ul>
          <li>être propriétaire du logement ou disposer de l’autorisation écrite de le louer ;</li>
          <li>
            déclarer le meublé de tourisme en mairie ou sur le téléservice applicable, obtenir le numéro d’enregistrement et
            le faire figurer sur toutes les annonces ;
          </li>
          <li>obtenir, lorsqu’elle est requise, l’autorisation de changement d’usage et, le cas échéant, la compensation ;</li>
          <li>respecter la limite de nuits applicable à une résidence principale dans sa commune ;</li>
          <li>vérifier que le règlement de copropriété ou le bail n’interdit pas la location de courte durée ;</li>
          <li>assurer le logement pour cette activité (multirisque adaptée à la location meublée de courte durée) ;</li>
          <li>
            fournir un logement décent, sûr et équipé (détecteur de fumée, installations conformes), respecter la capacité
            d’accueil annoncée et disposer des diagnostics exigés ;
          </li>
          <li>déclarer les revenus perçus et s’acquitter des impôts et taxes qui lui incombent ;</li>
          <li>informer {site.name} sans délai de tout changement de situation (vente, travaux, sinistre, changement de résidence).</li>
        </ul>
        <p>
          {site.name} peut demander les justificatifs correspondants avant le démarrage et pendant le contrat, et peut
          suspendre ses prestations si une obligation essentielle n’est pas respectée.
        </p>
      </LegalSection>

      <LegalSection id="conciergerie" title="9. Nos engagements">
        <p>
          {site.name} réalise les prestations avec soin et professionnalisme, dans le cadre d’une obligation de moyens. Elle
          informe le propriétaire de tout incident significatif, lui donne accès à un espace en ligne pour suivre son activité
          et lui transmet un relevé mensuel détaillé. Les codes d’accès et informations confiés sont conservés de manière
          sécurisée et ne sont communiqués qu’aux personnes qui en ont besoin pour intervenir.
        </p>
      </LegalSection>

      <LegalSection id="responsabilite" title="10. Responsabilité et assurances">
        <p>
          {site.name} est responsable des dommages directs résultant d’un manquement à ses obligations. Elle n’est pas
          responsable des dommages causés par les voyageurs, des décisions des plateformes de réservation, des défauts du
          logement ou de ses équipements, ni des événements de force majeure au sens de l’article 1218 du Code civil. Ces
          limites ne s’appliquent pas en cas de faute lourde ou intentionnelle, ni aux dommages corporels, et ne privent pas le
          propriétaire consommateur des droits que la loi lui reconnaît.
        </p>
        <p>
          Assurance responsabilité civile professionnelle de {site.name} :{" "}
          <Value value={regulated.liabilityInsurance} label="assureur, numéro de contrat et couverture" />.
        </p>
      </LegalSection>

      <LegalSection id="donnees" title="11. Données personnelles">
        <p>
          Les données du propriétaire et des voyageurs sont traitées conformément à la{" "}
          <Link href="/politique-confidentialite">politique de confidentialité</Link>. Le contrat précise les engagements
          réciproques des parties sur les données des voyageurs.
        </p>
      </LegalSection>

      <LegalSection id="reclamations" title="12. Réclamations et médiation">
        <p>
          Toute réclamation peut être adressée à{" "}
          {site.contact.email ? <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> : <Value value={null} label="email" />}.
        </p>
        <p>
          Le propriétaire consommateur peut, après une réclamation écrite restée sans solution, recourir gratuitement au
          médiateur de la consommation : <Value value={regulated.consumerMediator} label="nom, site et adresse du médiateur" />.
        </p>
      </LegalSection>

      <LegalSection id="droit" title="13. Droit applicable">
        <p>
          Les présentes conditions sont soumises au droit français. Entre professionnels, tout litige relève du tribunal
          suivant : <Value value={contract.court} label="tribunal compétent entre professionnels" />. Le consommateur peut
          saisir la juridiction du lieu où il demeurait au moment de la conclusion du contrat ou de la survenance du fait
          dommageable.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
