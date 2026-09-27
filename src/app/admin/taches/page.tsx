import { ButtonLink } from "@/components/ui/Button";
import { FilterBar, FilterField, filterControl, param } from "@/components/app/FilterBar";
import { ActionForm, Select, SubmitButton } from "@/components/app/form";
import { DataTable, DemoBadge, EmptyState, PageHeader, StatusBadge, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { formatDayMonth, formatTime, isIsoDate, todayIso } from "@/lib/dates";
import { labelOf, optionsOf, taskStatus, taskType, textOf } from "@/lib/labels";
import { propertyOptions, staffOptions } from "@/lib/options";

import { assignTask } from "./actions";

export const metadata = { title: "Tâches" };

export default async function TasksPage({ searchParams }: PageProps<"/admin/taches">) {
  const { supabase } = await adminContext();
  const params = await searchParams;
  const today = todayIso();
  const from = isIsoDate(param(params.du)) ? param(params.du) : param(params.statut) === "done" ? "" : today;
  const to = param(params.au);
  const status = param(params.statut);
  const type = param(params.type);
  const agent = param(params.agent);
  const property = param(params.bien);

  let query = supabase
    .from("tasks")
    .select("id, type, status, title, due_date, window_start, window_end, checklist, is_demo, assignee_id, property:properties!inner(id, name), task_photos(id)")
    .order("due_date")
    .order("window_start", { nullsFirst: false })
    .limit(300);
  if (from) query = query.gte("due_date", from);
  if (isIsoDate(to)) query = query.lte("due_date", to);
  if (status) query = query.eq("status", status);
  else query = query.in("status", ["todo", "in_progress", "done"]);
  if (type) query = query.eq("type", type);
  if (agent === "aucun") query = query.is("assignee_id", null);
  else if (agent) query = query.eq("assignee_id", agent);
  if (property) query = query.eq("property_id", property);

  const [{ data: tasks }, staff, properties] = await Promise.all([query, staffOptions(supabase), propertyOptions(supabase)]);

  return (
    <>
      <PageHeader
        title="Tâches"
        description="Ménages, contrôles, accueils et interventions. Les ménages de départ sont créés automatiquement à chaque réservation confirmée."
        actions={<ButtonLink href="/admin/taches/nouvelle" size="sm">Nouvelle tâche</ButtonLink>}
      />
      <FilterBar resetHref="/admin/taches">
        <FilterField label="Du" id="f-du">
          <input id="f-du" name="du" type="date" defaultValue={from} className={filterControl} />
        </FilterField>
        <FilterField label="Au" id="f-au">
          <input id="f-au" name="au" type="date" defaultValue={to} className={filterControl} />
        </FilterField>
        <FilterField label="Statut" id="f-statut">
          <select id="f-statut" name="statut" defaultValue={status} className={filterControl}>
            <option value="">À faire, en cours, à valider</option>
            {optionsOf(taskStatus).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Type" id="f-type">
          <select id="f-type" name="type" defaultValue={type} className={filterControl}>
            <option value="">Tous</option>
            {optionsOf(taskType).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Agent" id="f-agent">
          <select id="f-agent" name="agent" defaultValue={agent} className={filterControl}>
            <option value="">Tous</option>
            <option value="aucun">Non affectées</option>
            {staff.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Bien" id="f-bien">
          <select id="f-bien" name="bien" defaultValue={property} className={filterControl}>
            <option value="">Tous</option>
            {properties.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FilterField>
      </FilterBar>

      {staff.length === 0 ? (
        <EmptyState title="Aucun agent n’a encore de compte.">
          Invitez vos agents depuis Paramètres › Utilisateurs pour leur confier des tâches sur leur téléphone.
        </EmptyState>
      ) : null}

      <DataTable
        caption="Liste des tâches"
        rows={tasks ?? []}
        rowKey={(row) => row.id}
        empty={<EmptyState title="Aucune tâche sur cette période." />}
        columns={[
          {
            header: "Tâche",
            cell: (row) => (
              <div className="flex flex-col gap-0.5">
                <span className="flex flex-wrap items-center gap-2">
                  <TextLink href={`/admin/taches/${row.id}`}>
                    {textOf(taskType, row.type)} · {row.property.name}
                  </TextLink>
                  {row.is_demo ? <DemoBadge /> : null}
                </span>
                <span className="text-small text-ink-soft">
                  {formatDayMonth(row.due_date)}
                  {row.window_start ? ` · ${formatTime(row.window_start)} → ${formatTime(row.window_end)}` : ""}
                </span>
              </div>
            ),
          },
          {
            header: "Liste",
            numeric: true,
            hideOnMobile: true,
            cell: (row) => {
              const list = (Array.isArray(row.checklist) ? row.checklist : []) as Array<{ done: boolean }>;
              return list.length ? `${list.filter((i) => i.done).length}/${list.length}` : "—";
            },
          },
          { header: "Photos", numeric: true, hideOnMobile: true, cell: (row) => row.task_photos.length },
          {
            header: "Agent",
            cell: (row) => (
              <ActionForm action={assignTask.bind(null, row.id)} className="flex items-center gap-2">
                <label className="sr-only" htmlFor={`agent-${row.id}`}>
                  Agent pour cette tâche
                </label>
                <Select id={`agent-${row.id}`} name="assignee_id" options={staff} placeholder="Non affectée" defaultValue={row.assignee_id ?? ""} className="min-w-40" />
                <SubmitButton variant="secondary" pendingLabel="…">
                  OK
                </SubmitButton>
              </ActionForm>
            ),
          },
          { header: "Statut", cell: (row) => <StatusBadge value={labelOf(taskStatus, row.status)} /> },
        ]}
      />
    </>
  );
}
