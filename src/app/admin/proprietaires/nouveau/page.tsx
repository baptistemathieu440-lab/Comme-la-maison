import { PageHeader, Panel, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";

import { createOwner } from "../actions";
import { OwnerForm } from "../OwnerForm";

export const metadata = { title: "Nouveau propriétaire" };

export default async function NewOwnerPage() {
  await adminContext();
  return (
    <>
      <PageHeader
        eyebrow={<TextLink href="/admin/proprietaires">Propriétaires</TextLink>}
        title="Nouveau propriétaire"
        description="Étape 1 sur 3 : la fiche. Vous ajouterez ensuite son bien, puis son accès à l’espace propriétaire."
      />
      <Panel as="div">
        <OwnerForm action={createOwner} submitLabel="Créer et continuer" />
      </Panel>
    </>
  );
}
