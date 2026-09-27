import { notFound } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { ActionForm, Field, FormActions, FormGrid, Input, Select, SubmitButton, Textarea } from "@/components/app/form";
import { Badge, DemoBadge, EmptyState, Notice, PageHeader, Panel, StatusBadge, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { isEncryptionConfigured } from "@/lib/crypto";
import { formatDate, formatDateShort, formatMonth } from "@/lib/dates";
import { contractStatus, labelOf, optionsOf, ownerStatus, propertyStatus, statementStatus } from "@/lib/labels";
import { bpsToInput, formatBps, formatCents } from "@/lib/money";
import { displayName } from "@/lib/people";

import {
  deleteOwner,
  inviteOwner,
  newPasswordLinkForOwner,
  revokeOwnerAccess,
  saveContract,
  saveIban,
  updateOwner,
} from "../actions";
import { OwnerForm } from "../OwnerForm";

export const metadata = { title: "Propriétaire" };

export default async function OwnerPage({ params, searchParams }: PageProps<"/admin/proprietaires/[id]">) {
  const { id } = await params;
  const query = await searchParams;
  const { supabase } = await adminContext();

  const [{ data: owner }, { data: properties }, { data: contracts }, { data: statements }, { data: invitations }] = await Promise.all([
    supabase
      .from("owners")
      .select("*, contact:contacts!inner(*, profile:profiles!contacts_profile_id_fkey(email, full_name))")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("properties")
      .select("id, name, reference, status, city, listings(id), property_access(property_id)")
      .eq("owner_id", id)
      .order("name"),
    supabase.from("contracts").select("*, property:properties(name)").eq("owner_id", id).order("created_at", { ascending: false }),
    supabase
      .from("owner_statements")
      .select("id, period_month, status, number, total_due_cents")
      .eq("owner_id", id)
      .order("period_month", { ascending: false })
      .limit(6),
    supabase.from("invitations").select("email, created_at, accepted_at").eq("owner_id", id).order("created_at", { ascending: false }).limit(1),
  ]);
  if (!owner) notFound();

  const contact = owner.contact;
  const account = contact.profile;
  const lastInvitation = invitations?.[0];
  const propertyList = properties ?? [];

  const steps = [
    { done: (contracts ?? []).some((c) => c.status === "active"), label: "Contrat de gestion signé", href: "#contrats" },
    { done: propertyList.length > 0, label: "Bien ajouté", href: `/admin/biens/nouveau?proprietaire=${id}` },
    { done: propertyList.some((p) => p.listings.length > 0), label: "Annonces et calendriers renseignés", href: propertyList[0] ? `/admin/biens/${propertyList[0].id}/annonces` : "#biens" },
    { done: propertyList.some((p) => p.property_access), label: "Codes d’accès enregistrés", href: propertyList[0] ? `/admin/biens/${propertyList[0].id}/acces` : "#biens" },
    { done: Boolean(contact.profile_id), label: "Accès à l’espace propriétaire", href: "#espace" },
    { done: Boolean(owner.iban_last4 && owner.sepa_mandate_signed_on), label: "IBAN et mandat de prélèvement SEPA", href: "#banque" },
  ];
  const remaining = steps.filter((step) => !step.done).length;

  return (
    <>
      <PageHeader
        eyebrow={<TextLink href="/admin/proprietaires">Propriétaires</TextLink>}
        title={displayName(contact)}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <span>{[contact.email, contact.phone].filter(Boolean).join(" · ") || "Coordonnées à compléter"}</span>
            <StatusBadge value={labelOf(ownerStatus, owner.status)} />
            {owner.is_demo ? <DemoBadge /> : null}
          </span>
        }
        actions={
          <ButtonLink href={`/admin/biens/nouveau?proprietaire=${id}`} size="sm">
            Ajouter un bien
          </ButtonLink>
        }
      />

      {query.cree ? (
        <Notice tone="positive" title="Propriétaire créé">
          Étape suivante : <TextLink href={`/admin/biens/nouveau?proprietaire=${id}`}>ajouter son bien</TextLink>, puis ouvrir
          son accès à l’espace propriétaire.
        </Notice>
      ) : null}

      <Panel
        title="Arrivée du propriétaire"
        id="arrivee"
        description={remaining === 0 ? "Toutes les étapes sont faites." : `${remaining} étape(s) restante(s).`}
      >
        <ol className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {steps.map((step) => (
            <li key={step.label}>
              <a
                href={step.href}
                className="flex items-center gap-2.5 rounded-xl border border-line bg-cream px-3 py-2.5 text-[0.9375rem] hover:border-maison/40"
              >
                {step.done ? (
                  <CheckCircle2 aria-hidden="true" className="size-5 shrink-0 text-maison" />
                ) : (
                  <Circle aria-hidden="true" className="size-5 shrink-0 text-ink-soft" />
                )}
                <span>
                  {step.label}
                  <span className="sr-only">{step.done ? " : fait" : " : à faire"}</span>
                </span>
                <span className={step.done ? "ml-auto text-small text-maison" : "ml-auto text-small text-ink-soft"}>
                  {step.done ? "Fait" : "À faire"}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Biens" id="biens">
          {propertyList.length === 0 ? (
            <EmptyState title="Aucun bien pour ce propriétaire." action={<ButtonLink href={`/admin/biens/nouveau?proprietaire=${id}`} size="sm">Ajouter un bien</ButtonLink>} />
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {propertyList.map((property) => (
                <li key={property.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 first:pt-0">
                  <span className="flex flex-col">
                    <TextLink href={`/admin/biens/${property.id}`}>{property.name}</TextLink>
                    <span className="text-small text-ink-soft">
                      {property.reference} · {property.city}
                    </span>
                  </span>
                  <StatusBadge value={labelOf(propertyStatus, property.status)} />
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Espace propriétaire" id="espace">
          {account ? (
            <div className="flex flex-col gap-4">
              <p className="text-[0.9375rem]">
                <Badge tone="positive">Accès ouvert</Badge> <span className="ml-1">Compte : {account.email}</span>
              </p>
              {lastInvitation && !lastInvitation.accepted_at ? (
                <Notice tone="warning">Invitation envoyée le {formatDateShort(lastInvitation.created_at)}, mot de passe pas encore choisi.</Notice>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <ActionForm action={newPasswordLinkForOwner.bind(null, id)}>
                  <SubmitButton variant="secondary" pendingLabel="…">
                    Créer un lien de mot de passe
                  </SubmitButton>
                </ActionForm>
                <ActionForm action={revokeOwnerAccess.bind(null, id)} confirmMessage="Retirer l’accès de ce propriétaire à son espace ?">
                  <SubmitButton variant="ghost" pendingLabel="…">
                    Retirer l’accès
                  </SubmitButton>
                </ActionForm>
              </div>
            </div>
          ) : (
            <ActionForm action={inviteOwner.bind(null, id)} className="flex flex-col gap-4">
              <p className="text-small text-ink-soft">
                Le propriétaire verra ses biens, son calendrier, ses réservations (prénom des voyageurs uniquement), ses
                revenus, ses relevés et les documents partagés. Jamais ceux d’un autre propriétaire.
              </p>
              <Field name="email" label="Email de connexion" required>
                <Input type="email" defaultValue={contact.email ?? ""} required />
              </Field>
              <div>
                <SubmitButton pendingLabel="Création…">Ouvrir l’accès</SubmitButton>
              </div>
            </ActionForm>
          )}
        </Panel>
      </div>

      <Panel
        title="Coordonnées bancaires"
        id="banque"
        description="Pour le prélèvement SEPA de la commission. L’IBAN est chiffré avant d’être enregistré ; seuls ses 4 derniers caractères sont affichés."
      >
        {!isEncryptionConfigured() ? (
          <Notice tone="warning">Chiffrement non configuré (IBAN_ENCRYPTION_KEY) : l’IBAN ne peut pas être enregistré pour l’instant.</Notice>
        ) : null}
        <ActionForm action={saveIban.bind(null, id)} className="mt-3 flex flex-col gap-4">
          <FormGrid>
            <Field name="iban" label="IBAN" hint={owner.iban_last4 ? `Actuel : •••• ${owner.iban_last4}. Laisser vide et enregistrer pour l’effacer.` : "Non renseigné."}>
              <Input autoComplete="off" placeholder="FR76 …" />
            </Field>
            <Field name="iban_holder" label="Titulaire du compte">
              <Input defaultValue={owner.iban_holder ?? ""} autoComplete="off" />
            </Field>
          </FormGrid>
          <FormActions>
            <SubmitButton>Enregistrer l’IBAN</SubmitButton>
          </FormActions>
        </ActionForm>
      </Panel>

      <Panel title="Contrats de gestion" id="contrats">
        {(contracts ?? []).length === 0 ? (
          <p className="mb-4 text-small text-ink-soft">Aucun contrat enregistré.</p>
        ) : (
          <ul className="mb-5 flex flex-col divide-y divide-line">
            {(contracts ?? []).map((contract) => (
              <li key={contract.id} className="flex flex-col gap-2 py-3 first:pt-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold">
                    {contract.reference || "Contrat"} {contract.property?.name ? `· ${contract.property.name}` : ""}
                  </span>
                  <StatusBadge value={labelOf(contractStatus, contract.status)} />
                </div>
                <span className="text-small text-ink-soft">
                  Du {formatDate(contract.start_date)} {contract.end_date ? `au ${formatDate(contract.end_date)}` : "(sans date de fin)"}
                  {contract.commission_rate_bps !== null ? ` · commission ${formatBps(contract.commission_rate_bps)}` : ""}
                  {contract.signed_on ? ` · signé le ${formatDateShort(contract.signed_on)}` : ""}
                </span>
                <details>
                  <summary className="cursor-pointer text-small font-semibold text-maison">Modifier</summary>
                  <ContractForm ownerId={id} contract={contract} properties={propertyList} />
                </details>
              </li>
            ))}
          </ul>
        )}
        <details>
          <summary className="cursor-pointer font-semibold text-maison">Ajouter un contrat</summary>
          <ContractForm ownerId={id} properties={propertyList} />
        </details>
        <p className="mt-3 text-small text-ink-soft">
          Le taux du contrat est informatif : le taux appliqué aux réservations est celui du bien ou du propriétaire.
        </p>
      </Panel>

      <Panel
        title="Relevés récents"
        id="releves"
        actions={<TextLink href={`/admin/releves?proprietaire=${id}`} className="text-small">Tous les relevés</TextLink>}
      >
        {(statements ?? []).length === 0 ? (
          <p className="text-small text-ink-soft">Aucun relevé.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-line">
            {(statements ?? []).map((statement) => (
              <li key={statement.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 first:pt-0">
                <TextLink href={`/admin/releves/${statement.id}`} className="capitalize">
                  {formatMonth(statement.period_month)} {statement.number ? `· ${statement.number}` : ""}
                </TextLink>
                <span className="flex items-center gap-2">
                  <span className="text-small tabular-nums">{formatCents(statement.total_due_cents)}</span>
                  <StatusBadge value={labelOf(statementStatus, statement.status)} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Fiche" id="fiche">
        <OwnerForm action={updateOwner.bind(null, id)} contact={contact} owner={owner} submitLabel="Enregistrer" />
      </Panel>

      <Panel title="Supprimer ce propriétaire" id="suppression" description="Possible uniquement s’il n’a aucun bien.">
        <ActionForm action={deleteOwner.bind(null, id)} confirmMessage="Supprimer définitivement ce propriétaire ?">
          <SubmitButton variant="ghost" pendingLabel="Suppression…">
            Supprimer
          </SubmitButton>
        </ActionForm>
      </Panel>
    </>
  );
}

function ContractForm({
  ownerId,
  contract,
  properties,
}: {
  ownerId: string;
  contract?: {
    id: string;
    property_id: string | null;
    reference: string | null;
    status: string;
    start_date: string | null;
    end_date: string | null;
    signed_on: string | null;
    commission_rate_bps: number | null;
    notes: string | null;
  };
  properties: Array<{ id: string; name: string }>;
}) {
  return (
    <ActionForm action={saveContract.bind(null, ownerId, contract?.id ?? null)} resetOnSuccess={!contract} className="mt-4 flex flex-col gap-4">
      <FormGrid>
        <Field name="reference" label="Référence">
          <Input defaultValue={contract?.reference ?? ""} />
        </Field>
        <Field name="property_id" label="Bien concerné">
          <Select options={properties.map((p) => ({ value: p.id, label: p.name }))} placeholder="Tous ses biens" defaultValue={contract?.property_id ?? ""} />
        </Field>
        <Field name="status" label="Statut">
          <Select options={optionsOf(contractStatus)} defaultValue={contract?.status ?? "draft"} />
        </Field>
        <Field name="commission_rate" label="Commission prévue (%)">
          <Input defaultValue={bpsToInput(contract?.commission_rate_bps ?? 2000)} inputMode="decimal" />
        </Field>
        <Field name="start_date" label="Début">
          <Input type="date" defaultValue={contract?.start_date ?? ""} />
        </Field>
        <Field name="end_date" label="Fin">
          <Input type="date" defaultValue={contract?.end_date ?? ""} />
        </Field>
        <Field name="signed_on" label="Signé le">
          <Input type="date" defaultValue={contract?.signed_on ?? ""} />
        </Field>
      </FormGrid>
      <Field name="notes" label="Notes">
        <Textarea rows={2} defaultValue={contract?.notes ?? ""} />
      </Field>
      <div>
        <SubmitButton>{contract ? "Enregistrer" : "Ajouter le contrat"}</SubmitButton>
      </div>
    </ActionForm>
  );
}
