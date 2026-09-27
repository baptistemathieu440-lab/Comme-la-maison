import { ActionForm, FormActions, SubmitButton } from "@/components/app/form";
import { Notice, PageHeader, Panel, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { formatStay } from "@/lib/dates";
import { platformOptions, propertyOptions, propertyRates } from "@/lib/options";

import { createBooking } from "../actions";
import { BookingFields, type BookingDefaults } from "../BookingFields";

export const metadata = { title: "Nouvelle réservation" };

export default async function NewBookingPage({ searchParams }: PageProps<"/admin/reservations/nouvelle">) {
  const { supabase } = await adminContext();
  const params = await searchParams;
  const blockId = typeof params.bloc === "string" ? params.bloc : null;
  const propertyParam = typeof params.bien === "string" ? params.bien : undefined;

  const [properties, platforms, rates, block] = await Promise.all([
    propertyOptions(supabase),
    platformOptions(supabase),
    propertyRates(supabase),
    blockId
      ? supabase
          .from("calendar_blocks")
          .select("id, property_id, start_date, end_date, listing:listings(platform_id)")
          .eq("id", blockId)
          .maybeSingle()
          .then((r) => r.data)
      : Promise.resolve(null),
  ]);

  const defaults: BookingDefaults = block
    ? { property_id: block.property_id, check_in: block.start_date, check_out: block.end_date, platform_id: block.listing?.platform_id ?? "airbnb" }
    : { property_id: propertyParam };

  if (defaults.property_id && defaults.cleaning_fee_cents === undefined) {
    const { data: property } = await supabase.from("properties").select("default_cleaning_fee_cents").eq("id", defaults.property_id).maybeSingle();
    defaults.cleaning_fee_cents = property?.default_cleaning_fee_cents ?? undefined;
  }

  return (
    <>
      <PageHeader eyebrow={<TextLink href="/admin/reservations">Réservations</TextLink>} title="Nouvelle réservation" />
      {block ? (
        <Notice tone="info" title="Compléter une réservation importée">
          Séjour {formatStay(block.start_date, block.end_date)} lu dans le calendrier de la plateforme. Ajoutez les montants
          et le voyageur depuis la plateforme : le blocage importé sera relié à cette réservation.
        </Notice>
      ) : null}
      <Panel as="div">
        <ActionForm action={createBooking} className="flex flex-col gap-6">
          {block ? <input type="hidden" name="block_id" value={block.id} /> : null}
          <BookingFields values={defaults} properties={properties} platforms={platforms} rates={rates} />
          <FormActions>
            <SubmitButton>Enregistrer la réservation</SubmitButton>
          </FormActions>
        </ActionForm>
      </Panel>
    </>
  );
}
