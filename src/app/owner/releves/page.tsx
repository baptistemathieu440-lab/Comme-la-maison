import { OwnerNotLinked } from "@/components/app/OwnerNotLinked";
import { DataTable, DemoBadge, EmptyState, PageHeader, StatusBadge, TextLink } from "@/components/app/ui";
import { ownerContext } from "@/lib/auth/admin-context";
import { formatDateShort, formatMonth } from "@/lib/dates";
import { labelOf, statementStatus } from "@/lib/labels";
import { formatCents } from "@/lib/money";

export const metadata = { title: "Relevés" };

export default async function OwnerStatements() {
  const { supabase, owner } = await ownerContext();
  if (!owner) return <OwnerNotLinked />;
  const { data: statements } = await supabase
    .from("owner_statements")
    .select("id, period_month, number, status, issued_on, due_on, commission_base_cents, total_due_cents, owner_net_cents, is_demo")
    .order("period_month", { ascending: false });

  return (
    <>
      <PageHeader title="Relevés" description="Chaque mois, le détail de vos réservations et la facture de notre commission. Téléchargeables en PDF." />
      <DataTable
        caption="Vos relevés"
        rows={statements ?? []}
        rowKey={(row) => row.id}
        empty={<EmptyState title="Aucun relevé pour l’instant." />}
        columns={[
          {
            header: "Mois",
            cell: (row) => (
              <span className="flex flex-col">
                <span className="flex items-center gap-2">
                  <TextLink href={`/owner/releves/${row.id}`} className="capitalize">
                    {formatMonth(row.period_month)}
                  </TextLink>
                  {row.is_demo ? <DemoBadge /> : null}
                </span>
                <span className="text-small text-ink-soft">
                  Facture {row.number} · émise le {formatDateShort(row.issued_on)}
                </span>
              </span>
            ),
          },
          { header: "Perçu", numeric: true, cell: (row) => formatCents(row.commission_base_cents) },
          { header: "À régler", numeric: true, cell: (row) => formatCents(row.total_due_cents) },
          { header: "Revenu net", numeric: true, cell: (row) => <strong>{formatCents(row.owner_net_cents)}</strong> },
          { header: "Statut", cell: (row) => <StatusBadge value={labelOf(statementStatus, row.status)} /> },
          {
            header: "PDF",
            cell: (row) => (
              <a href={`/api/releves/${row.id}/pdf`} className="font-semibold text-maison underline underline-offset-4">
                Télécharger
              </a>
            ),
          },
        ]}
      />
    </>
  );
}
