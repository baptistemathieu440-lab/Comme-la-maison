import { PageHeader, Panel, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { todayIso } from "@/lib/dates";

import { saveGuidePlace } from "../actions";
import { GuidePlaceForm } from "../GuidePlaceForm";

export const metadata = { title: "Nouvelle adresse du guide" };

export default async function NewGuidePlacePage() {
  await adminContext();
  return (
    <>
      <PageHeader eyebrow={<TextLink href="/admin/guide">Guide voyageurs</TextLink>} title="Ajouter une adresse" />
      <Panel>
        <GuidePlaceForm action={saveGuidePlace.bind(null, null)} values={{ verified_on: todayIso(), is_published: true }} submitLabel="Ajouter au guide" />
      </Panel>
    </>
  );
}
