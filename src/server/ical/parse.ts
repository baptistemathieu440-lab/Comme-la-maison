/**
 * Lecture des calendriers iCal (RFC 5545) fournis par Airbnb, Booking.com, Abritel…
 * Ces flux ne contiennent que des dates bloquées : aucun montant, peu d'informations
 * sur les voyageurs. Les dates sont ramenées à des jours (fin exclusive).
 */

export type IcalEvent = {
  uid: string;
  start: string;
  end: string;
  summary: string;
  cancelled: boolean;
};

function unfold(text: string) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\n[ \t]/g, "");
}

function unescapeText(value: string) {
  return value.replace(/\\n/gi, " ").replace(/\\([,;\\])/g, "$1").trim();
}

const parisDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" });

/** « 20260915 » ou « 20260915T140000Z » → « 2026-09-15 » (heure de Paris). */
function toDate(raw: string, params: string): string | null {
  const value = raw.trim();
  const dateOnly = /^(\d{4})(\d{2})(\d{2})$/.exec(value);
  if (dateOnly) return `${dateOnly[1]}-${dateOnly[2]}-${dateOnly[3]}`;
  const dateTime = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/.exec(value);
  if (!dateTime) return null;
  const [, y, m, d, hh, mm, ss, utc] = dateTime;
  if (utc) {
    return parisDate.format(new Date(Date.UTC(+y, +m - 1, +d, +hh, +mm, +ss)));
  }
  // Heure locale (TZID) : on garde la date telle quelle.
  void params;
  return `${y}-${m}-${d}`;
}

function nextDay(iso: string) {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

export function parseIcal(text: string): IcalEvent[] {
  const lines = unfold(text).split("\n");
  const events: IcalEvent[] = [];
  let current: Record<string, { value: string; params: string }> | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      current = {};
      continue;
    }
    if (line === "END:VEVENT") {
      if (current) {
        const startRaw = current.DTSTART;
        const start = startRaw ? toDate(startRaw.value, startRaw.params) : null;
        const endRaw = current.DTEND;
        let end = endRaw ? toDate(endRaw.value, endRaw.params) : null;
        if (start && (!end || end <= start)) end = nextDay(start);
        if (start && end) {
          events.push({
            uid: current.UID?.value.trim() || `${start}_${end}`,
            start,
            end,
            summary: unescapeText(current.SUMMARY?.value ?? ""),
            cancelled: (current.STATUS?.value ?? "").trim().toUpperCase() === "CANCELLED",
          });
        }
      }
      current = null;
      continue;
    }
    if (!current) continue;
    const colon = line.indexOf(":");
    if (colon < 0) continue;
    const head = line.slice(0, colon);
    const value = line.slice(colon + 1);
    const [name, ...params] = head.split(";");
    current[name.toUpperCase()] = { value, params: params.join(";") };
  }
  return events;
}

/**
 * Les plateformes réexportent les dates bloquées par d'autres calendriers
 * (« Not available », « Blocked »…) : ce ne sont pas des réservations.
 */
export function isUnavailabilityOnly(summary: string) {
  return /not available|unavailable|blocked|closed|indisponible|bloqu|ferm/i.test(summary);
}
