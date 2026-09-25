import { ActionForm, Field, Input, SubmitButton } from "@/components/app/form";
import { AuthHeading } from "@/components/app/AuthHeading";
import { Notice, TextLink } from "@/components/app/ui";
import { getSession } from "@/lib/auth/session";

import { updatePassword } from "../actions";

export const metadata = { title: "Choisir un mot de passe" };

export default async function NewPasswordPage() {
  const session = await getSession();

  if (!session) {
    return (
      <>
        <AuthHeading title="Choisir un mot de passe" />
        <Notice tone="warning">
          Ce lien n’est plus valide ou a déjà été utilisé. Demandez un nouveau lien à Baptiste ou Simon, ou utilisez{" "}
          <TextLink href="/connexion/mot-de-passe-oublie">Mot de passe oublié</TextLink>.
        </Notice>
      </>
    );
  }

  return (
    <>
      <AuthHeading title={session.mustChangePassword ? "Choisissez votre mot de passe" : "Choisir un mot de passe"}>
        {session.mustChangePassword ? (
          <>
            Votre compte a été créé avec un mot de passe provisoire. Remplacez-le par un mot de passe personnel pour
            accéder à votre espace.{" "}
          </>
        ) : null}
        Compte : <strong className="text-ink">{session.email}</strong>. Au moins 10 caractères, avec des lettres et
        des chiffres.
      </AuthHeading>
      <ActionForm action={updatePassword} className="flex flex-col gap-4">
        <input type="hidden" name="email" autoComplete="username" value={session.email} readOnly />
        <Field name="password" label="Nouveau mot de passe" required>
          <Input type="password" autoComplete="new-password" minLength={10} required />
        </Field>
        <Field name="confirmation" label="Confirmez le mot de passe" required>
          <Input type="password" autoComplete="new-password" minLength={10} required />
        </Field>
        <div>
          <SubmitButton>Enregistrer et continuer</SubmitButton>
        </div>
      </ActionForm>
    </>
  );
}
