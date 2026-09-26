import type { Metadata } from "next";
import { Suspense } from "react";

import { ExplorerView } from "@/components/guide/ExplorerView";
import { GuideContainer, VerifiedNote } from "@/components/guide/layout";
import { Eyebrow } from "@/components/ui/Section";
import { latestVerification } from "@/lib/guide/place";
import { toSummary } from "@/lib/guide/summary";
import { getGuidePlaces } from "@/server/guide";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Explorer les adresses",
  description:
    "Toutes les bonnes adresses du guide Comme à la Maison, à filtrer par budget, type, public, distance depuis Bordeaux et météo.",
  alternates: { canonical: "/guide/explorer" },
};

export default async function ExplorerPage() {
  const { places } = await getGuidePlaces();
  const summaries = places.map(toSummary);
  return (
    <GuideContainer className="flex flex-col gap-6 pb-14 pt-6 sm:pt-10">
      <div className="flex flex-col gap-3">
        <Eyebrow>{places.length} adresses</Eyebrow>
        <h1 className="text-h1 text-maison">Explorer</h1>
        <p className="text-lead max-w-[40rem] text-ink-soft">Filtrez selon votre budget, avec qui vous êtes, la distance et la météo du jour.</p>
      </div>
      {/* Les filtres lisent l'adresse de la page : rendus côté navigateur. */}
      <Suspense fallback={<p className="text-ink-soft">Chargement des adresses…</p>}>
        <ExplorerView places={summaries} />
      </Suspense>
      <VerifiedNote date={latestVerification(places)} />
    </GuideContainer>
  );
}
