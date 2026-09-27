import { ButtonLink } from "@/components/ui/Button";
import { FilterBar, FilterField, filterControl, param } from "@/components/app/FilterBar";
import { Badge, DataTable, DemoBadge, EmptyState, PageHeader, StatusBadge, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { labelOf, optionsOf, propertyStatus, propertyType, textOf } from "@/lib/labels";
import { formatBps } from "@/lib/money";
import { ownerOptions } from "@/lib/options";
import { displayName } from "@/lib/people";
import { normalizeQuery } from "@/lib/search";

export const metadata = { title: "Biens" };

export default async function PropertiesPage({ searchParams }: PageProps<"/admin/biens">) {
  const { supabase } = await adminContext();
  const params = await searchParams;
  const status = param(params.statut);
  const owner = param(params.proprietaire);
  const q = normalizeQuery(param(params.q));

  let query = supabase
    .from("properties")
    .select(
      "id, reference, name, city, status, property_type, capacity, visible_on_site, commission_rate_bps, is_demo, is_primary_residence, owner:owners!inner(id, commission_rate_bps, contact:contacts!inner(first_name, last_name, company_name)), listings(platform_id, status)",
    )
    .order("name");
  if (status) query = query.eq("status", status);
  if (owner) query = query.eq("owner_id", owner);
  if (q) query = query.like("search_text", `%${q}%`);

  const [{ data: properties, error }, owners, { data: settings }] = await Promise.all([
    query,
    ownerOptions(supabase),
    supabase.from("settings").select("default_commission_bps").single(),
  ]);
  const defaultRate = settings?.default_commission_bps ?? 2000;

  return (
    <>
      <PageHeader
        title="Biens"
        description="Les logements gérés, leur propriétaire, leurs annonces et leur statut."
        actions={
          <ButtonLink href="/admin/biens/nouveau" size="sm">
            Ajouter un bien
          </ButtonLink>
        }
      />

      <FilterBar resetHref="/admin/biens">
        <FilterField label="Recherche" id="f-q">
          <input id="f-q" name="q" type="search" defaultValue={param(params.q)} className={filterControl} placeholder="Nom, adresse, référence" />
        </FilterField>
        <FilterField label="Statut" id="f-statut">
          <select id="f-statut" name="statut" defaultValue={status} className={filterControl}>
            <option value="">Tous</option>
            {optionsOf(propertyStatus).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FilterField>
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
      </FilterBar>

      {error ? <EmptyState title="Les biens n’ont pas pu être chargés.">{error.message}</EmptyState> : null}

      <DataTable
        caption="Liste des biens"
        rows={properties ?? []}
        rowKey={(row) => row.id}
        empty={
          <EmptyState
            title={status || owner || q ? "Aucun bien ne correspond à ces filtres." : "Aucun bien enregistré."}
            action={<ButtonLink href="/admin/biens/nouveau" size="sm">Ajouter un bien</ButtonLink>}
          >
            Un bien se rattache à un propriétaire : créez d’abord le propriétaire si besoin.
          </EmptyState>
        }
        columns={[
          {
            header: "Bien",
            cell: (row) => (
              <div className="flex flex-col gap-1">
                <span className="flex flex-wrap items-center gap-2">
                  <TextLink href={`/admin/biens/${row.id}`}>{row.name}</TextLink>
                  {row.is_demo ? <DemoBadge /> : null}
                </span>
                <span className="text-small text-ink-soft">
                  {row.reference} · {textOf(propertyType, row.property_type)}
                  {row.capacity ? ` · ${row.capacity} voyageurs` : ""}
                </span>
              </div>
            ),
          },
          {
            header: "Propriétaire",
            cell: (row) => <TextLink href={`/admin/proprietaires/${row.owner.id}`}>{displayName(row.owner.contact)}</TextLink>,
          },
          { header: "Commune", cell: (row) => row.city },
          { header: "Statut", cell: (row) => <StatusBadge value={labelOf(propertyStatus, row.status)} /> },
          {
            header: "Annonces",
            hideOnMobile: true,
            cell: (row) =>
              row.listings.length === 0 ? (
                <span className="text-small text-ink-soft">Aucune</span>
              ) : (
                <span className="text-small">{row.listings.map((l) => l.platform_id).join(", ")}</span>
              ),
          },
          {
            header: "Commission",
            numeric: true,
            cell: (row) => formatBps(row.commission_rate_bps ?? row.owner.commission_rate_bps ?? defaultRate),
          },
          {
            header: "Site",
            hideOnMobile: true,
            cell: (row) => (row.visible_on_site ? <Badge tone="positive">Publié</Badge> : <span className="text-small text-ink-soft">Non publié</span>),
          },
        ]}
      />
    </>
  );
}
