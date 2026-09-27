import { formatMonth, parseIsoDate } from "@/lib/dates";

const shortMonth = new Intl.DateTimeFormat("fr-FR", { month: "short", timeZone: "UTC" });

/**
 * Barres mensuelles : la barre entière (olive) est le total, la partie hachurée
 * foncée la part mise en avant (par exemple la commission). Un tableau
 * équivalent est fourni aux lecteurs d'écran.
 */
export function MonthBars({
  rows,
  totalLabel,
  partLabel,
  format,
  caption,
}: {
  rows: Array<{ month: string; total: number; part: number }>;
  totalLabel: string;
  partLabel: string;
  format: (value: number) => string;
  caption: string;
}) {
  const max = Math.max(1, ...rows.map((row) => row.total));
  const width = 720;
  const height = 220;
  const pad = { top: 16, bottom: 34, left: 8, right: 8 };
  const slot = (width - pad.left - pad.right) / Math.max(rows.length, 1);
  const barWidth = Math.min(38, slot * 0.62);
  const scale = (value: number) => ((height - pad.top - pad.bottom) * value) / max;

  return (
    <figure className="flex flex-col gap-3">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={caption}>
        <defs>
          <pattern id="part-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="var(--color-maison)" />
            <rect width="2" height="6" fill="var(--color-olive-deep)" />
          </pattern>
        </defs>
        <line
          x1={pad.left}
          x2={width - pad.right}
          y1={height - pad.bottom}
          y2={height - pad.bottom}
          stroke="var(--color-line-strong)"
          strokeWidth="1"
        />
        {rows.map((row, index) => {
          const x = pad.left + index * slot + (slot - barWidth) / 2;
          const totalHeight = scale(row.total);
          const partHeight = scale(Math.min(row.part, row.total));
          const baseY = height - pad.bottom;
          const label = shortMonth.format(parseIsoDate(row.month));
          return (
            <g key={row.month}>
              <rect x={x} y={baseY - totalHeight} width={barWidth} height={totalHeight} rx="4" fill="var(--color-olive)" />
              <rect x={x} y={baseY - partHeight} width={barWidth} height={partHeight} rx="4" fill="url(#part-hatch)" />
              <text x={x + barWidth / 2} y={height - 12} textAnchor="middle" fontSize="12" fill="var(--color-ink-soft)">
                {label}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="flex flex-wrap gap-x-5 gap-y-1 text-small text-ink-soft">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="size-3 rounded-sm bg-olive" />
          {totalLabel}
        </span>
        <span className="inline-flex items-center gap-2">
          <svg aria-hidden="true" className="size-3 rounded-sm" viewBox="0 0 6 6">
            <rect width="6" height="6" fill="var(--color-maison)" />
            <rect width="2" height="6" fill="var(--color-olive-deep)" transform="rotate(45 3 3)" />
          </svg>
          {partLabel} (hachuré)
        </span>
      </figcaption>
      <table className="sr-only">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Mois</th>
            <th scope="col">{totalLabel}</th>
            <th scope="col">{partLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.month}>
              <th scope="row">{formatMonth(row.month)}</th>
              <td>{format(row.total)}</td>
              <td>{format(row.part)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/** Jauge horizontale avec valeur écrite (jamais la couleur seule). */
export function Meter({ value, max, label }: { value: number; max: number; label: string }) {
  const ratio = max > 0 ? Math.min(1, value / max) : 0;
  return (
    <div className="flex flex-col gap-1">
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
        className="h-2.5 overflow-hidden rounded-full bg-stone"
      >
        <div className="h-full rounded-full bg-maison" style={{ width: `${ratio * 100}%` }} />
      </div>
    </div>
  );
}
