import { FilterBar, FilterField, filterControl, param } from "@/components/app/FilterBar";
import { DemoBadge, EmptyState, PageHeader, Pagination } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { formatDateTime } from "@/lib/dates";

export const metadata = { title: "Journal d’activité" };

const PAGE_SIZE = 50;

const tables: Record<string, string> = {
  bookings: "Réservation",
  properties: "Bien",
  owners: "Propriétaire",
  contacts: "Contact",
  prospects: "Prospect",
  tasks: "Tâche",
  incidents: "Incident",
  maintenance_jobs: "Intervention",
  expenses: "Dépense",
  owner_statements: "Relevé",
  payments: "Règlement",
  documents: "Document",
  listings: "Annonce",
  calendar_blocks: "Blocage de calendrier",
  property_access: "Accès au logement",
  contracts: "Contrat",
  settings: "Paramètres",
  user_roles: "Rôle",
  invitations: "Invitation",
  providers: "Prestataire",
  guests: "Voyageur",
  automation_rules: "Automatisation",
};
const actions: Record<string, string> = { insert: "Création", update: "Modification", delete: "Suppression" };

function summarize(changes: Record<string, unknown>, action: string) {
  if (action !== "update") {
    const name = changes.name ?? changes.title ?? changes.reference ?? changes.label ?? changes.email ?? changes.last_name;
    return typeof name === "string" ? name : "";
  }
  return Object.entries(changes)
    .slice(0, 6)
    .map(([key, value]) => {
      const change = value as { from: unknown; to: unknown };
      const show = (v: unknown) => (v === null || v === undefined || v === "" ? "vide" : typeof v === "object" ? "…" : String(v).slice(0, 40));
      return `${key} : ${show(change.from)} → ${show(change.to)}`;
    })
    .join(" · ");
}

export default async function AuditPage({ searchParams }: PageProps<"/admin/journal">) {
  const { supabase } = await adminContext();
  const params = await searchParams;
  const table = param(params.element);
  const action = param(params.action);
  const page = Math.max(1, Number(param(params.page)) || 1);

  let query = supabase
    .from("audit_logs")
    .select("id, occurred_at, actor_id, table_name, record_id, action, changes, is_demo", { count: "exact" })
    .order("occurred_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (table) query = query.eq("table_name", table);
  if (action) query = query.eq("action", action);
  const { data: logs, count } = await query;

  const actorIds = [...new Set((logs ?? []).map((l) => l.actor_id).filter((id): id is string => Boolean(id)))];
  const { data: actors } = actorIds.length ? await supabase.from("profiles").select("id, full_name, email").in("id", actorIds) : { data: [] };
  const actorName = new Map((actors ?? []).map((a) => [a.id, a.full_name || a.email]));

  return (
    <>
      <PageHeader
        title="Journal d’activité"
        description="Chaque création, modification et suppression, enregistrée par la base elle-même. Le journal ne peut pas être modifié ; les codes d’accès et IBAN n’y apparaissent jamais en clair."
      />
      <FilterBar resetHref="/admin/journal">
        <FilterField label="Élément" id="f-element">
          <select id="f-element" name="element" defaultValue={table} className={filterControl}>
            <option value="">Tous</option>
            {Object.entries(tables).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Action" id="f-action">
          <select id="f-action" name="action" defaultValue={action} className={filterControl}>
            <option value="">Toutes</option>
            {Object.entries(actions).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FilterField>
      </FilterBar>
      {(logs ?? []).length === 0 ? (
        <EmptyState title="Aucune entrée." />
      ) : (
        <ol className="flex flex-col divide-y divide-line rounded-[var(--radius-card)] border border-line bg-surface">
          {(logs ?? []).map((log) => (
            <li key={log.id} className="flex flex-col gap-1 p-4">
              <span className="flex flex-wrap items-center gap-2 text-[0.9375rem]">
                <strong className="text-maison">{actions[log.action] ?? log.action}</strong>
                <span>{tables[log.table_name] ?? log.table_name}</span>
                {log.is_demo ? <DemoBadge /> : null}
                <span className="text-small text-ink-soft">
                  · {formatDateTime(log.occurred_at)} · {log.actor_id ? (actorName.get(log.actor_id) ?? "Compte supprimé") : "Système (automatisation ou tâche planifiée)"}
                </span>
              </span>
              <span className="break-words text-small text-ink-soft">{summarize(log.changes as Record<string, unknown>, log.action)}</span>
            </li>
          ))}
        </ol>
      )}
      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={count ?? 0}
        hrefFor={(p) => `/admin/journal?${new URLSearchParams(Object.entries({ element: table, action, page: String(p) }).filter(([, v]) => v))}`}
      />
    </>
  );
}
