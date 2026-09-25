import { timingSafeEqual } from "node:crypto";

import { isAdminClientConfigured } from "@/lib/supabase/admin";
import { processPendingEvents, runDailyJobs, runMonthlyStatements } from "@/server/automation/engine";
import { syncAllListings } from "@/server/ical/sync";

/**
 * Tâches planifiées, appelées par les fonctions planifiées Netlify
 * (netlify/functions/*.mts) avec l'en-tête Authorization: Bearer CRON_SECRET.
 */
function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get("authorization") ?? "";
  if (!secret || !header.startsWith("Bearer ")) return false;
  const given = Buffer.from(header.slice(7));
  const expected = Buffer.from(secret);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function POST(request: Request, { params }: RouteContext<"/api/cron/[job]">) {
  if (!authorized(request)) return Response.json({ error: "Non autorisé." }, { status: 401 });
  if (!isAdminClientConfigured()) return Response.json({ error: "Base non configurée." }, { status: 503 });
  const { job } = await params;

  try {
    switch (job) {
      case "hourly": {
        const sync = await syncAllListings("schedule");
        const events = await processPendingEvents(200);
        return Response.json({ sync: sync.map((s) => ({ listing: s.listingId, status: s.status, conflicts: s.conflicts.length })), events });
      }
      case "daily": {
        const daily = await runDailyJobs();
        const events = await processPendingEvents(200);
        return Response.json({ daily, events });
      }
      case "monthly": {
        const monthly = await runMonthlyStatements();
        return Response.json({ monthly });
      }
      case "events":
        return Response.json(await processPendingEvents(200));
      default:
        return Response.json({ error: "Tâche inconnue." }, { status: 404 });
    }
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Erreur." }, { status: 500 });
  }
}
