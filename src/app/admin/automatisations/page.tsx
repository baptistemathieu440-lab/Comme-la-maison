import { ActionForm, SubmitButton } from "@/components/app/form";
import { Badge, DataTable, EmptyState, PageHeader, Panel } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { formatDateTime } from "@/lib/dates";

import { processNow, toggleRule } from "./actions";

export const metadata = { title: "Automatisations" };

const runTone = { success: "positive", skipped: "muted", error: "danger" } as const;
const runLabel = { success: "Exécutée", skipped: "Sans effet", error: "Erreur" } as const;

export default async function AutomationsPage() {
  const { supabase } = await adminContext();
  const [{ data: rules }, { data: runs }, { count: pending }] = await Promise.all([
    supabase.from("automation_rules").select("key, name, description, enabled, updated_at").order("name"),
    supabase
      .from("automation_runs")
      .select("id, rule_key, status, error, created_at, result, event:domain_events(type, entity_table)")
      .order("created_at", { ascending: false })
      .limit(40),
    supabase.from("domain_events").select("id", { count: "exact", head: true }).is("processed_at", null),
  ]);
  const ruleName = new Map((rules ?? []).map((r) => [r.key, r.name]));

  return (
    <>
      <PageHeader
        title="Automatisations"
        description="Chaque action importante (réservation, tâche, incident, demande du site) écrit un événement. Les règles actives le traitent une seule fois, dans l’ordre, avec un historique consultable."
        actions={
          <ActionForm action={processNow}>
            <SubmitButton variant="secondary" pendingLabel="Traitement…">
              {`Traiter les événements en attente (${pending ?? 0})`}
            </SubmitButton>
          </ActionForm>
        }
      />
      <Panel title="Règles" id="regles">
        <ul className="flex flex-col divide-y divide-line">
          {(rules ?? []).map((rule) => (
            <li key={rule.key} className="flex flex-col gap-2 py-3 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="flex flex-wrap items-center gap-2 font-semibold text-maison">
                  {rule.name} {rule.enabled ? <Badge tone="positive">Active</Badge> : <Badge tone="muted">Désactivée</Badge>}
                </span>
                <span className="text-small text-ink-soft">{rule.description}</span>
              </div>
              <ActionForm action={toggleRule.bind(null, rule.key, !rule.enabled)}>
                <SubmitButton variant="ghost" pendingLabel="…">
                  {rule.enabled ? "Désactiver" : "Activer"}
                </SubmitButton>
              </ActionForm>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Dernières exécutions" id="executions">
        <DataTable
          caption="Dernières exécutions des automatisations"
          rows={runs ?? []}
          rowKey={(row) => String(row.id)}
          empty={<EmptyState title="Aucune exécution pour l’instant." />}
          columns={[
            { header: "Date", cell: (row) => formatDateTime(row.created_at) },
            { header: "Règle", cell: (row) => ruleName.get(row.rule_key) ?? row.rule_key },
            { header: "Déclencheur", cell: (row) => row.event?.type ?? "Tâche planifiée" },
            {
              header: "Résultat",
              cell: (row) => (
                <span className="flex flex-col gap-1">
                  <Badge tone={runTone[row.status as keyof typeof runTone] ?? "neutral"}>{runLabel[row.status as keyof typeof runLabel] ?? row.status}</Badge>
                  {row.error ? <span className="text-small text-error">{row.error}</span> : null}
                  {row.status === "skipped" && (row.result as { reason?: string })?.reason ? (
                    <span className="text-small text-ink-soft">{(row.result as { reason?: string }).reason}</span>
                  ) : null}
                </span>
              ),
            },
          ]}
        />
      </Panel>
    </>
  );
}
