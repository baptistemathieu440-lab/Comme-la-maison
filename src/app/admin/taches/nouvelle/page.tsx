import { ActionForm, FormActions, SubmitButton } from "@/components/app/form";
import { PageHeader, Panel, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { todayIso } from "@/lib/dates";
import { propertyOptions, staffOptions } from "@/lib/options";

import { createTask } from "../actions";
import { TaskFields } from "../TaskFields";

export const metadata = { title: "Nouvelle tâche" };

export default async function NewTaskPage({ searchParams }: PageProps<"/admin/taches/nouvelle">) {
  const { supabase } = await adminContext();
  const params = await searchParams;
  const [properties, staff] = await Promise.all([propertyOptions(supabase, { activeOnly: true }), staffOptions(supabase)]);
  return (
    <>
      <PageHeader eyebrow={<TextLink href="/admin/taches">Tâches</TextLink>} title="Nouvelle tâche" />
      <Panel as="div">
        <ActionForm action={createTask} className="flex flex-col gap-4">
          <TaskFields
            properties={properties}
            staff={staff}
            values={{
              property_id: typeof params.bien === "string" ? params.bien : undefined,
              type: typeof params.type === "string" ? params.type : undefined,
              due_date: todayIso(),
            }}
          />
          <FormActions>
            <SubmitButton>Créer la tâche</SubmitButton>
          </FormActions>
        </ActionForm>
      </Panel>
    </>
  );
}
