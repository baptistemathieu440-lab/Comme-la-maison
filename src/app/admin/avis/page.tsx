import { ExternalLink } from "lucide-react";

import { FilterBar, FilterField, filterControl, param } from "@/components/app/FilterBar";
import { Badge, DataTable, EmptyState, Notice, PageHeader, StatCard, TextLink } from "@/components/app/ui";
import { ButtonLink, buttonClasses } from "@/components/ui/Button";
import { reviewCategories, reviewCategoryKeys, type ReviewCategory } from "@/content/reviews";
import { adminContext } from "@/lib/auth/admin-context";
import { formatDateShort } from "@/lib/dates";

export const metadata = { title: "Avis clients" };

function excerpt(text: string, max = 110) {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export default async function ReviewsAdminPage({ searchParams }: PageProps<"/admin/avis">) {
  const { supabase } = await adminContext();
  const params = await searchParams;
  const visibility = param(params.visibilite);
  const category = param(params.categorie);

  const { data, error } = await supabase
    .from("site_reviews")
    .select("id, author_name, city, category, rating, body, source, received_on, consent_confirmed, is_published, is_demo, position")
    .order("position")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <>
        <PageHeader title="Avis clients" />
        <Notice tone="warning" title="Les avis ne sont pas encore installés dans la base">
          Appliquez la migration <code>20260927124120_site_reviews.sql</code> (voir docs/plateforme-exploitation.md).
        </Notice>
      </>
    );
  }

  const all = data ?? [];
  const rows = all.filter((row) => {
    if (visibility === "publies" && !row.is_published) return false;
    if (visibility === "masques" && row.is_published) return false;
    if (visibility === "sans-accord" && row.consent_confirmed) return false;
    if (category && row.category !== category) return false;
    return true;
  });
  const published = all.filter((row) => row.is_published);
  const average = published.length > 0 ? published.reduce((sum, row) => sum + row.rating, 0) / published.length : null;

  return (
    <>
      <PageHeader
        title="Avis clients"
        description="Les avis affichés sur l’accueil du site. Uniquement de vrais avis, publiés avec l’accord de leur auteur. Chaque modification est en ligne immédiatement."
        actions={
          <>
            <a href="/#avis" target="_blank" rel="noopener noreferrer" className={buttonClasses("ghost", undefined, "sm")}>
              <ExternalLink aria-hidden="true" className="size-4" />
              Voir sur le site
            </a>
            <ButtonLink href="/admin/avis/nouveau" size="sm">
              Ajouter un avis
            </ButtonLink>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Avis enregistrés" value={all.length} href="/admin/avis" />
        <StatCard label="Publiés sur l’accueil" value={published.length} href="/admin/avis?visibilite=publies" />
        <StatCard label="Sans accord de l’auteur" value={all.filter((row) => !row.consent_confirmed).length} href="/admin/avis?visibilite=sans-accord" />
        <StatCard
          label="Note moyenne publiée"
          value={average === null ? "—" : `${average.toFixed(1).replace(".", ",")} / 5`}
          hint="Moyenne des avis publiés, pour information (non affichée sur le site)"
        />
      </div>

      <FilterBar resetHref="/admin/avis">
        <FilterField label="Visibilité" id="f-visibilite">
          <select id="f-visibilite" name="visibilite" defaultValue={visibility} className={filterControl}>
            <option value="">Tous</option>
            <option value="publies">Publiés</option>
            <option value="masques">Non publiés</option>
            <option value="sans-accord">Sans accord de l’auteur</option>
          </select>
        </FilterField>
        <FilterField label="Auteur" id="f-categorie">
          <select id="f-categorie" name="categorie" defaultValue={category} className={filterControl}>
            <option value="">Tous</option>
            {reviewCategoryKeys.map((key) => (
              <option key={key} value={key}>
                {reviewCategories[key].plural}
              </option>
            ))}
          </select>
        </FilterField>
      </FilterBar>

      <DataTable
        caption="Avis clients"
        rows={rows}
        rowKey={(row) => row.id}
        empty={
          <EmptyState title="Aucun avis pour l’instant." action={<ButtonLink href="/admin/avis/nouveau" size="sm">Ajouter un avis</ButtonLink>}>
            Tant qu’aucun avis n’est publié, la section « Avis » n’apparaît pas sur l’accueil : aucun avis d’exemple n’est jamais montré.
          </EmptyState>
        }
        columns={[
          {
            header: "Avis",
            cell: (row) => (
              <span className="flex flex-col gap-0.5">
                <TextLink href={`/admin/avis/${row.id}`}>
                  {row.author_name}
                  {row.city ? `, ${row.city}` : ""}
                </TextLink>
                <span className="text-small text-ink-soft">« {excerpt(row.body)} »</span>
              </span>
            ),
          },
          { header: "Note", cell: (row) => <span className="whitespace-nowrap">{row.rating} / 5</span> },
          { header: "Auteur", cell: (row) => reviewCategories[row.category as ReviewCategory]?.label ?? row.category },
          {
            header: "Source",
            cell: (row) => [row.source, row.received_on ? formatDateShort(row.received_on) : null].filter(Boolean).join(" · ") || "—",
          },
          {
            header: "Statut",
            cell: (row) => (
              <span className="flex flex-wrap gap-1.5">
                {row.is_published ? <Badge tone="positive">Publié</Badge> : <Badge tone="muted">Non publié</Badge>}
                {!row.consent_confirmed ? <Badge tone="warning">Accord à obtenir</Badge> : null}
                {row.is_demo ? <Badge tone="info">Démo</Badge> : null}
              </span>
            ),
          },
        ]}
      />
    </>
  );
}
