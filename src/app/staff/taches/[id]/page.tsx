import { notFound } from "next/navigation";
import { AlertTriangle, KeyRound, MapPin } from "lucide-react";

import { buttonClasses } from "@/components/ui/Button";
import { FileUploader } from "@/components/app/FileUploader";
import { ActionForm, Checkbox, Field, SubmitButton, Textarea } from "@/components/app/form";
import { DemoBadge, DescriptionList, Notice, PageHeader, Panel, StatusBadge } from "@/components/app/ui";
import { staffContext } from "@/lib/auth/admin-context";
import { formatDate, formatDayMonth, formatTime } from "@/lib/dates";
import { labelOf, taskStatus, taskType, textOf } from "@/lib/labels";
import { signedUrls } from "@/lib/storage";

import { confirmTaskPhotoUpload, requestTaskPhotoUpload, updateMyTask } from "../../actions";

export const metadata = { title: "Tâche" };

export default async function StaffTaskPage({ params }: PageProps<"/staff/taches/[id]">) {
  const { id } = await params;
  const { supabase } = await staffContext();
  const [{ data: task }, { data: access }, { data: photos }] = await Promise.all([
    supabase.from("staff_tasks").select("*").eq("id", id).maybeSingle(),
    supabase.rpc("staff_task_access", { p_task: id }),
    supabase.from("task_photos").select("id, storage_path, kind, created_at").eq("task_id", id).order("created_at"),
  ]);
  if (!task) notFound();
  const urls = await signedUrls("field-photos", (photos ?? []).map((p) => p.storage_path), 600);
  const checklist = (Array.isArray(task.checklist) ? task.checklist : []) as Array<{ label: string; done: boolean }>;
  const codes = access?.[0];
  const address = [task.address_line, task.postal_code, task.city].filter(Boolean).join(", ");
  const closed = task.status === "validated";

  return (
    <>
      <PageHeader
        eyebrow={formatDate(task.due_date)}
        title={`${textOf(taskType, task.type)} · ${task.property_name}`}
        description={
          <span className="flex flex-wrap items-center gap-2">
            {task.window_start ? `${formatTime(task.window_start)} → ${formatTime(task.window_end)}` : "Horaire libre"}
            <StatusBadge value={labelOf(taskStatus, task.status)} />
            {task.is_demo ? <DemoBadge /> : null}
          </span>
        }
      />

      <Panel title="Adresse" id="adresse">
        <p className="flex items-start gap-2 text-[1rem]">
          <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-ink-soft" />
          <span>
            {address || "Adresse non renseignée"}
            {task.floor_info ? <span className="block text-small text-ink-soft">{task.floor_info}</span> : null}
          </span>
        </p>
        {address ? (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("ghost", "mt-3", "sm")}
          >
            Itinéraire (nouvel onglet)
          </a>
        ) : null}
      </Panel>

      <Panel title="Accès" id="acces">
        {codes ? (
          <div className="flex flex-col gap-3">
            <p className="flex items-center gap-2 text-small text-ink-soft">
              <KeyRound aria-hidden="true" className="size-4" /> Visibles aujourd’hui seulement. Ne les partagez pas.
            </p>
            <DescriptionList
              items={[
                { label: "Code de la porte", value: codes.door_code, hidden: !codes.door_code },
                { label: "Boîte à clés", value: [codes.key_box_code, codes.key_box_location].filter(Boolean).join(" · "), hidden: !codes.key_box_code && !codes.key_box_location },
                { label: "Alarme", value: codes.alarm_code, hidden: !codes.alarm_code },
                { label: "Wifi", value: [codes.wifi_name, codes.wifi_password].filter(Boolean).join(" · "), hidden: !codes.wifi_name },
                { label: "Stationnement", value: codes.parking_info, hidden: !codes.parking_info },
              ]}
            />
            {codes.access_instructions ? <p className="whitespace-pre-line text-[0.9375rem]">{codes.access_instructions}</p> : null}
          </div>
        ) : (
          <p className="text-small text-ink-soft">Les codes d’accès s’affichent le jour de la tâche (ou pendant qu’elle est en cours).</p>
        )}
      </Panel>

      <Panel title="Séjour" id="sejour">
        <DescriptionList
          items={[
            { label: "Voyageurs", value: task.booking_adults !== null ? `${(task.booking_adults ?? 0) + (task.booking_children ?? 0)} (dont ${task.booking_children ?? 0} enfant(s))` : "—" },
            { label: "Prénom", value: task.guest_first_name },
            { label: "Départ", value: formatDayMonth(task.booking_check_out) },
            { label: "Prochaine arrivée", value: task.next_check_in ? formatDate(task.next_check_in) : "Aucune prévue" },
            { label: "Capacité du logement", value: task.capacity ? `${task.capacity} voyageurs` : null },
          ]}
        />
        {task.instructions ? <Notice tone="info" title="Consignes" className="mt-4"><p className="whitespace-pre-line">{task.instructions}</p></Notice> : null}
      </Panel>

      <Panel title={`Liste de contrôle (${checklist.filter((i) => i.done).length}/${checklist.length})`} id="liste">
        {closed ? <Notice tone="positive" className="mb-4">Tâche validée par l’équipe.</Notice> : null}
        <ActionForm action={updateMyTask.bind(null, id)} className="flex flex-col gap-4">
          <fieldset className="flex flex-col gap-1" disabled={closed}>
            <legend className="sr-only">Points à vérifier</legend>
            {checklist.map((item, index) => (
              <Checkbox key={item.label} name={`item-${index}`} defaultChecked={item.done} label={item.label} className="min-h-11 items-center rounded-xl px-2 hover:bg-cream" />
            ))}
          </fieldset>
          <Field name="agent_notes" label="Notes pour l’équipe">
            <Textarea rows={3} defaultValue={task.agent_notes ?? ""} disabled={closed} placeholder="Linge manquant, consommable à racheter…" />
          </Field>
          {!closed ? (
            <>
              {task.status !== "done" ? (
                <Checkbox name="confirm_incomplete" label="Terminer malgré des points non cochés (expliquez pourquoi dans les notes)" />
              ) : null}
              <div className="flex flex-wrap gap-2">
                {task.status === "todo" ? (
                  <SubmitButton name="intent" value="start" pendingLabel="…">
                    Commencer
                  </SubmitButton>
                ) : null}
                {task.status === "todo" || task.status === "in_progress" ? (
                  <SubmitButton name="intent" value="finish" pendingLabel="…">
                    Terminer la tâche
                  </SubmitButton>
                ) : null}
                {task.status === "done" ? (
                  <SubmitButton name="intent" value="reopen" variant="ghost" pendingLabel="…">
                    Reprendre
                  </SubmitButton>
                ) : null}
                <SubmitButton name="intent" value="save" variant="secondary" pendingLabel="…">
                  Enregistrer
                </SubmitButton>
              </div>
            </>
          ) : null}
        </ActionForm>
      </Panel>

      <Panel title={`Photos (${(photos ?? []).length})`} id="photos" description="Prenez une photo de chaque pièce après le ménage.">
        {!closed ? (
          <FileUploader
            requestUpload={requestTaskPhotoUpload.bind(null, id)}
            confirmUpload={confirmTaskPhotoUpload.bind(null, id)}
            accept="image/jpeg,image/png,image/webp"
            label="Ajouter des photos"
            capture="environment"
            extraFields={
              <label className="flex flex-col gap-1 text-[0.875rem] font-semibold">
                Moment
                <select name="kind" defaultValue="after" className="min-h-11 rounded-[var(--radius-field)] border-[1.5px] border-line-strong bg-white px-3 text-[0.9375rem]">
                  <option value="after">Après le ménage</option>
                  <option value="before">Avant (état à l’arrivée)</option>
                  <option value="issue">Problème constaté</option>
                </select>
              </label>
            }
          />
        ) : null}
        {(photos ?? []).length ? (
          <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {(photos ?? []).map((photo, index) => (
              <li key={photo.id}>
                {/* eslint-disable-next-line @next/next/no-img-element -- lien signé temporaire */}
                <img src={urls.get(photo.storage_path) ?? undefined} alt={`Photo ${index + 1}`} className="aspect-square w-full rounded-lg object-cover" />
              </li>
            ))}
          </ul>
        ) : null}
      </Panel>

      <a href={`/staff/incidents?tache=${id}`} className={buttonClasses("ghost", undefined, "sm")}>
        <AlertTriangle aria-hidden="true" className="size-4" />
        Signaler un problème dans ce logement
      </a>
    </>
  );
}
