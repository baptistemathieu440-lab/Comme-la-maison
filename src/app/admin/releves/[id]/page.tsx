import { notFound } from "next/navigation";
import { FileDown } from "lucide-react";

import { buttonClasses } from "@/components/ui/Button";
import { ActionForm, Field, FormGrid, Input, Select, SubmitButton } from "@/components/app/form";
import { DataTable, DemoBadge, Notice, PageHeader, Panel, StatusBadge, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { formatDateShort, formatDateTime, formatMonth, todayIso } from "@/lib/dates";
import { labelOf, paymentMethod, statementStatus, textOf, optionsOf } from "@/lib/labels";
import { formatBps, formatCents } from "@/lib/money";
import { displayName } from "@/lib/people";

import {
  addAdjustment,
  deleteDraft,
  deletePayment,
  finalizeStatement,
  markSent,
  recordPayment,
  regenerateStatement,
  removeAdjustment,
} from "../actions";

export const metadata = { title: "Relevé" };

export default async function StatementPage({ params }: PageProps<"/admin/releves/[id]">) {
  const { id } = await params;
  const { supabase } = await adminContext();
  const [{ data: statement }, { data: lines }, { data: payments }, { data: settings }] = await Promise.all([
    supabase
      .from("owner_statements")
      .select("*, owner:owners!inner(id, contact:contacts!inner(first_name, last_name, company_name, profile_id))")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("statement_lines").select("*").eq("statement_id", id).order("position"),
    supabase.from("payments").select("*").eq("statement_id", id).order("paid_on"),
    supabase.from("settings").select("legal_name, siren, head_office, vat_registered, vat_number").single(),
  ]);
  if (!statement) notFound();

  const draft = statement.status === "draft";
  const paid = (payments ?? []).reduce((sum, p) => sum + p.amount_cents, 0);
  const remaining = statement.total_due_cents - paid;
  const bookings = (lines ?? []).filter((l) => l.kind === "booking");
  const others = (lines ?? []).filter((l) => l.kind !== "booking");
  const legalMissing = !settings?.legal_name || !settings?.siren || !settings?.head_office || (settings?.vat_registered && !settings?.vat_number);

  return (
    <>
      <PageHeader
        eyebrow={<TextLink href="/admin/releves">Relevés et factures</TextLink>}
        title={
          <span className="capitalize">
            {formatMonth(statement.period_month)} · {displayName(statement.owner.contact)}
          </span>
        }
        description={
          <span className="flex flex-wrap items-center gap-2">
            <span>{statement.number ? `Facture ${statement.number} · émise le ${formatDateShort(statement.issued_on)} · échéance ${formatDateShort(statement.due_on)}` : "Brouillon, recalculable"}</span>
            <StatusBadge value={labelOf(statementStatus, statement.status)} />
            {statement.is_demo ? <DemoBadge /> : null}
          </span>
        }
        actions={
          <>
            <a href={`/api/releves/${id}/pdf`} target="_blank" rel="noopener" className={buttonClasses("ghost", undefined, "sm")}>
              <FileDown aria-hidden="true" className="size-4" />
              {draft ? "Aperçu PDF" : "PDF"}
            </a>
            {draft ? (
              <>
                <ActionForm action={regenerateStatement.bind(null, id)}>
                  <SubmitButton variant="secondary" pendingLabel="Calcul…">
                    Recalculer
                  </SubmitButton>
                </ActionForm>
                <ActionForm
                  action={finalizeStatement.bind(null, id)}
                  confirmMessage="Finaliser ce relevé ? Il reçoit un numéro de facture définitif et ne pourra plus être modifié."
                >
                  <SubmitButton pendingLabel="Finalisation…">Finaliser (facture)</SubmitButton>
                </ActionForm>
              </>
            ) : statement.status === "final" ? (
              <ActionForm action={markSent.bind(null, id)}>
                <SubmitButton variant="secondary" pendingLabel="…">
                  Marquer comme envoyé
                </SubmitButton>
              </ActionForm>
            ) : null}
          </>
        }
      />

      {draft && legalMissing ? (
        <Notice tone="warning">
          L’identité légale de la société est incomplète (<TextLink href="/admin/parametres">Paramètres</TextLink>) : la facture afficherait « À compléter ».
        </Notice>
      ) : null}
      {!draft && !statement.owner.contact.profile_id ? (
        <Notice tone="info">Ce propriétaire n’a pas encore accès à son espace : envoyez-lui le PDF vous-même.</Notice>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Revenus perçus (base)", statement.commission_base_cents, `${statement.booking_count} réservation(s), ${statement.nights_count} nuits`],
          ["Commission TTC", statement.commission_cents, statement.vat_registered ? `dont TVA ${formatCents(statement.commission_vat_cents)}` : "TVA non applicable (art. 293 B)"],
          ["Total à régler", statement.total_due_cents, `Ménage ${formatCents(statement.cleaning_rebill_cents)} · frais ${formatCents(statement.expenses_rebill_cents)}`],
          ["Revenu net du propriétaire", statement.owner_net_cents, "Après commission et frais avancés"],
        ].map(([label, value, hint]) => (
          <div key={String(label)} className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-line bg-surface p-5">
            <span className="text-small text-ink-soft">{label}</span>
            <span className="font-display text-[1.5rem] text-maison tabular-nums">{formatCents(Number(value))}</span>
            <span className="text-small text-ink-soft">{hint}</span>
          </div>
        ))}
      </div>

      <Panel title="Réservations" id="reservations" description="Départs du mois, et départs antérieurs jamais facturés.">
        <DataTable
          caption="Réservations du relevé"
          rows={bookings}
          rowKey={(row) => row.id}
          empty={<p className="text-small text-ink-soft">Aucune réservation.</p>}
          columns={[
            {
              header: "Séjour",
              cell: (row) => (row.booking_id ? <TextLink href={`/admin/reservations/${row.booking_id}`}>{row.label}</TextLink> : row.label),
            },
            { header: "Nuitées", numeric: true, cell: (row) => formatCents(row.nights_amount_cents) },
            { header: "Frais plateforme", numeric: true, cell: (row) => formatCents(row.platform_fee_cents) },
            { header: "Perçu", numeric: true, cell: (row) => formatCents(row.commission_base_cents) },
            { header: "Commission", numeric: true, cell: (row) => `${formatCents(row.commission_cents)} (${formatBps(row.commission_rate_bps)})` },
          ]}
        />
      </Panel>

      <Panel title="Ménages, frais et ajustements" id="autres">
        {others.length === 0 ? (
          <p className="text-small text-ink-soft">Aucune ligne.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-line">
            {others.map((line) => (
              <li key={line.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-[0.9375rem]">
                <span>
                  <span className="mr-2 text-small font-semibold text-ink-soft">
                    {{ cleaning: "Ménage", expense: "Frais avancé", adjustment: "Ajustement", booking: "" }[line.kind]}
                  </span>
                  {line.expense_id ? <TextLink href={`/admin/depenses?id=${line.expense_id}`}>{line.label}</TextLink> : line.label}
                </span>
                <span className="flex items-center gap-2 tabular-nums">
                  {formatCents(line.amount_cents)}
                  {draft && line.kind === "adjustment" ? (
                    <ActionForm action={removeAdjustment.bind(null, id, line.id)}>
                      <SubmitButton variant="ghost" pendingLabel="…">
                        Retirer
                      </SubmitButton>
                    </ActionForm>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        )}
        {draft ? (
          <details className="mt-4">
            <summary className="cursor-pointer font-semibold text-maison">Ajouter un ajustement</summary>
            <ActionForm action={addAdjustment.bind(null, id)} resetOnSuccess className="mt-3 flex flex-col gap-3">
              <FormGrid>
                <Field name="label" label="Libellé" required>
                  <Input required placeholder="Correction de la réservation R-00012…" />
                </Field>
                <Field name="amount" label="Montant TTC (€)" hint="Négatif pour un avoir en faveur du propriétaire." required>
                  <Input inputMode="decimal" required />
                </Field>
              </FormGrid>
              <div>
                <SubmitButton>Ajouter</SubmitButton>
              </div>
            </ActionForm>
          </details>
        ) : null}
      </Panel>

      {!draft ? (
        <Panel
          title="Règlements"
          id="reglements"
          description={remaining > 0 ? `Reste à régler : ${formatCents(remaining)}.` : "Relevé entièrement réglé."}
        >
          {(payments ?? []).length ? (
            <ul className="mb-4 flex flex-col divide-y divide-line">
              {(payments ?? []).map((payment) => (
                <li key={payment.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-[0.9375rem]">
                  <span>
                    {formatDateShort(payment.paid_on)} · {textOf(paymentMethod, payment.method)} {payment.reference ? `· ${payment.reference}` : ""}
                  </span>
                  <span className="flex items-center gap-2 tabular-nums">
                    {formatCents(payment.amount_cents)}
                    <ActionForm action={deletePayment.bind(null, id, payment.id)} confirmMessage="Supprimer ce règlement ?">
                      <SubmitButton variant="ghost" pendingLabel="…">
                        Supprimer
                      </SubmitButton>
                    </ActionForm>
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          {remaining > 0 ? (
            <ActionForm action={recordPayment.bind(null, id)} resetOnSuccess className="flex flex-col gap-3">
              <FormGrid className="lg:grid-cols-4">
                <Field name="amount" label="Montant (€)" required>
                  <Input inputMode="decimal" defaultValue={(remaining / 100).toFixed(2).replace(".", ",")} required />
                </Field>
                <Field name="paid_on" label="Date" required>
                  <Input type="date" defaultValue={todayIso()} required />
                </Field>
                <Field name="method" label="Moyen">
                  <Select options={optionsOf(paymentMethod)} defaultValue="transfer" />
                </Field>
                <Field name="reference" label="Référence">
                  <Input />
                </Field>
              </FormGrid>
              <div>
                <SubmitButton>Enregistrer le règlement</SubmitButton>
              </div>
            </ActionForm>
          ) : null}
          {statement.finalized_at ? <p className="mt-3 text-small text-ink-soft">Finalisé le {formatDateTime(statement.finalized_at)}.</p> : null}
        </Panel>
      ) : (
        <Panel title="Supprimer le brouillon" id="suppression">
          <ActionForm action={deleteDraft.bind(null, id)} confirmMessage="Supprimer ce brouillon ?">
            <SubmitButton variant="ghost" pendingLabel="…">
              Supprimer
            </SubmitButton>
          </ActionForm>
        </Panel>
      )}
    </>
  );
}
