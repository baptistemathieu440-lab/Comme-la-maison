import { ActionForm, Field, Fieldset, FormActions, FormGrid, Input, Select, SubmitButton, Textarea } from "@/components/app/form";
import type { ActionState } from "@/lib/action-state";
import { optionsOf, ownerStatus } from "@/lib/labels";
import { bpsToInput } from "@/lib/money";
import type { Database } from "@/lib/supabase/database.types";

type Contact = Database["public"]["Tables"]["contacts"]["Row"];
type Owner = Database["public"]["Tables"]["owners"]["Row"];

export function OwnerForm({
  action,
  contact,
  owner,
  submitLabel,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  contact?: Partial<Contact>;
  owner?: Owner;
  submitLabel: string;
}) {
  return (
    <ActionForm action={action} className="flex flex-col gap-6">
      <Fieldset legend="Coordonnées">
        <FormGrid>
          <Field name="first_name" label="Prénom">
            <Input defaultValue={contact?.first_name ?? ""} autoComplete="off" />
          </Field>
          <Field name="last_name" label="Nom">
            <Input defaultValue={contact?.last_name ?? ""} autoComplete="off" />
          </Field>
          <Field name="company_name" label="Société (si le propriétaire est une société)">
            <Input defaultValue={contact?.company_name ?? ""} />
          </Field>
          <Field name="email" label="Email">
            <Input type="email" defaultValue={contact?.email ?? ""} />
          </Field>
          <Field name="phone" label="Téléphone">
            <Input type="tel" defaultValue={contact?.phone ?? ""} />
          </Field>
          <Field name="address_line" label="Adresse postale">
            <Input defaultValue={contact?.address_line ?? ""} />
          </Field>
          <Field name="postal_code" label="Code postal">
            <Input defaultValue={contact?.postal_code ?? ""} />
          </Field>
          <Field name="city" label="Ville">
            <Input defaultValue={contact?.city ?? ""} />
          </Field>
        </FormGrid>
      </Fieldset>

      <Fieldset legend="Gestion">
        <FormGrid>
          <Field name="status" label="Statut">
            <Select options={optionsOf(ownerStatus)} defaultValue={owner?.status ?? "onboarding"} />
          </Field>
          <Field
            name="commission_rate"
            label="Commission propre à ce propriétaire (%)"
            hint="Vide : taux par défaut. Un taux défini sur un bien reste prioritaire."
          >
            <Input defaultValue={bpsToInput(owner?.commission_rate_bps)} inputMode="decimal" placeholder="20" />
          </Field>
          <Field name="billing_email" label="Email de facturation" hint="Vide : l’email principal.">
            <Input type="email" defaultValue={owner?.billing_email ?? ""} />
          </Field>
          <Field name="vat_number" label="Numéro de TVA (société)">
            <Input defaultValue={owner?.vat_number ?? ""} />
          </Field>
          <Field name="sepa_mandate_reference" label="Référence du mandat de prélèvement SEPA">
            <Input defaultValue={owner?.sepa_mandate_reference ?? ""} />
          </Field>
          <Field name="sepa_mandate_signed_on" label="Mandat SEPA signé le">
            <Input type="date" defaultValue={owner?.sepa_mandate_signed_on ?? ""} />
          </Field>
        </FormGrid>
        <Field name="notes" label="Notes internes">
          <Textarea defaultValue={owner?.notes ?? ""} />
        </Field>
      </Fieldset>

      <FormActions>
        <SubmitButton>{submitLabel}</SubmitButton>
      </FormActions>
    </ActionForm>
  );
}
