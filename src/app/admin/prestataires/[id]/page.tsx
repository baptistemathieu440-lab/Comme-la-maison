import { notFound } from "next/navigation";

import { DemoBadge, PageHeader, Panel, StatusBadge, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { formatDateShort } from "@/lib/dates";
import { labelOf, maintenanceStatus } from "@/lib/labels";
import { formatCents } from "@/lib/money";
import { displayName } from "@/lib/people";

import { saveProvider } from "../actions";
import { ProviderForm } from "../ProviderForm";

export const metadata = { title: "Prestataire" };

export default async function ProviderPage({ params }: PageProps<"/admin/prestataires/[id]">) {
  const { id } = await params;
  const { supabase } = await adminContext();
  const [{ data: provider }, { data: jobs }] = await Promise.all([
    supabase.from("providers").select("*, contact:contacts!inner(*)").eq("id", id).maybeSingle(),
    supabase
      .from("maintenance_jobs")
      .select("id, title, status, scheduled_on, cost_cents, property:properties(name)")
      .eq("provider_id", id)
      .order("scheduled_on", { ascending: false }),
  ]);
  if (!provider) notFound();

  return (
    <>
      <PageHeader
        eyebrow={<TextLink href="/admin/prestataires">Prestataires</TextLink>}
        title={displayName(provider.contact)}
        description={
          <span className="flex items-center gap-2">
            {provider.trade} {provider.is_demo ? <DemoBadge /> : null}
          </span>
        }
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Fiche" id="fiche">
          <ProviderForm action={saveProvider.bind(null, id)} values={{ ...provider.contact, ...provider }} submitLabel="Enregistrer" />
        </Panel>
        <Panel title="Interventions" id="interventions">
          {(jobs ?? []).length === 0 ? (
            <p className="text-small text-ink-soft">Aucune intervention.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {(jobs ?? []).map((job) => (
                <li key={job.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 first:pt-0">
                  <span className="flex flex-col">
                    <TextLink href={`/admin/interventions/${job.id}`}>{job.title}</TextLink>
                    <span className="text-small text-ink-soft">
                      {job.property?.name} · {formatDateShort(job.scheduled_on)}
                      {job.cost_cents !== null ? ` · ${formatCents(job.cost_cents)}` : ""}
                    </span>
                  </span>
                  <StatusBadge value={labelOf(maintenanceStatus, job.status)} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
