import { notFound } from "next/navigation";

import { ActionForm, Field, FormActions, Select, SubmitButton, Textarea } from "@/components/app/form";
import { DemoBadge, Notice, PageHeader, Panel, StatusBadge, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { formatDateTime } from "@/lib/dates";
import { labelOf, prospectSource, prospectStatus, textOf } from "@/lib/labels";
import { adminOptions } from "@/lib/options";
import { displayName } from "@/lib/people";

import { addProspectActivity, convertProspect, deleteProspect, updateProspect } from "../actions";
import { ProspectFields } from "../ProspectFields";

export const metadata = { title: "Prospect" };

const activityLabel: Record<string, string> = {
  note: "Note",
  call: "Appel",
  email: "Email",
  meeting: "Rendez-vous",
  status_change: "Changement d’étape",
};

export default async function ProspectPage({ params }: PageProps<"/admin/prospects/[id]">) {
  const { id } = await params;
  const { supabase } = await adminContext();
  const [{ data: prospect }, { data: activities }, admins] = await Promise.all([
    supabase.from("prospects").select("*, contact:contacts!inner(*)").eq("id", id).maybeSingle(),
    supabase
      .from("prospect_activities")
      .select("id, kind, content, created_at, author:profiles!prospect_activities_created_by_fkey(full_name)")
      .eq("prospect_id", id)
      .order("created_at", { ascending: false }),
    adminOptions(supabase),
  ]);
  if (!prospect) notFound();
  const contact = prospect.contact;

  return (
    <>
      <PageHeader
        eyebrow={<TextLink href="/admin/prospects">Prospects</TextLink>}
        title={displayName(contact)}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <span>
              {[contact.email, contact.phone].filter(Boolean).join(" · ")} · {textOf(prospectSource, prospect.source)}
            </span>
            <StatusBadge value={labelOf(prospectStatus, prospect.status)} />
            {prospect.is_demo ? <DemoBadge /> : null}
          </span>
        }
        actions={
          prospect.converted_owner_id ? (
            <TextLink href={`/admin/proprietaires/${prospect.converted_owner_id}`}>Voir la fiche propriétaire</TextLink>
          ) : (
            <ActionForm action={convertProspect.bind(null, id)} confirmMessage="Ce prospect a signé ? Sa fiche devient un propriétaire.">
              <SubmitButton pendingLabel="Conversion…">Convertir en propriétaire</SubmitButton>
            </ActionForm>
          )
        }
      />

      {prospect.message ? (
        <Notice tone="info" title="Sa demande">
          <p className="whitespace-pre-line">{prospect.message}</p>
        </Notice>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <Panel title="Fiche et suivi" id="fiche">
          <ActionForm action={updateProspect.bind(null, id)} className="flex flex-col gap-6">
            <ProspectFields
              admins={admins}
              values={{ ...prospect, first_name: contact.first_name, last_name: contact.last_name, email: contact.email, phone: contact.phone, city: contact.city }}
            />
            <FormActions>
              <SubmitButton>Enregistrer</SubmitButton>
            </FormActions>
          </ActionForm>
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel title="Ajouter à l’historique" id="nouvel-echange">
            <ActionForm action={addProspectActivity.bind(null, id)} resetOnSuccess className="flex flex-col gap-4">
              <Field name="kind" label="Type">
                <Select
                  options={[
                    { value: "call", label: "Appel" },
                    { value: "email", label: "Email" },
                    { value: "meeting", label: "Rendez-vous" },
                    { value: "note", label: "Note" },
                  ]}
                  defaultValue="call"
                />
              </Field>
              <Field name="content" label="Compte rendu" required>
                <Textarea rows={3} required />
              </Field>
              <div>
                <SubmitButton>Ajouter</SubmitButton>
              </div>
            </ActionForm>
          </Panel>

          <Panel title="Historique" id="historique">
            {(activities ?? []).length === 0 ? (
              <p className="text-small text-ink-soft">Aucun échange enregistré.</p>
            ) : (
              <ol className="flex flex-col gap-3">
                {(activities ?? []).map((activity) => (
                  <li key={activity.id} className="flex flex-col gap-1 border-l-2 border-olive pl-3">
                    <span className="text-[0.8125rem] font-semibold text-ink-soft">
                      {activityLabel[activity.kind] ?? activity.kind} · {formatDateTime(activity.created_at)}
                      {activity.author?.full_name ? ` · ${activity.author.full_name}` : ""}
                    </span>
                    <p className="whitespace-pre-line text-[0.9375rem]">{activity.content}</p>
                  </li>
                ))}
              </ol>
            )}
          </Panel>

          <Panel title="Supprimer" id="suppression">
            <ActionForm action={deleteProspect.bind(null, id)} confirmMessage="Supprimer ce prospect et son historique ?">
              <SubmitButton variant="ghost" pendingLabel="Suppression…">
                Supprimer le prospect
              </SubmitButton>
            </ActionForm>
          </Panel>
        </div>
      </div>
    </>
  );
}
