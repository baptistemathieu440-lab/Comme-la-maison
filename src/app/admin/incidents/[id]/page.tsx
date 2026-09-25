import { notFound } from "next/navigation";

import { ActionForm, Checkbox, Field, FormActions, FormGrid, Input, Select, SubmitButton, Textarea } from "@/components/app/form";
import { DemoBadge, PageHeader, Panel, StatusBadge, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { formatDateShort, formatDateTime } from "@/lib/dates";
import { incidentSeverity, incidentStatus, labelOf, maintenanceStatus, optionsOf } from "@/lib/labels";
import { providerOptions } from "@/lib/options";
import { signedUrls } from "@/lib/storage";

import { createMaintenanceFromIncident, updateIncident } from "../actions";

export const metadata = { title: "Incident" };

export default async function IncidentPage({ params }: PageProps<"/admin/incidents/[id]">) {
  const { id } = await params;
  const { supabase } = await adminContext();
  const [{ data: incident }, { data: photos }, { data: jobs }, providers] = await Promise.all([
    supabase
      .from("incidents")
      .select("*, property:properties!inner(id, name), reporter:profiles!incidents_reported_by_fkey(full_name), task:tasks(id, title)")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("incident_photos").select("id, storage_path").eq("incident_id", id),
    supabase.from("maintenance_jobs").select("id, title, status, scheduled_on").eq("incident_id", id),
    providerOptions(supabase),
  ]);
  if (!incident) notFound();
  const urls = await signedUrls("field-photos", (photos ?? []).map((p) => p.storage_path), 600);

  return (
    <>
      <PageHeader
        eyebrow={<TextLink href="/admin/incidents">Incidents</TextLink>}
        title={incident.title}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <span>
              <TextLink href={`/admin/biens/${incident.property.id}`}>{incident.property.name}</TextLink> · signalé le{" "}
              {formatDateTime(incident.created_at)} {incident.reporter?.full_name ? `par ${incident.reporter.full_name}` : ""}
              {incident.task ? (
                <>
                  {" "}
                  pendant <TextLink href={`/admin/taches/${incident.task.id}`}>{incident.task.title}</TextLink>
                </>
              ) : null}
            </span>
            <StatusBadge value={labelOf(incidentSeverity, incident.severity)} />
            <StatusBadge value={labelOf(incidentStatus, incident.status)} />
            {incident.is_demo ? <DemoBadge /> : null}
          </span>
        }
      />

      {(photos ?? []).length ? (
        <Panel title="Photos" id="photos">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(photos ?? []).map((photo, index) => (
              <li key={photo.id}>
                <a href={urls.get(photo.storage_path) ?? "#"} target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element -- lien signé temporaire */}
                  <img src={urls.get(photo.storage_path) ?? undefined} alt={`Photo ${index + 1} de l’incident`} className="aspect-square w-full rounded-xl object-cover" />
                </a>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Suivi" id="suivi">
          <ActionForm action={updateIncident.bind(null, id)} className="flex flex-col gap-4">
            <Field name="title" label="Problème" required>
              <Input defaultValue={incident.title} required />
            </Field>
            <Field name="description" label="Détails">
              <Textarea defaultValue={incident.description ?? ""} />
            </Field>
            <FormGrid>
              <Field name="severity" label="Gravité">
                <Select options={optionsOf(incidentSeverity)} defaultValue={incident.severity} />
              </Field>
              <Field name="status" label="Statut">
                <Select options={optionsOf(incidentStatus)} defaultValue={incident.status} />
              </Field>
            </FormGrid>
            <Field name="resolution" label="Résolution">
              <Textarea rows={3} defaultValue={incident.resolution ?? ""} />
            </Field>
            <Checkbox name="visible_to_owner" defaultChecked={incident.visible_to_owner} label="Visible par le propriétaire" />
            <FormActions>
              <SubmitButton>Enregistrer</SubmitButton>
            </FormActions>
          </ActionForm>
        </Panel>

        <Panel title="Interventions" id="interventions">
          {(jobs ?? []).length ? (
            <ul className="mb-5 flex flex-col gap-2">
              {(jobs ?? []).map((job) => (
                <li key={job.id} className="flex flex-wrap items-center justify-between gap-2">
                  <TextLink href={`/admin/interventions/${job.id}`}>
                    {job.title} · {formatDateShort(job.scheduled_on)}
                  </TextLink>
                  <StatusBadge value={labelOf(maintenanceStatus, job.status)} />
                </li>
              ))}
            </ul>
          ) : null}
          <ActionForm action={createMaintenanceFromIncident.bind(null, id)} className="flex flex-col gap-4">
            <p className="text-small text-ink-soft">Planifier une intervention pour résoudre cet incident.</p>
            <Field name="title" label="Intervention">
              <Input defaultValue={incident.title} />
            </Field>
            <FormGrid>
              <Field name="provider_id" label="Prestataire">
                <Select options={providers} placeholder="À choisir" />
              </Field>
              <Field name="scheduled_on" label="Date prévue">
                <Input type="date" />
              </Field>
              <Field name="cost" label="Coût estimé (€)">
                <Input inputMode="decimal" />
              </Field>
            </FormGrid>
            <div>
              <SubmitButton>Créer l’intervention</SubmitButton>
            </div>
          </ActionForm>
        </Panel>
      </div>
    </>
  );
}
