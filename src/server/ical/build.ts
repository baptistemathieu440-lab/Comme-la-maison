/** Génération d'un calendrier iCal (dates seulement, aucune donnée personnelle). */

export type ExportEvent = { uid: string; start: string; end: string; summary: string };

function formatDate(iso: string) {
  return iso.replaceAll("-", "");
}

function escapeText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/** Replie les lignes à 75 octets comme l'exige la norme. */
function fold(line: string) {
  const bytes = Buffer.from(line, "utf8");
  if (bytes.length <= 75) return line;
  const parts: string[] = [];
  let chunk = "";
  for (const char of line) {
    if (Buffer.byteLength(chunk + char, "utf8") > (parts.length === 0 ? 75 : 74)) {
      parts.push(chunk);
      chunk = char;
    } else {
      chunk += char;
    }
  }
  parts.push(chunk);
  return parts.join("\r\n ");
}

export function buildIcal(name: string, events: ExportEvent[], now = new Date()) {
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Comme a la Maison//Plateforme//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(name)}`,
  ];
  for (const event of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${escapeText(event.uid)}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${formatDate(event.start)}`,
      `DTEND;VALUE=DATE:${formatDate(event.end)}`,
      `SUMMARY:${escapeText(event.summary)}`,
      "TRANSP:OPAQUE",
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}
