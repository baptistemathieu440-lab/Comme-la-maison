import { PageHeader, Panel, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { ownerOptions } from "@/lib/options";

import { createProperty } from "../actions";
import { PropertyForm } from "../PropertyForm";

export const metadata = { title: "Nouveau bien" };

export default async function NewPropertyPage({ searchParams }: PageProps<"/admin/biens/nouveau">) {
  const { supabase } = await adminContext();
  const params = await searchParams;
  const owners = await ownerOptions(supabase);

  return (
    <>
      <PageHeader
        eyebrow={<TextLink href="/admin/biens">Biens</TextLink>}
        title="Nouveau bien"
        description={
          owners.length === 0 ? (
            <>
              Aucun propriétaire enregistré : <TextLink href="/admin/proprietaires/nouveau">créez d’abord le propriétaire</TextLink>.
            </>
          ) : (
            "Les informations peuvent être complétées plus tard."
          )
        }
      />
      <Panel as="div">
        <PropertyForm
          action={createProperty}
          owners={owners}
          defaultOwnerId={typeof params.proprietaire === "string" ? params.proprietaire : undefined}
          submitLabel="Créer le bien"
        />
      </Panel>
    </>
  );
}
