import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage, LegalSection, Value } from "@/components/legal/LegalPage";
import { images } from "@/content/images";
import { legal } from "@/content/legal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site de Comme à la Maison, conciergerie Airbnb à Bordeaux.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  const { company, regulated, hosting } = legal;
  const photos = Object.values(images).filter((img) => img.placeholder);

  return (
    <LegalPage title="Mentions légales" updatedAt={legal.updatedAt}>
      <LegalSection title="Éditeur du site">
        <p>
          Le site {site.url.replace(/^https?:\/\//, "")} est édité par <Value value={company.legalName} label="dénomination sociale" />,{" "}
          <Value value={company.legalForm} label="forme juridique" /> au capital de{" "}
          <Value value={company.shareCapital} label="capital social" />.
        </p>
        <p>
          Siège social : <Value value={company.headOffice} label="adresse du siège" />
          <br />
          Immatriculation : <Value value={company.registration} label="RCS et SIREN" />
          <br />
          TVA intracommunautaire : <Value value={company.vatNumber} label="numéro de TVA" />
        </p>
        <p>
          Contact : <Value value={site.contact.email} label="adresse email" />
          {site.contact.phones.map((phone) => (
            <span key={phone.number}>
              {" · "}
              {phone.name} {phone.number}
            </span>
          ))}
        </p>
        <p>
          Directeur ou directrice de la publication :{" "}
          <Value value={company.publicationDirector} label="nom et qualité" />
        </p>
      </LegalSection>

      <LegalSection title="Activité">
        <p>
          {site.name} propose un service de conciergerie et de gestion de location courte durée à{" "}
          {site.area.city} et dans les communes de {site.area.region}.
        </p>
        <p>
          Carte professionnelle : <Value value={regulated.professionalCard} label="numéro et CCI, si applicable" />
          <br />
          Assurance responsabilité civile professionnelle :{" "}
          <Value value={regulated.liabilityInsurance} label="assureur et numéro de contrat" />
          <br />
          Médiateur de la consommation : <Value value={regulated.consumerMediator} label="nom et coordonnées" />
        </p>
      </LegalSection>

      <LegalSection title="Hébergement">
        <p>
          Le site est hébergé par <Value value={hosting.name} label="hébergeur" />
          <br />
          Adresse : <Value value={hosting.address} label="adresse de l’hébergeur" />
          <br />
          Contact : <Value value={hosting.contact} label="téléphone ou site de l’hébergeur" />
        </p>
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          Le nom {site.name}, son logo, les textes et la présentation de ce site sont la propriété de
          leur éditeur. Toute reproduction sans autorisation préalable est interdite.
        </p>
      </LegalSection>

      <LegalSection title="Crédits photographiques">
        {photos.length > 0 ? (
          <>
            <p>
              Les photographies suivantes sont provisoires et libres de droits (domaine public, licence
              CC0). Elles seront remplacées par des photos de nos logements.
            </p>
            <ul className="flex list-disc flex-col gap-1 pl-5">
              {photos.map((img) => (
                <li key={img.credit + img.alt}>
                  {img.alt} : {img.credit}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>Les photographies de ce site appartiennent à {site.name}.</p>
        )}
        <p>
          Polices : Instrument Sans et Hanken Grotesk (licence SIL Open Font License). Pictogrammes :
          Lucide (licence ISC).
        </p>
      </LegalSection>

      <LegalSection title="Données personnelles">
        <p>
          Le traitement des informations envoyées par le formulaire est décrit dans notre{" "}
          <Link href="/politique-confidentialite">politique de confidentialité</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
