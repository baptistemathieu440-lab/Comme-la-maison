import { ActionForm, Checkbox, Field, Fieldset, FormActions, FormGrid, Input, Select, SubmitButton, Textarea } from "@/components/app/form";
import { site } from "@/content/site";
import type { ActionState } from "@/lib/action-state";
import { optionsOf, propertyStatus, propertyType } from "@/lib/labels";
import { bpsToInput, centsToInput } from "@/lib/money";
import type { Option } from "@/lib/options";
import type { Database } from "@/lib/supabase/database.types";

type Property = Database["public"]["Tables"]["properties"]["Row"];

export function PropertyForm({
  action,
  owners,
  property,
  defaultOwnerId,
  submitLabel,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  owners: Option[];
  property?: Property;
  defaultOwnerId?: string;
  submitLabel: string;
}) {
  const checklist = Array.isArray(property?.cleaning_checklist) ? (property.cleaning_checklist as string[]).join("\n") : "";

  return (
    <ActionForm action={action} className="flex flex-col gap-6">
      <Fieldset legend="Le bien">
        <FormGrid>
          <Field name="owner_id" label="Propriétaire" required>
            <Select options={owners} placeholder="Choisir…" defaultValue={property?.owner_id ?? defaultOwnerId ?? ""} required />
          </Field>
          <Field name="name" label="Nom du bien" hint="Utilisé partout dans la plateforme (exemple : T2 Chartrons)." required>
            <Input defaultValue={property?.name} required maxLength={120} />
          </Field>
          <Field name="property_type" label="Type">
            <Select options={optionsOf(propertyType)} defaultValue={property?.property_type ?? "apartment"} />
          </Field>
          <Field name="status" label="Statut">
            <Select options={optionsOf(propertyStatus)} defaultValue={property?.status ?? "onboarding"} />
          </Field>
        </FormGrid>
      </Fieldset>

      <Fieldset legend="Adresse">
        <FormGrid>
          <Field name="address_line" label="Adresse" className="sm:col-span-2">
            <Input defaultValue={property?.address_line ?? ""} autoComplete="street-address" />
          </Field>
          <Field name="postal_code" label="Code postal">
            <Input defaultValue={property?.postal_code ?? ""} inputMode="numeric" maxLength={10} />
          </Field>
          <Field name="city" label="Commune" required>
            <Input defaultValue={property?.city ?? "Bordeaux"} list="communes-metropole" required />
          </Field>
          <Field name="floor_info" label="Étage, bâtiment, digicode d’immeuble" className="sm:col-span-2">
            <Input defaultValue={property?.floor_info ?? ""} />
          </Field>
        </FormGrid>
        <datalist id="communes-metropole">
          {site.area.communes.map((commune) => (
            <option key={commune} value={commune} />
          ))}
        </datalist>
      </Fieldset>

      <Fieldset legend="Caractéristiques">
        <FormGrid className="lg:grid-cols-5">
          <Field name="surface_m2" label="Surface (m²)">
            <Input defaultValue={property?.surface_m2 ?? ""} inputMode="decimal" />
          </Field>
          <Field name="bedrooms" label="Chambres">
            <Input defaultValue={property?.bedrooms ?? ""} inputMode="numeric" />
          </Field>
          <Field name="beds" label="Lits">
            <Input defaultValue={property?.beds ?? ""} inputMode="numeric" />
          </Field>
          <Field name="bathrooms" label="Salles de bain">
            <Input defaultValue={property?.bathrooms ?? ""} inputMode="decimal" />
          </Field>
          <Field name="capacity" label="Voyageurs max.">
            <Input defaultValue={property?.capacity ?? ""} inputMode="numeric" />
          </Field>
        </FormGrid>
        <Field name="description" label="Description interne">
          <Textarea defaultValue={property?.description ?? ""} />
        </Field>
      </Fieldset>

      <Fieldset legend="Gestion et réglementation">
        <FormGrid>
          <Field
            name="commission_rate"
            label="Commission propre à ce bien (%)"
            hint={`Laisser vide pour le taux par défaut (${site.commission.label} ${site.commission.taxNote} des nuitées perçues). Le taux est figé sur chaque réservation à sa création.`}
          >
            <Input defaultValue={bpsToInput(property?.commission_rate_bps)} inputMode="decimal" placeholder="20" />
          </Field>
          <Field name="default_cleaning_fee" label="Frais de ménage par séjour (€)" hint="Payés par les voyageurs ; proposés par défaut sur chaque réservation.">
            <Input defaultValue={centsToInput(property?.default_cleaning_fee_cents)} inputMode="decimal" />
          </Field>
          <Field name="check_in_time" label="Heure d’arrivée">
            <Input type="time" defaultValue={property?.check_in_time?.slice(0, 5) ?? ""} />
          </Field>
          <Field name="check_out_time" label="Heure de départ">
            <Input type="time" defaultValue={property?.check_out_time?.slice(0, 5) ?? ""} />
          </Field>
          <Field name="registration_number" label="Numéro d’enregistrement (meublé de tourisme)">
            <Input defaultValue={property?.registration_number ?? ""} />
          </Field>
        </FormGrid>
        <Checkbox
          name="is_primary_residence"
          defaultChecked={property?.is_primary_residence ?? false}
          label="Résidence principale du propriétaire"
          hint="La plateforme suit alors le nombre de nuits louées dans l’année (limite légale paramétrable)."
        />
        <Field
          name="cleaning_checklist"
          label="Liste de contrôle du ménage (une ligne par point)"
          hint="Vide : la liste par défaut des paramètres est utilisée."
        >
          <Textarea defaultValue={checklist} rows={6} />
        </Field>
      </Fieldset>

      <Fieldset legend="Site internet">
        <Checkbox
          name="visible_on_site"
          defaultChecked={property?.visible_on_site ?? false}
          label="Afficher ce bien sur le site public"
          hint="Seuls le titre, la description publique, la commune, la capacité et les photos marquées publiques sont affichés."
        />
        <FormGrid>
          <Field name="slug" label="Adresse de la page" hint="Exemple : t2-chartrons">
            <Input defaultValue={property?.slug ?? ""} />
          </Field>
          <Field name="public_title" label="Titre public">
            <Input defaultValue={property?.public_title ?? ""} />
          </Field>
        </FormGrid>
        <Field name="public_description" label="Description publique">
          <Textarea defaultValue={property?.public_description ?? ""} />
        </Field>
      </Fieldset>

      <Fieldset legend="Notes internes">
        <Field name="internal_notes" label="Notes (visibles des administrateurs uniquement)">
          <Textarea defaultValue={property?.internal_notes ?? ""} />
        </Field>
      </Fieldset>

      <FormActions>
        <SubmitButton>{submitLabel}</SubmitButton>
      </FormActions>
    </ActionForm>
  );
}
