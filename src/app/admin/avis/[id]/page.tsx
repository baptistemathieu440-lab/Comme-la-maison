import { notFound } from "next/navigation";

import { ActionForm, SubmitButton } from "@/components/app/form";
import { Badge, Notice, PageHeader, Panel, TextLink } from "@/components/app/ui";
import { reviewCategories, type ReviewCategory } from "@/content/reviews";
import { adminContext } from "@/lib/auth/admin-context";
import { formatDateTime } from "@/lib/dates";

import { deleteReview, saveReview, setReviewPublished } from "../actions";
import { ReviewForm } from "../ReviewForm";

export const metadata = { title: "Avis client" };

export default async function ReviewAdminPage({ params }: PageProps<"/admin/avis/[id]">) {
  const { id } = await params;
  const { supabase } = await adminContext();
  const { data: review } = await supabase.from("site_reviews").select("*").eq("id", id).maybeSingle();
  if (!review) notFound();

  const category = reviewCategories[review.category as ReviewCategory]?.label ?? review.category;

  return (
    <>
      <PageHeader
        eyebrow={<TextLink href="/admin/avis">Avis clients</TextLink>}
        title={`Avis de ${review.author_name}`}
        description={
          <span className="flex flex-wrap items-center gap-2">
            {review.is_published ? <Badge tone="positive">Publié sur l’accueil</Badge> : <Badge tone="muted">Non publié</Badge>}
            {!review.consent_confirmed ? <Badge tone="warning">Accord à obtenir</Badge> : null}
            <span className="text-small">
              {category} · {review.rating} / 5 · modifié le {formatDateTime(review.updated_at)}
            </span>
          </span>
        }
      />

      {!review.consent_confirmed ? (
        <Notice tone="warning" title="Accord de l’auteur manquant">
          Cet avis ne peut pas être publié tant que son auteur n’a pas accepté qu’il apparaisse sur le site.
        </Notice>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Panel title="Fiche" id="fiche">
          <ReviewForm action={saveReview.bind(null, id)} values={review} submitLabel="Enregistrer" />
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel title="Publication" id="publication">
            {review.is_published || review.consent_confirmed ? (
              <ActionForm action={setReviewPublished.bind(null, id, !review.is_published)}>
                <SubmitButton variant={review.is_published ? "ghost" : "secondary"} pendingLabel="Enregistrement…">
                  {review.is_published ? "Retirer de l’accueil" : "Publier sur l’accueil"}
                </SubmitButton>
              </ActionForm>
            ) : (
              <p className="text-small text-ink-soft">
                Cochez « L’auteur a accepté que son avis soit publié sur le site » dans la fiche, enregistrez, puis publiez.
              </p>
            )}
          </Panel>

          <Panel title="Supprimer" id="supprimer" description="Préférez « Retirer de l’accueil » si l’avis peut revenir.">
            <ActionForm action={deleteReview.bind(null, id)} confirmMessage={`Supprimer définitivement l’avis de ${review.author_name} ?`}>
              <SubmitButton variant="ghost" pendingLabel="Suppression…">
                Supprimer l’avis
              </SubmitButton>
            </ActionForm>
          </Panel>
        </div>
      </div>
    </>
  );
}
