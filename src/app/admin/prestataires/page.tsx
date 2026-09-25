import { Badge, DataTable, DemoBadge, EmptyState, PageHeader, Panel, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { displayName } from "@/lib/people";

import { saveProvider } from "./actions";
import { ProviderForm } from "./ProviderForm";

export const metadata = { title: "Prestataires" };

export default async function ProvidersPage() {
  const { supabase } = await adminContext();
  const { data: providers } = await supabase
    .from("providers")
    .select("id, trade, active, is_demo, contact:contacts!inner(first_name, last_name, company_name, phone, email), maintenance_jobs(id)")
    .order("trade");

  return (
    <>
      <PageHeader title="Prestataires" description="Artisans et entreprises qui interviennent dans les logements." />
      <DataTable
        caption="Liste des prestataires"
        rows={providers ?? []}
        rowKey={(row) => row.id}
        empty={<EmptyState title="Aucun prestataire enregistré." />}
        columns={[
          {
            header: "Prestataire",
            cell: (row) => (
              <span className="flex flex-wrap items-center gap-2">
                <TextLink href={`/admin/prestataires/${row.id}`}>{displayName(row.contact)}</TextLink>
                {row.is_demo ? <DemoBadge /> : null}
              </span>
            ),
          },
          { header: "Métier", cell: (row) => row.trade },
          { header: "Contact", cell: (row) => <span className="text-small">{[row.contact.phone, row.contact.email].filter(Boolean).join(" · ") || "—"}</span> },
          { header: "Interventions", numeric: true, cell: (row) => row.maintenance_jobs.length },
          { header: "Statut", cell: (row) => (row.active ? <Badge tone="positive">Actif</Badge> : <Badge tone="muted">Inactif</Badge>) },
        ]}
      />
      <Panel title="Ajouter un prestataire" id="nouveau">
        <ProviderForm action={saveProvider.bind(null, null)} submitLabel="Ajouter" />
      </Panel>
    </>
  );
}
