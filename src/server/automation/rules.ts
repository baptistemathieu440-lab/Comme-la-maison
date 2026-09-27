import "server-only";

import { formatDateShort, formatMonth } from "@/lib/dates";
import { incidentSeverity } from "@/lib/labels";
import type { AdminClient } from "@/lib/supabase/admin";
import type { Database, Json } from "@/lib/supabase/database.types";

import { adminIds, notify, ownerProfileForProperty } from "../notifications";

export type DomainEvent = Database["public"]["Tables"]["domain_events"]["Row"];
export type RuleContext = { supabase: AdminClient; event: DomainEvent; config: Json };
export type RuleResult = { status: "success" | "skipped"; result?: Record<string, unknown> };
export type Rule = (context: RuleContext) => Promise<RuleResult>;

const payloadOf = (event: DomainEvent) => (event.payload ?? {}) as Record<string, unknown>;

/** Une réservation devient confirmée : à sa création, ou quand une demande est acceptée. */
function becameConfirmed(event: DomainEvent) {
  const payload = payloadOf(event);
  if (event.type === "booking.created") return payload.status === "confirmed" || payload.status === "in_progress";
  if (event.type === "booking.status_changed") return payload.to === "confirmed" && payload.from === "inquiry";
  return false;
}

async function loadBooking(supabase: AdminClient, id: string | null) {
  if (!id) return null;
  const { data } = await supabase
    .from("bookings")
    .select("id, reference, property_id, check_in, check_out, status, platform_id, is_demo, property:properties!inner(name, check_in_time, check_out_time, cleaning_checklist, is_primary_residence)")
    .eq("id", id)
    .maybeSingle();
  return data;
}

const platformNames: Record<string, string> = {
  airbnb: "Airbnb",
  booking: "Booking.com",
  abritel: "Abritel",
  direct: "réservation directe",
  other: "autre plateforme",
};

