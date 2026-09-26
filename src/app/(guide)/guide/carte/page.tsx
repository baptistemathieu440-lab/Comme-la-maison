import type { Metadata } from "next";
import { Suspense } from "react";

import { GuideMap } from "@/components/guide/GuideMap";
import { toSummary } from "@/lib/guide/summary";
import { getGuidePlaces } from "@/server/guide";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Carte des bonnes adresses",
  description: "La carte interactive des bonnes adresses de Bordeaux et de ses alentours sélectionnées par Comme à la Maison.",
  alternates: { canonical: "/guide/carte" },
};

export default async function MapPage() {
  const { places } = await getGuidePlaces();
  return (
    <>
      <h1 className="sr-only">Carte des bonnes adresses</h1>
      <Suspense fallback={<p className="p-6 text-ink-soft">Chargement de la carte…</p>}>
        <GuideMap places={places.map(toSummary)} />
      </Suspense>
    </>
  );
}
