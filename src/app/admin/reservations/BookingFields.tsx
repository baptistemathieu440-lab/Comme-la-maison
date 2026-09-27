import { Field, Fieldset, FormGrid, Input, Select, Textarea } from "@/components/app/form";
import { bookingStatus, optionsOf } from "@/lib/labels";
import { centsToInput } from "@/lib/money";
import type { Option } from "@/lib/options";

import { AmountsPreview } from "./AmountsPreview";

export type BookingDefaults = {
  property_id?: string;
  platform_id?: string;
  status?: string;
  check_in?: string;
  check_out?: string;
  adults?: number;
  children?: number;
  nights_amount_cents?: number;
  platform_fee_cents?: number;
  cleaning_fee_cents?: number;
  tourist_tax_cents?: number;
  external_ref?: string | null;
  internal_notes?: string | null;
  cancellation_reason?: string | null;
  guest?: { first_name?: string; last_name?: string; email?: string | null; phone?: string | null } | null;
};

export function BookingFields({
  values = {},
  properties,
  platforms,
  rates,
  fixedRate,
  locked = false,
}: {
  values?: BookingDefaults;
  properties: Option[];
  platforms: Option[];
  rates: Record<string, number>;
  fixedRate?: number | null;
  locked?: boolean;
}) {
  return (
    <>
      <Fieldset legend="Séjour">
        <FormGrid>
          <Field name="property_id" label="Bien" required>
            <Select options={properties} placeholder="Choisir…" defaultValue={values.property_id ?? ""} required disabled={locked} />
          </Field>
          <Field name="platform_id" label="Plateforme">
            <Select options={platforms} defaultValue={values.platform_id ?? "airbnb"} />
          </Field>
          <Field name="check_in" label="Arrivée" required>
            <Input type="date" defaultValue={values.check_in ?? ""} required disabled={locked} />
          </Field>
          <Field name="check_out" label="Départ" required>
            <Input type="date" defaultValue={values.check_out ?? ""} required disabled={locked} />
          </Field>
          <Field name="adults" label="Adultes">
            <Input type="number" min={0} max={50} defaultValue={values.adults ?? 2} />
          </Field>
          <Field name="children" label="Enfants">
            <Input type="number" min={0} max={50} defaultValue={values.children ?? 0} />
          </Field>
          <Field name="status" label="Statut">
            <Select options={optionsOf(bookingStatus)} defaultValue={values.status ?? "confirmed"} />
          </Field>
          <Field name="external_ref" label="Référence sur la plateforme" hint="Code de confirmation Airbnb, numéro Booking.com…">
            <Input defaultValue={values.external_ref ?? ""} />
          </Field>
        </FormGrid>
      </Fieldset>

      <Fieldset legend="Montants">
        <p className="-mt-2 text-small text-ink-soft">
          Saisissez ce que montre le relevé de la plateforme. La commission ({fixedRate ? "taux figé sur cette réservation" : "taux du bien ou taux par défaut"}) se
          calcule sur les nuitées réellement perçues, après les frais de la plateforme ; ménage et taxe de séjour sont hors base.
        </p>
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <FormGrid>
            <Field name="nights_amount" label="Prix des nuitées (€)" hint="Hors frais de service voyageur, ménage et taxe de séjour.">
              <Input inputMode="decimal" defaultValue={centsToInput(values.nights_amount_cents)} disabled={locked} />
            </Field>
            <Field name="platform_fee" label="Frais de la plateforme (€)" hint="Commission prélevée à l’hôte sur les nuitées.">
              <Input inputMode="decimal" defaultValue={centsToInput(values.platform_fee_cents)} disabled={locked} />
            </Field>
            {!locked ? (
              <Field name="platform_fee_percent" label="… ou en % des nuitées" hint="Utilisé seulement si les frais en euros sont vides.">
                <Input inputMode="decimal" placeholder="15" />
              </Field>
            ) : null}
            <Field name="cleaning_fee" label="Frais de ménage perçus (€)" hint="Refacturés à l’identique au propriétaire.">
              <Input inputMode="decimal" defaultValue={centsToInput(values.cleaning_fee_cents)} disabled={locked} />
            </Field>
            <Field name="tourist_tax" label="Taxe de séjour (€)" hint="Pour information : collectée par la plateforme ou le propriétaire.">
              <Input inputMode="decimal" defaultValue={centsToInput(values.tourist_tax_cents)} />
            </Field>
          </FormGrid>
          <AmountsPreview rates={rates} fixedRate={fixedRate} />
        </div>
      </Fieldset>

      <Fieldset legend="Voyageur">
        <FormGrid>
          <Field name="guest_first_name" label="Prénom">
            <Input defaultValue={values.guest?.first_name ?? ""} />
          </Field>
          <Field name="guest_last_name" label="Nom">
            <Input defaultValue={values.guest?.last_name ?? ""} />
          </Field>
          <Field name="guest_email" label="Email">
            <Input type="email" defaultValue={values.guest?.email ?? ""} />
          </Field>
          <Field name="guest_phone" label="Téléphone">
            <Input type="tel" defaultValue={values.guest?.phone ?? ""} />
          </Field>
        </FormGrid>
        <p className="-mt-2 text-small text-ink-soft">
          Coordonnées visibles des seuls administrateurs. Le propriétaire et l’agent ne voient que le prénom.
        </p>
      </Fieldset>

      <Fieldset legend="Notes">
        <Field name="internal_notes" label="Notes internes">
          <Textarea rows={3} defaultValue={values.internal_notes ?? ""} />
        </Field>
        <Field name="cancellation_reason" label="Motif d’annulation (si annulée)">
          <Input defaultValue={values.cancellation_reason ?? ""} />
        </Field>
      </Fieldset>
    </>
  );
}
