import { ActionForm, SubmitButton } from "@/components/app/form";
import { DemoBadge, Notice, Panel } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";

import { purgeDemo, seedDemo } from "../actions";

export const metadata = { title: "Données de démonstration" };

export default async function DemoPage() {
  const { supabase } = await adminContext();
  const tables = ["owners", "properties", "bookings", "tasks", "prospects", "expenses", "owner_statements"] as const;
  const counts = await Promise.all(
    tables.map((table) => supabase.from(table).select("id", { count: "exact", head: true }).eq("is_demo", true)),
  );
  const labels: Record<(typeof tables)[number], string> = {
    owners: "Propriétaires",
    properties: "Biens",
    bookings: "Réservations",
    tasks: "Tâches",
    prospects: "Prospects",
    expenses: "Dépenses",
    owner_statements: "Relevés",
  };
  const total = counts.reduce((sum, result) => sum + (result.count ?? 0), 0);

  return (
    <Panel
      as="div"
      title={
        <span className="flex items-center gap-2">
          Données de démonstration <DemoBadge />
        </span>
      }
    >
      <div className="flex flex-col gap-5">
        <p className="max-w-[46rem] text-[0.9375rem]">
          Pour découvrir la plateforme avant le premier client : 3 propriétaires fictifs, 5 biens, environ 90
          réservations sur cinq mois, des ménages, incidents, dépenses, prospects et relevés. Tout est marqué « Démo »
          partout où cela apparaît, les relevés ont leur propre numérotation (DEMO-…) et tout se supprime en un clic,
          sans toucher aux données réelles.
        </p>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {tables.map((table, index) => (
            <div key={table} className="rounded-xl border border-line bg-cream p-3">
              <dt className="text-small text-ink-soft">{labels[table]}</dt>
              <dd className="font-display text-[1.5rem] text-maison">{counts[index].count ?? 0}</dd>
            </div>
          ))}
        </dl>
        {total > 0 ? (
          <>
            <Notice tone="warning">Supprimez les données de démonstration avant de commencer avec de vrais clients.</Notice>
            <ActionForm action={purgeDemo} confirmMessage="Supprimer toutes les données de démonstration ?">
              <SubmitButton pendingLabel="Suppression…">Supprimer les données de démonstration</SubmitButton>
            </ActionForm>
          </>
        ) : (
          <ActionForm action={seedDemo}>
            <SubmitButton pendingLabel="Création…">Créer les données de démonstration</SubmitButton>
          </ActionForm>
        )}
      </div>
    </Panel>
  );
}
