import { ButtonLink } from "@/components/ui/Button";
import { FilterBar, FilterField, filterControl, param } from "@/components/app/FilterBar";
import { Badge, DataTable, DemoBadge, EmptyState, PageHeader, StatusBadge, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { labelOf, optionsOf, ownerStatus } from "@/lib/labels";
import { displayName } from "@/lib/people";
import { normalizeQuery } from "@/lib/search";

export const metadata = { title: "Propriétaires" };

export default async function OwnersPage({ searchParams }: PageProps<"/admin/proprietaires">) {
  const { supabase } = await adminContext();
  const params = await searchParams;
  const status = param(params.statut);
  const q = normalizeQuery(param(params.q));

  let query = supabase
    .from("owners")
    .select("id, status, is_demo, iban_last4, contact:contacts!inner(first_name, last_name, company_name, email, phone, profile_id, search_text), properties(id)")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  if (q) query = query.like("contact.search_text", `%${q}%`);
  const { data: owners } = await query;

  return (
    <>
      <PageHeader
        title="Propriétaires"
        description="Les clients de la conciergerie. Ils encaissent les versements des plateformes et reçoivent chaque mois un relevé valant facture."
        actions={<ButtonLink href="/admin/proprietaires/nouveau" size="sm">Ajouter un propriétaire</ButtonLink>}
      />
      <FilterBar resetHref="/admin/proprietaires">
        <FilterField label="Recherche" id="f-q">
          <input id="f-q" name="q" type="search" defaultValue={param(params.q)} className={filterControl} placeholder="Nom, email, téléphone" />
        </FilterField>
        <FilterField label="Statut" id="f-statut">
          <select id="f-statut" name="statut" defaultValue={status} className={filterControl}>
            <option value="">Tous</option>
            {optionsOf(ownerStatus).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FilterField>
      </FilterBar>
      <DataTable
        caption="Liste des propriétaires"
        rows={owners ?? []}
        rowKey={(row) => row.id}
        empty={
          <EmptyState title="Aucun propriétaire." action={<ButtonLink href="/admin/proprietaires/nouveau" size="sm">Ajouter un propriétaire</ButtonLink>}>
            Un prospect qui signe peut aussi être converti en propriétaire depuis sa fiche, sans ressaisie.
          </EmptyState>
        }
        columns={[
          {
            header: "Propriétaire",
            cell: (row) => (
              <span className="flex flex-wrap items-center gap-2">
                <TextLink href={`/admin/proprietaires/${row.id}`}>{displayName(row.contact)}</TextLink>
                {row.is_demo ? <DemoBadge /> : null}
              </span>
            ),
          },
          { header: "Contact", cell: (row) => <span className="text-small">{[row.contact.email, row.contact.phone].filter(Boolean).join(" · ") || "—"}</span> },
          { header: "Biens", numeric: true, cell: (row) => row.properties.length },
          { header: "Statut", cell: (row) => <StatusBadge value={labelOf(ownerStatus, row.status)} /> },
          {
            header: "Espace propriétaire",
            cell: (row) => (row.contact.profile_id ? <Badge tone="positive">Accès ouvert</Badge> : <Badge tone="muted">Pas d’accès</Badge>),
          },
          {
            header: "IBAN",
            hideOnMobile: true,
            cell: (row) => (row.iban_last4 ? <span className="text-small">•••• {row.iban_last4}</span> : <span className="text-small text-ink-soft">Non renseigné</span>),
          },
        ]}
      />
    </>
  );
}
