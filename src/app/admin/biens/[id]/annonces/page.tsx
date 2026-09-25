import { notFound } from "next/navigation";

import { CopyField } from "@/components/app/CopyField";
import { ActionForm, Field, FormActions, FormGrid, Input, Select, SubmitButton, Textarea } from "@/components/app/form";
import { Badge, EmptyState, Notice, Panel, StatusBadge, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { formatDateTime } from "@/lib/dates";
import { labelOf, syncStatus } from "@/lib/labels";
import { platformOptions } from "@/lib/options";
import { publicOrigin } from "@/lib/site-url";

import { deleteListing, regenerateExportToken, saveListing, syncListingNow } from "../../actions";

export const metadata = { title: "Annonces et calendriers" };

type Listing = {
  id: string;
  platform_id: string;
  external_id: string | null;
  listing_url: string | null;
  ical_import_url: string | null;
  ical_export_token: string;
  status: string;
  last_import_at: string | null;
  last_import_status: string | null;
  last_import_error: string | null;
  notes: string | null;
};

function ListingFields({ listing, platforms }: { listing?: Listing; platforms: Array<{ value: string; label: string }> }) {
  return (
    <>
      <FormGrid>
        <Field name="platform_id" label="Plateforme" required>
          <Select options={platforms} defaultValue={listing?.platform_id ?? "airbnb"} />
        </Field>
        <Field name="status" label="Statut">
          <Select
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive (non synchronisée)" },
            ]}
            defaultValue={listing?.status ?? "active"}
          />
        </Field>
        <Field name="external_id" label="Identifiant de l’annonce sur la plateforme">
          <Input defaultValue={listing?.external_id ?? ""} />
        </Field>
        <Field name="listing_url" label="Adresse de l’annonce">
          <Input type="url" defaultValue={listing?.listing_url ?? ""} placeholder="https://" />
        </Field>
      </FormGrid>
      <Field
        name="ical_import_url"
        label="Calendrier iCal de la plateforme (à importer)"
        hint="Dans la rubrique de synchronisation des calendriers de la plateforme (Airbnb : Calendrier › Disponibilités ; Booking.com : Tarifs et disponibilités). Cherchez « iCal » si le menu a changé."
      >
        <Input type="url" defaultValue={listing?.ical_import_url ?? ""} placeholder="https://" />
      </Field>
      <Field name="notes" label="Notes">
        <Textarea rows={2} defaultValue={listing?.notes ?? ""} />
      </Field>
    </>
  );
}

export default async function ListingsPage({ params }: PageProps<"/admin/biens/[id]/annonces">) {
  const { id } = await params;
  const { supabase } = await adminContext();
  const [{ data: property }, { data: listings }, platforms, origin] = await Promise.all([
    supabase.from("properties").select("id").eq("id", id).maybeSingle(),
    supabase
      .from("listings")
      .select("id, platform_id, external_id, listing_url, ical_import_url, ical_export_token, status, last_import_at, last_import_status, last_import_error, notes")
      .eq("property_id", id)
      .order("created_at"),
    platformOptions(supabase),
    publicOrigin(),
  ]);
  if (!property) notFound();
  const platformName = new Map(platforms.map((p) => [p.value, p.label]));

  return (
    <>
      <Notice tone="info" title="Comment fonctionne la synchronisation">
        Airbnb, Booking.com et Abritel ne donnent pas d’accès direct à leur système aux conciergeries. La
        synchronisation passe par les calendriers iCal : chaque plateforme importe l’adresse d’export ci-dessous, et la
        plateforme importe leur calendrier toutes les heures. Les calendriers iCal ne transmettent que des dates
        (ni montants ni voyageurs) et les plateformes les relisent avec un délai de 1 à 3 heures, parfois plus : le
        risque de double réservation n’est pas nul. Un channel manager agréé supprimera ce délai.{" "}
        <TextLink href="/admin/synchronisation">État des synchronisations</TextLink>
      </Notice>

      {(listings ?? []).length === 0 ? (
        <EmptyState title="Aucune annonce pour ce bien.">Ajoutez une annonce par plateforme ci-dessous.</EmptyState>
      ) : (
        (listings ?? []).map((listing) => (
          <Panel
            key={listing.id}
            id={`annonce-${listing.id}`}
            title={platformName.get(listing.platform_id) ?? listing.platform_id}
            actions={
              <span className="flex flex-wrap gap-2">
                {listing.status === "active" ? <Badge tone="positive">Active</Badge> : <Badge tone="muted">Inactive</Badge>}
                {listing.last_import_status ? <StatusBadge value={labelOf(syncStatus, listing.last_import_status)} /> : null}
              </span>
            }
          >
            <div className="flex flex-col gap-5">
              <CopyField
                label="Adresse d’export à coller dans la plateforme (import de calendrier)"
                hint="Adresse secrète : elle donne les dates réservées du bien, sans aucune donnée personnelle."
                value={`${origin}/api/ical/${listing.ical_export_token}.ics`}
              />

              <div className="flex flex-col gap-2 rounded-[var(--radius-field)] bg-cream p-4 text-small">
                <p>
                  <strong>Import :</strong>{" "}
                  {listing.ical_import_url ? (
                    <>
                      dernière synchronisation {listing.last_import_at ? formatDateTime(listing.last_import_at) : "jamais"}
                      {listing.last_import_error ? ` · ${listing.last_import_error}` : ""}
                    </>
                  ) : (
                    "non connecté : renseignez le calendrier iCal de la plateforme."
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {listing.ical_import_url ? (
                    <ActionForm action={syncListingNow.bind(null, id, listing.id)}>
                      <SubmitButton variant="secondary" pendingLabel="Synchronisation…">
                        Synchroniser maintenant
                      </SubmitButton>
                    </ActionForm>
                  ) : null}
                  <ActionForm
                    action={regenerateExportToken.bind(null, id, listing.id)}
                    confirmMessage="L’adresse actuelle cessera de fonctionner. Continuer ?"
                  >
                    <SubmitButton variant="ghost" pendingLabel="…">
                      Changer l’adresse d’export
                    </SubmitButton>
                  </ActionForm>
                </div>
              </div>

              <details>
                <summary className="cursor-pointer font-semibold text-maison">Modifier l’annonce</summary>
                <ActionForm action={saveListing.bind(null, id, listing.id)} className="mt-4 flex flex-col gap-4">
                  <ListingFields listing={listing} platforms={platforms} />
                  <FormActions>
                    <SubmitButton>Enregistrer</SubmitButton>
                  </FormActions>
                </ActionForm>
                <ActionForm
                  action={deleteListing.bind(null, id, listing.id)}
                  confirmMessage="Supprimer cette annonce et les blocages importés depuis son calendrier ?"
                  className="mt-3"
                >
                  <SubmitButton variant="ghost" pendingLabel="Suppression…">
                    Supprimer l’annonce
                  </SubmitButton>
                </ActionForm>
              </details>
            </div>
          </Panel>
        ))
      )}

      <Panel title="Ajouter une annonce" id="nouvelle-annonce">
        <ActionForm action={saveListing.bind(null, id, null)} resetOnSuccess className="flex flex-col gap-4">
          <ListingFields platforms={platforms} />
          <FormActions>
            <SubmitButton>Ajouter l’annonce</SubmitButton>
          </FormActions>
        </ActionForm>
      </Panel>
    </>
  );
}
