import { FilterBar, FilterField, filterControl, param } from "@/components/app/FilterBar";
import { ActionForm, Field, FormGrid, Input, Select, SubmitButton } from "@/components/app/form";
import { DataTable, DemoBadge, EmptyState, Notice, PageHeader, Panel, StatusBadge, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { addMonths, formatDateShort, formatMonth, startOfMonth, todayIso } from "@/lib/dates";
import { labelOf, optionsOf, statementStatus } from "@/lib/labels";
import { formatCents } from "@/lib/money";
import { ownerOptions } from "@/lib/options";
import { displayName } from "@/lib/people";

import { createStatement, prepareMonth } from "./actions";

export const metadata = { title: "Relevés et factures" };

export default async function StatementsPage({ searchParams }: PageProps<"/admin/releves">) {
  const { supabase } = await adminContext();
  const params = await searchParams;
  const status = param(params.statut);
  const owner = param(params.proprietaire);
  const lastMonth = addMonths(startOfMonth(todayIso()), -1).slice(0, 7);

  let query = supabase
    .from("owner_statements")
    .select("id, period_month, status, number, issued_on, due_on, total_due_cents, commission_cents, owner_net_cents, is_demo, owner:owners!inner(id, contact:contacts!inner(first_name, last_name, company_name)), payments(amount_cents)")
    .order("period_month", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(200);
  if (status) query = query.eq("status", status);
  if (owner) query = query.eq("owner_id", owner);
  const [{ data: statements }, owners, { data: settings }] = await Promise.all([
    query,
    ownerOptions(supabase),
    supabase.from("settings").select("legal_name, siren, head_office").single(),
  ]);
  const legalMissing = !settings?.legal_name || !settings?.siren || !settings?.head_office;

  return (
    <>
      <PageHeader
        title="Relevés et factures"
        description="Chaque mois, un relevé par propriétaire : ses réservations, notre commission sur les revenus perçus, les ménages refacturés et les frais avancés. Finalisé, il vaut facture."
      />

      {legalMissing ? (
        <Notice tone="warning" title="Identité légale incomplète">
          Complétez la dénomination, le SIREN et l’adresse du siège dans <TextLink href="/admin/parametres">Paramètres</TextLink> avant de
          finaliser un relevé : ces mentions sont obligatoires sur une facture.
        </Notice>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Préparer les brouillons d’un mois" id="preparer" description="Pour chaque propriétaire qui a eu des départs ou des frais à refacturer. Aussi fait automatiquement le 1er du mois.">
          <ActionForm action={prepareMonth} className="flex flex-wrap items-end gap-3">
            <Field name="month" label="Mois">
              <Input type="month" defaultValue={lastMonth} />
            </Field>
            <SubmitButton pendingLabel="Préparation…">Préparer</SubmitButton>
          </ActionForm>
        </Panel>
        <Panel title="Relevé d’un propriétaire" id="unitaire">
          <ActionForm action={createStatement} className="flex flex-col gap-3">
            <FormGrid>
              <Field name="owner_id" label="Propriétaire" required>
                <Select options={owners} placeholder="Choisir…" required />
              </Field>
              <Field name="month" label="Mois" required>
                <Input type="month" defaultValue={lastMonth} required />
              </Field>
            </FormGrid>
            <div>
              <SubmitButton>Créer ou recalculer le brouillon</SubmitButton>
            </div>
          </ActionForm>
        </Panel>
      </div>

      <FilterBar resetHref="/admin/releves">
        <FilterField label="Statut" id="f-statut">
          <select id="f-statut" name="statut" defaultValue={status} className={filterControl}>
            <option value="">Tous</option>
            {optionsOf(statementStatus).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Propriétaire" id="f-proprietaire">
          <select id="f-proprietaire" name="proprietaire" defaultValue={owner} className={filterControl}>
            <option value="">Tous</option>
            {owners.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FilterField>
      </FilterBar>

      <DataTable
        caption="Liste des relevés"
        rows={statements ?? []}
        rowKey={(row) => row.id}
        empty={<EmptyState title="Aucun relevé." />}
        columns={[
          {
            header: "Relevé",
            cell: (row) => (
              <span className="flex flex-col">
                <span className="flex flex-wrap items-center gap-2">
                  <TextLink href={`/admin/releves/${row.id}`} className="capitalize">
                    {formatMonth(row.period_month)}
                  </TextLink>
                  {row.is_demo ? <DemoBadge /> : null}
                </span>
                <span className="text-small text-ink-soft">{row.number ?? "Brouillon"}</span>
              </span>
            ),
          },
          { header: "Propriétaire", cell: (row) => <TextLink href={`/admin/proprietaires/${row.owner.id}`}>{displayName(row.owner.contact)}</TextLink> },
          { header: "Commission", numeric: true, cell: (row) => formatCents(row.commission_cents) },
          { header: "Total à régler", numeric: true, cell: (row) => formatCents(row.total_due_cents) },
          {
            header: "Réglé",
            numeric: true,
            cell: (row) => formatCents(row.payments.reduce((sum, p) => sum + p.amount_cents, 0)),
          },
          { header: "Échéance", hideOnMobile: true, cell: (row) => formatDateShort(row.due_on) },
          { header: "Statut", cell: (row) => <StatusBadge value={labelOf(statementStatus, row.status)} /> },
        ]}
      />
    </>
  );
}
