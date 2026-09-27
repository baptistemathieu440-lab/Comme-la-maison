import Link from "next/link";

import { addDays, diffDays, formatDateShort, parseIsoDate } from "@/lib/dates";
import { cn } from "@/lib/cn";

export type TimelineItem = {
  id: string;
  propertyId: string;
  start: string;
  end: string;
  label: string;
  detail: string;
  kind: "booking" | "inquiry" | "owner_stay" | "maintenance" | "blocked" | "platform_reservation";
  href?: string;
  isDemo?: boolean;
};

const styles: Record<TimelineItem["kind"], string> = {
  booking: "bg-maison text-cream",
  inquiry: "border-2 border-dashed border-maison bg-surface text-maison",
  owner_stay: "bg-olive-light text-maison border border-olive-deep",
  maintenance: "hatch text-ink border border-terra/50",
  blocked: "bg-stone text-ink border border-line-strong/40",
  platform_reservation: "bg-olive text-ink",
};

const weekday = new Intl.DateTimeFormat("fr-FR", { weekday: "narrow", timeZone: "UTC" });

/**
 * Frise : une ligne par bien, une colonne par jour. Chaque séjour est un lien
 * dont le texte décrit tout (bien, dates, voyageur) : la couleur n'est qu'un repère.
 */
export function Timeline({
  from,
  days,
  rows,
  items,
  today,
}: {
  from: string;
  days: number;
  rows: Array<{ id: string; name: string; href: string }>;
  items: TimelineItem[];
  today: string;
}) {
  const dates = Array.from({ length: days }, (_, index) => addDays(from, index));
  const to = addDays(from, days);
  const minCell = days > 14 ? "2.25rem" : "5.5rem";

  return (
    <div className="overflow-x-auto rounded-[var(--radius-card)] border border-line bg-surface">
      <div
        className="grid w-full text-[0.8125rem]"
        style={{
          gridTemplateColumns: `12rem repeat(${days}, minmax(${minCell}, 1fr))`,
          minWidth: `calc(12rem + ${days} * ${minCell})`,
        }}
      >
        <div className="sticky left-0 z-10 border-b border-r border-line bg-stone/80 px-3 py-2 font-semibold text-ink-soft">Bien</div>
        {dates.map((date) => {
          const d = parseIsoDate(date);
          const weekend = d.getUTCDay() === 0 || d.getUTCDay() === 6;
          return (
            <div
              key={date}
              className={cn(
                "flex flex-col items-center border-b border-line py-1.5 leading-tight",
                weekend && "bg-stone/50",
                date === today && "bg-olive-light font-semibold text-maison",
              )}
            >
              <span aria-hidden="true" className="text-[0.6875rem] uppercase text-ink-soft">
                {weekday.format(d)}
              </span>
              <span>{d.getUTCDate()}</span>
            </div>
          );
        })}

        {rows.map((row) => {
          const rowItems = items
            .filter((item) => item.propertyId === row.id && item.end > from && item.start < to)
            .sort((a, b) => a.start.localeCompare(b.start));
          // Répartit les séjours sur des lignes sans chevauchement (une seule ligne en général).
          const laneEnds: string[] = [];
          const lanes = rowItems.map((item) => {
            let lane = laneEnds.findIndex((end) => end <= item.start);
            if (lane === -1) {
              lane = laneEnds.length;
              laneEnds.push(item.end);
            } else {
              laneEnds[lane] = item.end;
            }
            return lane;
          });
          const laneCount = Math.max(1, laneEnds.length);
          return (
            <div key={row.id} className="contents">
              <div className="sticky left-0 z-10 flex items-center border-b border-r border-line bg-surface px-3 py-2">
                <Link href={row.href} className="line-clamp-2 font-semibold text-maison hover:underline">
                  {row.name}
                </Link>
              </div>
              <div
                className="relative grid border-b border-line py-1.5"
                style={{
                  gridColumn: `2 / span ${days}`,
                  gridTemplateColumns: `repeat(${days}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${laneCount}, minmax(1.9rem, auto))`,
                }}
              >
                {dates.map((date, index) => (
                  <span
                    key={date}
                    aria-hidden="true"
                    className={cn("border-r border-line/60", date === today && "bg-olive-light/60")}
                    style={{ gridColumn: `${index + 1}`, gridRow: "1 / -1" }}
                  />
                ))}
                {rowItems.map((item, position) => {
                  const lane = lanes[position];
                  const startIndex = Math.max(0, diffDays(from, item.start));
                  const endIndex = Math.min(days, diffDays(from, item.end));
                  const span = Math.max(1, endIndex - startIndex);
                  const description = `${row.name} : ${item.label}, du ${formatDateShort(item.start)} au ${formatDateShort(item.end)}. ${item.detail}${item.isDemo ? " (démo)" : ""}`;
                  const content = (
                    <span className="block truncate px-2 py-1 font-semibold">
                      {item.label}
                      <span className="font-normal opacity-85"> · {item.detail}</span>
                    </span>
                  );
                  const className = cn(
                    "relative z-[1] mx-0.5 min-w-0 self-center overflow-hidden rounded-lg",
                    styles[item.kind],
                    item.start < from && "rounded-l-none",
                    item.end > to && "rounded-r-none",
                  );
                  return item.href ? (
                    <Link
                      key={item.id}
                      href={item.href}
                      aria-label={description}
                      title={description}
                      className={cn(className, "hover:ring-2 hover:ring-maison/40")}
                      style={{ gridColumn: `${startIndex + 1} / span ${span}`, gridRow: `${lane + 1}` }}
                    >
                      {content}
                    </Link>
                  ) : (
                    <span
                      key={item.id}
                      title={description}
                      className={className}
                      style={{ gridColumn: `${startIndex + 1} / span ${span}`, gridRow: `${lane + 1}` }}
                    >
                      <span className="sr-only">{description}</span>
                      <span aria-hidden="true">{content}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TimelineLegend() {
  const entries: Array<[TimelineItem["kind"], string]> = [
    ["booking", "Réservation"],
    ["inquiry", "Demande (non confirmée)"],
    ["platform_reservation", "Réservation importée par iCal (sans montant)"],
    ["owner_stay", "Séjour du propriétaire"],
    ["maintenance", "Travaux"],
    ["blocked", "Dates bloquées"],
  ];
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-small text-ink-soft">
      {entries.map(([kind, label]) => (
        <li key={kind} className="flex items-center gap-2">
          <span aria-hidden="true" className={cn("inline-block h-3.5 w-7 rounded", styles[kind])} />
          {label}
        </li>
      ))}
    </ul>
  );
}
