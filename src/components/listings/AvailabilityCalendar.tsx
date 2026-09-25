import { addDays, daysInMonth, formatDate, formatMonth, parseIsoDate } from "@/lib/dates";
import { cn } from "@/lib/cn";

const weekdays = [
  { short: "L", long: "lundi" },
  { short: "M", long: "mardi" },
  { short: "M", long: "mercredi" },
  { short: "J", long: "jeudi" },
  { short: "V", long: "vendredi" },
  { short: "S", long: "samedi" },
  { short: "D", long: "dimanche" },
];

/**
 * Disponibilités d'un logement, mois par mois. Une nuit indisponible est barrée
 * et annoncée comme telle (jamais la couleur seule).
 */
export function AvailabilityCalendar({ months, unavailable, today }: { months: string[]; unavailable: Set<string>; today: string }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {months.map((month) => {
          const length = daysInMonth(month);
          // Lundi = 0.
          const offset = (parseIsoDate(month).getUTCDay() + 6) % 7;
          const cells: Array<string | null> = [
            ...Array.from({ length: offset }, () => null),
            ...Array.from({ length }, (_, i) => addDays(month, i)),
          ];
          while (cells.length % 7 !== 0) cells.push(null);
          const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));

          return (
            <table key={month} className="w-full table-fixed border-separate border-spacing-1 text-center">
              <caption className="mb-2 text-left font-display text-[1.125rem] font-medium capitalize text-maison [font-stretch:92%]">
                {formatMonth(month)}
              </caption>
              <thead>
                <tr>
                  {weekdays.map((day) => (
                    <th key={day.long} scope="col" className="pb-1 text-[0.75rem] font-semibold text-ink-soft">
                      <abbr title={day.long} className="no-underline">
                        {day.short}
                      </abbr>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, index) => (
                  <tr key={index}>
                    {week.map((day, position) => {
                      if (!day) return <td key={position} />;
                      const past = day < today;
                      const taken = !past && unavailable.has(day);
                      return (
                        <td
                          key={day}
                          className={cn(
                            "h-9 rounded-md text-[0.875rem] tabular-nums",
                            past && "text-ink-soft",
                            taken && "bg-stone text-ink-soft line-through",
                            !past && !taken && "bg-olive-light font-semibold text-ink",
                          )}
                        >
                          <span aria-hidden="true">{Number(day.slice(8))}</span>
                          <span className="sr-only">
                            {formatDate(day)} : {past ? "passé" : taken ? "indisponible" : "disponible"}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          );
        })}
      </div>
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-small text-ink">
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="grid h-7 w-9 place-items-center rounded-md bg-olive-light font-semibold">
            12
          </span>
          Nuit disponible
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="grid h-7 w-9 place-items-center rounded-md bg-stone text-ink-soft line-through">
            12
          </span>
          Nuit indisponible
        </li>
      </ul>
    </div>
  );
}
