import { ButtonLink } from "@/components/ui/Button";
import { FilterBar, FilterField, filterControl, param } from "@/components/app/FilterBar";
import { DataTable, DemoBadge, EmptyState, PageHeader, StatusBadge, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { formatDateShort } from "@/lib/dates";
import { incidentSeverity, incidentStatus, labelOf, optionsOf } from "@/lib/labels";
import { propertyOptions } from "@/lib/options";

export const metadata = { title: "Incidents" };

export default async function IncidentsPage({ searchParams }: PageProps<"/admin/incidents">) {
  const { supabase } = await adminContext();
  const params = await searchParams;
  const status = param(params.statut);
  const property = param(params.bien);
  let query = supabase
    .from("incidents")
    .select("id, title, severity, status, created_at, is_demo, visible_to_owner, property:properties!inner(id, name), reporter:profiles!incidents_reported_by_fkey(full_name), incident_photos(id)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status) query = query.eq("status", status);
  else query = query.neq("status", "resolved");
  if (property) query = query.eq("property_id", property);
  const [{ data: incidents }, properties] = await Promise.all([query, propertyOptions(supabase)]);

  return (
    <>
      <PageHeader
        title="Incidents"
        description="Problèmes signalés par les agents ou saisis ici. Un incident peut devenir une intervention."
        actions={<ButtonLink href="/admin/incidents/nouveau" size="sm">Signaler un incident</ButtonLink>}
      />
      <FilterBar resetHref="/admin/incidents">
        <FilterField label="Statut" id="f-statut">
          <select id="f-statut" name="statut" defaultValue={status} className={filterControl}>
            <option value="">Non résolus</option>
            {optionsOf(incidentStatus).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Bien" id="f-bien">
          <select id="f-bien" name="bien" defaultValue={property} className={filterControl}>
            <option value="">Tous</option>
            {properties.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FilterField>
      </FilterBar>
      <DataTable
        caption="Liste des incidents"
        rows={incidents ?? []}
        rowKey={(row) => row.id}
        empty={<EmptyState title="Aucun incident." />}
        columns={[
          {
            header: "Incident",
            cell: (row) => (
              <span className="flex flex-col gap-0.5">
                <span className="flex flex-wrap items-center gap-2">
                  <TextLink href={`/admin/incidents/${row.id}`}>{row.title}</TextLink>
                  {row.is_demo ? <DemoBadge /> : null}
                </span>
                <span className="text-small text-ink-soft">
                  {formatDateShort(row.created_at)} · {row.reporter?.full_name ?? "—"} · {row.incident_photos.length} photo(s)
                </span>
              </span>
            ),
          },
          { header: "Bien", cell: (row) => <TextLink href={`/admin/biens/${row.property.id}`}>{row.property.name}</TextLink> },
          { header: "Gravité", cell: (row) => <StatusBadge value={labelOf(incidentSeverity, row.severity)} /> },
          { header: "Statut", cell: (row) => <StatusBadge value={labelOf(incidentStatus, row.status)} /> },
          { header: "Propriétaire", hideOnMobile: true, cell: (row) => (row.visible_to_owner ? "Visible" : "Masqué") },
        ]}
      />
    </>
  );
}
