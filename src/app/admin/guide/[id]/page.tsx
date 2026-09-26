import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";

import { FileUploader } from "@/components/app/FileUploader";
import { ActionForm, SubmitButton } from "@/components/app/form";
import { Badge, Notice, PageHeader, Panel, TextLink } from "@/components/app/ui";
import { buttonClasses } from "@/components/ui/Button";
import { adminContext } from "@/lib/auth/admin-context";
import { formatDate, formatDateTime } from "@/lib/dates";
import { placeHref } from "@/lib/guide/place";
import { guidePhotoUrl } from "@/server/guide";

import {
  confirmGuidePhotoUpload,
  deleteGuidePlace,
  markGuidePlaceVerified,
  removeGuidePhoto,
  requestGuidePhotoUpload,
  saveGuidePlace,
  setGuidePlacePublished,
} from "../actions";
import { GuidePlaceForm } from "../GuidePlaceForm";

export const metadata = { title: "Adresse du guide" };

export default async function GuidePlaceAdminPage({ params }: PageProps<"/admin/guide/[id]">) {
  const { id } = await params;
  const { supabase } = await adminContext();
  const { data: place } = await supabase.from("guide_places").select("*").eq("id", id).maybeSingle();
  if (!place) notFound();

  return (
    <>
      <PageHeader
        eyebrow={<TextLink href="/admin/guide">Guide voyageurs</TextLink>}
        title={place.name}
        description={
          <span className="flex flex-wrap items-center gap-2">
            {place.is_published ? <Badge tone="positive">Visible dans le guide</Badge> : <Badge tone="muted">Masquée</Badge>}
            <span className="text-small">
              Vérifiée le {formatDate(place.verified_on)} · modifiée le {formatDateTime(place.updated_at)}
            </span>
          </span>
        }
        actions={
          place.is_published ? (
            <a href={placeHref(place.slug)} target="_blank" rel="noopener noreferrer" className={buttonClasses("ghost", undefined, "sm")}>
              <ExternalLink aria-hidden="true" className="size-4" />
              Voir la fiche
            </a>
          ) : null
        }
      />

      {place.internal_notes ? <Notice tone="warning" title="Note interne">{place.internal_notes}</Notice> : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Panel title="Fiche" id="fiche">
          <GuidePlaceForm action={saveGuidePlace.bind(null, id)} values={place} submitLabel="Enregistrer" />
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel title="Actions rapides" id="actions">
            <div className="flex flex-col gap-3">
              <ActionForm action={markGuidePlaceVerified.bind(null, id)}>
                <SubmitButton variant="secondary" pendingLabel="Enregistrement…">
                  Marquer comme vérifiée aujourd’hui
                </SubmitButton>
              </ActionForm>
              <ActionForm action={setGuidePlacePublished.bind(null, id, !place.is_published)}>
                <SubmitButton variant="ghost">{place.is_published ? "Masquer du guide" : "Afficher dans le guide"}</SubmitButton>
              </ActionForm>
            </div>
          </Panel>

          <Panel title="Photo" id="photo" description="JPEG, PNG ou WebP. Uniquement une photo dont vous avez les droits (la vôtre, officielle autorisée ou libre de droits), jamais une image générée.">
            <div className="flex flex-col gap-4">
              {place.photo_path ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element -- aperçu dans le back-office */}
                  <img src={guidePhotoUrl(place.photo_path)} alt={place.photo_alt ?? ""} className="aspect-[4/3] w-full rounded-xl object-cover" loading="lazy" />
                  <ActionForm action={removeGuidePhoto.bind(null, id)} confirmMessage="Retirer cette photo ?">
                    <SubmitButton variant="ghost" pendingLabel="Suppression…">
                      Retirer la photo
                    </SubmitButton>
                  </ActionForm>
                </>
              ) : (
                <p className="text-small text-ink-soft">Sans photo, le guide affiche une illustration aux couleurs de la marque.</p>
              )}
              <FileUploader
                requestUpload={requestGuidePhotoUpload.bind(null, id)}
                confirmUpload={confirmGuidePhotoUpload.bind(null, id)}
                accept="image/jpeg,image/png,image/webp"
                label={place.photo_path ? "Remplacer la photo" : "Ajouter une photo"}
                multiple={false}
              />
            </div>
          </Panel>

          <Panel title="Supprimer" id="supprimer" description="Préférez « Masquer du guide » si l’adresse peut revenir (fermeture pour travaux, saison).">
            <ActionForm action={deleteGuidePlace.bind(null, id)} confirmMessage={`Supprimer définitivement « ${place.name} » ?`}>
              <SubmitButton variant="ghost" pendingLabel="Suppression…">
                Supprimer l’adresse
              </SubmitButton>
            </ActionForm>
          </Panel>
        </div>
      </div>
    </>
  );
}
