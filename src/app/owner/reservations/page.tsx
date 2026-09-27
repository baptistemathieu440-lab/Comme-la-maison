import { FilterBar, FilterField, filterControl, param } from "@/components/app/FilterBar";
import { OwnerNotLinked } from "@/components/app/OwnerNotLinked";
import { DataTable, DemoBadge, EmptyState, PageHeader, StatusBadge } from "@/components/app/ui";
import { ownerContext } from "@/lib/auth/admin-context";
import { formatStay } from "@/lib/dates";
import { bookingStatus, labelOf } from "@/lib/labels";
import { formatCents } from "@/lib/money";

export const metadata = { title: "Réservations" };

export default async function OwnerBookings({ searchParams }: PageProps<"/owner/reservations">) {
  const { supabase, owner } = await ownerContext();
  if (!owner) return <OwnerNotLinked />;
  const params = await searchParams;
  const property = param(params.bien);
  const year = /^\d{4}$/.test(param(params.annee)) ? param(params.annee) : "";

  let query = supabase
    .from("owner_bookings")
    .select("id, reference, property_id, property_name, platform_name, status, check_in, check_out, guest_first_name, adults, children, nights_amount_cents, platform_fee_cents, commission_base_cents, commission_cents, owner_net_cents, cleaning_fee_cents, is_demo")
    .order("check_in", { ascending: false })
    .limit(300);
  if (property) query = query.eq("property_id", property);
  if (year) query = query.gte("check_in", `${year}-01-01`).lt("check_in", `${Number(year) + 1}-01-01`);
  const [{ data: bookings }, { data: properties }] = await Promise.all([query, supabase.from("properties").select("id, name").order("name")]);

  return (
    <>
      <PageHeader
        title="Réservations"
        description="Pour chaque séjour : le prix des nuitées, les frais de la plateforme, ce que vous percevez, notre commission de 20 % TTC sur ce montant et ce qu’il vous reste. Le ménage payé par les voyageurs vous est refacturé à l’identique."
      />
      <FilterBar resetHref="/owner/reservations">
        <FilterField label="Logement" id="f-bien">
          <select id="f-bien" name="bien" defaultValue={property} className={filterControl}>
            <option value="">Tous</option>
            {(properties ?? []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Année" id="f-annee">
          <input id="f-annee" name="annee" inputMode="numeric" defaultValue={year} placeholder="2026" className={filterControl} />
        </FilterField>
      </FilterBar>
      <DataTable
        caption="Vos réservations"
        rows={bookings ?? []}
        rowKey={(row) => row.id ?? ""}
        empty={<EmptyState title="Aucune réservation." />}
        columns={[
          {
            header: "Séjour",
            cell: (row) => (
              <span className="flex flex-col">
                <span className="flex flex-wrap items-center gap-2 font-semibold text-maison">
                  {formatStay(row.check_in ?? "", row.check_out ?? "")} {row.is_demo ? <DemoBadge /> : null}
                </span>
                <span className="text-small text-ink-soft">
                  {row.property_name} · {row.guest_first_name ?? "Voyageur"} · {(row.adults ?? 0) + (row.children ?? 0)} pers. · {row.platform_name}
                </span>
              </span>
            ),
          },
          { header: "Nuitées", numeric: true, hideOnMobile: true, cell: (row) => formatCents(row.nights_amount_cents) },
          { header: "Frais plateforme", numeric: true, hideOnMobile: true, cell: (row) => formatCents(row.platform_fee_cents) },
          { header: "Perçu", numeric: true, cell: (row) => formatCents(row.commission_base_cents) },
          { header: "Commission", numeric: true, cell: (row) => formatCents(row.commission_cents) },
          { header: "Pour vous", numeric: true, cell: (row) => <strong>{formatCents(row.owner_net_cents)}</strong> },
          { header: "Statut", cell: (row) => <StatusBadge value={labelOf(bookingStatus, row.status)} /> },
        ]}
      />
    </>
  );
}
