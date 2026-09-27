import { notFound } from "next/navigation";

import { FileUploader } from "@/components/app/FileUploader";
import { Notice, PageHeader, Panel, StatusBadge, TextLink } from "@/components/app/ui";
import { staffContext } from "@/lib/auth/admin-context";
import { formatDateTime } from "@/lib/dates";
import { incidentSeverity, incidentStatus, labelOf } from "@/lib/labels";
import { signedUrls } from "@/lib/storage";

import { confirmIncidentPhotoUpload, requestIncidentPhotoUpload } from "../../actions";

export const metadata = { title: "Signalement" };

export default async function StaffIncident({ params, searchParams }: PageProps<"/staff/incidents/[id]">) {
  const { id } = await params;
  const query = await searchParams;
  const { supabase } = await staffContext();
  const [{ data: incident }, { data: photos }] = await Promise.all([
    supabase.from("incidents").select("id, title, description, status, severity, created_at, resolution, property:properties(name)").eq("id", id).maybeSingle(),
    supabase.from("incident_photos").select("id, storage_path").eq("incident_id", id),
  ]);
  if (!incident) notFound();
  const urls = await signedUrls("field-photos", (photos ?? []).map((p) => p.storage_path), 600);

  return (
    <>
      <PageHeader
        eyebrow={<TextLink href="/staff/incidents">Signalements</TextLink>}
        title={incident.title}
        description={
          <span className="flex flex-wrap items-center gap-2">
            {incident.property?.name} · {formatDateTime(incident.created_at)}
            <StatusBadge value={labelOf(incidentSeverity, incident.severity)} />
            <StatusBadge value={labelOf(incidentStatus, incident.status)} />
          </span>
        }
      />
      {query.nouveau ? <Notice tone="positive">Signalement envoyé à l’équipe. Ajoutez une photo si possible.</Notice> : null}
      {incident.description ? <p className="whitespace-pre-line">{incident.description}</p> : null}
      {incident.resolution ? <Notice tone="positive" title="Résolution">{incident.resolution}</Notice> : null}
      <Panel title="Photos" id="photos">
        <FileUploader
          requestUpload={requestIncidentPhotoUpload.bind(null, id)}
          confirmUpload={confirmIncidentPhotoUpload.bind(null, id)}
          accept="image/jpeg,image/png,image/webp"
          label="Ajouter des photos"
          capture="environment"
        />
        {(photos ?? []).length ? (
          <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {(photos ?? []).map((photo, index) => (
              <li key={photo.id}>
                {/* eslint-disable-next-line @next/next/no-img-element -- lien signé temporaire */}
                <img src={urls.get(photo.storage_path) ?? undefined} alt={`Photo ${index + 1} du signalement`} className="aspect-square w-full rounded-lg object-cover" />
              </li>
            ))}
          </ul>
        ) : null}
      </Panel>
    </>
  );
}
