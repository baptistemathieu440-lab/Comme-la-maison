import type { Metadata } from "next";

import { Contact } from "@/components/sections/Contact";
import { PageHero, Period } from "@/components/ui/Section";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact · Confier mon bien",
  description: `Contactez ${site.name}, conciergerie à Bordeaux : présentez-nous votre logement pour une estimation de son potentiel en location courte durée, ou appelez directement Baptiste ou Simon.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        titleId="contact-h1"
        title={
          <>
            Parlons de votre logement
            <Period />
          </>
        }
        intro="Un projet de location courte durée, une question sur notre fonctionnement ? Écrivez-nous ou appelez-nous : Baptiste ou Simon vous répond personnellement."
      />
      <Contact />
    </>
  );
}
