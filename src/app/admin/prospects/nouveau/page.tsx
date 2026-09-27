import { ActionForm, FormActions, SubmitButton } from "@/components/app/form";
import { PageHeader, Panel, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { adminOptions } from "@/lib/options";

import { createProspect } from "../actions";
import { ProspectFields } from "../ProspectFields";

export const metadata = { title: "Nouveau prospect" };

export default async function NewProspectPage() {
  const { supabase, session } = await adminContext();
  const admins = await adminOptions(supabase);
  return (
    <>
      <PageHeader eyebrow={<TextLink href="/admin/prospects">Prospects</TextLink>} title="Nouveau prospect" />
      <Panel as="div">
        <ActionForm action={createProspect} className="flex flex-col gap-6">
          <ProspectFields admins={admins} values={{ assigned_to: session.userId, source: "phone" }} />
          <FormActions>
            <SubmitButton>Créer le prospect</SubmitButton>
          </FormActions>
        </ActionForm>
      </Panel>
    </>
  );
}
