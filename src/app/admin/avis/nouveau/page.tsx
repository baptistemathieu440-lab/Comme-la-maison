import { PageHeader, Panel, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { todayIso } from "@/lib/dates";

import { saveReview } from "../actions";
import { ReviewForm } from "../ReviewForm";

export const metadata = { title: "Nouvel avis client" };

export default async function NewReviewPage() {
  await adminContext();
  return (
    <>
      <PageHeader eyebrow={<TextLink href="/admin/avis">Avis clients</TextLink>} title="Ajouter un avis" />
      <Panel>
        <ReviewForm action={saveReview.bind(null, null)} values={{ received_on: todayIso(), rating: 5 }} submitLabel="Enregistrer l’avis" />
      </Panel>
    </>
  );
}
