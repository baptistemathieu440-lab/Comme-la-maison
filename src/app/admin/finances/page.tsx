import { Download } from "lucide-react";

import { buttonClasses } from "@/components/ui/Button";
import { MonthBars } from "@/components/app/charts";
import { MonthSwitcher, readMonth } from "@/components/app/MonthSwitcher";
import { DataTable, DemoBadge, EmptyState, PageHeader, Panel, StatCard, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { addMonths, formatMonth, todayIso } from "@/lib/dates";
import { formatCents, formatCentsRounded } from "@/lib/money";
import { displayName } from "@/lib/people";
import { byMonth, sumMonths } from "@/lib/stats";

export const metadata = { title: "Finances" };

export default async function FinancesPage({ searchParams }: PageProps<"/admin/finances">) {
  const { supabase } = await adminContext();
  const params = await searchParams;
  const month = readMonth(params.mois, todayIso());
  const next = addMonths(month, 1);

  const [monthStats, yearStats, { data: expenses }, { data: statements }, { data: open }, { data: owners }, { data: properties }] = await Promise.all([
    supabase.rpc("stats_property_months", { p_from: month, p_to: month }),
    supabase.rpc("stats_property_months", { p_from: addMonths(month, -11), p_to: month }),
    supabase.from("expenses").select("amount_cents, paid_by, rebill_to_owner").gte("incurred_on", month).lt("incurred_on", next),
    supabase.from("owner_statements").select("id, status, total_due_cents, owner_id, payments(amount_cents)").eq("period_month", month),
    supabase.from("owner_statements").select("total_due_cents, payments(amount_cents)").in("status", ["final", "sent"]),
    supabase.from("owners").select("id, contact:contacts!inner(first_name, last_name, company_name)"),
    supabase.from("properties").select("id, name, owner_id"),
  ]);

  const rows = monthStats.data ?? [];
  const totals = sumMonths(rows);
  const chart = byMonth(yearStats.data ?? []).map(({ month: m, totals: t }) => ({ month: m, total: t.base, part: t.commission }));
  const expenseTotal = (expenses ?? []).reduce((s, e) => s + e.amount_cents, 0);
  const expenseRebill = (expenses ?? []).filter((e) => e.rebill_to_owner).reduce((s, e) => s + e.amount_cents, 0);
  const invoiced = (statements ?? []).filter((s) => s.status !== "draft").reduce((s, st) => s + st.total_due_cents, 0);
  const collected = (statements ?? []).reduce((s, st) => s + st.payments.reduce((a, p) => a + p.amount_cents, 0), 0);
  const outstanding = (open ?? []).reduce((s, st) => s + st.total_due_cents - st.payments.reduce((a, p) => a + p.amount_cents, 0), 0);

  const ownerName = new Map((owners ?? []).map((o) => [o.id, displayName(o.contact)]));
  const propertyName = new Map((properties ?? []).map((p) => [p.id, p.name]));
  const perOwner = [...new Set(rows.map((r) => r.owner_id))].map((ownerId) => {
    const t = sumMonths(rows.filter((r) => r.owner_id === ownerId));
    const statement = (statements ?? []).find((s) => s.owner_id === ownerId);
    return { ownerId, t, statement };
  }).filter((row) => row.t.nightsAmount > 0 || row.statement);
  const perProperty = [...new Set(rows.map((r) => r.property_id))]
    .map((propertyId) => ({ propertyId, t: sumMonths(rows.filter((r) => r.property_id === propertyId)) }))
    .filter((row) => row.t.nightsAmount > 0);
  const m = month.slice(0, 7);

  return (
    <>
      <PageHeader
        title="Finances"
        description="Revenus des propriétaires, commissions, frais et facturation. Montants TTC en euros, calculés à partir des réservations et dépenses enregistrées."
        actions={<MonthSwitcher month={month} hrefFor={(value) => `/admin/finances?mois=${value.slice(0, 7)}`} />}
      />

      <section aria-labelledby="activite" className="flex flex-col gap-3">
        <h2 id="activite" className="flex items-center gap-2 font-display text-[1.25rem] font-medium text-maison [font-stretch:92%]">
          Activité de {formatMonth(month)} {totals.hasDemo ? <DemoBadge /> : null}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Prix des nuitées" value={formatCentsRounded(totals.nightsAmount)} hint="Réparti par nuit sur le mois" />
          <StatCard label="Frais des plateformes" value={formatCentsRounded(totals.platformFee)} />
          <StatCard label="Revenus perçus par les propriétaires" value={formatCentsRounded(totals.base)} hint="Base de la commission" />
          <StatCard label="Commissions (TTC)" value={formatCentsRounded(totals.commission)} hint={`Part des propriétaires : ${formatCentsRounded(totals.ownerNet)}`} />
        </div>
      </section>

      <section aria-labelledby="facturation" className="flex flex-col gap-3">
        <h2 id="facturation" className="font-display text-[1.25rem] font-medium text-maison [font-stretch:92%]">
          Facturation et dépenses
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label={`Facturé (relevés de ${formatMonth(month)})`} value={formatCentsRounded(invoiced)} hint={`${(statements ?? []).filter((s) => s.status !== "draft").length} relevé(s) finalisé(s)`} href={`/admin/releves`} />
          <StatCard label="Encaissé sur ces relevés" value={formatCentsRounded(collected)} />
          <StatCard label="Reste à encaisser (tous mois)" value={formatCentsRounded(outstanding)} hint="Relevés finalisés ou envoyés, non réglés" href="/admin/releves?statut=sent" />
          <StatCard label="Dépenses du mois" value={formatCentsRounded(expenseTotal)} hint={`Dont ${formatCentsRounded(expenseRebill)} à refacturer`} href={`/admin/depenses?mois=${m}`} />
        </div>
      </section>

      <Panel title="Exports pour la comptabilité" id="exports" description="Fichiers CSV (séparateur point-virgule), ouvrables dans Excel ou LibreOffice.">
        <div className="flex flex-wrap gap-2">
          {[
            ["reservations", "Réservations (départs du mois)"],
            ["depenses", "Dépenses du mois"],
            ["releves", "Relevés finalisés du mois"],
          ].map(([kind, label]) => (
            <a key={kind} href={`/api/export/${kind}?mois=${m}`} className={buttonClasses("ghost", undefined, "sm")}>
              <Download aria-hidden="true" className="size-4" />
              {label}
            </a>
          ))}
        </div>
      </Panel>

      <Panel title="Par propriétaire" id="proprietaires">
        <DataTable
          caption={`Revenus et commissions par propriétaire en ${formatMonth(month)}`}
          rows={perOwner}
          rowKey={(row) => row.ownerId}
          empty={<EmptyState title="Aucune activité ce mois-ci." />}
          columns={[
            { header: "Propriétaire", cell: (row) => <TextLink href={`/admin/proprietaires/${row.ownerId}`}>{ownerName.get(row.ownerId) ?? "—"}</TextLink> },
            { header: "Nuits", numeric: true, cell: (row) => row.t.bookedNights },
            { header: "Revenus perçus", numeric: true, cell: (row) => formatCents(row.t.base) },
            { header: "Commission", numeric: true, cell: (row) => formatCents(row.t.commission) },
            {
              header: "Relevé du mois",
              cell: (row) => (row.statement ? <TextLink href={`/admin/releves/${row.statement.id}`}>{row.statement.status === "draft" ? "Brouillon" : "Finalisé"}</TextLink> : "—"),
            },
          ]}
        />
      </Panel>

      <Panel title="Par bien" id="biens">
        <DataTable
          caption={`Revenus par bien en ${formatMonth(month)}`}
          rows={perProperty}
          rowKey={(row) => row.propertyId}
          empty={<EmptyState title="Aucune activité ce mois-ci." />}
          columns={[
            { header: "Bien", cell: (row) => <TextLink href={`/admin/biens/${row.propertyId}`}>{propertyName.get(row.propertyId) ?? "—"}</TextLink> },
            { header: "Nuits", numeric: true, cell: (row) => row.t.bookedNights },
            { header: "Nuitées", numeric: true, cell: (row) => formatCents(row.t.nightsAmount) },
            { header: "Frais plateformes", numeric: true, cell: (row) => formatCents(row.t.platformFee) },
            { header: "Revenus perçus", numeric: true, cell: (row) => formatCents(row.t.base) },
            { header: "Commission", numeric: true, cell: (row) => formatCents(row.t.commission) },
          ]}
        />
      </Panel>

      <Panel title="Douze derniers mois" id="evolution">
        {chart.every((row) => row.total === 0) ? (
          <EmptyState title="Pas encore de données." />
        ) : (
          <MonthBars rows={chart} totalLabel="Revenus perçus" partLabel="Commissions" format={formatCentsRounded} caption="Revenus perçus et commissions sur douze mois" />
        )}
      </Panel>
    </>
  );
}
