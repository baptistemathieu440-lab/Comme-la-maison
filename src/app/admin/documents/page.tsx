import { FileUploader } from "@/components/app/FileUploader";
import { FilterBar, FilterField, filterControl, param } from "@/components/app/FilterBar";
import { ActionForm, SubmitButton } from "@/components/app/form";
import { Badge, DataTable, DemoBadge, EmptyState, PageHeader, Panel, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { formatDateShort } from "@/lib/dates";
import { documentCategory, optionsOf, textOf } from "@/lib/labels";
import { ownerOptions, propertyOptions } from "@/lib/options";
import { displayName } from "@/lib/people";

import { confirmDocumentUpload, deleteDocument, requestDocumentUpload, toggleDocumentVisibility } from "./actions";

export const metadata = { title: "Documents" };

const select = "min-h-11 w-full rounded-[var(--radius-field)] border-[1.5px] border-line-strong bg-white px-3 text-[0.9375rem]";

export default async function DocumentsPage({ searchParams }: PageProps<"/admin/documents">) {
  const { supabase } = await adminContext();
  const params = await searchParams;
  const owner = param(params.proprietaire);
  const property = param(params.bien);
  const category = param(params.categorie);

  let query = supabase
    .from("documents")
    .select("id, title, category, size_bytes, visible_to_owner, created_at, is_demo, owner:owners(id, contact:contacts!inner(first_name, last_name, company_name)), property:properties(id, name)")
    .order("created_at", { ascending: false })
    .limit(300);
  if (owner) query = query.eq("owner_id", owner);
  if (property) query = query.eq("property_id", property);
  if (category) query = query.eq("category", category);
  const [{ data: documents }, owners, properties] = await Promise.all([query, ownerOptions(supabase), propertyOptions(supabase)]);

  return (
    <>
      <PageHeader title="Documents" description="Contrats, factures, justificatifs, diagnostics, inventaires. Stockage privé ; les propriétaires ne voient que les documents partagés avec eux." />
      <Panel title="Ajouter des documents" id="ajout" description="PDF, images, Word, Excel ou texte, 20 Mo au maximum par fichier.">
        <FileUploader
          requestUpload={requestDocumentUpload}
          confirmUpload={confirmDocumentUpload}
          accept="application/pdf,image/jpeg,image/png,image/webp,.docx,.xlsx,.txt,.csv"
          label="Fichiers"
          compress={false}
          extraFields={
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="flex flex-col gap-1 text-[0.875rem] font-semibold">
                Titre (sinon le nom du fichier)
                <input name="title" className={select} />
              </label>
              <label className="flex flex-col gap-1 text-[0.875rem] font-semibold">
                Catégorie
                <select name="category" defaultValue="other" className={select}>
                  {optionsOf(documentCategory).map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-[0.875rem] font-semibold">
                Propriétaire
                <select name="owner_id" defaultValue={owner} className={select}>
                  <option value="">Aucun</option>
                  {owners.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-[0.875rem] font-semibold">
                Bien
                <select name="property_id" defaultValue={property} className={select}>
                  <option value="">Aucun</option>
                  {properties.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-[0.9375rem] sm:col-span-2">
                <input type="checkbox" name="visible_to_owner" className="size-5 accent-maison" />
                Partager avec le propriétaire (visible dans son espace)
              </label>
            </div>
          }
        />
      </Panel>

      <FilterBar resetHref="/admin/documents">
        <FilterField label="Propriétaire" id="f-proprietaire">
          <select id="f-proprietaire" name="proprietaire" defaultValue={owner} className={filterControl}>
            <option value="">Tous</option>
            {owners.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Bien" id="f-bien">
          <select id="f-bien" name="bien" defaultValue={property} className={filterControl}>
            <option value="">Tous</option>
            {properties.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Catégorie" id="f-categorie">
          <select id="f-categorie" name="categorie" defaultValue={category} className={filterControl}>
            <option value="">Toutes</option>
            {optionsOf(documentCategory).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FilterField>
      </FilterBar>

      <DataTable
        caption="Liste des documents"
        rows={documents ?? []}
        rowKey={(row) => row.id}
        empty={<EmptyState title="Aucun document." />}
        columns={[
          {
            header: "Document",
            cell: (row) => (
              <span className="flex flex-col">
                <span className="flex flex-wrap items-center gap-2">
                  <a href={`/api/fichiers/document/${row.id}`} className="font-semibold text-maison underline decoration-maison/30 underline-offset-4">
                    {row.title}
                  </a>
                  {row.is_demo ? <DemoBadge /> : null}
                </span>
                <span className="text-small text-ink-soft">
                  {textOf(documentCategory, row.category)} · {formatDateShort(row.created_at)}
                  {row.size_bytes ? ` · ${Math.max(1, Math.round(row.size_bytes / 1024))} Ko` : ""}
                </span>
              </span>
            ),
          },
          { header: "Propriétaire", cell: (row) => (row.owner ? <TextLink href={`/admin/proprietaires/${row.owner.id}`}>{displayName(row.owner.contact)}</TextLink> : "—") },
          { header: "Bien", cell: (row) => (row.property ? <TextLink href={`/admin/biens/${row.property.id}`}>{row.property.name}</TextLink> : "—") },
          {
            header: "Espace propriétaire",
            cell: (row) => (
              <span className="flex flex-wrap items-center gap-2">
                {row.visible_to_owner ? <Badge tone="positive">Partagé</Badge> : <Badge tone="muted">Privé</Badge>}
                {row.owner ? (
                  <ActionForm action={toggleDocumentVisibility.bind(null, row.id, !row.visible_to_owner)}>
                    <SubmitButton variant="ghost" pendingLabel="…">
                      {row.visible_to_owner ? "Rendre privé" : "Partager"}
                    </SubmitButton>
                  </ActionForm>
                ) : null}
              </span>
            ),
          },
          {
            header: "Action",
            cell: (row) => (
              <ActionForm action={deleteDocument.bind(null, row.id)} confirmMessage={`Supprimer « ${row.title} » ?`}>
                <SubmitButton variant="ghost" pendingLabel="…">
                  Supprimer
                </SubmitButton>
              </ActionForm>
            ),
          },
        ]}
      />
    </>
  );
}
