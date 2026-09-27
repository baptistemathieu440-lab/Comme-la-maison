import { redirect } from "next/navigation";

import { ActionForm, Field, Input, SubmitButton } from "@/components/app/form";
import { AuthHeading } from "@/components/app/AuthHeading";
import { SignOutButton } from "@/components/app/SignOutButton";
import { getSession, safeNext } from "@/lib/auth/session";

import { verifyTotp } from "../actions";

export const metadata = { title: "Double authentification" };

export default async function MfaChallengePage({ searchParams }: PageProps<"/connexion/double-authentification">) {
  const session = await getSession();
  if (!session) redirect("/connexion");
  if (!session.roles.includes("admin")) redirect("/connexion?erreur=acces");
  if (session.aal === "aal2") redirect("/admin");
  const params = await searchParams;
  const next = safeNext(typeof params.suite === "string" ? params.suite : null);

  return (
    <>
      <AuthHeading title="Double authentification">
        Ouvrez votre application d’authentification et saisissez le code à 6 chiffres affiché pour Comme à la
        Maison.
      </AuthHeading>
      <ActionForm action={verifyTotp} className="flex flex-col gap-4">
        <input type="hidden" name="suite" value={next ?? ""} />
        <Field name="code" label="Code à 6 chiffres" required>
          <Input
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9 ]{6,7}"
            maxLength={7}
            required
            autoFocus
            className="font-display text-[1.5rem] tracking-[0.3em] tabular-nums"
          />
        </Field>
        <div>
          <SubmitButton pendingLabel="Vérification…">Valider</SubmitButton>
        </div>
      </ActionForm>
      <div className="mt-6 border-t border-line pt-4">
        <SignOutButton />
      </div>
    </>
  );
}
