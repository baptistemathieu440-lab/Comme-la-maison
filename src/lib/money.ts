/** Montants en centimes (entiers) et taux en points de base (2000 = 20 %). */

const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
const euroWhole = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const percent = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });

/** 123456 → « 1 234,56 € » */
export function formatCents(cents: number | null | undefined) {
  return euro.format((cents ?? 0) / 100);
}

/** Arrondi à l'euro, pour les indicateurs : 123456 → « 1 235 € » */
export function formatCentsRounded(cents: number | null | undefined) {
  return euroWhole.format(Math.round((cents ?? 0) / 100));
}

/** « 1 234,5 » ou « 1234.50 » → 123450 ; null si la saisie n'est pas un montant. */
export function parseEuros(raw: FormDataEntryValue | string | null | undefined): number | null {
  if (typeof raw !== "string") return null;
  const cleaned = raw.replace(/\s| | |€/g, "").replace(",", ".");
  if (cleaned === "") return null;
  if (!/^-?\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  return Math.round(Number(cleaned) * 100);
}

/** Centimes → valeur de champ « 1234,56 ». */
export function centsToInput(cents: number | null | undefined) {
  if (cents === null || cents === undefined) return "";
  return (cents / 100).toFixed(2).replace(".", ",");
}

/** 2000 → « 20 % » */
export function formatBps(bps: number | null | undefined) {
  return `${percent.format((bps ?? 0) / 100)} %`;
}

/** « 20 » ou « 17,5 » → 2000 ou 1750 */
export function parsePercentToBps(raw: FormDataEntryValue | string | null | undefined): number | null {
  if (typeof raw !== "string") return null;
  const cleaned = raw.replace(/\s|%/g, "").replace(",", ".");
  if (cleaned === "") return null;
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  const value = Math.round(Number(cleaned) * 100);
  return value >= 0 && value <= 10000 ? value : null;
}

export function bpsToInput(bps: number | null | undefined) {
  if (bps === null || bps === undefined) return "";
  return percent.format(bps / 100).replace(/ /g, "");
}
