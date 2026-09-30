import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage, LegalSection, LegalTable, Value } from "@/components/legal/LegalPage";
import { legal, stayRequestsOpen } from "@/content/legal";
import { site } from "@/content/site";
import { fieldLabels, requiredFields } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Quelles données Comme à la Maison collecte, pourquoi, combien de temps elles sont conservées, qui y a accès et comment exercer vos droits.",
  alternates: { canonical: "/politique-confidentialite" },
  robots: { index: false, follow: true },
};

const toc = [
  { id: "responsable", label: "Responsable du traitement" },
  { id: "traitements", label: "Données, finalités et bases légales" },
  { id: "conservation", label: "Durées de conservation" },
  { id: "destinataires", label: "Qui a accès à vos données" },
  { id: "sous-traitants", label: "Prestataires et transferts hors UE" },
  { id: "securite", label: "Sécurité" },
  { id: "droits", label: "Vos droits" },
  { id: "cnil", label: "Réclamation auprès de la CNIL" },
  { id: "evolutions", label: "Évolutions de cette politique" },
];

export default function ConfidentialitePage() {
  const { privacy, retention, company } = legal;
  const estimationFields = Object.entries(fieldLabels)
    .map(([key, label]) => `${label}${requiredFields.includes(key as (typeof requiredFields)[number]) ? "" : " (facultatif)"}`)
    .join(", ");
  const email = privacy.contactEmail;
  const mail = email ? <a href={`mailto:${email}`}>{email}</a> : <Value value={null} label="email de contact" />;

  return (
    <LegalPage
      title="Politique de confidentialité"
      updatedAt={legal.updatedAt}
      toc={toc}
      current="/politique-confidentialite"
      intro={
        <p>
          Cette page explique comment {site.name} utilise les informations qui vous concernent, que vous soyez
          propriétaire, voyageur, agent ou simple visiteur. Nous ne vendons ni ne louons aucune donnée, et nous ne faisons
          pas de publicité ciblée.
        </p>
      }
    >
      <LegalSection id="responsable" title="Responsable du traitement">
        <p>
          <Value value={company.legalName} label="dénomination sociale" />, qui exerce sous le nom « {site.name} »,
          <br />
          siège : <Value value={company.headOffice} label="adresse du siège" />,
          <br />
          représentée par <Value value={company.publicationDirector} label="représentant légal" />.
        </p>
        <p>
          Contact pour toute question sur vos données : {mail}
          <br />
          Adresse postale : <Value value={privacy.postalAddress} label="adresse postale pour les demandes" />
          {privacy.dpo ? (
            <>
              <br />
              Délégué à la protection des données : {privacy.dpo}
            </>
          ) : null}
        </p>
        <p>
          Pour les voyageurs dont le séjour a été réservé sur une plateforme (Airbnb, Booking.com…), la plateforme et le
          propriétaire du logement traitent aussi vos données, selon leurs propres politiques.
        </p>
      </LegalSection>

      <LegalSection id="traitements" title="Données, finalités et bases légales">
        <LegalTable
          caption="Ce que nous collectons et pourquoi"
          columns={["Qui", "Données", "Pourquoi", "Base légale (RGPD, art. 6)"]}
          rows={[
            [
              "Propriétaire qui demande une estimation",
              `${estimationFields}.`,
              "Vous recontacter, estimer le potentiel de votre logement et vous présenter nos prestations.",
              "Mesures précontractuelles prises à votre demande (6.1.b).",
            ],
            ...(stayRequestsOpen()
              ? [
                  [
                    "Voyageur qui envoie une demande de séjour",
                    "Prénom, nom, email, téléphone, dates, nombre d’adultes et d’enfants, message.",
                    "Répondre à votre demande et vous confirmer disponibilité et tarif.",
                    "Mesures précontractuelles prises à votre demande (6.1.b).",
                  ],
                ]
              : []),
            [
              "Propriétaire client",
              "Identité, coordonnées, adresse, société et n° de TVA le cas échéant, coordonnées bancaires (chiffrées), contrat, informations et photos du logement, codes d’accès, réservations, relevés, factures, documents échangés.",
              "Exécuter le contrat : gestion des séjours, interventions, relevés mensuels, facturation, espace propriétaire.",
              "Exécution du contrat (6.1.b) ; obligations comptables et fiscales (6.1.c).",
            ],
            [
              "Voyageur ayant séjourné dans un logement que nous accompagnons",
              "Prénom, nom, coordonnées transmises par la plateforme ou par vous, dates de séjour, nombre de voyageurs, échanges et éventuels incidents.",
              "Organiser votre accueil et votre départ, vous assister pendant le séjour, préparer le ménage, traiter un incident.",
              "Intérêt légitime à exécuter la prestation confiée par le propriétaire (6.1.f).",
            ],
            [
              "Agent ou prestataire",
              "Identité, coordonnées, métier, SIRET, tâches, photos de fin d’intervention, signalements.",
              "Planifier et suivre les interventions, contrôler la qualité, régler les prestations.",
              "Exécution du contrat (6.1.b).",
            ],
            [
              "Toute personne disposant d’un compte",
              "Email, nom, téléphone, mot de passe (enregistré sous forme chiffrée irréversible), facteur de double authentification, journal des actions effectuées.",
              "Donner accès à l’espace, sécuriser les comptes, garder la trace des modifications.",
              "Exécution du contrat (6.1.b) ; intérêt légitime à sécuriser la plateforme (6.1.f).",
            ],
            [
              "Auteur d’un avis",
              "Nom tel que vous acceptez qu’il soit affiché, note, texte, date.",
              "Publier votre avis sur le site.",
              "Votre consentement (6.1.a), que vous pouvez retirer à tout moment.",
            ],
            [
              "Visiteur du guide voyageurs",
              "Adresses mises en favori (sur votre téléphone uniquement). Pour afficher la carte, votre adresse IP est transmise au service de tuiles OpenStreetMap.",
              "Retrouver vos adresses favorites ; afficher la carte.",
              "Fonctionnalité que vous demandez ; intérêt légitime (6.1.f) pour la carte.",
            ],
            [
              "Toute personne qui nous écrit",
              "Contenu de votre message et coordonnées.",
              "Vous répondre.",
              "Intérêt légitime (6.1.f) ou mesures précontractuelles (6.1.b).",
            ],
          ]}
        />
        <p>
          Les informations marquées comme obligatoires dans nos formulaires sont nécessaires pour vous répondre ; sans elles,
          nous ne pouvons pas traiter votre demande. Nous ne prenons aucune décision automatisée produisant des effets
          juridiques à votre égard.
        </p>
        <p>
          Nous n’envoyons pas de lettre d’information ni de prospection commerciale par email. Si cela devait changer, votre
          accord préalable serait demandé lorsque la loi l’exige, et chaque message contiendrait un lien de désinscription.
        </p>
      </LegalSection>

      <LegalSection id="conservation" title="Durées de conservation">
        <LegalTable
          caption="Combien de temps nous gardons vos données"
          columns={["Données", "Durée"]}
          rows={[
            ["Demandes d’estimation sans suite", <Value key="p" value={retention.prospects} label="durée prospects" />],
            ...(stayRequestsOpen()
              ? [["Demandes de séjour sans suite", <Value key="s" value={retention.stayRequests} label="durée demandes de séjour" />]]
              : []),
            ["Dossier d’un propriétaire client (hors pièces comptables)", <Value key="o" value={retention.owners} label="durée après fin du contrat" />],
            ["Factures, relevés et pièces comptables", <Value key="a" value={retention.accounting} label="durée comptable" />],
            ["Données des voyageurs", <Value key="g" value={retention.guests} label="durée après le séjour" />],
            ["Données des agents et prestataires", <Value key="st" value={retention.staff} label="durée après la fin de la collaboration" />],
            ["Comptes de connexion", <Value key="ac" value={retention.accounts} label="délai de suppression après retrait de l’accès" />],
            ["Journal d’activité", <Value key="l" value={retention.auditLog} label="durée du journal" />],
            ["Avis publiés", <Value key="r" value={retention.reviews} label="durée de publication" />],
            ["Favoris du guide", "Sur votre téléphone, jusqu’à ce que vous les retiriez ou effaciez les données du site."],
          ]}
        />
        <p>
          À l’issue de ces durées, les données sont supprimées ou rendues anonymes. Elles peuvent être conservées plus
          longtemps, dans un accès restreint, lorsqu’une obligation légale ou la défense d’un droit en justice l’impose.
        </p>
      </LegalSection>

      <LegalSection id="destinataires" title="Qui a accès à vos données">
        <ul>
          <li>Baptiste et Simon, associés de {site.name}, pour l’ensemble des données.</li>
          <li>
            Chaque propriétaire, pour les seules informations de son logement : réservations (prénom du voyageur, dates),
            interventions, relevés et documents qui lui sont destinés. Un propriétaire n’a jamais accès aux données d’un
            autre propriétaire.
          </li>
          <li>
            Chaque agent, pour les seules tâches qui lui sont confiées : adresse, consignes et codes d’accès du logement le
            jour de l’intervention.
          </li>
          <li>Le cas échéant, notre expert-comptable, pour les pièces comptables.</li>
          <li>Les prestataires techniques listés ci-dessous, dans la limite de leur mission.</li>
          <li>Les autorités, lorsque la loi l’impose.</li>
        </ul>
      </LegalSection>

      <LegalSection id="sous-traitants" title="Prestataires et transferts hors UE">
        <LegalTable
          caption="Prestataires techniques (sous-traitants)"
          columns={["Prestataire", "Rôle", "Localisation et garanties"]}
          rows={[
            [
              "Netlify, Inc.",
              "Hébergement du site, exécution du code serveur, réception des demandes d’estimation (Netlify Forms).",
              "Société établie aux États-Unis. Transferts encadrés par le Data Privacy Framework UE–États-Unis, auquel Netlify déclare adhérer.",
            ],
            [
              "Supabase",
              "Base de données, comptes de connexion, stockage des fichiers.",
              "Données hébergées dans l’Union européenne (région de Paris). Société établie hors de l’UE : accès éventuels encadrés par les clauses contractuelles types de la Commission européenne.",
            ],
            [
              "Resend",
              "Envoi des emails de service (invitations, notifications), lorsque ce service est activé.",
              "Société établie aux États-Unis. Garanties à vérifier dans son accord de traitement des données.",
            ],
            [
              "Fondation OpenStreetMap",
              "Fond de carte du guide voyageurs.",
              "Royaume-Uni, pays reconnu comme offrant un niveau de protection adéquat par la Commission européenne.",
            ],
          ]}
        />
        <p>
          Les polices de caractères sont hébergées avec le site : votre navigateur ne contacte aucun service tiers pour les
          afficher. Les calendriers échangés avec les plateformes de réservation ne contiennent que des dates.
        </p>
      </LegalSection>

      <LegalSection id="securite" title="Sécurité">
        <p>
          Les espaces connectés sont protégés par mot de passe, avec double authentification obligatoire pour l’équipe. Chaque
          compte n’accède qu’aux données de son rôle, contrôle appliqué jusque dans la base de données. Les fichiers sont
          stockés dans des espaces privés et ne sont accessibles que par des liens temporaires. Les coordonnées bancaires sont
          chiffrées. Les échanges avec le site sont chiffrés (HTTPS).
        </p>
      </LegalSection>

      <LegalSection id="droits" title="Vos droits">
        <p>Vous pouvez à tout moment :</p>
        <ul>
          <li>accéder à vos données et en obtenir une copie ;</li>
          <li>les faire rectifier si elles sont inexactes ou incomplètes ;</li>
          <li>demander leur effacement, sauf si nous devons les conserver (factures, par exemple) ;</li>
          <li>vous opposer à un traitement fondé sur notre intérêt légitime, pour des raisons tenant à votre situation ;</li>
          <li>demander la limitation d’un traitement, le temps d’examiner une contestation ;</li>
          <li>
            recevoir les données que vous nous avez fournies dans un format structuré, ou les faire transmettre à un autre
            prestataire (portabilité), pour les traitements fondés sur le contrat ou le consentement ;
          </li>
          <li>retirer votre consentement (avis publiés), sans remettre en cause ce qui a été fait auparavant ;</li>
          <li>définir des directives sur le sort de vos données après votre décès.</li>
        </ul>
        <p>
          Écrivez-nous à {mail} ou par courrier à <Value value={privacy.postalAddress} label="adresse postale" />. Nous
          répondons dans un délai d’un mois, prolongeable de deux mois pour une demande complexe ; nous pouvons vous demander
          de justifier de votre identité en cas de doute raisonnable.
        </p>
      </LegalSection>

      <LegalSection id="cnil" title="Réclamation auprès de la CNIL">
        <p>
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la Commission nationale
          de l’informatique et des libertés (CNIL), 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07,{" "}
          <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">
            cnil.fr/fr/plaintes
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection id="evolutions" title="Évolutions de cette politique">
        <p>
          Cette politique suit le fonctionnement réel du site et de la plateforme. Elle est mise à jour à chaque changement
          (nouveau service, nouveau prestataire) ; la date de mise à jour figure en haut de la page. Les traceurs utilisés
          sont détaillés dans la <Link href="/politique-cookies">politique cookies</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
