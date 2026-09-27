import Link from "next/link";
import { ArrowRight, LogIn, LogOut } from "lucide-react";

import { MonthBars } from "@/components/app/charts";
import { MonthSwitcher, readMonth } from "@/components/app/MonthSwitcher";
import { DemoBadge, EmptyState, PageHeader, Panel, StatCard, StatusBadge, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { addDays, addMonths, formatDayMonth, formatMonth, formatWeekday, todayIso } from "@/lib/dates";
import { bookingStatus, labelOf, taskStatus, taskType, textOf } from "@/lib/labels";
import { formatCents, formatCentsRounded } from "@/lib/money";
import { displayName } from "@/lib/people";
import { averageNightly, byMonth, formatRatio, occupancy, sumMonths } from "@/lib/stats";

export const metadata = { title: "Tableau de bord" };

export default async function AdminDashboard({ searchParams }: PageProps<"/admin">) {
  const { session, supabase } = await adminContext();
  const params = await searchParams;
  const today = todayIso();
  const month = readMonth(params.mois, today);
  const chartFrom = addMonths(month, -11);
  const weekEnd = addDays(today, 7);
  const year = Number(today.slice(0, 4));

  const [
    monthStats,
    chartStats,
    arrivals,
    departures,
    upcoming,
    todayTasks,
    toValidate,
    openIncidents,
    newProspects,
    followUps,
    syncErrors,
    drafts,
    residences,
  ] = await Promise.all([
    supabase.rpc("stats_property_months", { p_from: month, p_to: month }),
    supabase.rpc("stats_property_months", { p_from: chartFrom, p_to: month }),
    supabase
      .from("bookings")
      .select("id, reference, check_in, check_out, adults, children, status, is_demo, property:properties(name), guest:guests(contact:contacts(first_name, last_name))")
      .eq("check_in", today)
      .in("status", ["confirmed", "in_progress"]),
    supabase
      .from("bookings")
      .select("id, reference, check_in, check_out, adults, children, status, is_demo, property:properties(name), guest:guests(contact:contacts(first_name, last_name))")
      .eq("check_out", today)
      .in("status", ["confirmed", "in_progress", "completed"]),
    supabase
      .from("bookings")
      .select("id, reference, check_in, check_out, adults, children, status, is_demo, property:properties(name), guest:guests(contact:contacts(first_name, last_name))")
      .gt("check_in", today)
      .lte("check_in", weekEnd)
      .in("status", ["confirmed"])
      .order("check_in")
      .limit(8),
    supabase
      .from("tasks")
      .select("id, type, status, title, assignee_id, is_demo, property:properties(name), assignee:profiles!tasks_assignee_id_fkey(full_name)")
      .eq("due_date", today)
      .in("status", ["todo", "in_progress", "done"])
      .order("window_start", { nullsFirst: false }),
    supabase.from("tasks").select("id", { count: "exact", head: true }).eq("status", "done"),
    supabase.from("incidents").select("id", { count: "exact", head: true }).neq("status", "resolved"),
    supabase.from("prospects").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase
      .from("prospects")
      .select("id", { count: "exact", head: true })
      .lte("next_action_on", today)
      .not("status", "in", "(won,lost)"),
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("last_import_status", "error"),
    supabase
      .from("owner_statements")
      .select("id", { count: "exact", head: true })
      .eq("status", "draft")
      .lt("period_month", `${today.slice(0, 7)}-01`),
    supabase.rpc("primary_residence_usage", { p_year: year }),
  ]);

  const totals = sumMonths(monthStats.data ?? []);
  const chart = byMonth(chartStats.data ?? []).map(({ month: m, totals: t }) => ({ month: m, total: t.base, part: t.commission }));
  const firstName = session.fullName.split(" ")[0];
  const nearLimit = (residences.data ?? []).filter((row) => row.nights >= row.night_limit - 10);

  const alerts = [
    { count: toValidate.count ?? 0, label: "tâche(s) terminée(s) à valider", href: "/admin/taches?statut=done" },
    { count: openIncidents.count ?? 0, label: "incident(s) non résolu(s)", href: "/admin/incidents" },
    { count: newProspects.count ?? 0, label: "nouvelle(s) demande(s) d’estimation", href: "/admin/prospects?statut=new" },
    { count: followUps.count ?? 0, label: "prospect(s) à relancer aujourd’hui", href: "/admin/prospects?relance=1" },
    { count: syncErrors.count ?? 0, label: "calendrier(s) en erreur de synchronisation", href: "/admin/synchronisation" },
    { count: drafts.count ?? 0, label: "relevé(s) des mois passés encore en brouillon", href: "/admin/releves?statut=draft" },
    { count: nearLimit.length, label: "résidence(s) principale(s) proche(s) de la limite annuelle de nuits", href: "/admin/biens" },
  ].filter((alert) => alert.count > 0);

  const unassigned = (todayTasks.data ?? []).filter((task) => !task.assignee_id && task.status !== "done").length;

  return (
    <>
      <PageHeader
        eyebrow={formatWeekday(today)}
        title={firstName ? `Bonjour ${firstName}` : "Tableau de bord"}
        description="L’activité de Comme à la Maison, calculée à partir des réservations, tâches et dépenses enregistrées."
        actions={
          <MonthSwitcher month={month} hrefFor={(m) => `/admin?mois=${m.slice(0, 7)}`} />
        }
      />

      <section aria-labelledby="indicateurs" className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="indicateurs" className="font-display text-[1.25rem] font-medium text-maison [font-stretch:92%]">
            Indicateurs de {formatMonth(month)}
          </h2>
          {totals.hasDemo ? <DemoBadge /> : null}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="Revenus perçus par les propriétaires"
            value={formatCentsRounded(totals.base)}
            hint={`Nuitées ${formatCentsRounded(totals.nightsAmount)} − frais de plateforme ${formatCentsRounded(totals.platformFee)}`}
            href={`/admin/finances?mois=${month.slice(0, 7)}`}
          />
          <StatCard
            label="Commissions Comme à la Maison (TTC)"
            value={formatCentsRounded(totals.commission)}
            hint="20 % TTC des revenus perçus, sauf taux particulier"
            href={`/admin/finances?mois=${month.slice(0, 7)}`}
          />
          <StatCard
            label="Taux d’occupation"
            value={formatRatio(occupancy(totals))}
            hint={`${totals.bookedNights + totals.importedNights} nuits louées sur ${totals.days - totals.blockedNights} disponibles · ${totals.properties} bien(s)`}
          />
          <StatCard
            label="Prix moyen par nuit"
            value={averageNightly(totals) === null ? "—" : formatCents(averageNightly(totals))}
            hint="Réservations avec montants saisis"
          />
          <StatCard label="Nuits louées" value={totals.bookedNights + totals.importedNights} hint={totals.importedNights ? `dont ${totals.importedNights} importées par iCal, sans montant` : "Réparties par nuit sur le mois"} />
          <StatCard label="Part des propriétaires après commission" value={formatCentsRounded(totals.ownerNet)} hint="Avant dépenses refacturées" />
        </div>
        <p className="text-small text-ink-soft">
          Nature : données enregistrées dans la plateforme ; celles marquées « Démo » sont fictives. Répartition par
          nuit : un séjour à cheval sur deux mois compte pour chacun au prorata.
        </p>
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Aujourd’hui" className="xl:col-span-2" id="aujourdhui">
          <div className="grid gap-5 md:grid-cols-2">
            <MovementList title="Arrivées" icon="in" rows={arrivals.data ?? []} empty="Aucune arrivée aujourd’hui." />
            <MovementList title="Départs" icon="out" rows={departures.data ?? []} empty="Aucun départ aujourd’hui." />
          </div>
        </Panel>

        <Panel
          title="À surveiller"
          id="alertes"
          description={alerts.length === 0 ? undefined : "Chaque ligne mène à la liste concernée."}
        >
          {alerts.length === 0 ? (
            <p className="text-small text-ink-soft">Rien à signaler.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {alerts.map((alert) => (
                <li key={alert.href}>
                  <Link
                    href={alert.href}
                    className="flex items-center justify-between gap-3 rounded-xl border border-line bg-cream px-3 py-2.5 hover:border-maison/40"
                  >
                    <span className="text-[0.9375rem]">
                      <strong className="font-display text-[1.125rem] text-maison">{alert.count}</strong> {alert.label}
                    </span>
                    <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-maison" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel
          title="Tâches du jour"
          id="taches-jour"
          className="xl:col-span-1"
          actions={<TextLink href="/admin/taches" className="text-small">Toutes les tâches</TextLink>}
          description={unassigned > 0 ? `${unassigned} tâche(s) sans agent affecté.` : undefined}
        >
          {(todayTasks.data ?? []).length === 0 ? (
            <p className="text-small text-ink-soft">Aucune tâche prévue aujourd’hui.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {(todayTasks.data ?? []).map((task) => (
                <li key={task.id} className="flex flex-col gap-1 py-2.5 first:pt-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <TextLink href={`/admin/taches/${task.id}`}>{task.property?.name ?? task.title}</TextLink>
                    <StatusBadge value={labelOf(taskStatus, task.status)} />
                  </div>
                  <span className="text-small text-ink-soft">
                    {textOf(taskType, task.type)} · {task.assignee?.full_name || "Aucun agent affecté"}
                    {task.is_demo ? " · Démo" : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Arrivées des 7 prochains jours" id="a-venir" className="xl:col-span-2">
          {(upcoming.data ?? []).length === 0 ? (
            <EmptyState title="Aucune arrivée prévue dans les 7 jours." />
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {(upcoming.data ?? []).map((booking) => (
                <li key={booking.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 first:pt-0">
                  <div className="flex flex-col">
                    <TextLink href={`/admin/reservations/${booking.id}`}>{booking.property?.name}</TextLink>
                    <span className="text-small text-ink-soft">
                      {displayName(booking.guest?.contact)} · {booking.adults + booking.children} voyageur(s)
                    </span>
                  </div>
                  <span className="flex items-center gap-2 text-small font-semibold text-ink">
                    {booking.is_demo ? <DemoBadge /> : null}
                    {formatDayMonth(booking.check_in)} → {formatDayMonth(booking.check_out)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel
        title="Douze derniers mois"
        id="evolution"
        description="Revenus perçus par les propriétaires (après frais de plateforme) et commissions, répartis par nuit."
      >
        {chart.every((row) => row.total === 0) ? (
          <EmptyState title="Pas encore de réservation avec montants.">
            Les graphiques se rempliront au fil des réservations saisies ou synchronisées.
          </EmptyState>
        ) : (
          <MonthBars
            rows={chart}
            totalLabel="Revenus perçus"
            partLabel="Commissions"
            format={formatCentsRounded}
            caption={`Revenus perçus et commissions de ${formatMonth(chartFrom)} à ${formatMonth(month)}`}
          />
        )}
      </Panel>
    </>
  );
}

type Movement = {
  id: string;
  reference: string;
  adults: number;
  children: number;
  status: string;
  is_demo: boolean;
  property: { name: string } | null;
  guest: { contact: { first_name: string; last_name: string } | null } | null;
};

function MovementList({ title, rows, empty, icon }: { title: string; rows: Movement[]; empty: string; icon: "in" | "out" }) {
  const Icon = icon === "in" ? LogIn : LogOut;
  return (
    <div className="flex flex-col gap-3">
      <h3 className="flex items-center gap-2 font-semibold text-maison">
        <Icon aria-hidden="true" className="size-4" />
        {title} <span className="text-ink-soft">({rows.length})</span>
      </h3>
      {rows.length === 0 ? (
        <p className="text-small text-ink-soft">{empty}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((row) => (
            <li key={row.id} className="flex flex-col gap-1 rounded-xl border border-line bg-cream px-3 py-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <TextLink href={`/admin/reservations/${row.id}`}>{row.property?.name ?? row.reference}</TextLink>
                {row.is_demo ? <DemoBadge /> : <StatusBadge value={labelOf(bookingStatus, row.status)} />}
              </div>
              <span className="text-small text-ink-soft">
                {displayName(row.guest?.contact)} · {row.adults + row.children} voyageur(s)
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
