import { founders } from "@/content/about";
import { faq } from "@/content/faq";
import { site } from "@/content/site";
import { telHref } from "@/lib/format";

type Json = Record<string, unknown>;

/** Données structurées schema.org, échappées pour éviter toute injection HTML. */
export function JsonLd({ data }: { data: Json | Json[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function organizationJsonLd(): Json {
  const sameAs = Object.values(site.socials).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#organisation`,
    name: site.name,
    slogan: "Votre logement, notre savoir-faire.",
    description: site.seo.description,
    url: site.url,
    logo: `${site.url}/brand/logo-vertical.svg`,
    image: `${site.url}/og.png`,
    knowsLanguage: "fr",
    areaServed: [
      { "@type": "City", name: site.area.city },
      { "@type": "AdministrativeArea", name: site.area.region },
    ],
    founder: founders.map((f) => ({ "@type": "Person", name: f.name, jobTitle: f.role })),
    ...(site.contact.phones.length > 0
      ? {
          telephone: site.contact.phones[0].number,
          contactPoint: site.contact.phones.map((phone) => ({
            "@type": "ContactPoint",
            name: phone.name,
            telephone: telHref(phone.number).replace("tel:", ""),
            contactType: "customer service",
            areaServed: "FR",
            availableLanguage: "French",
          })),
        }
      : {}),
    ...(site.contact.email ? { email: site.contact.email } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    makesOffer: {
      "@type": "Offer",
      name: "Gestion complète de location courte durée",
      description: `Conciergerie Airbnb à ${site.area.city} : commission de ${site.commission.rate} % ${site.commission.taxNote} ${site.commission.base}.`,
      areaServed: site.area.region,
    },
  };
}

export function homeJsonLd(): Json[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.name,
      url: site.url,
      inLanguage: "fr-FR",
      publisher: { "@id": `${site.url}/#organisation` },
    },
    organizationJsonLd(),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: [item.answer[0], ...(item.list ?? []), ...item.answer.slice(1)].join(" "),
        },
      })),
    },
  ];
}
