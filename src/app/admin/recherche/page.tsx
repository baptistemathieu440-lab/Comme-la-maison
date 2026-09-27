import { DemoBadge, EmptyState, PageHeader, Panel, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";

export const metadata = { title: "Recherche" };

const groups: Record<string, { label: string; href: (id: string) => string }> = {
  property: { label: "Biens", href: (id) => `/admin/biens/${id}` },
  owner: { label: "Propriétaires", href: (id) => `/admin/proprietaires/${id}` },
  prospect: { label: "Prospects", href: (id) => `/admin/prospects/${id}` },
  booking: { label: "Réservations", href: (id) => `/admin/reservations/${id}` },
  guest: { label: "Voyageurs", href: () => `/admin/reservations` },
  provider: { label: "Prestataires", href: (id) => `/admin/prestataires/${id}` },
  task: { label: "Tâches", href: (id) => `/admin/taches/${id}` },
  incident: { label: "Incidents", href: (id) => `/admin/incidents/${id}` },
  document: { label: "Documents", href: (id) => `/api/fichiers/document/${id}` },
};

export default async function SearchPage({ searchParams }: PageProps<"/admin/recherche">) {
  const { supabase } = await adminContext();
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 80) : "";
  const { data: results } = q.length >= 2 ? await supabase.rpc("search_global", { p_query: q }) : { data: [] };

  return (
    <>
      <PageHeader title="Recherche" description="Biens, propriétaires, prospects, réservations, voyageurs, prestataires, tâches, incidents et documents. Sans tenir compte des accents." />
      <form role="search" className="flex gap-2">
        <label htmlFor="q" className="sr-only">
          Rechercher
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q}
          autoFocus
          placeholder="Nom, adresse, référence, email…"
          className="min-h-12 w-full max-w-[40rem] rounded-full border-[1.5px] border-line-strong bg-white px-5 text-[1rem] focus-visible:border-maison"
        />
        <button type="submit" className="min-h-12 rounded-full bg-maison px-6 font-semibold text-cream">
          Rechercher
        </button>
      </form>
      {q.length < 2 ? (
        <p className="text-small text-ink-soft">Saisissez au moins 2 caractères.</p>
      ) : (results ?? []).length === 0 ? (
        <EmptyState title={`Aucun résultat pour « ${q} ».`} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {Object.entries(groups).map(([kind, group]) => {
            const items = (results ?? []).filter((r) => r.kind === kind);
            if (items.length === 0) return null;
            return (
              <Panel key={kind} title={`${group.label} (${items.length})`}>
                <ul className="flex flex-col gap-2">
                  {items.map((item) => (
                    <li key={item.id} className="flex flex-col">
                      <span className="flex flex-wrap items-center gap-2">
                        <TextLink href={group.href(item.id)}>{item.title}</TextLink>
                        {item.is_demo ? <DemoBadge /> : null}
                      </span>
                      {item.subtitle ? <span className="text-small text-ink-soft">{item.subtitle}</span> : null}
                    </li>
                  ))}
                </ul>
              </Panel>
            );
          })}
        </div>
      )}
    </>
  );
}
