import type { Database } from "@/lib/supabase/database.types";

export type PropertyMonth = Database["public"]["Functions"]["stats_property_months"]["Returns"][number];

export type Totals = {
  properties: number;
  days: number;
  bookedNights: number;
  importedNights: number;
  blockedNights: number;
  nightsAmount: number;
  platformFee: number;
  base: number;
  commission: number;
  ownerNet: number;
  hasDemo: boolean;
};

export function sumMonths(rows: PropertyMonth[]): Totals {
  const properties = new Set<string>();
  const totals: Totals = {
    properties: 0,
    days: 0,
    bookedNights: 0,
    importedNights: 0,
    blockedNights: 0,
    nightsAmount: 0,
    platformFee: 0,
    base: 0,
    commission: 0,
    ownerNet: 0,
    hasDemo: false,
  };
  for (const row of rows) {
    properties.add(row.property_id);
    totals.days += row.days;
    totals.bookedNights += row.booked_nights;
    totals.importedNights += row.imported_nights;
    totals.blockedNights += row.blocked_nights;
    totals.nightsAmount += Number(row.nights_amount_cents);
    totals.platformFee += Number(row.platform_fee_cents);
    totals.base += Number(row.commission_base_cents);
    totals.commission += Number(row.commission_cents);
    totals.ownerNet += Number(row.owner_net_cents);
    totals.hasDemo ||= row.is_demo;
  }
  totals.properties = properties.size;
  return totals;
}

/** Taux d'occupation : nuits réservées (saisies ou importées) / nuits disponibles (hors blocages). */
export function occupancy(totals: Totals) {
  const available = totals.days - totals.blockedNights;
  if (available <= 0) return null;
  return (totals.bookedNights + totals.importedNights) / available;
}

/** Prix moyen par nuit (sur les réservations avec montants). */
export function averageNightly(totals: Totals) {
  return totals.bookedNights > 0 ? Math.round(totals.nightsAmount / totals.bookedNights) : null;
}

export function byMonth(rows: PropertyMonth[]) {
  const months = new Map<string, PropertyMonth[]>();
  for (const row of rows) {
    const list = months.get(row.month) ?? [];
    list.push(row);
    months.set(row.month, list);
  }
  return [...months.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([month, list]) => ({ month, totals: sumMonths(list) }));
}

const pct = new Intl.NumberFormat("fr-FR", { style: "percent", maximumFractionDigits: 0 });

export function formatRatio(value: number | null) {
  return value === null ? "—" : pct.format(value);
}
