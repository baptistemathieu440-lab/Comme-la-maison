import { ActionForm, Field, Input, SubmitButton } from "@/components/app/form";
import { AuthHeading } from "@/components/app/AuthHeading";
import { TextLink } from "@/components/app/ui";

import { requestPasswordReset } from "../actions";

export const metadata = { title: "Mot de passe oublié" };

export default function ForgotPasswordPage() {
  return (
    <>
      <AuthHeading title="Mot de passe oublié">
        Indiquez l’adresse email de votre compte : vous recevrez un lien pour choisir un nouveau mot de passe.
      </AuthHeading>
      <ActionForm action={requestPasswordReset} className="flex flex-col gap-4">
        <Field name="email" label="Adresse email" required>
          <Input type="email" autoComplete="email" inputMode="email" required />
        </Field>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SubmitButton pendingLabel="Envoi…">Recevoir le lien</SubmitButton>
          <TextLink href="/connexion" className="text-small">
            Retour à la connexion
          </TextLink>
        </div>
      </ActionForm>
    </>
  );
}
