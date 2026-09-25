import { ShieldCheck } from "lucide-react";

import { changeAccountPassword, updateAccountProfile } from "@/app/account-actions";
import { ActionForm, Field, FormActions, FormGrid, Input, SubmitButton } from "@/components/app/form";
import { DescriptionList, PageHeader, Panel } from "@/components/app/ui";
import type { Session } from "@/lib/auth/session";
import { roleLabel } from "@/lib/labels";
import { createClient } from "@/lib/supabase/server";

import type { Space } from "./nav-config";

/** Page « Mon compte », identique dans les trois espaces : informations, mot de passe, sécurité. */
export async function AccountPage({ session, space }: { session: Session; space: Space }) {
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("full_name, phone").eq("id", session.userId).maybeSingle();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Mon compte" description="Vos informations de contact et votre mot de passe." />

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel id="informations" title="Mes informations">
          <ActionForm action={updateAccountProfile} className="flex flex-col gap-4">
            <DescriptionList
              items={[
                { label: "Adresse email", value: session.email },
                { label: "Rôle", value: session.roles.map((role) => roleLabel[role]).join(", ") },
              ]}
            />
            <p className="text-small text-ink-soft">
              L’adresse email sert d’identifiant de connexion : elle ne se modifie pas ici.
            </p>
            <FormGrid>
              <Field name="full_name" label="Nom affiché" required>
                <Input defaultValue={profile?.full_name ?? session.fullName} autoComplete="name" maxLength={80} required />
              </Field>
              <Field name="phone" label="Téléphone">
                <Input defaultValue={profile?.phone ?? ""} type="tel" autoComplete="tel" inputMode="tel" />
              </Field>
            </FormGrid>
            <FormActions className="mt-2">
              <SubmitButton>Enregistrer</SubmitButton>
            </FormActions>
          </ActionForm>
        </Panel>

        <Panel id="mot-de-passe" title="Mot de passe" description="Au moins 10 caractères, avec des lettres et des chiffres.">
          <ActionForm action={changeAccountPassword} resetOnSuccess className="flex flex-col gap-4">
            <input type="hidden" name="email" autoComplete="username" value={session.email} readOnly />
            <Field name="current_password" label="Mot de passe actuel" required>
              <Input type="password" autoComplete="current-password" required />
            </Field>
            <FormGrid>
              <Field name="password" label="Nouveau mot de passe" required>
                <Input type="password" autoComplete="new-password" minLength={10} required />
              </Field>
              <Field name="confirmation" label="Confirmez le nouveau mot de passe" required>
                <Input type="password" autoComplete="new-password" minLength={10} required />
              </Field>
            </FormGrid>
            <FormActions className="mt-2">
              <SubmitButton>Changer le mot de passe</SubmitButton>
            </FormActions>
          </ActionForm>
        </Panel>
      </div>

      {space === "admin" ? (
        <Panel id="securite" title="Double authentification">
          <p className="flex items-start gap-2 text-ink">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-maison" />
            <span>
              Activée : chaque connexion au back-office demande le code de votre application d’authentification. En cas
              de téléphone perdu, l’autre administrateur la réinitialise dans Paramètres › Utilisateurs.
            </span>
          </p>
        </Panel>
      ) : null}
    </div>
  );
}
