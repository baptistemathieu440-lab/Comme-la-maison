import { FileUploader } from "@/components/app/FileUploader";
import { ActionForm, Checkbox, Field, Input, SubmitButton } from "@/components/app/form";
import { EmptyState, Panel } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { signedUrls } from "@/lib/storage";

import {
  confirmPropertyPhotoUpload,
  deletePropertyPhoto,
  requestPropertyPhotoUpload,
  updatePropertyPhoto,
} from "../../photo-actions";

export const metadata = { title: "Photos du bien" };

export default async function PhotosPage({ params }: PageProps<"/admin/biens/[id]/photos">) {
  const { id } = await params;
  const { supabase } = await adminContext();
  const { data: photos } = await supabase
    .from("property_photos")
    .select("id, storage_path, caption, position, is_public")
    .eq("property_id", id)
    .order("position");
  const urls = await signedUrls("property-photos", (photos ?? []).map((photo) => photo.storage_path), 600);

  return (
    <>
      <Panel title="Ajouter des photos" id="ajout-photos" description="JPEG, PNG ou WebP, 10 Mo au maximum. Les photos sont réduites à 2 000 px avant l’envoi.">
        <FileUploader
          requestUpload={requestPropertyPhotoUpload.bind(null, id)}
          confirmUpload={confirmPropertyPhotoUpload.bind(null, id)}
          accept="image/jpeg,image/png,image/webp"
          label="Photos"
        />
      </Panel>

      {(photos ?? []).length === 0 ? (
        <EmptyState title="Aucune photo pour ce bien." />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {(photos ?? []).map((photo, index) => (
            <li key={photo.id} className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-3">
              {urls.get(photo.storage_path) ? (
                // eslint-disable-next-line @next/next/no-img-element -- lien signé temporaire vers un stockage privé
                <img
                  src={urls.get(photo.storage_path) ?? undefined}
                  alt={photo.caption || `Photo ${index + 1} du bien`}
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="grid aspect-[4/3] place-items-center rounded-xl bg-stone text-small text-ink-soft">Aperçu indisponible</div>
              )}
              <ActionForm action={updatePropertyPhoto.bind(null, id, photo.id)} className="flex flex-col gap-3">
                <Field name="caption" label="Légende">
                  <Input defaultValue={photo.caption ?? ""} maxLength={200} />
                </Field>
                <Field name="position" label="Ordre">
                  <Input type="number" min={0} defaultValue={photo.position} className="max-w-28" />
                </Field>
                <Checkbox name="is_public" defaultChecked={photo.is_public} label="Visible sur le site public" />
                <SubmitButton variant="secondary">Enregistrer</SubmitButton>
              </ActionForm>
              <ActionForm action={deletePropertyPhoto.bind(null, id, photo.id)} confirmMessage="Supprimer cette photo ?">
                <SubmitButton variant="ghost" pendingLabel="Suppression…">
                  Supprimer
                </SubmitButton>
              </ActionForm>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
