/** Dates au format ISO « AAAA-MM-JJ », calculées à l'heure de Paris. */

const TZ = "Europe/Paris";

export function todayIso() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
}

export function parseIsoDate(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toIso(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number) {
  const date = parseIsoDate(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return toIso(date);
}

export function diffDays(fromIso: string, toIsoValue: string) {
  return Math.round((parseIsoDate(toIsoValue).getTime() - parseIsoDate(fromIso).getTime()) / 86_400_000);
}

export function startOfMonth(iso: string) {
  return `${iso.slice(0, 7)}-01`;
}

export function addMonths(iso: string, months: number) {
  const date = parseIsoDate(startOfMonth(iso));
  date.setUTCMonth(date.getUTCMonth() + months);
  return toIso(date);
}

export function daysInMonth(iso: string) {
  const date = parseIsoDate(startOfMonth(iso));
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
}

export function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(parseIsoDate(value).getTime());
}

const long = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const short = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });
const dayMonth = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" });
const weekday = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const monthYear = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" });
const dateTime = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: TZ,
});

/** « 12 septembre 2026 » */
export function formatDate(iso: string | null | undefined) {
  return iso ? long.format(parseIsoDate(iso.slice(0, 10))) : "—";
}

/** « 12/09/2026 » */
export function formatDateShort(iso: string | null | undefined) {
  return iso ? short.format(parseIsoDate(iso.slice(0, 10))) : "—";
}

/** « 12 sept. » */
export function formatDayMonth(iso: string | null | undefined) {
  return iso ? dayMonth.format(parseIsoDate(iso.slice(0, 10))) : "—";
}

/** « samedi 12 septembre » */
export function formatWeekday(iso: string) {
  return weekday.format(parseIsoDate(iso));
}

/** « septembre 2026 » */
export function formatMonth(iso: string) {
  return monthYear.format(parseIsoDate(startOfMonth(iso)));
}

/** Horodatage (timestamptz) à l'heure de Paris : « 12/09/2026 14:05 » */
export function formatDateTime(value: string | null | undefined) {
  return value ? dateTime.format(new Date(value)) : "—";
}

/** « 12 → 15 sept. 2026 · 3 nuits » */
export function formatStay(checkIn: string, checkOut: string) {
  const nights = diffDays(checkIn, checkOut);
  return `${formatDateShort(checkIn)} → ${formatDateShort(checkOut)} · ${nights} nuit${nights > 1 ? "s" : ""}`;
}

/** « 16:00:00 » → « 16 h » ; « 16:30:00 » → « 16 h 30 » */
export function formatTime(value: string | null | undefined) {
  if (!value) return "—";
  const [h, m] = value.split(":");
  return m && m !== "00" ? `${Number(h)} h ${m}` : `${Number(h)} h`;
}
