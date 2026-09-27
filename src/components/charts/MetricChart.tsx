import type { Metric } from "@/content/metrics";

import { formatTick, formatValue, niceScale, ticks } from "./scale";

// Dimensions proches de la largeur affichée d'une carte, pour que 12 px restent 12 px.
const W = 360;
const H = 220;
const M = { top: 26, right: 12, bottom: 30, left: 52 };
const innerW = W - M.left - M.right;
const innerH = H - M.top - M.bottom;

/** Barre à extrémité arrondie (4 px), carrée sur la ligne de base. */
function barPath(x: number, y: number, w: number, h: number) {
  const r = Math.min(4, w / 2, h);
  return `M${x} ${y + h}V${y + r}Q${x} ${y} ${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h}Z`;
}

/**
 * Graphique d'une seule série, dessiné en SVG côté serveur (aucun JavaScript).
 * Le style suit la nature de la donnée : plein (réel), hachuré (simulation),
 * contour (estimation), pointillés (projection).
 */
export function MetricChart({ metric }: { metric: Metric }) {
  const { points, unit, nature } = metric;
  const scale = niceScale(Math.max(...points.map((p) => p.value)));
  const { max } = scale;
  const y = (v: number) => M.top + innerH - (v / max) * innerH;
  const band = innerW / points.length;
  const hatchId = `hatch-${metric.id}`;
  const last = points[points.length - 1];

  const fill =
    nature === "reel" ? "var(--color-maison)" : nature === "simulation" ? `url(#${hatchId})` : "var(--color-surface)";
  const stroke = nature === "estimation" || nature === "projection" ? "var(--color-maison)" : "none";
  const dash = nature === "projection" ? "3 4" : undefined;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby={`${metric.id}-chart-title`}
      className="h-auto w-full overflow-visible"
    >
      <title id={`${metric.id}-chart-title`}>
        {`${metric.title}, ${metric.period ?? ""}. Dernière valeur : ${formatValue(last.value, unit)}.`}
      </title>
      <defs>
        <pattern id={hatchId} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="var(--color-olive-light)" />
          <rect width="3" height="8" fill="var(--color-olive-deep)" />
        </pattern>
      </defs>

      {/* Grille discrète */}
      {ticks(scale).map((t) => (
        <g key={t}>
          <line x1={M.left} x2={W - M.right} y1={y(t)} y2={y(t)} stroke="var(--color-line)" strokeWidth={1} />
          <text x={M.left - 10} y={y(t)} dy="0.35em" textAnchor="end" fontSize="12" fill="var(--color-ink-soft)" style={{ fontVariantNumeric: "tabular-nums" }}>
            {formatTick(t, unit)}
          </text>
        </g>
      ))}

      {metric.chart === "bar"
        ? points.map((p, i) => {
            const w = Math.min(24, band * 0.6);
            const x = M.left + band * i + (band - w) / 2;
            const top = y(p.value);
            return (
              <path
                key={p.label}
                d={barPath(x, top, w, M.top + innerH - top)}
                fill={fill}
                stroke={stroke}
                strokeWidth={stroke === "none" ? 0 : 1.5}
                strokeDasharray={dash}
              >
                <title>{`${p.label} : ${formatValue(p.value, unit)}`}</title>
              </path>
            );
          })
        : null}

      {metric.chart === "line" ? (
        <>
          {nature === "reel" || nature === "simulation" ? (
            <path
              d={`M${M.left + band / 2} ${M.top + innerH}${points.map((p, i) => `L${M.left + band * i + band / 2} ${y(p.value)}`).join("")}L${M.left + band * (points.length - 1) + band / 2} ${M.top + innerH}Z`}
              fill={nature === "reel" ? "var(--color-maison)" : `url(#${hatchId})`}
              fillOpacity={nature === "reel" ? 0.1 : 0.5}
            />
          ) : null}
          <path
            d={points.map((p, i) => `${i === 0 ? "M" : "L"}${M.left + band * i + band / 2} ${y(p.value)}`).join("")}
            fill="none"
            stroke="var(--color-maison)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={nature === "estimation" ? "7 5" : dash}
          />
          {points.map((p, i) => (
            <circle
              key={p.label}
              cx={M.left + band * i + band / 2}
              cy={y(p.value)}
              r={i === points.length - 1 ? 5 : 8}
              fill={i === points.length - 1 ? "var(--color-maison)" : "transparent"}
              stroke={i === points.length - 1 ? "var(--color-surface)" : "none"}
              strokeWidth={2}
            >
              <title>{`${p.label} : ${formatValue(p.value, unit)}`}</title>
            </circle>
          ))}
        </>
      ) : null}

      {/* Libellés de l'axe horizontal */}
      {points.map((p, i) => (
        <text key={p.label} x={M.left + band * i + band / 2} y={H - 10} textAnchor="middle" fontSize="12" fill="var(--color-ink-soft)">
          {p.label}
        </text>
      ))}

      {/* Seule la dernière valeur est étiquetée ; le reste est dans l'info-bulle et le tableau. */}
      <text
        x={M.left + band * (points.length - 1) + band / 2}
        y={y(last.value) - 12}
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="var(--color-ink)"
      >
        {formatValue(last.value, unit)}
      </text>
    </svg>
  );
}

/** Graphique vide : les axes sont prêts, les données arriveront. */
export function EmptyChart() {
  return (
    <svg viewBox={`0 0 ${W} 150`} aria-hidden="true" className="h-auto w-full">
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={0} x2={W} y1={16 + i * 38} y2={16 + i * 38} stroke="var(--color-line)" strokeWidth={1} />
      ))}
      <line x1={0} x2={W} y1={130} y2={130} stroke="var(--color-line-strong)" strokeOpacity={0.5} strokeWidth={1} />
    </svg>
  );
}
