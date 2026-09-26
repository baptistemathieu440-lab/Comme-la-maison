import { ExternalLink, QrCode } from "lucide-react";

import { ActionForm, SubmitButton } from "@/components/app/form";
import { FilterBar, FilterField, filterControl, param } from "@/components/app/FilterBar";
import { Badge, DataTable, Notice, PageHeader, Panel, StatCard, TextLink } from "@/components/app/ui";
import { ButtonLink, buttonClasses } from "@/components/ui/Button";
import { seedPlaces } from "@/content/guide/places";
import { adminContext } from "@/lib/auth/admin-context";
import { addDays, formatDateShort, todayIso } from "@/lib/dates";
import { budgets, isKey, kindKeys, kinds, statuses, type Budget, type Kind, type Status } from "@/lib/guide/taxonomy";
import { normalizeQuery } from "@/lib/search";

import { importGuideSeed } from "./actions";

export const metadata = { title: "Guide voyageurs" };

function plain(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

/** Au-delà de six mois, une adresse est à revérifier (horaires, prix, ouverture). */
const STALE_AFTER_DAYS = 180;

export default async function GuideAdminPage({ searchParams }: PageProps<"/admin/guide">) {
  const { supabase } = await adminContext();
  const params = await searchParams;
  const kind = param(params.categorie);
  const visibility = param(params.visibilite);
  const check = param(params.verification);
  const q = normalizeQuery(param(params.q));
  const staleBefore = addDays(todayIso(), -STALE_AFTER_DAYS);

  const { data, error } = await supabase
    .from("guide_places")
    .select("id, slug, name, kind, subcategory, budget, area, status, is_published, is_favorite, verified_on, rating, rating_source, internal_notes, updated_at")
    .order("position")
    .order("name");

  if (error) {
    return (
      <>
        <PageHeader title="Guide voyageurs" />
        <Notice tone="warning" title="Le guide n’est pas encore installé dans la base">
          Appliquez la migration <code>20260926000100_guide_places.sql</code> (voir docs/guide-voyageurs.md). En attendant, le guide public
          affiche la sélection initiale.
        </Notice>
      </>
    );
  }

  const all = data ?? [];
  const isStale = (row: (typeof all)[number]) => !row.verified_on || row.verified_on < staleBefore;
  const rows = all.filter((row) => {
    if (kind && row.kind !== kind) return false;
    if (visibility === "publiees" && !row.is_published) return false;
    if (visibility === "masquees" && row.is_published) return false;
    if (check === "a-revoir" && !isStale(row)) return false;
    if (check === "budget" && !row.internal_notes?.includes("Budget estimé")) return false;
    if (q && !plain(`${row.name} ${row.area} ${row.subcategory ?? ""}`).includes(q)) return false;
    return true;
  });
  const missingSeeds = seedPlaces.filter((seed) => !all.some((row) => row.slug === seed.slug)).length;

  return (
    <>
      <PageHeader
        title="Guide voyageurs"
        description="Le carnet de bonnes adresses ouvert par les voyageurs depuis le QR code des logements. Chaque modification est en ligne immédiatement."
        actions={
          <>
            <a href="/guide" target="_blank" rel="noopener noreferrer" className={buttonClasses("ghost", undefined, "sm")}>
              <ExternalLink aria-hidden="true" className="size-4" />
              Voir le guide
            </a>
            <ButtonLink href="/admin/guide/qr-code" variant="secondary" size="sm">
              <QrCode aria-hidden="true" className="size-4" />
              QR code
            </ButtonLink>
            <ButtonLink href="/admin/guide/nouveau" size="sm">
              Ajouter une adresse
            </ButtonLink>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Adresses" value={all.length} href="/admin/guide" />
        <StatCard label="Visibles dans le guide" value={all.filter((row) => row.is_published).length} href="/admin/guide?visibilite=publiees" />
        <StatCard
          label="À revérifier"
          value={all.filter(isStale).length}
          hint={`Jamais vérifiées ou vérifiées il y a plus de ${STALE_AFTER_DAYS} jours`}
          href="/admin/guide?verification=a-revoir"
        />
        <StatCard label="Coups de cœur" value={all.filter((row) => row.is_favorite).length} />
      </div>

      {missingSeeds > 0 ? (
        <Panel
          title="Sélection initiale"
          id="import"
          description={
            all.length === 0
              ? `Le guide public affiche pour l’instant la sélection préparée en septembre 2026 (${seedPlaces.length} adresses vérifiées). Importez-la pour pouvoir la modifier ici.`
              : `${missingSeeds} adresse${missingSeeds > 1 ? "s" : ""} de la sélection initiale ne ${missingSeeds > 1 ? "sont" : "est"} pas encore dans la base.`
          }
        >
          <ActionForm action={importGuideSeed} confirmMessage="Importer la sélection initiale ? Les adresses déjà présentes ne sont pas modifiées.">
            <SubmitButton variant="secondary" pendingLabel="Import…">
              Importer {missingSeeds} adresse{missingSeeds > 1 ? "s" : ""}
            </SubmitButton>
          </ActionForm>
        </Panel>
      ) : null}

      <FilterBar resetHref="/admin/guide">
        <FilterField label="Recherche" id="f-q">
          <input id="f-q" name="q" type="search" defaultValue={param(params.q)} className={filterControl} placeholder="Nom, quartier…" />
        </FilterField>
        <FilterField label="Catégorie" id="f-categorie">
          <select id="f-categorie" name="categorie" defaultValue={kind} className={filterControl}>
            <option value="">Toutes</option>
            {kindKeys.map((key) => (
              <option key={key} value={key}>
                {kinds[key].label}
              </option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Visibilité" id="f-visibilite">
          <select id="f-visibilite" name="visibilite" defaultValue={visibility} className={filterControl}>
            <option value="">Toutes</option>
            <option value="publiees">Visibles</option>
            <option value="masquees">Masquées</option>
          </select>
        </FilterField>
        <FilterField label="Vérification" id="f-verification">
          <select id="f-verification" name="verification" defaultValue={check} className={filterControl}>
            <option value="">Toutes</option>
            <option value="a-revoir">À revérifier</option>
            <option value="budget">Budget à confirmer</option>
          </select>
        </FilterField>
      </FilterBar>

      <DataTable
        caption="Adresses du guide voyageurs"
        rows={rows}
        rowKey={(row) => row.id}
        columns={[
          {
            header: "Adresse",
            cell: (row) => (
              <span className="flex flex-col">
                <TextLink href={`/admin/guide/${row.id}`}>{row.name}</TextLink>
                <span className="text-small text-ink-soft">{row.area}</span>
              </span>
            ),
          },
          {
            header: "Catégorie",
            cell: (row) => (isKey(kindKeys, row.kind) ? (row.subcategory ?? kinds[row.kind as Kind].label) : row.kind),
          },
          { header: "Budget", cell: (row) => budgets[row.budget as Budget]?.symbol ?? "—" },
          {
            header: "Vérifiée le",
            cell: (row) =>
              isStale(row) ? <Badge tone="warning">{row.verified_on ? formatDateShort(row.verified_on) : "Jamais"}</Badge> : formatDateShort(row.verified_on),
          },
          {
            header: "Statut",
            cell: (row) => (
              <span className="flex flex-wrap gap-1.5">
                {row.is_published ? <Badge tone="positive">Visible</Badge> : <Badge tone="muted">Masquée</Badge>}
                {row.status !== "ouvert" ? <Badge tone="warning">{statuses[row.status as Status]?.label ?? row.status}</Badge> : null}
                {row.is_favorite ? <Badge tone="info">Coup de cœur</Badge> : null}
              </span>
            ),
          },
        ]}
      />
    </>
  );
}
