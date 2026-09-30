import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage, LegalSection, LegalTable } from "@/components/legal/LegalPage";
import { legal } from "@/content/legal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Politique cookies",
  description: "Les cookies et traceurs utilisés par le site de Comme à la Maison : aucun cookie publicitaire ni de mesure d’audience.",
  alternates: { canonical: "/politique-cookies" },
  robots: { index: false, follow: true },
};

/**
 * Inventaire établi à partir du code (audit du 30 septembre 2026, docs/audit-juridique.md).
 * Avant d'ajouter un outil de mesure d'audience, une vidéo, un bouton de réseau social ou
 * un pixel publicitaire : mettre à jour cette page et, si l'outil n'est pas exempté,
 * installer un recueil du consentement (accepter, refuser, paramétrer) avant tout dépôt.
 */
export default function PolitiqueCookiesPage() {
  return (
    <LegalPage
      title="Politique cookies"
      updatedAt={legal.updatedAt}
      current="/politique-cookies"
      intro={
        <p>
          Le site de {site.name} n’utilise aucun cookie publicitaire, aucun outil de mesure d’audience et aucun bouton de
          réseau social qui vous suivrait. C’est pourquoi aucun bandeau ne vous demande votre accord : les seuls traceurs
          utilisés sont nécessaires au service que vous demandez, et la loi les dispense de consentement.
        </p>
      }
    >
      <LegalSection title="Qu’est-ce qu’un cookie ?">
        <p>
          Un cookie, ou plus largement un traceur, est une information enregistrée par votre navigateur lorsque vous
          consultez un site (cookie, stockage local…). Certains sont indispensables au fonctionnement du site ; d’autres,
          comme la publicité ciblée ou la mesure d’audience, nécessitent votre accord préalable.
        </p>
      </LegalSection>

      <LegalSection title="Les traceurs utilisés">
        <LegalTable
          caption="Traceurs présents sur le site"
          columns={["Nom", "Où", "Finalité", "Durée", "Fournisseur"]}
          rows={[
            [
              "sb-…-auth-token",
              "Page de connexion et espaces connectés uniquement (propriétaires, agents, équipe).",
              "Garder votre session ouverte et sécuriser l’accès à votre espace. Strictement nécessaire.",
              "Jusqu’à 400 jours, renouvelé à chaque visite ; supprimé à la déconnexion.",
              "Comme à la Maison, via Supabase",
            ],
            [
              "cam-guide-favoris (stockage local)",
              "Guide voyageurs.",
              "Mémoriser les adresses que vous ajoutez à vos favoris. Rien n’est envoyé à nos serveurs.",
              "Jusqu’à ce que vous retiriez vos favoris ou effaciez les données du site.",
              "Comme à la Maison",
            ],
          ]}
        />
        <p>
          Le site public (accueil, offres, tarifs, logements, contact) ne dépose aucun cookie. Les polices de caractères sont
          hébergées avec le site.
        </p>
      </LegalSection>

      <LegalSection title="Services tiers">
        <p>
          La carte du guide voyageurs affiche des images fournies par les serveurs d’OpenStreetMap : pour les charger, votre
          navigateur leur transmet votre adresse IP, comme pour toute image hébergée ailleurs. Aucun cookie n’est déposé par
          {" "}{site.name} à cette occasion. Les liens vers des sites tiers (plateformes de réservation, sources des photos)
          vous soumettent, une fois sur ces sites, à leurs propres règles.
        </p>
      </LegalSection>

      <LegalSection title="Gérer vos choix">
        <p>
          Aucun traceur soumis à consentement n’étant utilisé, il n’y a pas de choix à enregistrer. Vous pouvez à tout moment
          supprimer les cookies et le stockage local du site depuis les réglages de votre navigateur ; vous serez alors
          déconnecté de votre espace et vos favoris du guide seront effacés.
        </p>
        <p>
          Si nous ajoutons un jour un outil qui nécessite votre accord, un bandeau vous permettra d’accepter, de refuser aussi
          simplement que d’accepter, ou de paramétrer vos choix, puis de les modifier à tout moment depuis cette page.
        </p>
      </LegalSection>

      <LegalSection title="En savoir plus">
        <p>
          Vos données personnelles : <Link href="/politique-confidentialite">politique de confidentialité</Link>. Les règles
          applicables aux cookies :{" "}
          <a href="https://www.cnil.fr/fr/cookies-et-autres-traceurs" target="_blank" rel="noopener noreferrer">
            cnil.fr
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
