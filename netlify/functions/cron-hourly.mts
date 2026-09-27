import type { Config } from "@netlify/functions";

/** Toutes les heures : calendriers iCal et automatisations en attente. */
export default async function cronHourly() {
  const base = process.env.URL;
  const secret = process.env.CRON_SECRET;
  if (!base || !secret) return new Response("CRON_SECRET ou URL manquant.", { status: 500 });
  const response = await fetch(`${base}/api/cron/hourly`, {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}` },
  });
  console.log("cron-hourly", response.status, await response.text());
  return new Response(null, { status: 204 });
}

export const config: Config = { schedule: "@hourly" };
