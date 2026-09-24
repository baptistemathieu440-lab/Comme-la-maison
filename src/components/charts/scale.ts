import type { Metric } from "@/content/metrics";
import { formatEuro, formatNumber } from "@/lib/format";

/** Pas de graduation « rond » (1, 2, 2,5, 5 × 10^n) et maximum d'axe correspondant. */
export function niceScale(dataMax: number, target = 4) {
  if (dataMax <= 0) return { max: 1, step: 0.25 };
  const raw = dataMax / target;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
  return { max: Math.ceil(dataMax / step) * step, step };
}

export function ticks({ max, step }: { max: number; step: number }) {
  const out: number[] = [];
  for (let v = 0; v <= max + step / 1000; v += step) out.push(Math.round(v * 1000) / 1000);
  return out;
}

export function formatValue(value: number, unit: Metric["unit"]) {
  if (unit === "€") return formatEuro(value);
  if (unit === "%") return `${formatNumber(value)} %`;
  if (unit.startsWith("/")) return `${formatNumber(value)} ${unit}`;
  return `${formatNumber(value)} ${unit}`;
}

/** Version courte pour les graduations : 12 500 € → « 12,5 k€ ». */
export function formatTick(value: number, unit: Metric["unit"]) {
  if (unit === "€" && value >= 10_000) return `${formatNumber(value / 1000)} k€`;
  if (unit === "€") return `${formatNumber(value)} €`;
  if (unit === "%") return `${formatNumber(value)} %`;
  return formatNumber(value);
}
