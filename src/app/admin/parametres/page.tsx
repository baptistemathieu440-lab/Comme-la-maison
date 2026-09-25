import { ActionForm, Checkbox, Field, Fieldset, FormActions, FormGrid, Input, SubmitButton, Textarea } from "@/components/app/form";
import { Notice, Panel } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { bpsToInput } from "@/lib/money";

import { saveSettings } from "./actions";

export const metadata = { title: "Paramètres" };

export default async function SettingsPage() {
  const { supabase } = await adminContext();
  const { data: s } = await supabase.from("settings").select("*").single();
  if (!s) return <Notice tone="danger">Paramètres introuvables.</Notice>;
  const missing = [
    !s.legal_name && "dénomination sociale",
    !s.siren && "SIREN",
    !s.head_office && "adresse du siège",
    s.vat_registered && !s.vat_number && "numéro de TVA",
  ].filter(Boolean);
  const checklist = Array.isArray(s.default_cleaning_checklist) ? (s.default_cleaning_checklist as string[]).join("\n") : "";

  return (
    <Panel as="div">
      {missing.length ? (
        <Notice tone="warning" title="Informations légales à compléter avant d’envoyer des factures" className="mb-6">
          Manquant : {missing.join(", ")}. Elles figurent obligatoirement sur chaque facture ; tant qu’elles manquent, les
          relevés affichent « À compléter ».
        </Notice>
      ) : null}
      <ActionForm action={saveSettings} className="flex flex-col gap-6">
        <Fieldset legend="Identité de la société (factures)">
          <FormGrid>
            <Field name="company_name" label="Nom commercial" required>
              <Input defaultValue={s.company_name} required />
            </Field>
            <Field name="legal_name" label="Dénomination sociale">
              <Input defaultValue={s.legal_name ?? ""} />
            </Field>
            <Field name="legal_form" label="Forme juridique" hint="Micro-entreprise, SAS, SARL…">
              <Input defaultValue={s.legal_form ?? ""} />
            </Field>
            <Field name="share_capital" label="Capital social">
              <Input defaultValue={s.share_capital ?? ""} />
            </Field>
            <Field name="siren" label="SIREN / SIRET">
              <Input defaultValue={s.siren ?? ""} inputMode="numeric" />
            </Field>
            <Field name="registration" label="Immatriculation" hint="Exemple : RCS Bordeaux 123 456 789">
              <Input defaultValue={s.registration ?? ""} />
            </Field>
            <Field name="head_office" label="Adresse du siège" className="sm:col-span-2">
              <Input defaultValue={s.head_office ?? ""} />
            </Field>
            <Field name="email" label="Email de facturation">
              <Input type="email" defaultValue={s.email ?? ""} />
            </Field>
            <Field name="phone" label="Téléphone">
              <Input defaultValue={s.phone ?? ""} />
            </Field>
            <Field name="website" label="Site internet">
              <Input defaultValue={s.website ?? ""} />
            </Field>
            <Field name="professional_card" label="Carte professionnelle (si applicable)" hint="Numéro, mention et CCI de délivrance.">
              <Input defaultValue={s.professional_card ?? ""} />
            </Field>
            <Field name="liability_insurance" label="Assurance responsabilité civile professionnelle" className="sm:col-span-2">
              <Input defaultValue={s.liability_insurance ?? ""} />
            </Field>
          </FormGrid>
        </Fieldset>

        <Fieldset legend="Commission et TVA">
          <FormGrid>
            <Field
              name="default_commission"
              label="Commission par défaut (%)"
              required
              hint="TTC, calculée sur le prix des nuitées perçu par le propriétaire (après frais de plateforme). S’applique aux nouvelles réservations."
            >
              <Input defaultValue={bpsToInput(s.default_commission_bps)} inputMode="decimal" required />
            </Field>
            <Field name="vat_rate" label="Taux de TVA (%)" required>
              <Input defaultValue={bpsToInput(s.vat_rate_bps)} inputMode="decimal" required />
            </Field>
          </FormGrid>
          <Checkbox
            name="vat_registered"
            defaultChecked={s.vat_registered}
            label="Comme à la Maison facture la TVA"
            hint="Décoché (franchise en base) : les factures portent « TVA non applicable, art. 293 B du CGI » et la commission TTC n’est pas décomposée. Coché : la commission de 20 % TTC est décomposée en HT et TVA."
          />
        </Fieldset>

        <Fieldset legend="Facturation">
          <FormGrid>
            <Field name="invoice_prefix" label="Préfixe des numéros de facture" required hint="Exemple : CAM → CAM-2026-0001. Numérotation continue par année.">
              <Input defaultValue={s.invoice_prefix} required maxLength={10} />
            </Field>
            <Field name="payment_terms_days" label="Délai de paiement (jours)" required>
              <Input type="number" min={0} max={90} defaultValue={s.payment_terms_days} required />
            </Field>
          </FormGrid>
          <Field name="bank_details" label="Coordonnées bancaires de Comme à la Maison (sur les factures)">
            <Textarea rows={2} defaultValue={s.bank_details ?? ""} />
          </Field>
          <Field name="late_penalty_note" label="Mention sur les pénalités de retard">
            <Textarea rows={2} defaultValue={s.late_penalty_note ?? ""} placeholder="Taux des pénalités de retard et, entre professionnels, indemnité forfaitaire de recouvrement." />
          </Field>
        </Fieldset>

        <Fieldset legend="Exploitation">
          <FormGrid className="lg:grid-cols-3">
            <Field name="default_check_in_time" label="Heure d’arrivée par défaut">
              <Input type="time" defaultValue={s.default_check_in_time.slice(0, 5)} />
            </Field>
            <Field name="default_check_out_time" label="Heure de départ par défaut">
              <Input type="time" defaultValue={s.default_check_out_time.slice(0, 5)} />
            </Field>
            <Field name="primary_residence_night_limit" label="Limite annuelle (résidence principale)" required hint="Nuits louées par an.">
              <Input type="number" min={0} max={366} defaultValue={s.primary_residence_night_limit} required />
            </Field>
          </FormGrid>
          <Field name="default_cleaning_checklist" label="Liste de contrôle du ménage par défaut (une ligne par point)">
            <Textarea rows={10} defaultValue={checklist} />
          </Field>
        </Fieldset>

        <FormActions>
          <SubmitButton>Enregistrer les paramètres</SubmitButton>
        </FormActions>
      </ActionForm>
    </Panel>
  );
}
