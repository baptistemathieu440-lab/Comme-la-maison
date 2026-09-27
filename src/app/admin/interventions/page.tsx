import { DataTable, DemoBadge, EmptyState, PageHeader, StatusBadge, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { formatDateShort } from "@/lib/dates";
import { labelOf, maintenanceStatus } from "@/lib/labels";
import { formatCents } from "@/lib/money";
import { displayName } from "@/lib/people";

export const metadata = { title: "Interventions" };

export default async function MaintenancePage() {
  const { supabase } = await adminContext();
  const { data: jobs } = await supabase
    .from("maintenance_jobs")
    .select("id, title, status, scheduled_on, cost_cents, is_demo, property:properties!inner(id, name), provider:providers(contact:contacts(first_name, last_name, company_name)), expenses(id)")
    .order("scheduled_on", { ascending: false, nullsFirst: true })
    .limit(200);

  return (
    <>
      <PageHeader title="Interventions" description="Réparations et entretien réalisés par des prestataires. Créez-les depuis un incident." />
      <DataTable
        caption="Liste des interventions"
        rows={jobs ?? []}
        rowKey={(row) => row.id}
        empty={<EmptyState title="Aucune intervention.">Ouvrez un incident puis « Créer l’intervention ».</EmptyState>}
        columns={[
          {
            header: "Intervention",
            cell: (row) => (
              <span className="flex flex-wrap items-center gap-2">
                <TextLink href={`/admin/interventions/${row.id}`}>{row.title}</TextLink>
                {row.is_demo ? <DemoBadge /> : null}
              </span>
            ),
          },
          { header: "Bien", cell: (row) => row.property.name },
          { header: "Prestataire", cell: (row) => (row.provider ? displayName(row.provider.contact) : "—") },
          { header: "Date", cell: (row) => formatDateShort(row.scheduled_on) },
          { header: "Coût", numeric: true, cell: (row) => (row.cost_cents === null ? "—" : formatCents(row.cost_cents)) },
          { header: "Dépense", hideOnMobile: true, cell: (row) => (row.expenses.length ? "Enregistrée" : "—") },
          { header: "Statut", cell: (row) => <StatusBadge value={labelOf(maintenanceStatus, row.status)} /> },
        ]}
      />
    </>
  );
}
