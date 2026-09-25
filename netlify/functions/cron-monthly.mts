import type { Config } from "@netlify/functions";

/** Le 1er du mois (5 h 30 UTC) : brouillons des relevés du mois écoulé. */
export default async function cronMonthly() {
  const base = process.env.URL;
  const secret = process.env.CRON_SECRET;
  if (!base || !secret) return new Response("CRON_SECRET ou URL manquant.", { status: 500 });
  const response = await fetch(`${base}/api/cron/monthly`, {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}` },
  });
  console.log("cron-monthly", response.status, await response.text());
  return new Response(null, { status: 204 });
}

export const config: Config = { schedule: "30 5 1 * *" };
