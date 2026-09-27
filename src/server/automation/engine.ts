import "server-only";

import { addMonths, startOfMonth, todayIso } from "@/lib/dates";
import { createAdminClient, isAdminClientConfigured } from "@/lib/supabase/admin";

import { rules, type DomainEvent } from "./rules";

const MAX_ATTEMPTS = 5;

/**
 * Traite les événements en attente, dans l'ordre, une seule fois chacun :
 * l'événement est « réservé » avant traitement, et chaque règle n'est exécutée
 * qu'une fois par événement (ligne unique dans automation_runs).
 * Appelé après chaque action qui modifie des données, et par la tâche planifiée.
 */
export async function processPendingEvents(limit = 50) {
  if (!isAdminClientConfigured()) return { processed: 0 };
  const supabase = createAdminClient();

  const { data: events } = await supabase
    .from("domain_events")
    .select("*")
    .is("processed_at", null)
    .lt("attempts", MAX_ATTEMPTS)
    .order("id")
    .limit(limit);
  if (!events?.length) return { processed: 0 };

  const { data: ruleRows } = await supabase.from("automation_rules").select("key, enabled, config");
  const settings = new Map((ruleRows ?? []).map((row) => [row.key, row]));
  let processed = 0;

  for (const event of events as DomainEvent[]) {
    // Réservation de l'événement (évite un double traitement en parallèle).
    const { data: claimed } = await supabase
      .from("domain_events")
      .update({ processed_at: new Date().toISOString(), attempts: event.attempts + 1 })
      .eq("id", event.id)
      .is("processed_at", null)
      .select("id");
    if (!claimed?.length) continue;

    let lastError: string | null = null;
    for (const [key, rule] of Object.entries(rules)) {
      if (!rule.matches(event)) continue;
      const setting = settings.get(key);
      const { data: previous } = await supabase
        .from("automation_runs")
        .select("id, status")
        .eq("event_id", event.id)
        .eq("rule_key", key)
        .maybeSingle();
      if (previous && previous.status !== "error") continue;
      if (previous) await supabase.from("automation_runs").delete().eq("id", previous.id);

      if (!setting?.enabled) {
        await supabase.from("automation_runs").insert({ event_id: event.id, rule_key: key, status: "skipped", result: { reason: "Règle désactivée." } });
        continue;
      }
      try {
        const outcome = await rule.run({ supabase, event, config: setting.config });
        await supabase.from("automation_runs").insert({
          event_id: event.id,
          rule_key: key,
          status: outcome.status,
          result: (outcome.result ?? {}) as never,
        });
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
        await supabase.from("automation_runs").insert({ event_id: event.id, rule_key: key, status: "error", error: lastError });
      }
    }

    if (lastError) {
      // Nouvelle tentative au prochain passage (jusqu'à 5).
      await supabase.from("domain_events").update({ processed_at: null, last_error: lastError }).eq("id", event.id);
    }
    processed += 1;
  }
  return { processed };
}

/** Chaque nuit : fait avancer les statuts des réservations selon leurs dates. */
export async function runDailyJobs() {
  const supabase = createAdminClient();
  const { data: rule } = await supabase.from("automation_rules").select("enabled").eq("key", "booking_status_rollover").single();
  if (!rule?.enabled) return { rolled: 0, skipped: true };
  const { data, error } = await supabase.rpc("roll_booking_statuses");
  if (error) throw new Error(error.message);
  await supabase.from("automation_runs").insert({ rule_key: "booking_status_rollover", status: "success", result: { updated: data } });
  return { rolled: data };
}

/** Le 1er du mois : brouillons des relevés du mois écoulé pour chaque propriétaire actif. */
export async function runMonthlyStatements(reference = todayIso()) {
  const supabase = createAdminClient();
  const { data: rule } = await supabase.from("automation_rules").select("enabled").eq("key", "monthly_statements").single();
  if (!rule?.enabled) return { drafts: 0, skipped: true };

  const month = addMonths(startOfMonth(reference), -1);
  const end = startOfMonth(reference);
  const [{ data: bookingOwners }, { data: expenseOwners }] = await Promise.all([
    supabase
      .from("bookings")
      .select("property:properties!inner(owner_id)")
      .gte("check_out", month)
      .lt("check_out", end)
      .neq("status", "inquiry"),
    supabase.from("expenses").select("owner_id").eq("rebill_to_owner", true).is("statement_id", null).lt("incurred_on", end),
  ]);
  const owners = new Set<string>([
    ...(bookingOwners ?? []).map((row) => row.property.owner_id),
    ...(expenseOwners ?? []).map((row) => row.owner_id).filter((id): id is string => Boolean(id)),
  ]);

  let drafts = 0;
  const errors: string[] = [];
  for (const owner of owners) {
    const { data: existing } = await supabase.from("owner_statements").select("status").eq("owner_id", owner).eq("period_month", month).maybeSingle();
    if (existing && existing.status !== "draft") continue;
    const { error } = await supabase.rpc("generate_statement", { p_owner: owner, p_month: month });
    if (error) errors.push(error.message);
    else drafts += 1;
  }
  await supabase.from("automation_runs").insert({
    rule_key: "monthly_statements",
    status: errors.length ? "error" : "success",
    result: { month, drafts },
    error: errors.join(" ") || null,
  });
  return { drafts, month };
}
