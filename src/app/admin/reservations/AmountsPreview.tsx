"use client";

import { useEffect, useRef, useState } from "react";

import { formatBps, formatCents, parseEuros, parsePercentToBps } from "@/lib/money";

/**
 * Aperçu en direct du calcul, identique à celui de la base :
 * base = nuitées − frais de plateforme ; commission = base × taux ; part propriétaire = base − commission.
 * Le montant enregistré est toujours recalculé par la base.
 */
export function AmountsPreview({ rates, fixedRate }: { rates: Record<string, number>; fixedRate?: number | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState({ property: "", nights: 0, fee: 0, cleaning: 0 });

  useEffect(() => {
    const form = ref.current?.closest("form");
    if (!form) return;
    const read = () => {
      const data = new FormData(form);
      const nights = parseEuros(String(data.get("nights_amount") ?? "")) ?? 0;
      const feeRaw = parseEuros(String(data.get("platform_fee") ?? ""));
      const feePercent = parsePercentToBps(String(data.get("platform_fee_percent") ?? ""));
      const fee = feeRaw ?? (feePercent !== null ? Math.round((nights * feePercent) / 10000) : 0);
      setValues({
        property: String(data.get("property_id") ?? ""),
        nights,
        fee,
        cleaning: parseEuros(String(data.get("cleaning_fee") ?? "")) ?? 0,
      });
    };
    read();
    form.addEventListener("input", read);
    form.addEventListener("change", read);
    return () => {
      form.removeEventListener("input", read);
      form.removeEventListener("change", read);
    };
  }, []);

  const rate = fixedRate ?? rates[values.property] ?? null;
  const base = Math.max(values.nights - values.fee, 0);
  const commission = rate === null ? null : Math.round((base * rate) / 10000);

  return (
    <div ref={ref} className="rounded-[var(--radius-field)] border border-line bg-cream p-4" aria-live="polite">
      <p className="mb-2 text-small font-semibold text-maison">Calcul (aperçu)</p>
      <dl className="grid gap-1 text-[0.9375rem] tabular-nums">
        <div className="flex justify-between gap-3">
          <dt>Prix des nuitées</dt>
          <dd>{formatCents(values.nights)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Frais de la plateforme</dt>
          <dd>− {formatCents(values.fee)}</dd>
        </div>
        <div className="flex justify-between gap-3 font-semibold">
          <dt>Revenus perçus (base)</dt>
          <dd>{formatCents(base)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Commission {rate === null ? "" : `(${formatBps(rate)} TTC)`}</dt>
          <dd>{commission === null ? "Choisissez le bien" : `− ${formatCents(commission)}`}</dd>
        </div>
        <div className="flex justify-between gap-3 font-semibold text-maison">
          <dt>Part du propriétaire</dt>
          <dd>{commission === null ? "—" : formatCents(base - commission)}</dd>
        </div>
        <div className="flex justify-between gap-3 text-ink-soft">
          <dt>Ménage (refacturé à l’identique)</dt>
          <dd>{formatCents(values.cleaning)}</dd>
        </div>
      </dl>
    </div>
  );
}
