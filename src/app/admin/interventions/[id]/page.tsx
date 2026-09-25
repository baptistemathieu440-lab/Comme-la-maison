import { notFound } from "next/navigation";

import { ActionForm, Field, FormActions, FormGrid, Input, Select, SubmitButton, Textarea } from "@/components/app/form";
import { DemoBadge, Notice, PageHeader, Panel, StatusBadge, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { labelOf, maintenanceStatus, optionsOf } from "@/lib/labels";
import { centsToInput, formatCents } from "@/lib/money";
import { providerOptions } from "@/lib/options";

import { expenseFromMaintenance, saveMaintenance } from "../../incidents/actions";

export const metadata = { title: "Intervention" };

export default async function MaintenanceJobPage({ params }: PageProps<"/admin/interventions/[id]">) {
  const { id } = await params;
  const { supabase } = await adminContext();
  const [{ data: job }, providers] = await Promise.all([
    supabase
      .from("maintenance_jobs")
      .select("*, property:properties!inner(id, name), incident:incidents(id, title), expenses(id, amount_cents, rebill_to_owner)")
      .eq("id", id)
      .maybeSingle(),
    providerOptions(supabase),
  ]);
  if (!job) notFound();
  const expense = job.expenses[0];

  return (
    <>
      <PageHeader
        eyebrow={<TextLink href="/admin/interventions">Interventions</TextLink>}
        title={job.title}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <TextLink href={`/admin/biens/${job.property.id}`}>{job.property.name}</TextLink>
            {job.incident ? (
              <>
                · incident <TextLink href={`/admin/incidents/${job.incident.id}`}>{job.incident.title}</TextLink>
              </>
            ) : null}
            <StatusBadge value={labelOf(maintenanceStatus, job.status)} />
            {job.is_demo ? <DemoBadge /> : null}
          </span>
        }
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Intervention" id="intervention">
          <ActionForm action={saveMaintenance.bind(null, id)} className="flex flex-col gap-4">
            <Field name="title" label="Intitulé" required>
              <Input defaultValue={job.title} required />
            </Field>
            <FormGrid>
              <Field name="provider_id" label="Prestataire">
                <Select options={providers} placeholder="À choisir" defaultValue={job.provider_id ?? ""} />
              </Field>
              <Field name="status" label="Statut">
                <Select options={optionsOf(maintenanceStatus)} defaultValue={job.status} />
              </Field>
              <Field name="scheduled_on" label="Date prévue">
                <Input type="date" defaultValue={job.scheduled_on ?? ""} />
              </Field>
              <Field name="completed_on" label="Réalisée le">
                <Input type="date" defaultValue={job.completed_on ?? ""} />
              </Field>
              <Field name="cost" label="Coût TTC (€)">
                <Input inputMode="decimal" defaultValue={centsToInput(job.cost_cents)} />
              </Field>
            </FormGrid>
            <Field name="description" label="Détails">
              <Textarea defaultValue={job.description ?? ""} />
            </Field>
            <FormActions>
              <SubmitButton>Enregistrer</SubmitButton>
            </FormActions>
          </ActionForm>
        </Panel>
        <Panel title="Dépense" id="depense">
          {expense ? (
            <Notice tone="positive">
              Dépense de {formatCents(expense.amount_cents)} enregistrée
              {expense.rebill_to_owner ? ", refacturée au propriétaire sur le prochain relevé." : ", payée par le propriétaire."}
            </Notice>
          ) : (
            <ActionForm action={expenseFromMaintenance.bind(null, id)} className="flex flex-col gap-4">
              <p className="text-small text-ink-soft">Une fois l’intervention facturée par le prestataire, enregistrez son coût comme dépense du bien.</p>
              <Field name="paid_by" label="Qui paie le prestataire ?">
                <Select
                  options={[
                    { value: "company", label: "Comme à la Maison avance et refacture au propriétaire" },
                    { value: "owner", label: "Le propriétaire paie directement" },
                  ]}
                  defaultValue="company"
                />
              </Field>
              <div>
                <SubmitButton>Créer la dépense</SubmitButton>
              </div>
            </ActionForm>
          )}
        </Panel>
      </div>
    </>
  );
}
