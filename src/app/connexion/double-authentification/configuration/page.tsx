import { redirect } from "next/navigation";

import { AuthHeading } from "@/components/app/AuthHeading";
import { SignOutButton } from "@/components/app/SignOutButton";
import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

import { TotpEnrollment } from "./TotpEnrollment";

export const metadata = { title: "Activer la double authentification" };

export default async function MfaSetupPage() {
  const session = await getSession();
  if (!session) redirect("/connexion");
  if (!session.roles.includes("admin")) redirect("/connexion?erreur=acces");

  const supabase = await createClient();
  const { data } = await supabase.auth.mfa.listFactors();
  if (data?.totp?.some((factor) => factor.status === "verified")) {
    redirect(session.aal === "aal2" ? "/admin" : "/connexion/double-authentification");
  }

  return (
    <>
      <AuthHeading title="Activer la double authentification">
        Obligatoire pour les administrateurs : l’accès au back-office demande, en plus du mot de passe, un code
        temporaire généré par une application sur votre téléphone (Google Authenticator, Microsoft
        Authenticator, 1Password, Bitwarden…).
      </AuthHeading>
      <TotpEnrollment />
      <div className="mt-6 border-t border-line pt-5">
        <SignOutButton />
      </div>
    </>
  );
}
