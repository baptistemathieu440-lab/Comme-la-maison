import { ActionForm, Field, FormGrid, Input, Select, SubmitButton, Textarea } from "@/components/app/form";
import { EmptyState, PageHeader, Panel, StatusBadge, TextLink } from "@/components/app/ui";
import { staffContext } from "@/lib/auth/admin-context";
import { formatDateShort } from "@/lib/dates";
import { incidentSeverity, incidentStatus, labelOf, optionsOf } from "@/lib/labels";

import { reportIncident } from "../actions";

export const metadata = { title: "Signalements" };

export default async function StaffIncidents({ searchParams }: PageProps<"/staff/incidents">) {
  const { supabase } = await staffContext();
  const params = await searchParams;
  const taskId = typeof params.tache === "string" ? params.tache : null;
  const [{ data: properties }, { data: incidents }, { data: task }] = await Promise.all([
    supabase.from("properties").select("id, name").order("name"),
    supabase.from("incidents").select("id, title, status, severity, created_at, property:properties(name)").order("created_at", { ascending: false }),
    taskId ? supabase.from("staff_tasks").select("id, property_id").eq("id", taskId).maybeSingle() : Promise.resolve({ data: null }),
  ]);

  return (
    <>
      <PageHeader title="Signalements" description="Un problème dans un logement ? Signalez-le : l’équipe est prévenue immédiatement." />
      <Panel title="Signaler un problème" id="signaler">
        {(properties ?? []).length === 0 ? (
          <p className="text-small text-ink-soft">Vous pourrez signaler un problème dans les logements de vos tâches.</p>
        ) : (
          <ActionForm action={reportIncident} className="flex flex-col gap-4">
            {task ? <input type="hidden" name="task_id" value={task.id ?? ""} /> : null}
            <FormGrid>
              <Field name="property_id" label="Logement" required>
                <Select options={(properties ?? []).map((p) => ({ value: p.id, label: p.name }))} placeholder="Choisir…" defaultValue={task?.property_id ?? ""} required />
              </Field>
              <Field name="severity" label="Urgence">
                <Select options={optionsOf(incidentSeverity)} defaultValue="medium" />
              </Field>
            </FormGrid>
            <Field name="title" label="Problème" required>
              <Input required placeholder="Fuite, casse, appareil en panne, objet oublié…" />
            </Field>
            <Field name="description" label="Détails">
              <Textarea rows={3} />
            </Field>
            <div>
              <SubmitButton pendingLabel="Envoi…">Envoyer le signalement</SubmitButton>
            </div>
          </ActionForm>
        )}
      </Panel>
      <Panel title="Mes signalements" id="mes-signalements">
        {(incidents ?? []).length === 0 ? (
          <EmptyState title="Aucun signalement." />
        ) : (
          <ul className="flex flex-col divide-y divide-line">
            {(incidents ?? []).map((i) => (
              <li key={i.id} className="flex flex-col gap-1 py-3 first:pt-0">
                <TextLink href={`/staff/incidents/${i.id}`}>{i.title}</TextLink>
                <span className="flex flex-wrap items-center gap-2 text-small text-ink-soft">
                  {i.property?.name} · {formatDateShort(i.created_at)}
                  <StatusBadge value={labelOf(incidentSeverity, i.severity)} />
                  <StatusBadge value={labelOf(incidentStatus, i.status)} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
