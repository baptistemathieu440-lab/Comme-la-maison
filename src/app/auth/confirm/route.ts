import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

const otpTypes: EmailOtpType[] = ["invite", "recovery", "magiclink", "email", "signup", "email_change"];

/**
 * Point d'arrivée des liens envoyés par email ou copiés depuis le back-office
 * (invitation, mot de passe oublié, lien de connexion).
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const code = url.searchParams.get("code");
  const suite = url.searchParams.get("suite");

  const supabase = await createClient();
  let ok = false;
  if (tokenHash && type && otpTypes.includes(type)) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    ok = !error;
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    ok = !error;
  }

  if (!ok) return NextResponse.redirect(new URL("/connexion?erreur=lien", url.origin));

  // Invitation et mot de passe oublié : la personne choisit son mot de passe.
  const destination =
    type === "invite" || type === "recovery" || suite === "/connexion/nouveau-mot-de-passe"
      ? "/connexion/nouveau-mot-de-passe"
      : "/connexion";
  return NextResponse.redirect(new URL(destination, url.origin));
}
