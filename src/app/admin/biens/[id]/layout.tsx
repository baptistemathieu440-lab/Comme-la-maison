import { notFound } from "next/navigation";

import { NavTabs } from "@/components/app/NavTabs";
import { DemoBadge, PageHeader, StatusBadge, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { labelOf, propertyStatus } from "@/lib/labels";
import { displayName } from "@/lib/people";

export default async function PropertyLayout({ children, params }: LayoutProps<"/admin/biens/[id]">) {
  const { id } = await params;
  const { supabase } = await adminContext();
  const { data: property } = await supabase
    .from("properties")
    .select("id, name, reference, status, city, is_demo, owner:owners!inner(id, contact:contacts!inner(first_name, last_name, company_name))")
    .eq("id", id)
    .maybeSingle();
  if (!property) notFound();

  const base = `/admin/biens/${id}`;
  return (
    <>
      <PageHeader
        eyebrow={<TextLink href="/admin/biens">Biens</TextLink>}
        title={property.name}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <span>
              {property.reference} · {property.city} · Propriétaire :{" "}
              <TextLink href={`/admin/proprietaires/${property.owner.id}`}>{displayName(property.owner.contact)}</TextLink>
            </span>
            <StatusBadge value={labelOf(propertyStatus, property.status)} />
            {property.is_demo ? <DemoBadge /> : null}
          </span>
        }
      />
      <NavTabs
        label="Sections du bien"
        items={[
          { href: base, label: "Aperçu", exact: true },
          { href: `${base}/modifier`, label: "Informations" },
          { href: `${base}/annonces`, label: "Annonces et calendriers" },
          { href: `${base}/acces`, label: "Accès" },
          { href: `${base}/photos`, label: "Photos" },
        ]}
      />
      {children}
    </>
  );
}
