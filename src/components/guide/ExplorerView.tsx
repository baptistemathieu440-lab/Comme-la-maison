"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CloudRain, Search, SlidersHorizontal, Sun, X } from "lucide-react";
import { useMemo, useRef, useState, useTransition, type ReactNode } from "react";

import { themeBySlug } from "@/content/guide/themes";
import { cn } from "@/lib/cn";
import type { PlaceSummary } from "@/lib/guide/summary";
import {
  audienceFilterKeys,
  audiences,
  budgetKeys,
  budgets,
  kindKeys,
  kinds,
  weathers,
  zoneKeys,
  zones,
  type Weather,
} from "@/lib/guide/taxonomy";

import { applyFilters, countActive, emptyFilters, parseFilters, serializeFilters, type Filters } from "./filters";
import { PlaceCard } from "./PlaceCard";

function Chip({ pressed, onClick, children, className }: { pressed: boolean; onClick: () => void; children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border-[1.5px] px-4 text-[0.9375rem] font-semibold transition-colors",
        pressed ? "border-maison bg-maison text-cream" : "border-line-strong/60 bg-surface text-ink hover:border-maison",
        className,
      )}
    >
      {children}
    </button>
  );
}

function toggle<T>(values: T[], value: T) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function Group({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 font-display text-[1.125rem] font-medium text-maison">{legend}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

/**
 * Explorateur : recherche et filtres sur toutes les adresses.
 * Les filtres vivent dans l'adresse de la page : on peut la partager ou revenir en arrière.
 */
export function ExplorerView({ places }: { places: PlaceSummary[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const filters = useMemo(() => parseFilters(new URLSearchParams(params.toString())), [params]);
  const [query, setQuery] = useState(filters.q);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const results = useMemo(() => applyFilters(places, { ...filters, q: query }), [places, filters, query]);
  const active = countActive(filters);
  const theme = filters.rubrique ? themeBySlug(filters.rubrique) : null;

  function update(next: Filters) {
    const search = serializeFilters(next);
    startTransition(() => router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false }));
  }

  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    update({ ...filters, q: query, [key]: value });
  }

  const weatherIcon: Record<Weather, typeof Sun> = { soleil: Sun, pluie: CloudRain };

  return (
    <div className="flex flex-col gap-5">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          set("q", query);
        }}
        className="relative"
      >
        <label htmlFor="recherche-guide" className="sr-only">
          Rechercher une adresse, un quartier, une envie
        </label>
        <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-soft" />
        <input
          id="recherche-guide"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onBlur={() => query !== filters.q && set("q", query)}
          placeholder="Huîtres, rooftop, Chartrons, musée…"
          enterKeyHint="search"
          className="min-h-12 w-full rounded-full border-[1.5px] border-line-strong bg-white pl-12 pr-4 text-[1rem] text-ink placeholder:text-ink-soft/70 focus-visible:border-maison"
        />
      </form>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          aria-haspopup="dialog"
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-maison px-4 text-[0.9375rem] font-semibold text-cream"
        >
          <SlidersHorizontal aria-hidden="true" className="size-4" strokeWidth={2} />
          Filtres
          {active > 0 ? <span className="grid min-w-5 place-items-center rounded-full bg-cream px-1 text-[0.75rem] font-bold leading-5 text-maison">{active}</span> : null}
        </button>
        <Chip pressed={filters.budget.includes(0)} onClick={() => set("budget", toggle(filters.budget, 0))}>
          Gratuit
        </Chip>
        <Chip pressed={filters.meteo === "pluie"} onClick={() => set("meteo", filters.meteo === "pluie" ? null : "pluie")}>
          <CloudRain aria-hidden="true" className="size-4" /> Il pleut
        </Chip>
        <Chip pressed={filters.pour.includes("famille")} onClick={() => set("pour", toggle(filters.pour, "famille"))}>
          En famille
        </Chip>
        <Chip pressed={filters.pour.includes("couple")} onClick={() => set("pour", toggle(filters.pour, "couple"))}>
          En couple
        </Chip>
        <Chip pressed={filters.distance.includes("centre")} onClick={() => set("distance", toggle(filters.distance, "centre"))}>
          Centre-ville
        </Chip>
      </div>

      {theme ? (
        <p className="flex flex-wrap items-center gap-2 text-small text-ink-soft">
          Rubrique :
          <button
            type="button"
            onClick={() => set("rubrique", null)}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-olive-light px-3 font-semibold text-maison"
          >
            {theme.title}
            <X aria-hidden="true" className="size-4" />
            <span className="sr-only">(retirer)</span>
          </button>
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <p role="status" className="font-semibold text-ink">
          {results.length} adresse{results.length > 1 ? "s" : ""}
        </p>
        {active > 0 || theme || filters.q ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              update(emptyFilters);
            }}
            className="inline-flex min-h-11 items-center px-2 text-[0.9375rem] font-semibold text-maison underline underline-offset-4"
          >
            Tout effacer
          </button>
        ) : null}
      </div>

      {results.length === 0 ? (
        <p className="rounded-[var(--radius-card)] bg-surface p-6 text-ink-soft">
          Aucune adresse ne correspond à tous ces critères. Retirez un filtre, ou écrivez-nous : on trouvera ensemble.
        </p>
      ) : (
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-2">
          {results.map((place) => (
            <li key={place.slug}>
              <PlaceCard place={place} headingLevel="h2" />
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby="filtres-titre"
        className="m-0 mt-auto max-h-[88dvh] w-full max-w-none overflow-y-auto rounded-t-[var(--radius-panel)] bg-cream p-0 text-ink backdrop:bg-ink/40 sm:m-auto sm:max-w-[36rem] sm:rounded-[var(--radius-panel)]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line/70 bg-cream px-5 py-3">
          <h2 id="filtres-titre" className="font-display text-[1.375rem] text-maison">
            Filtrer
          </h2>
          <button type="button" onClick={() => dialogRef.current?.close()} className="grid size-11 place-items-center rounded-full hover:bg-olive-light">
            <X aria-hidden="true" className="size-5" />
            <span className="sr-only">Fermer</span>
          </button>
        </div>
        <div className="flex flex-col gap-7 px-5 py-6">
          <Group legend="Budget">
            {budgetKeys.map((key) => (
              <Chip key={key} pressed={filters.budget.includes(key)} onClick={() => set("budget", toggle(filters.budget, key))}>
                {budgets[key].symbol}
                {key > 0 ? <span className="font-normal opacity-80">· {budgets[key].detail}</span> : null}
              </Chip>
            ))}
          </Group>
          <Group legend="Type">
            {kindKeys.map((key) => (
              <Chip key={key} pressed={filters.type.includes(key)} onClick={() => set("type", toggle(filters.type, key))}>
                {kinds[key].label}
              </Chip>
            ))}
          </Group>
          <Group legend="Pour qui ?">
            {audienceFilterKeys.map((key) => (
              <Chip key={key} pressed={filters.pour.includes(key)} onClick={() => set("pour", toggle(filters.pour, key))}>
                {audiences[key].label}
              </Chip>
            ))}
          </Group>
          <Group legend="Distance depuis le centre">
            {zoneKeys.map((key) => (
              <Chip key={key} pressed={filters.distance.includes(key)} onClick={() => set("distance", toggle(filters.distance, key))}>
                {zones[key].label}
              </Chip>
            ))}
          </Group>
          <Group legend="Météo">
            {(Object.keys(weathers) as Weather[]).map((key) => {
              const Icon = weatherIcon[key];
              return (
                <Chip key={key} pressed={filters.meteo === key} onClick={() => set("meteo", filters.meteo === key ? null : key)}>
                  <Icon aria-hidden="true" className="size-4" />
                  {weathers[key].label}
                </Chip>
              );
            })}
          </Group>
        </div>
        <div className="sticky bottom-0 flex gap-3 border-t border-line/70 bg-cream px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => update({ ...emptyFilters, q: query, rubrique: filters.rubrique })}
            className="inline-flex min-h-[3.125rem] items-center rounded-full px-4 text-button text-maison underline underline-offset-4"
          >
            Effacer
          </button>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="inline-flex min-h-[3.125rem] flex-1 items-center justify-center rounded-full bg-maison px-6 text-button text-cream hover:bg-maison-hover"
          >
            Voir {results.length} adresse{results.length > 1 ? "s" : ""}
          </button>
        </div>
      </dialog>
    </div>
  );
}
