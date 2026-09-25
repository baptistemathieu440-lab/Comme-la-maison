import { ButtonLink } from "@/components/ui/Button";
import { FilterBar, FilterField, filterControl, param } from "@/components/app/FilterBar";
import { DataTable, DemoBadge, EmptyState, PageHeader, Pagination, StatusBadge, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { formatStay, isIsoDate } from "@/lib/dates";
import { bookingStatus, labelOf, optionsOf } from "@/lib/labels";
import { formatCents } from "@/lib/money";
import { platformOptions, propertyOptions } from "@/lib/options";
import { displayName } from "@/lib/people";
import { normalizeQuery } from "@/lib/search";

export const metadata = { title: "Réservations" };

const PAGE_SIZE = 50;

export default async function BookingsPage({ searchParams }: PageProps<"/admin/reservations">) {
  const { supabase } = await adminContext();
  const params = await searchParams;
  const property = param(params.bien);
  const status = param(params.statut);
  const platform = param(params.plateforme);
  const from = param(params.du);
  const to = param(params.au);
  const q = normalizeQuery(param(params.q));
  const page = Math.max(1, Number(param(params.page)) || 1);

  let query = supabase
    .from("bookings")
    .select(
      "id, reference, check_in, check_out, status, platform_id, nights_amount_cents, platform_fee_cents, commission_base_cents, commission_cents, is_demo, statement_id, property:properties!inner(id, name), guest:guests(contact:contacts(first_name, last_name))",
      { count: "exact" },
    )
    .order("check_in", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (property) query = query.eq("property_id", property);
  if (status) query = query.eq("status", status);
  if (platform) query = query.eq("platform_id", platform);
  if (isIsoDate(from)) query = query.gte("check_out", from);
  if (isIsoDate(to)) query = query.lte("check_in", to);
  if (q) query = query.like("search_text", `%${q}%`);

  const [{ data: bookings, count }, properties, platforms] = await Promise.all([query, propertyOptions(supabase), platformOptions(supabase)]);
  const platformName = new Map(platforms.map((p) => [p.value, p.label]));
  const hrefFor = (p: number) => {
    const search = new URLSearchParams(Object.entries({ bien: property, statut: status, plateforme: platform, du: from, au: to, q: param(params.q), page: String(p) }).filter(([, v]) => v));
    return `/admin/reservations?${search}`;
  };

  return (
    <>
      <PageHeader
        title="Réservations"
        description="Toutes les réservations, saisies ou complétées depuis les calendriers importés. Montants en euros TTC."
        actions={<ButtonLink href="/admin/reservations/nouvelle" size="sm">Nouvelle réservation</ButtonLink>}
      />
      <FilterBar resetHref="/admin/reservations">
        <FilterField label="Référence" id="f-q">
          <input id="f-q" name="q" type="search" defaultValue={param(params.q)} className={filterControl} placeholder="R-00012, code plateforme" />
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
        <FilterField label="Statut" id="f-statut">
          <select id="f-statut" name="statut" defaultValue={status} className={filterControl}>
            <option value="">Tous</option>
            {optionsOf(bookingStatus).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Plateforme" id="f-plateforme">
          <select id="f-plateforme" name="plateforme" defaultValue={platform} className={filterControl}>
            <option value="">Toutes</option>
            {platforms.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Du" id="f-du">
          <input id="f-du" name="du" type="date" defaultValue={from} className={filterControl} />
        </FilterField>
        <FilterField label="Au" id="f-au">
          <input id="f-au" name="au" type="date" defaultValue={to} className={filterControl} />
        </FilterField>
      </FilterBar>

      <DataTable
        caption="Liste des réservations"
        rows={bookings ?? []}
        rowKey={(row) => row.id}
        empty={<EmptyState title="Aucune réservation ne correspond." action={<ButtonLink href="/admin/reservations/nouvelle" size="sm">Nouvelle réservation</ButtonLink>} />}
        columns={[
          {
            header: "Séjour",
            cell: (row) => (
              <div className="flex flex-col gap-0.5">
                <span className="flex flex-wrap items-center gap-2">
                  <TextLink href={`/admin/reservations/${row.id}`}>{formatStay(row.check_in, row.check_out)}</TextLink>
                  {row.is_demo ? <DemoBadge /> : null}
                </span>
                <span className="text-small text-ink-soft">
                  {row.reference} · {displayName(row.guest?.contact)}
                </span>
              </div>
            ),
          },
          { header: "Bien", cell: (row) => <TextLink href={`/admin/biens/${row.property.id}`}>{row.property.name}</TextLink> },
          { header: "Plateforme", cell: (row) => platformName.get(row.platform_id) ?? row.platform_id },
          { header: "Nuitées", numeric: true, hideOnMobile: true, cell: (row) => formatCents(row.nights_amount_cents) },
          { header: "Perçu", numeric: true, cell: (row) => formatCents(row.commission_base_cents) },
          { header: "Commission", numeric: true, cell: (row) => formatCents(row.commission_cents) },
          {
            header: "Statut",
            cell: (row) => (
              <span className="flex flex-wrap gap-1.5">
                <StatusBadge value={labelOf(bookingStatus, row.status)} />
                {row.statement_id ? <span className="text-[0.8125rem] text-ink-soft">Facturée</span> : null}
              </span>
            ),
          },
        ]}
      />
      <Pagination page={page} pageSize={PAGE_SIZE} total={count ?? 0} hrefFor={hrefFor} />
    </>
  );
}
