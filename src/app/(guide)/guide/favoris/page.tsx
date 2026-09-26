import type { Metadata } from "next";

import { FavoritesView } from "@/components/guide/FavoritesView";
import { GuideContainer } from "@/components/guide/layout";
import { Eyebrow } from "@/components/ui/Section";
import { toSummary } from "@/lib/guide/summary";
import { getGuidePlaces } from "@/server/guide";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Mes favoris",
  description: "Les bonnes adresses que vous avez enregistrées dans le guide Comme à la Maison.",
  alternates: { canonical: "/guide/favoris" },
  robots: { index: false },
};

export default async function FavoritesPage() {
  const { places } = await getGuidePlaces();
  return (
    <GuideContainer className="flex flex-col gap-6 pb-14 pt-6 sm:pt-10">
      <div className="flex flex-col gap-3">
        <Eyebrow>Enregistrés sur ce téléphone</Eyebrow>
        <h1 className="text-h1 text-maison">Mes favoris</h1>
      </div>
      <FavoritesView places={places.map(toSummary)} />
    </GuideContainer>
  );
}
