import { ActionForm, SubmitButton } from "@/components/app/form";
import { Badge, DataTable, EmptyState, Notice, PageHeader, Panel, StatusBadge, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { formatDateTime, formatStay, todayIso } from "@/lib/dates";
import { labelOf, syncStatus } from "@/lib/labels";

import { syncEverything } from "./actions";

export const metadata = { title: "Synchronisation" };

export default async function SyncPage() {
  const { supabase } = await adminContext();
  const today = todayIso();
  const [{ data: listings }, { data: runs }, { data: imported }] = await Promise.all([
    supabase
      .from("listings")
      .select("id, platform_id, status, ical_import_url, last_import_at, last_import_status, last_import_error, property:properties!inner(id, name)")
      .order("last_import_at", { ascending: false, nullsFirst: false }),
    supabase
      .from("sync_runs")
      .select("id, started_at, status, trigger, events_found, created_count, updated_count, removed_count, conflicts, error, listing:listings!inner(platform_id, property:properties!inner(name))")
      .order("started_at", { ascending: false })
      .limit(30),
    supabase
      .from("calendar_blocks")
      .select("id, start_date, end_date, summary, property:properties!inner(name), listing:listings(platform_id)")
      .eq("kind", "platform_reservation")
      .is("booking_id", null)
      .gte("end_date", today)
      .order("start_date"),
  ]);
  const connected = (listings ?? []).filter((l) => l.ical_import_url);
  const missing = (listings ?? []).filter((l) => !l.ical_import_url && l.status === "active");

  return (
    <>
      <PageHeader
        title="Synchronisation"
        description="Calendriers des plateformes importés toutes les heures, calendriers exportés vers elles, et journal de chaque synchronisation."
        actions={
          <ActionForm action={syncEverything}>
            <SubmitButton pendingLabel="Synchronisation…">Tout synchroniser maintenant</SubmitButton>
          </ActionForm>
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <Notice tone="info" title="iCal : actif, avec ses limites">
          Airbnb, Booking.com et Abritel relisent les calendriers toutes les 1 à 3 heures, parfois jusqu’à 24 heures. Les
          flux iCal ne contiennent que des dates : les montants et le voyageur se complètent à la main depuis la plateforme.
          Un chevauchement est signalé dès qu’il est détecté.
        </Notice>
        <Notice tone="muted" title="Channel manager : non connecté">
          La synchronisation instantanée (réservations, montants, voyageurs, blocage immédiat des dates) passe par un
          channel manager agréé par les plateformes (Beds24, Smoobu…). Il sera branché une fois l’abonnement choisi ; rien
          n’est simulé d’ici là.
        </Notice>
      </div>

      <Panel
        title={`Réservations importées à compléter (${(imported ?? []).length})`}
        id="a-completer"
        description="Séjours lus dans les calendriers des plateformes, sans réservation saisie correspondante."
      >
        {(imported ?? []).length === 0 ? (
          <p className="text-small text-ink-soft">Rien à compléter.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-line">
            {(imported ?? []).map((block) => (
              <li key={block.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 first:pt-0">
                <span className="flex flex-col">
                  <span className="font-semibold">{block.property.name}</span>
                  <span className="text-small text-ink-soft">
                    {formatStay(block.start_date, block.end_date)} · {block.listing?.platform_id ?? "plateforme"} {block.summary ? `· ${block.summary}` : ""}
                  </span>
                </span>
                <TextLink href={`/admin/reservations/nouvelle?bloc=${block.id}`}>Compléter la réservation</TextLink>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title={`Calendriers importés (${connected.length})`} id="calendriers">
        {missing.length ? (
          <Notice tone="warning" className="mb-4">
            {missing.length} annonce(s) active(s) sans calendrier à importer :{" "}
            {missing.map((l, i) => (
              <span key={l.id}>
                {i > 0 ? ", " : ""}
                <TextLink href={`/admin/biens/${l.property.id}/annonces`}>
                  {l.property.name} ({l.platform_id})
                </TextLink>
              </span>
            ))}
            .
          </Notice>
        ) : null}
        <DataTable
          caption="Calendriers importés"
          rows={connected}
          rowKey={(row) => row.id}
          empty={<EmptyState title="Aucun calendrier à importer.">Ajoutez l’adresse iCal de chaque plateforme dans les annonces des biens.</EmptyState>}
          columns={[
            { header: "Bien", cell: (row) => <TextLink href={`/admin/biens/${row.property.id}/annonces`}>{row.property.name}</TextLink> },
            { header: "Plateforme", cell: (row) => row.platform_id },
            { header: "Dernier import", cell: (row) => formatDateTime(row.last_import_at) },
            {
              header: "État",
              cell: (row) => (
                <span className="flex flex-col gap-1">
                  {row.last_import_status ? <StatusBadge value={labelOf(syncStatus, row.last_import_status)} /> : <Badge tone="muted">Jamais</Badge>}
                  {row.last_import_error ? <span className="text-small text-ink-soft">{row.last_import_error}</span> : null}
                </span>
              ),
            },
          ]}
        />
      </Panel>

      <Panel title="Journal des synchronisations" id="journal">
        <DataTable
          caption="Dernières synchronisations"
          rows={runs ?? []}
          rowKey={(row) => row.id}
          empty={<EmptyState title="Aucune synchronisation pour l’instant." />}
          columns={[
            { header: "Date", cell: (row) => `${formatDateTime(row.started_at)} · ${row.trigger === "manual" ? "manuelle" : "planifiée"}` },
            { header: "Calendrier", cell: (row) => `${row.listing.property.name} (${row.listing.platform_id})` },
            {
              header: "Résultat",
              cell: (row) => `${row.events_found} lus · +${row.created_count} · ~${row.updated_count} · −${row.removed_count}`,
            },
            {
              header: "État",
              cell: (row) => {
                const conflicts = (Array.isArray(row.conflicts) ? row.conflicts : []) as Array<{ start: string; end: string; with: string }>;
                return (
                  <span className="flex flex-col gap-1">
                    <StatusBadge value={labelOf(syncStatus, row.status)} />
                    {row.error ? <span className="text-small text-error">{row.error}</span> : null}
                    {conflicts.map((c) => (
                      <span key={`${c.start}-${c.end}`} className="text-small text-terra-text">
                        Chevauchement {formatStay(c.start, c.end)} avec {c.with}
                      </span>
                    ))}
                  </span>
                );
              },
            },
          ]}
        />
      </Panel>
    </>
  );
}
