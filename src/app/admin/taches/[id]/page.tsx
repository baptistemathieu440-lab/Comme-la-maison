import { notFound } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";

import { ActionForm, FormActions, SubmitButton } from "@/components/app/form";
import { DemoBadge, DescriptionList, Notice, PageHeader, Panel, StatusBadge, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { formatDate, formatDateTime, formatStay, formatTime } from "@/lib/dates";
import { incidentStatus, labelOf, taskStatus, taskType, textOf } from "@/lib/labels";
import { propertyOptions, staffOptions } from "@/lib/options";
import { signedUrls } from "@/lib/storage";

import { deleteTask, setTaskStatus, updateTask } from "../actions";
import { TaskFields } from "../TaskFields";

export const metadata = { title: "Tâche" };

export default async function TaskPage({ params }: PageProps<"/admin/taches/[id]">) {
  const { id } = await params;
  const { supabase } = await adminContext();
  const [{ data: task }, { data: photos }, { data: incidents }, properties, staff] = await Promise.all([
    supabase
      .from("tasks")
      .select("*, property:properties!inner(id, name, address_line, city), booking:bookings(id, reference, check_in, check_out), assignee:profiles!tasks_assignee_id_fkey(full_name), validator:profiles!tasks_validated_by_fkey(full_name)")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("task_photos").select("id, storage_path, kind, caption, created_at").eq("task_id", id).order("created_at"),
    supabase.from("incidents").select("id, title, status").eq("task_id", id),
    propertyOptions(supabase),
    staffOptions(supabase),
  ]);
  if (!task) notFound();
  const urls = await signedUrls("field-photos", (photos ?? []).map((p) => p.storage_path), 600);
  const checklist = (Array.isArray(task.checklist) ? task.checklist : []) as Array<{ label: string; done: boolean }>;

  return (
    <>
      <PageHeader
        eyebrow={<TextLink href="/admin/taches">Tâches</TextLink>}
        title={task.title}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <span>
              {textOf(taskType, task.type)} · {formatDate(task.due_date)}
              {task.window_start ? ` · ${formatTime(task.window_start)} → ${formatTime(task.window_end)}` : ""}
            </span>
            <StatusBadge value={labelOf(taskStatus, task.status)} />
            {task.is_demo ? <DemoBadge /> : null}
          </span>
        }
        actions={
          <>
            {task.status === "done" ? (
              <ActionForm action={setTaskStatus.bind(null, id, "validated")}>
                <SubmitButton pendingLabel="…">Valider la tâche</SubmitButton>
              </ActionForm>
            ) : null}
            {["done", "validated"].includes(task.status) ? (
              <ActionForm action={setTaskStatus.bind(null, id, "in_progress")}>
                <SubmitButton variant="ghost" pendingLabel="…">
                  Rouvrir
                </SubmitButton>
              </ActionForm>
            ) : null}
            {task.status === "todo" ? (
              <ActionForm action={setTaskStatus.bind(null, id, "cancelled")} confirmMessage="Annuler cette tâche ?">
                <SubmitButton variant="ghost" pendingLabel="…">
                  Annuler
                </SubmitButton>
              </ActionForm>
            ) : null}
          </>
        }
      />

      {task.status === "done" ? <Notice tone="warning">Terminée par l’agent : vérifiez la liste et les photos, puis validez.</Notice> : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Détails" id="details">
          <DescriptionList
            items={[
              { label: "Bien", value: <TextLink href={`/admin/biens/${task.property.id}`}>{task.property.name}</TextLink> },
              { label: "Adresse", value: [task.property.address_line, task.property.city].filter(Boolean).join(", ") },
              { label: "Agent", value: task.assignee?.full_name ?? "Non affectée" },
              {
                label: "Réservation",
                value: task.booking ? (
                  <TextLink href={`/admin/reservations/${task.booking.id}`}>
                    {task.booking.reference} · {formatStay(task.booking.check_in, task.booking.check_out)}
                  </TextLink>
                ) : null,
              },
              { label: "Commencée", value: formatDateTime(task.started_at) },
              { label: "Terminée", value: formatDateTime(task.completed_at) },
              { label: "Validée", value: task.validated_at ? `${formatDateTime(task.validated_at)}${task.validator?.full_name ? ` par ${task.validator.full_name}` : ""}` : null },
              { label: "Créée par", value: task.created_by_rule ? "Automatisation (ménage à chaque départ)" : "Saisie manuelle" },
            ]}
          />
          {task.instructions ? <p className="mt-4 whitespace-pre-line rounded-xl bg-cream p-3 text-[0.9375rem]">{task.instructions}</p> : null}
          {task.agent_notes ? (
            <div className="mt-4">
              <p className="text-small font-semibold text-ink-soft">Notes de l’agent</p>
              <p className="whitespace-pre-line text-[0.9375rem]">{task.agent_notes}</p>
            </div>
          ) : null}
        </Panel>

        <Panel title={`Liste de contrôle (${checklist.filter((i) => i.done).length}/${checklist.length})`} id="liste">
          {checklist.length === 0 ? (
            <p className="text-small text-ink-soft">Aucune liste pour cette tâche.</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {checklist.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-[0.9375rem]">
                  {item.done ? <CheckCircle2 aria-hidden="true" className="size-5 text-maison" /> : <Circle aria-hidden="true" className="size-5 text-ink-soft" />}
                  <span>{item.label}</span>
                  <span className="sr-only">{item.done ? "fait" : "non fait"}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel title={`Photos (${(photos ?? []).length})`} id="photos">
        {(photos ?? []).length === 0 ? (
          <p className="text-small text-ink-soft">Aucune photo envoyée par l’agent.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {(photos ?? []).map((photo, index) => (
              <li key={photo.id} className="flex flex-col gap-1">
                <a href={urls.get(photo.storage_path) ?? "#"} target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element -- lien signé temporaire vers un stockage privé */}
                  <img src={urls.get(photo.storage_path) ?? undefined} alt={photo.caption || `Photo ${index + 1} de la tâche`} className="aspect-square w-full rounded-xl object-cover" loading="lazy" />
                </a>
                <span className="text-[0.8125rem] text-ink-soft">{formatDateTime(photo.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {(incidents ?? []).length ? (
        <Panel title="Incidents signalés pendant la tâche" id="incidents">
          <ul className="flex flex-col gap-2">
            {(incidents ?? []).map((incident) => (
              <li key={incident.id} className="flex items-center justify-between gap-2">
                <TextLink href={`/admin/incidents/${incident.id}`}>{incident.title}</TextLink>
                <StatusBadge value={labelOf(incidentStatus, incident.status)} />
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      <Panel title="Modifier" id="modifier">
        <ActionForm action={updateTask.bind(null, id)} className="flex flex-col gap-4">
          <TaskFields
            properties={properties}
            staff={staff}
            values={{ ...task, checklist: checklist.map((item) => item.label) }}
          />
          <FormActions>
            <SubmitButton>Enregistrer</SubmitButton>
          </FormActions>
        </ActionForm>
      </Panel>

      <Panel title="Supprimer" id="suppression">
        <ActionForm action={deleteTask.bind(null, id)} confirmMessage="Supprimer cette tâche et ses photos ?">
          <SubmitButton variant="ghost" pendingLabel="Suppression…">
            Supprimer la tâche
          </SubmitButton>
        </ActionForm>
      </Panel>
    </>
  );
}
