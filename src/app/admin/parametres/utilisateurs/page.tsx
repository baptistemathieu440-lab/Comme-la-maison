import { ActionForm, Field, FormGrid, Input, Select, SubmitButton } from "@/components/app/form";
import { Badge, DataTable, Panel } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { formatDateShort } from "@/lib/dates";
import { roleLabel } from "@/lib/labels";

import { inviteMember, memberPasswordLink, removeRole, resetMemberMfa } from "../actions";

export const metadata = { title: "Utilisateurs" };

type Role = "admin" | "staff" | "owner";

export default async function UsersPage() {
  const { supabase, session } = await adminContext();
  const [{ data: roles }, { data: invitations }] = await Promise.all([
    supabase
      .from("user_roles")
      .select("user_id, role, granted_at, profile:profiles!user_roles_user_id_fkey(full_name, email)")
      .order("granted_at"),
    supabase.from("invitations").select("id, email, role, created_at, accepted_at").is("accepted_at", null).order("created_at", { ascending: false }),
  ]);

  const members = new Map<string, { id: string; name: string; email: string; roles: Role[] }>();
  for (const row of roles ?? []) {
    const member = members.get(row.user_id) ?? { id: row.user_id, name: row.profile?.full_name ?? "", email: row.profile?.email ?? "", roles: [] };
    member.roles.push(row.role as Role);
    members.set(row.user_id, member);
  }

  return (
    <>
      <Panel title="Inviter un administrateur ou un agent" id="inviter" description="Les propriétaires s’invitent depuis leur fiche. Les administrateurs devront activer la double authentification.">
        <ActionForm action={inviteMember} resetOnSuccess className="flex flex-col gap-4">
          <FormGrid className="lg:grid-cols-3">
            <Field name="full_name" label="Nom" required>
              <Input required />
            </Field>
            <Field name="email" label="Email" required>
              <Input type="email" required />
            </Field>
            <Field name="role" label="Rôle">
              <Select
                options={[
                  { value: "staff", label: "Agent (tâches terrain)" },
                  { value: "admin", label: "Administrateur (accès complet)" },
                ]}
                defaultValue="staff"
              />
            </Field>
          </FormGrid>
          <div>
            <SubmitButton pendingLabel="Création…">Inviter</SubmitButton>
          </div>
        </ActionForm>
      </Panel>

      <DataTable
        caption="Comptes et rôles"
        rows={[...members.values()]}
        rowKey={(row) => row.id}
        columns={[
          {
            header: "Compte",
            cell: (row) => (
              <span className="flex flex-col">
                <span className="font-semibold">{row.name || row.email}</span>
                <span className="text-small text-ink-soft">{row.email}</span>
              </span>
            ),
          },
          {
            header: "Rôles",
            cell: (row) => (
              <span className="flex flex-wrap gap-1.5">
                {row.roles.map((role) => (
                  <Badge key={role} tone={role === "admin" ? "info" : "neutral"}>
                    {roleLabel[role]}
                  </Badge>
                ))}
              </span>
            ),
          },
          {
            header: "Actions",
            cell: (row) => (
              <div className="flex flex-col gap-2">
                <ActionForm action={memberPasswordLink.bind(null, row.id)}>
                  <SubmitButton variant="ghost" pendingLabel="…">
                    Lien de mot de passe
                  </SubmitButton>
                </ActionForm>
                {row.roles.includes("admin") && row.id !== session.userId ? (
                  <ActionForm action={resetMemberMfa.bind(null, row.id)} confirmMessage="Réinitialiser la double authentification de ce compte ?">
                    <SubmitButton variant="ghost" pendingLabel="…">
                      Réinitialiser la double authentification
                    </SubmitButton>
                  </ActionForm>
                ) : null}
                {row.roles
                  .filter((role) => role !== "owner")
                  .map((role) => (
                    <ActionForm key={role} action={removeRole.bind(null, row.id, role)} confirmMessage={`Retirer le rôle ${roleLabel[role]} ?`}>
                      <SubmitButton variant="ghost" pendingLabel="…">
                        {`Retirer le rôle ${roleLabel[role].toLowerCase()}`}
                      </SubmitButton>
                    </ActionForm>
                  ))}
              </div>
            ),
          },
        ]}
      />

      {(invitations ?? []).length ? (
        <Panel title="Invitations en attente" id="invitations" description="Mot de passe pas encore choisi. Créez un nouveau lien si le précédent a expiré.">
          <ul className="flex flex-col divide-y divide-line">
            {(invitations ?? []).map((invitation) => (
              <li key={invitation.id} className="flex flex-wrap justify-between gap-2 py-2 text-[0.9375rem]">
                <span>{invitation.email}</span>
                <span className="text-small text-ink-soft">
                  {roleLabel[invitation.role as Role]} · invité le {formatDateShort(invitation.created_at)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}
    </>
  );
}
