import { ActionForm, Checkbox, Field, Fieldset, FormActions, FormGrid, Input, Select, SubmitButton, Textarea } from "@/components/app/form";
import { reviewCategories, reviewCategoryKeys } from "@/content/reviews";
import type { ActionState } from "@/lib/action-state";
import type { Database } from "@/lib/supabase/database.types";

type Values = Partial<Database["public"]["Tables"]["site_reviews"]["Row"]>;

const sources = ["Airbnb", "Booking.com", "Abritel", "Google", "Message reçu", "Email", "SMS"];

/** Fiche d'un avis client (création et modification). */
export function ReviewForm({
  action,
  values = {},
  submitLabel,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  values?: Values;
  submitLabel: string;
}) {
  return (
    <ActionForm action={action} className="flex flex-col gap-6">
      <Fieldset legend="L’avis">
        <Field name="body" label="Texte de l’avis" required hint="Recopié tel quel : pas de reformulation. Entre 10 et 1 200 caractères.">
          <Textarea defaultValue={values.body ?? ""} required rows={6} maxLength={1200} />
        </Field>
        <FormGrid>
          <Field name="rating" label="Note" required>
            <Select
              defaultValue={String(values.rating ?? 5)}
              options={[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} sur 5` }))}
            />
          </Field>
          <Field name="category" label="L’auteur est" required>
            <Select
              defaultValue={values.category ?? "proprietaire"}
              options={reviewCategoryKeys.map((key) => ({ value: key, label: reviewCategories[key].label }))}
            />
          </Field>
        </FormGrid>
      </Fieldset>

      <Fieldset legend="L’auteur et la source">
        <FormGrid>
          <Field name="author_name" label="Prénom affiché" required hint="Le prénom seul, ou prénom et initiale (« Sophie L. »).">
            <Input defaultValue={values.author_name ?? ""} required maxLength={60} autoComplete="off" />
          </Field>
          <Field name="city" label="Ville" hint="Facultatif.">
            <Input defaultValue={values.city ?? ""} maxLength={60} />
          </Field>
          <Field name="source" label="Reçu via" hint="Airbnb, Booking.com, Google, message…">
            <Input defaultValue={values.source ?? ""} list="avis-sources" maxLength={60} />
          </Field>
          <Field name="received_on" label="Date de l’avis" hint="Affichée au mois près (« septembre 2026 »).">
            <Input type="date" defaultValue={values.received_on ?? ""} />
          </Field>
        </FormGrid>
        <datalist id="avis-sources">
          {sources.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>
      </Fieldset>

      <Fieldset legend="Publication">
        <div className="flex flex-col gap-3">
          <Checkbox
            name="consent_confirmed"
            defaultChecked={values.consent_confirmed ?? false}
            label="L’auteur a accepté que son avis soit publié sur le site"
            hint="Obligatoire pour publier. Gardez une trace de cet accord (message, email)."
          />
          <Checkbox
            name="is_published"
            defaultChecked={values.is_published ?? false}
            label="Afficher sur l’accueil du site"
            hint="Décochez pour masquer l’avis sans le supprimer."
          />
        </div>
        <FormGrid>
          <Field name="position" label="Ordre d’affichage" hint="Les plus petits nombres apparaissent en premier.">
            <Input type="number" inputMode="numeric" min={0} max={100000} defaultValue={String(values.position ?? 0)} />
          </Field>
        </FormGrid>
        <Field name="internal_notes" label="Note interne" hint="Jamais affichée sur le site (ex. : accord reçu par SMS le 12/10).">
          <Textarea defaultValue={values.internal_notes ?? ""} rows={3} maxLength={2000} />
        </Field>
      </Fieldset>

      <FormActions>
        <SubmitButton pendingLabel="Enregistrement…">{submitLabel}</SubmitButton>
      </FormActions>
    </ActionForm>
  );
}
