import { ActionForm, Checkbox, Field, FormActions, FormGrid, Input, SubmitButton, Textarea } from "@/components/app/form";
import type { ActionState } from "@/lib/action-state";

type Values = {
  company_name?: string | null;
  first_name?: string;
  last_name?: string;
  email?: string | null;
  phone?: string | null;
  address_line?: string | null;
  city?: string | null;
  trade?: string;
  siret?: string | null;
  active?: boolean;
  notes?: string | null;
};

export function ProviderForm({ action, values = {}, submitLabel }: { action: (s: ActionState, f: FormData) => Promise<ActionState>; values?: Values; submitLabel: string }) {
  return (
    <ActionForm action={action} className="flex flex-col gap-4">
      <FormGrid>
        <Field name="company_name" label="Société">
          <Input defaultValue={values.company_name ?? ""} />
        </Field>
        <Field name="trade" label="Métier" required hint="Plomberie, électricité, ménage, blanchisserie, serrurerie…">
          <Input defaultValue={values.trade ?? ""} list="metiers" required />
        </Field>
        <Field name="first_name" label="Prénom du contact">
          <Input defaultValue={values.first_name ?? ""} />
        </Field>
        <Field name="last_name" label="Nom du contact">
          <Input defaultValue={values.last_name ?? ""} />
        </Field>
        <Field name="phone" label="Téléphone">
          <Input type="tel" defaultValue={values.phone ?? ""} />
        </Field>
        <Field name="email" label="Email">
          <Input type="email" defaultValue={values.email ?? ""} />
        </Field>
        <Field name="address_line" label="Adresse">
          <Input defaultValue={values.address_line ?? ""} />
        </Field>
        <Field name="city" label="Ville">
          <Input defaultValue={values.city ?? ""} />
        </Field>
        <Field name="siret" label="SIRET">
          <Input defaultValue={values.siret ?? ""} inputMode="numeric" />
        </Field>
      </FormGrid>
      <datalist id="metiers">
        {["Plomberie", "Électricité", "Serrurerie", "Ménage", "Blanchisserie", "Petits travaux", "Chauffage", "Électroménager"].map((trade) => (
          <option key={trade} value={trade} />
        ))}
      </datalist>
      <Checkbox name="active" defaultChecked={values.active ?? true} label="Prestataire actif (proposé pour les interventions)" />
      <Field name="notes" label="Notes (tarifs, disponibilités…)">
        <Textarea defaultValue={values.notes ?? ""} />
      </Field>
      <FormActions>
        <SubmitButton>{submitLabel}</SubmitButton>
      </FormActions>
    </ActionForm>
  );
}
