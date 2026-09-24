"use client";

import { useEffect, useId, useRef, useState } from "react";

import { DataBadge } from "@/components/ui/DataBadge";
import { Eyebrow } from "@/components/ui/Section";
import { site } from "@/content/site";
import { formatEuro } from "@/lib/format";

const RATE = site.commission.rate / 100;

const limits = {
  price: { min: 1, max: 5000, sliderMax: 600, initial: 100 },
  nights: { min: 0, max: 31, sliderMax: 31, initial: 20 },
};

/** Fait défiler un nombre vers sa nouvelle valeur (désactivé si l'animation est réduite). */
function useAnimatedNumber(target: number, duration = 450) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = fromRef.current;
    if (reduce || from === target) {
      fromRef.current = target;
      const id = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(id);
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (target - from) * eased;
      fromRef.current = next;
      setValue(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return Math.round(value * 100) / 100;
}

function parse(raw: string) {
  const n = Number(raw.replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}

function NumberField({
  id,
  label,
  hint,
  unit,
  value,
  onChange,
  min,
  max,
  sliderMax,
  error,
}: {
  id: string;
  label: string;
  hint: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  min: number;
  max: number;
  sliderMax: number;
  error: string | null;
}) {
  const numeric = parse(value);
  const sliderValue = Number.isNaN(numeric) ? min : Math.min(Math.max(numeric, min), sliderMax);
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="font-semibold text-ink">
        {label}
      </label>
      <span id={hintId} className="-mt-2 text-small text-ink-soft">
        {hint}
      </span>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={error ? `${hintId} ${errorId}` : hintId}
          aria-invalid={error ? true : undefined}
          className="h-14 w-full rounded-[var(--radius-field)] border-[1.5px] border-line-strong bg-surface pl-4 pr-16 font-display text-[1.5rem] font-medium tabular-nums text-maison [font-stretch:92%] focus-visible:border-maison aria-invalid:border-2 aria-invalid:border-error"
        />
        <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-soft">
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={sliderMax}
        step={1}
        value={sliderValue}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`${label} (curseur)`}
        className="h-11 w-full cursor-pointer accent-maison"
      />
      {error ? (
        <p id={errorId} className="text-small font-medium text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Simulator() {
  const uid = useId();
  const [price, setPrice] = useState(String(limits.price.initial));
  const [nights, setNights] = useState(String(limits.nights.initial));
  const [announcement, setAnnouncement] = useState("");

  const p = parse(price);
  const n = parse(nights);
  const priceError =
    price.trim() === "" || Number.isNaN(p) || p < limits.price.min || p > limits.price.max
      ? `Indiquez un prix entre ${limits.price.min} € et ${formatEuro(limits.price.max)}.`
      : null;
  const nightsError =
    nights.trim() === "" || Number.isNaN(n) || n < limits.nights.min || n > limits.nights.max || !Number.isInteger(n)
      ? `Indiquez un nombre entier de nuits entre ${limits.nights.min} et ${limits.nights.max}.`
      : null;

  const valid = !priceError && !nightsError;
  const gross = valid ? p * n : 0;
  const commission = gross * RATE;
  const net = gross - commission;

  const shownGross = useAnimatedNumber(gross);
  const shownCommission = useAnimatedNumber(commission);
  const shownNet = useAnimatedNumber(net);

  // Annonce les résultats aux lecteurs d'écran une fois la saisie terminée.
  useEffect(() => {
    const id = window.setTimeout(() => {
      setAnnouncement(
        valid
          ? `Simulation : revenus locatifs bruts ${formatEuro(gross)}, commission ${formatEuro(commission)}, revenus après commission ${formatEuro(net)}.`
          : "Simulation impossible : vérifiez les valeurs saisies.",
      );
    }, 700);
    return () => window.clearTimeout(id);
  }, [gross, commission, net, valid]);

  return (
    <div className="reveal mt-12 overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface shadow-soft lg:mt-16">
      <div className="grid lg:grid-cols-[1fr_1.05fr]">
        <form
          className="flex flex-col gap-8 p-6 sm:p-10"
          onSubmit={(e) => e.preventDefault()}
          aria-label="Paramètres de la simulation"
        >
          <NumberField
            id={`${uid}-price`}
            label="Prix moyen par nuit"
            hint="Hors frais de ménage, qui sont réglés par les voyageurs."
            unit="€"
            value={price}
            onChange={setPrice}
            min={limits.price.min}
            max={limits.price.max}
            sliderMax={limits.price.sliderMax}
            error={priceError}
          />
          <NumberField
            id={`${uid}-nights`}
            label="Nombre de nuits louées par mois"
            hint="Entre 0 et 31 nuits."
            unit="nuits"
            value={nights}
            onChange={setNights}
            min={limits.nights.min}
            max={limits.nights.max}
            sliderMax={limits.nights.sliderMax}
            error={nightsError}
          />
        </form>

        <div className="on-dark flex flex-col gap-6 bg-maison p-6 text-cream sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Eyebrow surface="dark">Résultat par mois</Eyebrow>
            <DataBadge nature="simulation" />
          </div>

          <dl className="flex flex-col">
            <div className="flex items-baseline justify-between gap-4 border-b border-cream/20 py-4">
              <dt className="text-cream/90">Revenus locatifs bruts</dt>
              <dd className="whitespace-nowrap font-display text-[1.5rem] font-medium tabular-nums [font-stretch:92%]">
                {formatEuro(shownGross)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-cream/20 py-4">
              <dt className="text-cream/90">
                Commission {site.name}
                <span className="block text-small text-cream/75">
                  {site.commission.label} {site.commission.taxNote}
                </span>
              </dt>
              <dd className="whitespace-nowrap font-display text-[1.5rem] font-medium tabular-nums text-terra-light [font-stretch:92%]">
                −&nbsp;{formatEuro(shownCommission)}
              </dd>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pt-5">
              <dt className="font-semibold">Revenus après commission</dt>
              <dd className="font-display text-[2.75rem] font-medium leading-none tracking-[-0.02em] text-cream [font-stretch:92%] sm:text-[3.25rem]">
                {formatEuro(shownNet)}
              </dd>
            </div>
          </dl>

          <div aria-hidden="true" className="flex flex-col gap-2">
            <div className="flex h-3 overflow-hidden rounded-full">
              <span className="bg-olive" style={{ width: `${100 - site.commission.rate}%` }} />
              <span className="bg-terra-on-dark" style={{ width: `${site.commission.rate}%` }} />
            </div>
            <div className="flex justify-between text-small text-cream/80">
              <span>Pour vous : {100 - site.commission.rate} %</span>
              <span>Commission : {site.commission.rate} %</span>
            </div>
          </div>

          {valid ? (
            <p className="text-small text-cream/80">
              Calcul : {formatEuro(p)} × {n} nuit{n > 1 ? "s" : ""} = {formatEuro(gross)}
            </p>
          ) : null}
        </div>
      </div>

      <div className="border-t border-line bg-stone/60 px-6 py-5 sm:px-10">
        <p className="text-small text-ink">
          <strong className="font-semibold">Simulation indicative.</strong> Les revenus réels peuvent
          varier selon la saison, la demande, le logement, sa localisation, son positionnement et son
          taux d’occupation.
        </p>
        <p className="mt-1.5 text-small text-ink-soft">
          Montants TTC. Les frais de ménage, réglés par les voyageurs, ne sont pas pris en compte. Ce
          calcul ne tient pas compte des frais de plateforme, des charges ni de la fiscalité.
        </p>
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
