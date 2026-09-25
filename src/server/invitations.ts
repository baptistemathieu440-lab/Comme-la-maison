import "server-only";

import { linkValidity } from "@/lib/auth/link-validity";
import type { Role } from "@/lib/auth/session";
import { roleLabel } from "@/lib/labels";
import { publicOrigin } from "@/lib/site-url";
import { createAdminClient } from "@/lib/supabase/admin";

import { sendEmail } from "./email";

export type InvitationResult =
  | { ok: true; link: string | null; emailed: boolean; existing: boolean }
  | { ok: false; message: string };

/**
 * Donne accès à la plateforme : crée le compte si besoin (sans mot de passe),
 * attribue le rôle, relie le propriétaire à son compte, et produit un lien
 * à durée limitée (voir link-validity.ts) pour choisir son mot de passe. Le lien est envoyé par email si un
 * service d'email est configuré ; sinon il est affiché pour être transmis à la main.
 * À n'appeler qu'après requireAdmin().
 */
export async function inviteUser({
  email,
  fullName,
  role,
  ownerId,
  invitedBy,
}: {
  email: string;
  fullName: string;
  role: Role;
  ownerId?: string | null;
  invitedBy: string;
}): Promise<InvitationResult> {
  const admin = createAdminClient();
  const origin = await publicOrigin();
  const normalized = email.trim().toLowerCase();

  if (role === "owner") {
    if (!ownerId) return { ok: false, message: "Choisissez le propriétaire concerné." };
    const { data: owner } = await admin.from("owners").select("contact_id, contact:contacts!inner(profile_id)").eq("id", ownerId).single();
    if (!owner) return { ok: false, message: "Propriétaire introuvable." };
  }

  const { data: existingProfile } = await admin.from("profiles").select("id, full_name").eq("email", normalized).maybeSingle();
  let userId = existingProfile?.id ?? null;
  let link: string | null = null;

  if (!userId) {
    const { data, error } = await admin.auth.admin.generateLink({
      type: "invite",
      email: normalized,
      options: { data: { full_name: fullName } },
    });
    if (error || !data.user) return { ok: false, message: "Le compte n’a pas pu être créé. Vérifiez l’adresse email." };
    userId = data.user.id;
    link = `${origin}/auth/confirm?token_hash=${data.properties.hashed_token}&type=invite`;
  }

  if (fullName && !existingProfile?.full_name) {
    await admin.from("profiles").update({ full_name: fullName }).eq("id", userId);
  }

  const { error: roleError } = await admin.from("user_roles").upsert({ user_id: userId, role, granted_by: invitedBy });
  if (roleError) return { ok: false, message: "Le rôle n’a pas pu être attribué." };

  if (role === "owner" && ownerId) {
    const { data: owner } = await admin.from("owners").select("contact_id").eq("id", ownerId).single();
    const { data: alreadyLinked } = await admin.from("contacts").select("id").eq("profile_id", userId).maybeSingle();
    if (alreadyLinked && alreadyLinked.id !== owner?.contact_id) {
      return { ok: false, message: "Ce compte est déjà relié à une autre fiche. Utilisez une autre adresse email." };
    }
    await admin.from("contacts").update({ profile_id: userId }).eq("id", owner?.contact_id ?? "");
  }

  await admin.from("invitations").insert({
    email: normalized,
    full_name: fullName,
    role,
    owner_id: role === "owner" ? ownerId : null,
    user_id: userId,
    invited_by: invitedBy,
    accepted_at: existingProfile ? new Date().toISOString() : null,
  });

  let emailed = false;
  if (link) {
    const result = await sendEmail({
      to: normalized,
      subject: "Votre accès à la plateforme Comme à la Maison",
      text: [
        `Bonjour ${fullName || ""},`.trim(),
        "",
        `Baptiste et Simon vous ont ouvert un accès ${roleLabel[role].toLowerCase()} à la plateforme Comme à la Maison.`,
        `Choisissez votre mot de passe avec ce lien, valable ${linkValidity} :`,
        link,
        "",
        "Comme à la Maison, conciergerie à Bordeaux",
      ].join("\n"),
    });
    emailed = result.status === "sent";
  }

  return { ok: true, link, emailed, existing: Boolean(existingProfile) };
}

/** Nouveau lien (durée limitée) pour choisir un mot de passe, pour un compte existant. */
export async function passwordLink(email: string) {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.generateLink({ type: "recovery", email: email.trim().toLowerCase() });
  if (error || !data.properties) return null;
  return `${await publicOrigin()}/auth/confirm?token_hash=${data.properties.hashed_token}&type=recovery`;
}
