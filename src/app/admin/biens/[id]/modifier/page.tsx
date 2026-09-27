import { notFound } from "next/navigation";

import { Panel } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { ownerOptions } from "@/lib/options";

import { updateProperty } from "../../actions";
import { PropertyForm } from "../../PropertyForm";

export const metadata = { title: "Informations du bien" };

export default async function EditPropertyPage({ params }: PageProps<"/admin/biens/[id]/modifier">) {
  const { id } = await params;
  const { supabase } = await adminContext();
  const [{ data: property }, owners] = await Promise.all([
    supabase.from("properties").select("*").eq("id", id).maybeSingle(),
    ownerOptions(supabase),
  ]);
  if (!property) notFound();

  return (
    <Panel as="div">
      <PropertyForm action={updateProperty.bind(null, id)} owners={owners} property={property} submitLabel="Enregistrer" />
    </Panel>
  );
}
