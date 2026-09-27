import { MonthSwitcher, readMonth } from "@/components/app/MonthSwitcher";
import { OwnerNotLinked } from "@/components/app/OwnerNotLinked";
import { Timeline, TimelineLegend, type TimelineItem } from "@/components/app/Timeline";
import { EmptyState, PageHeader } from "@/components/app/ui";
import { ownerContext } from "@/lib/auth/admin-context";
import { addMonths, daysInMonth, formatStay, todayIso } from "@/lib/dates";
import { blockKind, labelOf } from "@/lib/labels";

export const metadata = { title: "Calendrier" };

export default async function OwnerCalendar({ searchParams }: PageProps<"/owner/calendrier">) {
  const { supabase, owner } = await ownerContext();
  if (!owner) return <OwnerNotLinked />;
  const params = await searchParams;
  const today = todayIso();
  const month = readMonth(params.mois, today);
  const end = addMonths(month, 1);

  const [{ data: properties }, { data: bookings }, { data: blocks }] = await Promise.all([
    supabase.from("properties").select("id, name").order("name"),
    supabase
      .from("owner_bookings")
      .select("id, property_id, check_in, check_out, guest_first_name, platform_name, status, is_demo")
      .in("status", ["confirmed", "in_progress", "completed"])
      .lt("check_in", end)
      .gt("check_out", month),
    supabase.from("calendar_blocks").select("id, property_id, start_date, end_date, kind, booking_id").is("booking_id", null).lt("start_date", end).gt("end_date", month),
  ]);

  const items: TimelineItem[] = [
    ...(bookings ?? []).map((b) => ({
      id: b.id ?? "",
      propertyId: b.property_id ?? "",
      start: b.check_in ?? "",
      end: b.check_out ?? "",
      label: b.guest_first_name ?? "Réservé",
      detail: b.platform_name ?? "",
      kind: "booking" as const,
      isDemo: b.is_demo ?? false,
    })),
    ...(blocks ?? []).map((block) => ({
      id: block.id,
      propertyId: block.property_id,
      start: block.start_date,
      end: block.end_date,
      label: labelOf(blockKind, block.kind).label,
      detail: "",
      kind: block.kind as TimelineItem["kind"],
    })),
  ];

  return (
    <>
      <PageHeader
        title="Calendrier"
        description="Séjours et dates bloquées de vos logements. Pour réserver des dates pour vous, contactez Baptiste ou Simon."
        actions={<MonthSwitcher month={month} hrefFor={(m) => `/owner/calendrier?mois=${m.slice(0, 7)}`} />}
      />
      {(properties ?? []).length === 0 ? (
        <EmptyState title="Aucun logement." />
      ) : (
        <>
          <Timeline
            from={month}
            days={daysInMonth(month)}
            rows={(properties ?? []).map((p) => ({ id: p.id, name: p.name, href: `/owner/biens/${p.id}` }))}
            items={items}
            today={today}
          />
          <TimelineLegend />
          <details className="rounded-[var(--radius-card)] border border-line bg-surface p-4">
            <summary className="cursor-pointer font-semibold text-maison">Liste des séjours du mois ({items.length})</summary>
            <ul className="mt-3 flex flex-col gap-1.5 text-[0.9375rem]">
              {items.map((item) => (
                <li key={item.id}>
                  {properties?.find((p) => p.id === item.propertyId)?.name} · {formatStay(item.start, item.end)} · {item.label}
                </li>
              ))}
            </ul>
          </details>
        </>
      )}
    </>
  );
}
