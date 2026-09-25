import { redirect } from "next/navigation";

import { ActionForm, Field, Input, SubmitButton } from "@/components/app/form";
import { AuthHeading } from "@/components/app/AuthHeading";
import { Notice, TextLink } from "@/components/app/ui";
import { linkValidity } from "@/lib/auth/link-validity";
import { getSession, homeFor, safeNext } from "@/lib/auth/session";
import { isPlatformConfigured } from "@/lib/supabase/env";

import { sendMagicLink, signIn } from "./actions";

const errors: Record<string, string> = {
  acces: "Votre compte n’a pas accès à cet espace.",
  "aucun-role": "Votre compte n’a encore aucun accès. Contactez Baptiste ou Simon.",
  lien: "Ce lien n’est plus valide (déjà utilisé ou expiré). Demandez-en un nouveau.",
  session: "Votre session a expiré. Reconnectez-vous.",
};

export default async function LoginPage({ searchParams }: PageProps<"/connexion">) {
  const params = await searchParams;
  const error = typeof params.erreur === "string" ? errors[params.erreur] : undefined;
  const next = safeNext(typeof params.suite === "string" ? params.suite : null);

  if (!isPlatformConfigured()) {
    return (
      <>
        <AuthHeading title="Connexion" />
        <Notice tone="warning" title="Plateforme pas encore branchée">
          La base de données n’est pas configurée sur ce site (variables Supabase manquantes). Les espaces de
          gestion seront accessibles dès sa mise en service.
        </Notice>
      </>
    );
  }

  const session = await getSession();
  if (session && !error) {
    if (session.roles.includes("admin") && session.aal !== "aal2") redirect("/connexion/double-authentification");
    redirect(next ?? homeFor(session));
  }

  return (
    <>
      <AuthHeading title="Connexion">Accédez à votre espace de gestion.</AuthHeading>
      {error ? (
        <Notice tone="danger" className="mb-5">
          {error}
        </Notice>
      ) : null}

      <ActionForm action={signIn} className="flex flex-col gap-4">
        <input type="hidden" name="suite" value={next ?? ""} />
        <Field name="email" label="Adresse email" required>
          <Input type="email" autoComplete="email" inputMode="email" required />
        </Field>
        <Field name="password" label="Mot de passe" required>
          <Input type="password" autoComplete="current-password" required />
        </Field>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <SubmitButton pendingLabel="Connexion…">Se connecter</SubmitButton>
          <TextLink href="/connexion/mot-de-passe-oublie" className="text-small">
            Mot de passe oublié ?
          </TextLink>
        </div>
      </ActionForm>

      <details className="mt-7 border-t border-line pt-5">
        <summary className="cursor-pointer font-semibold text-maison">Recevoir un lien de connexion par email</summary>
        <ActionForm action={sendMagicLink} className="mt-4 flex flex-col gap-4">
          <Field name="email" label="Adresse email" hint={`Un lien valable ${linkValidity}, sans mot de passe.`} required>
            <Input type="email" autoComplete="email" inputMode="email" required />
          </Field>
          <div>
            <SubmitButton variant="ghost" pendingLabel="Envoi…">
              Envoyer le lien
            </SubmitButton>
          </div>
        </ActionForm>
      </details>
    </>
  );
}
