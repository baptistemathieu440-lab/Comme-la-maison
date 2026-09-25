import { notFound } from "next/navigation";
import { FileDown } from "lucide-react";

import { buttonClasses } from "@/components/ui/Button";
import { OwnerNotLinked } from "@/components/app/OwnerNotLinked";
import { DataTable, DemoBadge, PageHeader, Panel, StatusBadge, TextLink } from "@/components/app/ui";
import { ownerContext } from "@/lib/auth/admin-context";
import { formatDateShort, formatMonth } from "@/lib/dates";
import { labelOf, paymentMethod, statementStatus, textOf } from "@/lib/labels";
import { formatCents } from "@/lib/money";

export const metadata = { title: "Relevé" };

export default async function OwnerStatement({ params }: PageProps<"/owner/releves/[id]">) {
  const { id } = await params;
  const { supabase, owner } = await ownerContext();
  if (!owner) return <OwnerNotLinked />;
  const [{ data: statement }, { data: lines }, { data: payments }] = await Promise.all([
    supabase.from("owner_statements").select("*").eq("id", id).maybeSingle(),
    supabase.from("statement_lines").select("*").eq("statement_id", id).order("position"),
    supabase.from("payments").select("paid_on, amount_cents, method").eq("statement_id", id),
  ]);
  if (!statement) notFound();
  const bookings = (lines ?? []).filter((l) => l.kind === "booking");
  const others = (lines ?? []).filter((l) => l.kind !== "booking");

  return (
    <>
      <PageHeader
        eyebrow={<TextLink href="/owner/releves">Relevés</TextLink>}
        title={<span className="capitalize">Relevé de {formatMonth(statement.period_month)}</span>}
        description={
          <span className="flex flex-wrap items-center gap-2">
            Facture {statement.number} · émise le {formatDateShort(statement.issued_on)} · à régler avant le {formatDateShort(statement.due_on)}
            <StatusBadge value={labelOf(statementStatus, statement.status)} />
            {statement.is_demo ? <DemoBadge /> : null}
          </span>
        }
        actions={
          <a href={`/api/releves/${id}/pdf`} className={buttonClasses("primary", undefined, "sm")}>
            <FileDown aria-hidden="true" className="size-4" />
            Télécharger le PDF
          </a>
        }
      />
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Revenus perçus", statement.commission_base_cents],
          ["Total à régler à Comme à la Maison", statement.total_due_cents],
          ["Votre revenu net", statement.owner_net_cents],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
            <p className="text-small text-ink-soft">{label}</p>
            <p className="font-display text-[1.5rem] text-maison tabular-nums">{formatCents(Number(value))}</p>
          </div>
        ))}
      </div>
      <Panel title="Réservations" id="reservations">
        <DataTable
          caption="Réservations du relevé"
          rows={bookings}
          rowKey={(row) => row.id}
          columns={[
            { header: "Séjour", cell: (row) => row.label },
            { header: "Nuitées", numeric: true, cell: (row) => formatCents(row.nights_amount_cents) },
            { header: "Frais plateforme", numeric: true, cell: (row) => formatCents(row.platform_fee_cents) },
            { header: "Perçu", numeric: true, cell: (row) => formatCents(row.commission_base_cents) },
            { header: "Commission", numeric: true, cell: (row) => formatCents(row.commission_cents) },
          ]}
        />
      </Panel>
      {others.length ? (
        <Panel title="Ménages et frais refacturés" id="autres">
          <ul className="flex flex-col divide-y divide-line">
            {others.map((line) => (
              <li key={line.id} className="flex justify-between gap-3 py-2 text-[0.9375rem]">
                <span>{line.label}</span>
                <span className="tabular-nums">{formatCents(line.amount_cents)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}
      <Panel title="Règlements" id="reglements">
        {(payments ?? []).length === 0 ? (
          <p className="text-small text-ink-soft">Aucun règlement enregistré pour l’instant.</p>
        ) : (
          <ul className="flex flex-col gap-1.5 text-[0.9375rem]">
            {(payments ?? []).map((p, i) => (
              <li key={i}>
                {formatDateShort(p.paid_on)} · {textOf(paymentMethod, p.method)} · {formatCents(p.amount_cents)}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
