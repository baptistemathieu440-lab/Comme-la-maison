import { OwnerNotLinked } from "@/components/app/OwnerNotLinked";
import { DataTable, EmptyState, PageHeader } from "@/components/app/ui";
import { ownerContext } from "@/lib/auth/admin-context";
import { formatDateShort } from "@/lib/dates";
import { documentCategory, textOf } from "@/lib/labels";

export const metadata = { title: "Documents" };

export default async function OwnerDocuments() {
  const { supabase, owner } = await ownerContext();
  if (!owner) return <OwnerNotLinked />;
  const { data: documents } = await supabase
    .from("documents")
    .select("id, title, category, created_at, property:properties(name)")
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader title="Documents" description="Les documents que Comme à la Maison partage avec vous : contrat, inventaires, justificatifs…" />
      <DataTable
        caption="Vos documents"
        rows={documents ?? []}
        rowKey={(row) => row.id}
        empty={<EmptyState title="Aucun document partagé pour l’instant." />}
        columns={[
          {
            header: "Document",
            cell: (row) => (
              <a href={`/api/fichiers/document/${row.id}`} className="font-semibold text-maison underline underline-offset-4">
                {row.title}
              </a>
            ),
          },
          { header: "Catégorie", cell: (row) => textOf(documentCategory, row.category) },
          { header: "Logement", cell: (row) => row.property?.name ?? "—" },
          { header: "Ajouté le", cell: (row) => formatDateShort(row.created_at) },
        ]}
      />
    </>
  );
}
