import type { Config } from "@netlify/functions";

/** Chaque nuit (2 h 15 UTC) : statuts des réservations selon leurs dates. */
export default async () => {
  const base = process.env.URL;
  const secret = process.env.CRON_SECRET;
  if (!base || !secret) return new Response("CRON_SECRET ou URL manquant.", { status: 500 });
  const response = await fetch(`${base}/api/cron/daily`, {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}` },
  });
  console.log("cron-daily", response.status, await response.text());
  return new Response(null, { status: 204 });
};

export const config: Config = { schedule: "15 2 * * *" };
