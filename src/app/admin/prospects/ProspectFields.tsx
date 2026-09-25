import { Field, Fieldset, FormGrid, Input, Select, Textarea } from "@/components/app/form";
import { bedroomOptions, propertyTypeOptions } from "@/lib/contact";
import { optionsOf, prospectSource, prospectStatus } from "@/lib/labels";
import type { Option } from "@/lib/options";

type Values = {
  first_name?: string;
  last_name?: string;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  status?: string;
  source?: string;
  property_city?: string | null;
  property_type?: string | null;
  bedrooms?: string | null;
  capacity?: string | null;
  message?: string | null;
  next_action?: string | null;
  next_action_on?: string | null;
  assigned_to?: string | null;
  lost_reason?: string | null;
};

export function ProspectFields({ values = {}, admins }: { values?: Values; admins: Option[] }) {
  return (
    <>
      <Fieldset legend="Contact">
        <FormGrid>
          <Field name="first_name" label="Prénom">
            <Input defaultValue={values.first_name ?? ""} />
          </Field>
          <Field name="last_name" label="Nom" required>
            <Input defaultValue={values.last_name ?? ""} required />
          </Field>
          <Field name="email" label="Email">
            <Input type="email" defaultValue={values.email ?? ""} />
          </Field>
          <Field name="phone" label="Téléphone">
            <Input type="tel" defaultValue={values.phone ?? ""} />
          </Field>
          <Field name="city" label="Ville du contact">
            <Input defaultValue={values.city ?? ""} />
          </Field>
        </FormGrid>
      </Fieldset>
      <Fieldset legend="Suivi">
        <FormGrid>
          <Field name="status" label="Étape">
            <Select options={optionsOf(prospectStatus)} defaultValue={values.status ?? "new"} />
          </Field>
          <Field name="source" label="Origine">
            <Select options={optionsOf(prospectSource)} defaultValue={values.source ?? "phone"} />
          </Field>
          <Field name="next_action" label="Prochaine action">
            <Input defaultValue={values.next_action ?? ""} placeholder="Rappeler, visiter, envoyer la proposition…" />
          </Field>
          <Field name="next_action_on" label="Pour le">
            <Input type="date" defaultValue={values.next_action_on ?? ""} />
          </Field>
          <Field name="assigned_to" label="Suivi par">
            <Select options={admins} placeholder="Personne" defaultValue={values.assigned_to ?? ""} />
          </Field>
          <Field name="lost_reason" label="Raison du refus (si refusé)">
            <Input defaultValue={values.lost_reason ?? ""} />
          </Field>
        </FormGrid>
      </Fieldset>
      <Fieldset legend="Le logement">
        <FormGrid>
          <Field name="property_city" label="Commune du logement">
            <Input defaultValue={values.property_city ?? ""} />
          </Field>
          <Field name="property_type" label="Type">
            <Select options={propertyTypeOptions.map((v) => ({ value: v, label: v }))} placeholder="Non précisé" defaultValue={values.property_type ?? ""} />
          </Field>
          <Field name="bedrooms" label="Chambres">
            <Select options={bedroomOptions.map((v) => ({ value: v, label: v }))} placeholder="Non précisé" defaultValue={values.bedrooms ?? ""} />
          </Field>
          <Field name="capacity" label="Capacité (voyageurs)">
            <Input defaultValue={values.capacity ?? ""} />
          </Field>
        </FormGrid>
        <Field name="message" label="Message ou besoin">
          <Textarea defaultValue={values.message ?? ""} />
        </Field>
      </Fieldset>
    </>
  );
}
