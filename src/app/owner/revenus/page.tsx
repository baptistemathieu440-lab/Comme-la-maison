import { MonthBars } from "@/components/app/charts";
import { OwnerNotLinked } from "@/components/app/OwnerNotLinked";
import { DataTable, EmptyState, Notice, PageHeader, Panel, StatCard } from "@/components/app/ui";
import { site } from "@/content/site";
import { ownerContext } from "@/lib/auth/admin-context";
import { addMonths, formatMonth, startOfMonth, todayIso } from "@/lib/dates";
import { formatCents, formatCentsRounded } from "@/lib/money";
import { byMonth, formatRatio, occupancy, sumMonths } from "@/lib/stats";

export const metadata = { title: "Revenus" };

export default async function OwnerRevenue() {
  const { supabase, owner } = await ownerContext();
  if (!owner) return <OwnerNotLinked />;
  const month = startOfMonth(todayIso());
  const from = addMonths(month, -11);
  const [{ data: stats }, { data: properties }] = await Promise.all([
    supabase.rpc("stats_property_months", { p_from: from, p_to: month }),
    supabase.from("properties").select("id, name"),
  ]);
  const rows = stats ?? [];
  const months = byMonth(rows);
  const year = sumMonths(rows);
  const name = new Map((properties ?? []).map((p) => [p.id, p.name]));

  return (
    <>
      <PageHeader title="Revenus" description={`Les douze derniers mois, de ${formatMonth(from)} à ${formatMonth(month)}.`} />
      <Notice tone="info" title="Comment se calcule notre commission">
        {site.commission.baseDetail} {site.commission.payment} Exemple : pour 300 € de nuitées sur une plateforme qui prélève 45 € de
        frais, vous percevez 255 € ; notre commission est de 51 € (20 % TTC de 255 €) et il vous reste 204 €.
      </Notice>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Prix des nuitées (12 mois)" value={formatCentsRounded(year.nightsAmount)} />
        <StatCard label="Revenus perçus (12 mois)" value={formatCentsRounded(year.base)} hint={`Après ${formatCentsRounded(year.platformFee)} de frais de plateformes`} />
        <StatCard label="Après commission (12 mois)" value={formatCentsRounded(year.ownerNet)} hint={`Commission : ${formatCentsRounded(year.commission)}`} />
        <StatCard label="Occupation (12 mois)" value={formatRatio(occupancy(year))} />
      </div>
      <Panel title="Évolution" id="evolution">
        {months.every((m) => m.totals.base === 0) ? (
          <EmptyState title="Pas encore de revenus enregistrés." />
        ) : (
          <MonthBars
            rows={months.map((m) => ({ month: m.month, total: m.totals.base, part: m.totals.commission }))}
            totalLabel="Revenus perçus"
            partLabel="Commission"
            format={formatCentsRounded}
            caption="Vos revenus perçus et notre commission, mois par mois"
          />
        )}
      </Panel>
      <Panel title="Par mois" id="mois">
        <DataTable
          caption="Revenus par mois"
          rows={[...months].reverse()}
          rowKey={(row) => row.month}
          columns={[
            { header: "Mois", cell: (row) => <span className="capitalize">{formatMonth(row.month)}</span> },
            { header: "Nuits louées", numeric: true, cell: (row) => row.totals.bookedNights + row.totals.importedNights },
            { header: "Occupation", numeric: true, cell: (row) => formatRatio(occupancy(row.totals)) },
            { header: "Perçu", numeric: true, cell: (row) => formatCents(row.totals.base) },
            { header: "Commission", numeric: true, cell: (row) => formatCents(row.totals.commission) },
            { header: "Pour vous", numeric: true, cell: (row) => <strong>{formatCents(row.totals.ownerNet)}</strong> },
          ]}
        />
      </Panel>
      <Panel title="Par logement (12 mois)" id="logements">
        <DataTable
          caption="Revenus par logement"
          rows={[...new Set(rows.map((r) => r.property_id))].map((id) => ({ id, t: sumMonths(rows.filter((r) => r.property_id === id)) }))}
          rowKey={(row) => row.id}
          columns={[
            { header: "Logement", cell: (row) => name.get(row.id) ?? "—" },
            { header: "Occupation", numeric: true, cell: (row) => formatRatio(occupancy(row.t)) },
            { header: "Perçu", numeric: true, cell: (row) => formatCents(row.t.base) },
            { header: "Pour vous", numeric: true, cell: (row) => <strong>{formatCents(row.t.ownerNet)}</strong> },
          ]}
        />
      </Panel>
      <p className="text-small text-ink-soft">
        Nature : données réelles enregistrées dans la plateforme à partir des relevés des plateformes, réparties par nuit. Les dépenses
        refacturées apparaissent dans vos relevés mensuels.
      </p>
    </>
  );
}
