import { ActionForm, Checkbox, Field, FormActions, FormGrid, Input, Select, SubmitButton, Textarea } from "@/components/app/form";
import { PageHeader, Panel, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { incidentSeverity, optionsOf } from "@/lib/labels";
import { propertyOptions } from "@/lib/options";

import { createIncident } from "../actions";

export const metadata = { title: "Signaler un incident" };

export default async function NewIncidentPage() {
  const { supabase } = await adminContext();
  const properties = await propertyOptions(supabase);
  return (
    <>
      <PageHeader eyebrow={<TextLink href="/admin/incidents">Incidents</TextLink>} title="Signaler un incident" />
      <Panel as="div">
        <ActionForm action={createIncident} className="flex flex-col gap-4">
          <FormGrid>
            <Field name="property_id" label="Bien" required>
              <Select options={properties} placeholder="Choisir…" required />
            </Field>
            <Field name="severity" label="Gravité">
              <Select options={optionsOf(incidentSeverity)} defaultValue="medium" />
            </Field>
          </FormGrid>
          <Field name="title" label="Problème" required>
            <Input required maxLength={160} placeholder="Fuite sous l’évier, serrure difficile…" />
          </Field>
          <Field name="description" label="Détails">
            <Textarea />
          </Field>
          <Checkbox name="visible_to_owner" defaultChecked label="Visible par le propriétaire" hint="Il est prévenu si la gravité est élevée ou critique." />
          <FormActions>
            <SubmitButton>Enregistrer</SubmitButton>
          </FormActions>
        </ActionForm>
      </Panel>
    </>
  );
}
