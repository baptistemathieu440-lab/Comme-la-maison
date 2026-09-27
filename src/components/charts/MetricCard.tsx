import { DataBadge } from "@/components/ui/DataBadge";
import { isPublishable, type Metric } from "@/content/metrics";

import { EmptyChart, MetricChart } from "./MetricChart";
import { formatValue } from "./scale";

/**
 * Carte d'un indicateur. Tant qu'une série n'a pas de points, de source ET de
 * période, elle reste en état « Données à venir » : aucun chiffre n'est affiché.
 */
export function MetricCard({ metric }: { metric: Metric }) {
  const published = isPublishable(metric);
  const last = metric.points[metric.points.length - 1];

  return (
    <article
      aria-labelledby={`${metric.id}-title`}
      className="flex flex-col gap-5 rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-7"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <h3 id={`${metric.id}-title`} className="text-h3 text-maison">
          {metric.title}
        </h3>
        <DataBadge nature={metric.nature} />
      </header>

      {published ? (
        <>
          {metric.chart === "value" ? (
            <p className="font-display text-[3.25rem] font-medium leading-none tracking-[-0.02em] text-maison [font-stretch:92%]">
              {formatValue(last.value, metric.unit)}
            </p>
          ) : (
            <MetricChart metric={metric} />
          )}

          {metric.chart !== "value" ? (
            <details className="text-small">
              <summary className="inline-flex min-h-10 cursor-pointer items-center font-semibold text-maison underline underline-offset-4">
                Voir les données
              </summary>
              <table className="mt-3 w-full border-collapse text-left">
                <caption className="sr-only">{metric.title}</caption>
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="py-2 font-semibold">Période</th>
                    <th scope="col" className="py-2 text-right font-semibold">Valeur</th>
                  </tr>
                </thead>
                <tbody>
                  {metric.points.map((p) => (
                    <tr key={p.label} className="border-b border-line/60">
                      <th scope="row" className="py-2 font-normal">{p.label}</th>
                      <td className="py-2 text-right tabular-nums">{formatValue(p.value, metric.unit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          ) : null}
        </>
      ) : (
        <div className="relative">
          <EmptyChart />
          <p className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-cream px-4 py-2 text-small font-medium text-ink-soft">
              Données à venir
            </span>
          </p>
        </div>
      )}

      <dl className="mt-auto grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-t border-line pt-4 text-small">
        <dt className="text-ink-soft">Source</dt>
        <dd>{published ? metric.source : "Publiée avec les premières données"}</dd>
        <dt className="text-ink-soft">Période</dt>
        <dd>{published ? metric.period : "À venir"}</dd>
        {published && metric.updatedAt ? (
          <>
            <dt className="text-ink-soft">Mise à jour</dt>
            <dd>{metric.updatedAt}</dd>
          </>
        ) : null}
      </dl>
    </article>
  );
}
