import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Timeline, TimelineLegend, type TimelineItem } from "@/components/app/Timeline";
import { DemoBadge, EmptyState, PageHeader, Panel, StatusBadge, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { cn } from "@/lib/cn";
import {
  addDays,
  addMonths,
  daysInMonth,
  formatDate,
  formatMonth,
  formatStay,
  formatWeekday,
  isIsoDate,
  parseIsoDate,
  startOfMonth,
  todayIso,
} from "@/lib/dates";
import { blockKind, labelOf, taskStatus, taskType, textOf } from "@/lib/labels";
import { displayName } from "@/lib/people";
import { formatRatio, occupancy, sumMonths } from "@/lib/stats";

export const metadata = { title: "Calendrier" };

type View = "jour" | "semaine" | "mois" | "annee";

const platformShort: Record<string, string> = { airbnb: "Airbnb", booking: "Booking", abritel: "Abritel", direct: "Direct", other: "Autre" };

function mondayOf(iso: string) {
  const day = parseIsoDate(iso).getUTCDay();
  return addDays(iso, day === 0 ? -6 : 1 - day);
}

export default async function CalendarPage({ searchParams }: PageProps<"/admin/calendrier">) {
  const { supabase } = await adminContext();
  const params = await searchParams;
  const today = todayIso();
  const view: View = (["jour", "semaine", "mois", "annee"] as const).find((v) => v === params.vue) ?? "mois";
  const anchor = isIsoDate(params.date) ? params.date : today;
  const propertyFilter = typeof params.bien === "string" ? params.bien : "";

  const from = view === "jour" ? anchor : view === "semaine" ? mondayOf(anchor) : view === "mois" ? startOfMonth(anchor) : `${anchor.slice(0, 4)}-01-01`;
  const days = view === "jour" ? 1 : view === "semaine" ? 7 : view === "mois" ? daysInMonth(anchor) : 365;
  const to = view === "annee" ? `${Number(anchor.slice(0, 4)) + 1}-01-01` : addDays(from, days);
  const previous = view === "jour" ? addDays(anchor, -1) : view === "semaine" ? addDays(from, -7) : view === "mois" ? addMonths(from, -1) : `${Number(anchor.slice(0, 4)) - 1}-01-01`;
  const next = view === "jour" ? addDays(anchor, 1) : view === "semaine" ? addDays(from, 7) : view === "mois" ? addMonths(from, 1) : `${Number(anchor.slice(0, 4)) + 1}-01-01`;
  const title =
    view === "jour" ? formatWeekday(anchor) : view === "semaine" ? `Semaine du ${formatDate(from)}` : view === "mois" ? formatMonth(from) : anchor.slice(0, 4);

  const href = (changes: Record<string, string>) => {
    const search = new URLSearchParams({ vue: view, date: anchor, ...(propertyFilter ? { bien: propertyFilter } : {}), ...changes });
    return `/admin/calendrier?${search}`;
  };

  let propertiesQuery = supabase.from("properties").select("id, name, status, is_demo").neq("status", "inactive").order("name");
  if (propertyFilter) propertiesQuery = propertiesQuery.eq("id", propertyFilter);
  const { data: properties } = await propertiesQuery;
  const ids = (properties ?? []).map((p) => p.id);

  const [bookingsResult, blocksResult, tasksResult, statsResult] = await Promise.all([
    supabase
      .from("bookings")
      .select("id, reference, property_id, check_in, check_out, status, platform_id, adults, children, is_demo, guest:guests(contact:contacts(first_name, last_name))")
      .in("property_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"])
      .in("status", ["inquiry", "confirmed", "in_progress", "completed"])
      .lt("check_in", to)
      .gt("check_out", from),
    supabase
      .from("calendar_blocks")
      .select("id, property_id, start_date, end_date, kind, summary, booking_id, is_demo")
      .in("property_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"])
      .is("booking_id", null)
      .lt("start_date", to)
      .gt("end_date", from),
    view === "jour"
      ? supabase
          .from("tasks")
          .select("id, type, status, title, property_id, assignee:profiles!tasks_assignee_id_fkey(full_name)")
          .eq("due_date", anchor)
          .neq("status", "cancelled")
      : Promise.resolve({ data: [] as never[] }),
    view === "annee"
      ? supabase.rpc("stats_property_months", { p_from: from, p_to: `${anchor.slice(0, 4)}-12-01` })
      : Promise.resolve({ data: [] as never[] }),
  ]);

  const items: TimelineItem[] = [
    ...(bookingsResult.data ?? []).map((b) => ({
      id: b.id,
      propertyId: b.property_id,
      start: b.check_in,
      end: b.check_out,
      label: displayName(b.guest?.contact) === "—" ? b.reference : displayName(b.guest?.contact),
      detail: `${platformShort[b.platform_id] ?? b.platform_id}${b.status === "inquiry" ? " · demande" : ""}`,
      kind: (b.status === "inquiry" ? "inquiry" : "booking") as TimelineItem["kind"],
      href: `/admin/reservations/${b.id}`,
      isDemo: b.is_demo,
    })),
    ...(blocksResult.data ?? []).map((block) => ({
      id: block.id,
      propertyId: block.property_id,
      start: block.start_date,
      end: block.end_date,
      label: labelOf(blockKind, block.kind).label,
      detail: block.summary ?? "",
      kind: block.kind as TimelineItem["kind"],
      href: block.kind === "platform_reservation" ? `/admin/reservations/nouvelle?bloc=${block.id}` : undefined,
      isDemo: block.is_demo,
    })),
  ];

  const rows = (properties ?? []).map((p) => ({ id: p.id, name: p.name, href: `/admin/biens/${p.id}` }));
  const propertyName = new Map((properties ?? []).map((p) => [p.id, p.name]));

  return (
    <>
      <PageHeader
        title="Calendrier"
        description="Réservations saisies, réservations importées des plateformes (iCal) et blocages, pour tous les biens."
        actions={<ButtonLink href="/admin/reservations/nouvelle" size="sm">Nouvelle réservation</ButtonLink>}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Vue du calendrier" className="inline-flex rounded-full border border-line bg-surface p-1">
          {(["jour", "semaine", "mois", "annee"] as const).map((v) => (
            <Link
              key={v}
              href={href({ vue: v })}
              aria-current={view === v ? "page" : undefined}
              className={cn(
                "inline-flex min-h-10 items-center rounded-full px-4 text-[0.9375rem] font-semibold",
                view === v ? "bg-maison text-cream" : "text-ink hover:bg-olive-light",
              )}
            >
              {{ jour: "Jour", semaine: "Semaine", mois: "Mois", annee: "Année" }[v]}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-1">
          <Link href={href({ date: previous })} className="grid size-10 place-items-center rounded-full text-maison hover:bg-olive-light">
            <ChevronLeft aria-hidden="true" className="size-5" />
            <span className="sr-only">Période précédente</span>
          </Link>
          <span className="min-w-44 px-2 text-center font-semibold capitalize text-maison">{title}</span>
          <Link href={href({ date: next })} className="grid size-10 place-items-center rounded-full text-maison hover:bg-olive-light">
            <ChevronRight aria-hidden="true" className="size-5" />
            <span className="sr-only">Période suivante</span>
          </Link>
          <Link href={href({ date: today })} className="ml-1 rounded-full px-3 py-2 text-small font-semibold text-maison hover:bg-olive-light">
            Aujourd’hui
          </Link>
        </div>
        <form method="get" className="flex items-center gap-2">
          <input type="hidden" name="vue" value={view} />
          <input type="hidden" name="date" value={anchor} />
          <label htmlFor="cal-bien" className="text-small font-semibold text-ink-soft">
            Bien
          </label>
          <select
            id="cal-bien"
            name="bien"
            defaultValue={propertyFilter}
            className="min-h-10 rounded-full border-[1.5px] border-line-strong bg-white px-3 text-[0.9375rem]"
          >
            <option value="">Tous les biens</option>
            {(await supabase.from("properties").select("id, name").order("name")).data?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button type="submit" className="min-h-10 rounded-full bg-olive px-4 text-[0.9375rem] font-semibold text-ink">
            Afficher
          </button>
        </form>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="Aucun bien à afficher." />
      ) : view === "jour" ? (
        <DayAgenda
          date={anchor}
          bookings={bookingsResult.data ?? []}
          tasks={tasksResult.data ?? []}
          propertyName={propertyName}
        />
      ) : view === "annee" ? (
        <YearTable year={anchor.slice(0, 4)} properties={properties ?? []} stats={statsResult.data ?? []} href={href} />
      ) : (
        <>
          <Timeline from={from} days={days} rows={rows} items={items} today={today} />
          <TimelineLegend />
          <details className="rounded-[var(--radius-card)] border border-line bg-surface p-4">
            <summary className="cursor-pointer font-semibold text-maison">Liste des séjours de la période ({items.length})</summary>
            <ul className="mt-3 flex flex-col gap-1.5 text-[0.9375rem]">
              {items
                .sort((a, b) => a.start.localeCompare(b.start))
                .map((item) => (
                  <li key={item.id}>
                    {item.href ? <TextLink href={item.href}>{propertyName.get(item.propertyId)}</TextLink> : propertyName.get(item.propertyId)} ·{" "}
                    {formatStay(item.start, item.end)} · {item.label} {item.detail ? `(${item.detail})` : ""} {item.isDemo ? <DemoBadge /> : null}
                  </li>
                ))}
            </ul>
          </details>
        </>
      )}
    </>
  );
}

function DayAgenda({
  date,
  bookings,
  tasks,
  propertyName,
}: {
  date: string;
  bookings: Array<{ id: string; property_id: string; check_in: string; check_out: string; reference: string; adults: number; children: number; status: string; guest: { contact: { first_name: string; last_name: string } | null } | null }>;
  tasks: Array<{ id: string; type: string; status: string; title: string; property_id: string; assignee: { full_name: string } | null }>;
  propertyName: Map<string, string>;
}) {
  const arrivals = bookings.filter((b) => b.check_in === date && b.status !== "inquiry");
  const departures = bookings.filter((b) => b.check_out === date);
  const staying = bookings.filter((b) => b.check_in < date && b.check_out > date && b.status !== "inquiry");
  const section = (title: string, list: typeof bookings) => (
    <Panel title={`${title} (${list.length})`}>
      {list.length === 0 ? (
        <p className="text-small text-ink-soft">Aucun.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {list.map((b) => (
            <li key={b.id} className="flex flex-col">
              <TextLink href={`/admin/reservations/${b.id}`}>{propertyName.get(b.property_id)}</TextLink>
              <span className="text-small text-ink-soft">
                {displayName(b.guest?.contact)} · {b.adults + b.children} voyageur(s) · {formatStay(b.check_in, b.check_out)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {section("Arrivées", arrivals)}
      {section("Départs", departures)}
      {section("Séjours en cours", staying)}
      <Panel title={`Tâches (${tasks.length})`}>
        {tasks.length === 0 ? (
          <p className="text-small text-ink-soft">Aucune tâche.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {tasks.map((t) => (
              <li key={t.id} className="flex flex-wrap items-center justify-between gap-2">
                <span className="flex flex-col">
                  <TextLink href={`/admin/taches/${t.id}`}>
                    {textOf(taskType, t.type)} · {propertyName.get(t.property_id) ?? t.title}
                  </TextLink>
                  <span className="text-small text-ink-soft">{t.assignee?.full_name ?? "Non affectée"}</span>
                </span>
                <StatusBadge value={labelOf(taskStatus, t.status)} />
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function YearTable({
  year,
  properties,
  stats,
  href,
}: {
  year: string;
  properties: Array<{ id: string; name: string }>;
  stats: Array<Parameters<typeof sumMonths>[0][number]>;
  href: (changes: Record<string, string>) => string;
}) {
  const months = Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, "0")}-01`);
  const short = new Intl.DateTimeFormat("fr-FR", { month: "short", timeZone: "UTC" });
  return (
    <div className="overflow-x-auto rounded-[var(--radius-card)] border border-line bg-surface">
      <table className="w-full min-w-max border-collapse text-[0.875rem]">
        <caption className="sr-only">Taux d’occupation par bien et par mois en {year}</caption>
        <thead className="bg-stone/60">
          <tr>
            <th scope="col" className="px-3 py-2 text-left font-semibold text-ink-soft">
              Bien
            </th>
            {months.map((m) => (
              <th key={m} scope="col" className="px-2 py-2 font-semibold capitalize text-ink-soft">
                <Link href={href({ vue: "mois", date: m })} className="hover:underline">
                  {short.format(parseIsoDate(m))}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {properties.map((p) => (
            <tr key={p.id} className="border-t border-line">
              <th scope="row" className="px-3 py-2 text-left font-semibold text-maison">
                {p.name}
              </th>
              {months.map((m) => {
                const ratio = occupancy(sumMonths(stats.filter((s) => s.property_id === p.id && s.month === m)));
                return (
                  <td key={m} className="px-2 py-2 text-center tabular-nums">
                    <span
                      className="inline-block min-w-12 rounded-md px-1.5 py-1"
                      style={{ background: ratio ? `color-mix(in oklab, var(--color-olive) ${Math.round(ratio * 100)}%, var(--color-surface))` : undefined }}
                    >
                      {formatRatio(ratio)}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
