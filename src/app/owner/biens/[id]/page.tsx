import { notFound } from "next/navigation";

import { OwnerNotLinked } from "@/components/app/OwnerNotLinked";
import { DemoBadge, DescriptionList, PageHeader, Panel, StatusBadge, TextLink } from "@/components/app/ui";
import { ownerContext } from "@/lib/auth/admin-context";
import { formatStay, todayIso } from "@/lib/dates";
import { labelOf, propertyStatus, propertyType, textOf } from "@/lib/labels";
import { signedUrls } from "@/lib/storage";

export const metadata = { title: "Logement" };

export default async function OwnerProperty({ params }: PageProps<"/owner/biens/[id]">) {
  const { id } = await params;
  const { supabase, owner } = await ownerContext();
  if (!owner) return <OwnerNotLinked />;
  const [{ data: property }, { data: photos }, { data: listings }, { data: bookings }] = await Promise.all([
    supabase.from("properties").select("id, name, reference, status, property_type, address_line, postal_code, city, surface_m2, bedrooms, beds, capacity, is_demo").eq("id", id).maybeSingle(),
    supabase.from("property_photos").select("id, storage_path, caption").eq("property_id", id).order("position"),
    supabase.from("listings").select("id, platform_id, listing_url, status").eq("property_id", id),
    supabase
      .from("owner_bookings")
      .select("id, check_in, check_out, guest_first_name, platform_name")
      .eq("property_id", id)
      .gte("check_out", todayIso())
      .in("status", ["confirmed", "in_progress"])
      .order("check_in")
      .limit(10),
  ]);
  if (!property) notFound();
  const urls = await signedUrls("property-photos", (photos ?? []).map((p) => p.storage_path), 600);

  return (
    <>
      <PageHeader
        eyebrow={<TextLink href="/owner">Accueil</TextLink>}
        title={property.name}
        description={
          <span className="flex flex-wrap items-center gap-2">
            {property.city} <StatusBadge value={labelOf(propertyStatus, property.status)} /> {property.is_demo ? <DemoBadge /> : null}
          </span>
        }
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Informations" id="infos">
          <DescriptionList
            items={[
              { label: "Type", value: textOf(propertyType, property.property_type) },
              { label: "Adresse", value: [property.address_line, property.postal_code, property.city].filter(Boolean).join(", ") },
              { label: "Surface", value: property.surface_m2 ? `${property.surface_m2} m²` : null },
              { label: "Capacité", value: property.capacity ? `${property.capacity} voyageurs` : null },
              { label: "Chambres / lits", value: `${property.bedrooms ?? "—"} / ${property.beds ?? "—"}` },
              { label: "Référence", value: property.reference },
            ]}
          />
          {(listings ?? []).length ? (
            <div className="mt-4 border-t border-line pt-4">
              <p className="mb-2 text-small font-semibold text-ink-soft">Annonces</p>
              <ul className="flex flex-wrap gap-3">
                {(listings ?? []).map((l) => (
                  <li key={l.id}>
                    {l.listing_url ? (
                      <a href={l.listing_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-maison underline underline-offset-4">
                        Voir sur {l.platform_id} (nouvel onglet)
                      </a>
                    ) : (
                      <span>{l.platform_id}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Panel>
        <Panel title="Prochains séjours" id="sejours">
          {(bookings ?? []).length === 0 ? (
            <p className="text-small text-ink-soft">Aucun séjour à venir.</p>
          ) : (
            <ul className="flex flex-col gap-2 text-[0.9375rem]">
              {(bookings ?? []).map((b) => (
                <li key={b.id}>
                  {formatStay(b.check_in ?? "", b.check_out ?? "")} · {b.guest_first_name ?? "Voyageur"} · {b.platform_name}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
      {(photos ?? []).length ? (
        <Panel title="Photos" id="photos">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {(photos ?? []).map((photo, index) => (
              <li key={photo.id}>
                {/* eslint-disable-next-line @next/next/no-img-element -- lien signé temporaire */}
                <img src={urls.get(photo.storage_path) ?? undefined} alt={photo.caption || `Photo ${index + 1} du logement`} className="aspect-[4/3] w-full rounded-xl object-cover" />
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}
    </>
  );
}
