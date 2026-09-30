import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage, LegalSection, PendingNotice, Value } from "@/components/legal/LegalPage";
import { images } from "@/content/images";
import { legal } from "@/content/legal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site de Comme à la Maison, conciergerie de location courte durée à Bordeaux : éditeur, hébergeur, propriété intellectuelle et responsabilité.",
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false, follow: true },
};

const toc = [
  { id: "editeur", label: "Éditeur du site" },
  { id: "activite", label: "Activité" },
  { id: "hebergement", label: "Hébergement" },
  { id: "utilisation", label: "Utilisation du site" },
  { id: "propriete-intellectuelle", label: "Propriété intellectuelle" },
  { id: "credits", label: "Crédits" },
  { id: "responsabilite", label: "Responsabilité" },
  { id: "logements", label: "Informations sur les logements" },
  { id: "donnees", label: "Données personnelles et cookies" },
  { id: "droit", label: "Droit applicable et contact" },
];

export default function MentionsLegalesPage() {
  const { company, regulated, hosting, dataHosting } = legal;
  const photos = Object.values(images).filter((img) => img.placeholder);
  const domain = site.url.replace(/^https?:\/\//, "");

  return (
    <LegalPage title="Mentions légales" updatedAt={legal.updatedAt} toc={toc} current="/mentions-legales">
      <LegalSection id="editeur" title="Éditeur du site">
        <p>
          Le site {domain} est édité par <Value value={company.legalName} label="dénomination sociale" />,{" "}
          <Value value={company.legalForm} label="forme juridique" />
          {/individuel/i.test(company.legalForm ?? "") ? null : (
            <>
              {" "}au capital de <Value value={company.shareCapital} label="capital social, si société" />
            </>
          )}
          , qui exerce sous le nom « {site.name} ».
        </p>
        <p>
          Siège social : <Value value={company.headOffice} label="adresse du siège" />
          <br />
          SIREN : <Value value={company.siren} label="SIREN" />
          <br />
          SIRET : <Value value={company.siret} label="SIRET" />
          <br />
          Immatriculation : <Value value={company.registration} label="RCS ou RNE" />
          <br />
          TVA intracommunautaire : <Value value={company.vatNumber} label="numéro de TVA ou mention de franchise" />
        </p>
        <p>
          Contact : {site.contact.email ? <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> : <Value value={null} label="email" />}
          {site.contact.phones.map((phone) => (
            <span key={phone.number}>
              {" · "}
              {phone.name} {phone.number}
            </span>
          ))}
        </p>
        <p>
          Directeur ou directrice de la publication : <Value value={company.publicationDirector} label="nom et qualité" />
        </p>
      </LegalSection>

      <LegalSection id="activite" title="Activité">
        <p>
          {site.name} propose aux propriétaires de logements meublés loués en courte durée, à {site.area.city} et dans les
          communes de {site.area.region}, des prestations de conciergerie : accueil et départ des voyageurs, coordination
          du ménage, suivi du logement, photographies, estimation et conseils. Le détail des prestations et leurs conditions
          figurent dans les <Link href="/conditions-generales-vente">conditions générales</Link> et dans le contrat signé avec
          chaque propriétaire.
        </p>
        <p>
          Chaque propriétaire encaisse directement les sommes versées par les plateformes de réservation. {site.name}{" "}
          ne reçoit pas de fonds pour le compte des propriétaires et leur facture chaque mois sa commission.
        </p>
        {regulated.hoguetStatus === "pending" ? (
          <PendingNotice>
            <p>
              La qualification de certaines prestations au regard de la réglementation des activités immobilières (loi n° 70-9
              du 2 janvier 1970, dite loi Hoguet) est en cours de vérification auprès des organismes compétents. Aucune
              information de ce site ne doit être comprise comme la présentation d’une activité d’agent immobilier ou
              d’administrateur de biens.
            </p>
          </PendingNotice>
        ) : null}
        <p>
          Carte professionnelle : <Value value={regulated.professionalCard} label="numéro, mention et CCI, si l’activité y est soumise" />
          {regulated.hoguetStatus === "card" ? (
            <>
              <br />
              Garantie financière : <Value value={regulated.financialGuarantee} label="garant et montant" />
            </>
          ) : null}
          <br />
          Assurance responsabilité civile professionnelle : <Value value={regulated.liabilityInsurance} label="assureur, numéro de contrat et couverture" />
          <br />
          Médiateur de la consommation : <Value value={regulated.consumerMediator} label="nom, site et adresse du médiateur" />
        </p>
      </LegalSection>

      <LegalSection id="hebergement" title="Hébergement">
        <p>
          Le site est hébergé par <Value value={hosting.name} label="hébergeur" />
          <br />
          Adresse : <Value value={hosting.address} label="adresse de l’hébergeur" />
          <br />
          Téléphone : <Value value={hosting.phone} label="téléphone de l’hébergeur" />
          <br />
          Site : <Value value={hosting.website} label="site de l’hébergeur" />
        </p>
        <p>
          Les données des espaces connectés (propriétaires, agents, équipe) sont hébergées par{" "}
          <Value value={dataHosting.name} label="hébergeur des données" /> (<Value value={dataHosting.location} label="localisation" />
          ), <Value value={dataHosting.website} label="site" />.
        </p>
      </LegalSection>

      <LegalSection id="utilisation" title="Utilisation du site">
        <p>
          Le site public est accessible gratuitement, sans inscription. Les espaces connectés sont réservés aux personnes
          invitées par {site.name} (équipe, propriétaires clients, agents) ; leurs identifiants sont personnels et ne
          doivent pas être partagés. Toute tentative d’accès à un espace ou à une donnée sans autorisation est interdite.
        </p>
        <p>
          Le simulateur de revenus et les estimations présentés sur le site sont indicatifs : ils ne constituent ni une offre,
          ni un engagement, ni une garantie de revenus.
        </p>
      </LegalSection>

      <LegalSection id="propriete-intellectuelle" title="Propriété intellectuelle">
        <p>
          Les textes, la présentation et la charte graphique du site, ainsi que le nom et le logo {site.name}, sont la propriété
          de l’éditeur ou sont utilisés avec l’autorisation de leurs titulaires. Les éléments appartenant à des tiers sont
          listés ci-dessous avec leur licence ; ils restent la propriété de leurs auteurs.
        </p>
        <p>
          Sauf autorisation écrite préalable, toute reproduction, représentation ou adaptation de tout ou partie du site, en
          dehors de l’usage privé et des exceptions prévues par le Code de la propriété intellectuelle, est interdite.
        </p>
      </LegalSection>

      <LegalSection id="credits" title="Crédits">
        {photos.length > 0 ? (
          <>
            <p>
              Photographies d’illustration provisoires, libres de droits (licence CC0, domaine public). Elles ne représentent
              pas des logements gérés par {site.name} :
            </p>
            <ul>
              {photos.map((img) => (
                <li key={img.credit + img.alt}>
                  {img.alt} : {img.credit}
                </li>
              ))}
            </ul>
          </>
        ) : null}
        <p>
          Photographies des logements : fournies par leurs propriétaires ou réalisées pour eux, publiées avec leur accord.
        </p>
        <p>
          Guide voyageurs : photographies des lieux issues de Wikimedia Commons, sous licence libre (CC0, CC BY ou CC BY-SA) ;
          l’auteur, la licence et la source sont indiqués sur la fiche de chaque adresse. Fond de carte : ©{" "}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
            contributeurs OpenStreetMap
          </a>{" "}
          (licence ODbL), affiché avec la bibliothèque Leaflet (licence BSD).
        </p>
        <p>
          Polices : EB Garamond, Source Sans 3, Instrument Sans et Hanken Grotesk (SIL Open Font License). Lettrage du logo
          vectorisé avec TeX Gyre Heros (licence GUST). Pictogrammes : Lucide (licence ISC).
        </p>
      </LegalSection>

      <LegalSection id="responsabilite" title="Responsabilité">
        <p>
          L’éditeur s’efforce de publier des informations exactes et à jour, et de maintenir le site accessible. Des erreurs,
          omissions ou interruptions (maintenance, panne, cas de force majeure) peuvent toutefois survenir : signalez-les-nous,
          nous les corrigerons dans les meilleurs délais.
        </p>
        <p>
          Les informations générales publiées (réglementation, fiscalité, marché locatif) sont données à titre indicatif et ne
          remplacent pas un conseil personnalisé. Les règles applicables à la location courte durée évoluent et varient selon
          les communes.
        </p>
        <p>
          Le site contient des liens vers des sites tiers (plateformes de réservation, cartographie, sources des photos).
          L’éditeur n’a pas la maîtrise de leur contenu et ne peut en être tenu responsable. Les avis publiés sont ceux de
          leurs auteurs, avec leur accord.
        </p>
        <p>
          Ces limites ne s’appliquent pas aux dommages dont l’éditeur serait responsable en application de la loi,
          notamment en cas de faute de sa part, et ne privent pas les consommateurs des droits que la loi leur reconnaît.
        </p>
      </LegalSection>

      <LegalSection id="logements" title="Informations sur les logements">
        <p>
          Les descriptions, photos et caractéristiques des logements sont établies à partir des informations fournies par
          leurs propriétaires. Les disponibilités affichées sont indicatives tant qu’un séjour n’a pas été confirmé.
        </p>
        <p>
          Chaque propriétaire reste responsable des obligations attachées à son logement : déclaration ou enregistrement du
          meublé de tourisme, autorisation de changement d’usage lorsqu’elle est requise, respect du règlement de copropriété
          et de la limite de nuits applicable à une résidence principale, assurance, sécurité, capacité d’accueil,
          obligations fiscales. {site.name} ne délivre aucune attestation de conformité d’un logement.
        </p>
      </LegalSection>

      <LegalSection id="donnees" title="Données personnelles et cookies">
        <p>
          Le traitement des données personnelles est décrit dans la{" "}
          <Link href="/politique-confidentialite">politique de confidentialité</Link> ; les traceurs utilisés, dans la{" "}
          <Link href="/politique-cookies">politique cookies</Link>.
        </p>
      </LegalSection>

      <LegalSection id="droit" title="Droit applicable et contact">
        <p>
          Le site et les présentes mentions sont régis par le droit français. Pour toute question :{" "}
          {site.contact.email ? <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> : <Value value={null} label="email" />}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