export const rules: Record<string, { matches: (event: DomainEvent) => boolean; run: Rule }> = {
  booking_cleaning_task: {
    matches: becameConfirmed,
    async run({ supabase, event }) {
      const booking = await loadBooking(supabase, event.entity_id);
      if (!booking || !["confirmed", "in_progress"].includes(booking.status)) return { status: "skipped", result: { reason: "Réservation non confirmée." } };
      const { data: existing } = await supabase.from("tasks").select("id").eq("booking_id", booking.id).eq("type", "cleaning").limit(1);
      if (existing?.length) return { status: "skipped", result: { reason: "Tâche de ménage déjà présente." } };

      const { data: settings } = await supabase.from("settings").select("default_cleaning_checklist, default_check_in_time, default_check_out_time").single();
      const labels = (Array.isArray(booking.property.cleaning_checklist) ? booking.property.cleaning_checklist : settings?.default_cleaning_checklist) as string[] | null;
      const { data: task, error } = await supabase
        .from("tasks")
        .insert({
          type: "cleaning",
          property_id: booking.property_id,
          booking_id: booking.id,
          title: `Ménage · ${booking.property.name}`,
          due_date: booking.check_out,
          window_start: booking.property.check_out_time ?? settings?.default_check_out_time ?? null,
          window_end: booking.property.check_in_time ?? settings?.default_check_in_time ?? null,
          checklist: (labels ?? []).map((label) => ({ label, done: false })),
          created_by_rule: "booking_cleaning_task",
          is_demo: booking.is_demo,
        })
        .select("id")
        .single();
      if (error) {
        if (error.code === "23505") return { status: "skipped", result: { reason: "Tâche de ménage déjà présente." } };
        throw new Error(error.message);
      }
      return { status: "success", result: { task_id: task.id } };
    },
  },

  booking_cancel_tasks: {
    matches: (event) => event.type === "booking.status_changed" && payloadOf(event).to === "cancelled",
    async run({ supabase, event }) {
      const { data } = await supabase
        .from("tasks")
        .update({ status: "cancelled" })
        .eq("booking_id", event.entity_id ?? "")
        .eq("status", "todo")
        .select("id");
      return data?.length ? { status: "success", result: { cancelled: data.length } } : { status: "skipped", result: { reason: "Aucune tâche à annuler." } };
    },
  },

  booking_move_tasks: {
    matches: (event) => event.type === "booking.dates_changed",
    async run({ supabase, event }) {
      const booking = await loadBooking(supabase, event.entity_id);
      if (!booking) return { status: "skipped" };
      const { data } = await supabase
        .from("tasks")
        .update({ due_date: booking.check_out, property_id: booking.property_id })
        .eq("booking_id", booking.id)
        .eq("type", "cleaning")
        .eq("status", "todo")
        .select("id");
      return data?.length ? { status: "success", result: { moved: data.length } } : { status: "skipped", result: { reason: "Aucune tâche à déplacer." } };
    },
  },

  booking_notify: {
    matches: (event) => becameConfirmed(event) || (event.type === "booking.status_changed" && payloadOf(event).to === "cancelled"),
    async run({ supabase, event }) {
      const booking = await loadBooking(supabase, event.entity_id);
      if (!booking) return { status: "skipped" };
      const cancelled = booking.status === "cancelled";
      const stay = `du ${formatDateShort(booking.check_in)} au ${formatDateShort(booking.check_out)}`;
      const title = cancelled ? `Réservation annulée : ${booking.property.name}` : `Nouvelle réservation : ${booking.property.name}`;
      const body = `${cancelled ? "Séjour annulé" : "Séjour"} ${stay} (${platformNames[booking.platform_id] ?? booking.platform_id}, ${booking.reference}).`;
      const admins = await notify(supabase, {
        recipients: await adminIds(supabase),
        kind: "booking",
        title,
        body,
        link: `/admin/reservations/${booking.id}`,
        eventId: event.id,
        isDemo: booking.is_demo,
      });
      const owner = await ownerProfileForProperty(supabase, booking.property_id);
      const owners = owner
        ? await notify(supabase, { recipients: [owner], kind: "booking_owner", title, body, link: "/owner/reservations", eventId: event.id, isDemo: booking.is_demo })
        : 0;
      return { status: "success", result: { notified: admins + owners } };
    },
  },

  primary_residence_limit: {
    matches: becameConfirmed,
    async run({ supabase, event, config }) {
      const booking = await loadBooking(supabase, event.entity_id);
      if (!booking?.property.is_primary_residence) return { status: "skipped", result: { reason: "Pas une résidence principale." } };
      const year = Number(booking.check_in.slice(0, 4));
      const [{ data: settings }, { data: stays }] = await Promise.all([
        supabase.from("settings").select("primary_residence_night_limit").single(),
        supabase
          .from("bookings")
          .select("check_in, check_out")
          .eq("property_id", booking.property_id)
          .in("status", ["confirmed", "in_progress", "completed"])
          .lt("check_in", `${year + 1}-01-01`)
          .gt("check_out", `${year}-01-01`),
      ]);
      const limit = settings?.primary_residence_night_limit ?? 120;
      const nights = (stays ?? []).reduce((sum, stay) => {
        const start = stay.check_in < `${year}-01-01` ? `${year}-01-01` : stay.check_in;
        const end = stay.check_out > `${year + 1}-01-01` ? `${year + 1}-01-01` : stay.check_out;
        return sum + Math.round((Date.parse(end) - Date.parse(start)) / 86_400_000);
      }, 0);
      const warnBefore = Number((config as { warn_before?: number })?.warn_before ?? 10);
      if (nights < limit - warnBefore) return { status: "skipped", result: { nights, limit } };
      await notify(supabase, {
        recipients: await adminIds(supabase),
        kind: "primary_residence",
        title: `${booking.property.name} : ${nights} nuits louées en ${year}`,
        body: `Résidence principale : la limite annuelle est de ${limit} nuits.${nights >= limit ? " Elle est atteinte ou dépassée." : ""}`,
        link: `/admin/biens/${booking.property_id}`,
        eventId: event.id,
        isDemo: booking.is_demo,
      });
      return { status: "success", result: { nights, limit } };
    },
  },

  task_assigned_notify: {
    matches: (event) => event.type === "task.assigned",
    async run({ supabase, event }) {
      const { data: task } = await supabase
        .from("tasks")
        .select("id, title, due_date, assignee_id, status, is_demo")
        .eq("id", event.entity_id ?? "")
        .maybeSingle();
      if (!task?.assignee_id || task.status === "cancelled") return { status: "skipped" };
      await notify(supabase, {
        recipients: [task.assignee_id],
        kind: "task_assigned",
        title: `Nouvelle tâche : ${task.title}`,
        body: `Prévue le ${formatDateShort(task.due_date)}.`,
        link: `/staff/taches/${task.id}`,
        eventId: event.id,
        isDemo: task.is_demo,
      });
      return { status: "success" };
    },
  },

  task_done_notify: {
    matches: (event) => event.type === "task.status_changed" && payloadOf(event).to === "done",
    async run({ supabase, event }) {
      const { data: task } = await supabase
        .from("tasks")
        .select("id, title, is_demo, assignee:profiles!tasks_assignee_id_fkey(full_name)")
        .eq("id", event.entity_id ?? "")
        .maybeSingle();
      if (!task) return { status: "skipped" };
      await notify(supabase, {
        recipients: await adminIds(supabase),
        kind: "task_done",
        title: `Tâche terminée à valider : ${task.title}`,
        body: task.assignee?.full_name ? `Terminée par ${task.assignee.full_name}.` : null,
        link: `/admin/taches/${task.id}`,
        eventId: event.id,
        isDemo: task.is_demo,
      });
      return { status: "success" };
    },
  },

  incident_notify: {
    matches: (event) => event.type === "incident.created",
    async run({ supabase, event }) {
      const { data: incident } = await supabase
        .from("incidents")
        .select("id, title, severity, visible_to_owner, property_id, is_demo, property:properties!inner(name)")
        .eq("id", event.entity_id ?? "")
        .maybeSingle();
      if (!incident) return { status: "skipped" };
      const severity = incidentSeverity[incident.severity as keyof typeof incidentSeverity]?.label ?? incident.severity;
      const title = `Incident (${severity.toLowerCase()}) : ${incident.property.name}`;
      await notify(supabase, {
        recipients: await adminIds(supabase),
        kind: "incident",
        title,
        body: incident.title,
        link: `/admin/incidents/${incident.id}`,
        eventId: event.id,
        isDemo: incident.is_demo,
      });
      if (incident.visible_to_owner && ["high", "critical"].includes(incident.severity)) {
        const owner = await ownerProfileForProperty(supabase, incident.property_id);
        if (owner) {
          await notify(supabase, { recipients: [owner], kind: "incident_owner", title, body: incident.title, link: "/owner", eventId: event.id, isDemo: incident.is_demo });
        }
      }
      return { status: "success" };
    },
  },

  prospect_notify: {
    matches: (event) => event.type === "prospect.created",
    async run({ supabase, event }) {
      const { data: prospect } = await supabase
        .from("prospects")
        .select("id, source, property_city, is_demo, contact:contacts!inner(first_name, last_name)")
        .eq("id", event.entity_id ?? "")
        .maybeSingle();
      if (!prospect) return { status: "skipped" };
      const name = `${prospect.contact.first_name} ${prospect.contact.last_name}`.trim();
      await notify(supabase, {
        recipients: await adminIds(supabase),
        kind: "prospect",
        title: prospect.source === "website" ? `Demande d’estimation : ${name}` : `Nouveau prospect : ${name}`,
        body: prospect.property_city ? `Logement à ${prospect.property_city}.` : null,
        link: `/admin/prospects/${prospect.id}`,
        eventId: event.id,
        isDemo: prospect.is_demo,
      });
      return { status: "success" };
    },
  },

  statement_notify: {
    matches: (event) => event.type === "statement.finalized",
    async run({ supabase, event }) {
      const payload = payloadOf(event);
      const { data: owner } = await supabase
        .from("owners")
        .select("contact:contacts!inner(profile_id)")
        .eq("id", String(payload.owner_id ?? ""))
        .maybeSingle();
      const profileId = owner?.contact.profile_id;
      if (!profileId) return { status: "skipped", result: { reason: "Propriétaire sans accès à son espace." } };
      await notify(supabase, {
        recipients: [profileId],
        kind: "statement",
        title: `Votre relevé de ${formatMonth(String(payload.period_month))} est disponible`,
        body: `Relevé ${String(payload.number ?? "")}.`,
        link: `/owner/releves/${event.entity_id}`,
        eventId: event.id,
        isDemo: event.is_demo,
      });
      return { status: "success" };
    },
  },

  sync_conflict_notify: {
    matches: (event) => event.type === "sync.conflict",
    async run({ supabase, event }) {
      const payload = payloadOf(event) as { property_id?: string; conflicts?: Array<{ start: string; end: string; with: string }> };
      const { data: property } = await supabase.from("properties").select("name").eq("id", payload.property_id ?? "").maybeSingle();
      const first = payload.conflicts?.[0];
      await notify(supabase, {
        recipients: await adminIds(supabase),
        kind: "sync_conflict",
        title: `Chevauchement de calendrier : ${property?.name ?? "bien"}`,
        body: first ? `Du ${formatDateShort(first.start)} au ${formatDateShort(first.end)}, avec ${first.with}.` : null,
        link: "/admin/synchronisation",
        eventId: event.id,
        isDemo: event.is_demo,
      });
      return { status: "success" };
    },
  },
};
