import "server-only";

import type { AdminClient } from "@/lib/supabase/admin";

import { isEmailConfigured, sendEmail } from "./email";

export type NotificationInput = {
  recipients: string[];
  kind: string;
  title: string;
  body?: string | null;
  link?: string | null;
  eventId?: number | null;
  isDemo?: boolean;
};

/**
 * Crée une notification dans l'application pour chaque destinataire (une seule par
 * événement et destinataire), puis l'envoie par email si un service est configuré.
 */
export async function notify(supabase: AdminClient, input: NotificationInput) {
  const recipients = [...new Set(input.recipients.filter(Boolean))];
  if (recipients.length === 0) return 0;

  const rows = recipients.map((recipient) => ({
    recipient_id: recipient,
    kind: input.kind,
    title: input.title,
    body: input.body ?? null,
    link: input.link ?? null,
    event_id: input.eventId ?? null,
    is_demo: input.isDemo ?? false,
  }));
  const { data, error } = await supabase
    .from("notifications")
    .upsert(rows, { onConflict: "event_id,recipient_id,kind", ignoreDuplicates: true })
    .select("id, recipient_id");
  if (error) {
    // Sans événement, l'index d'unicité ne s'applique pas : insertion simple.
    const { data: inserted } = await supabase.from("notifications").insert(rows).select("id, recipient_id");
    return inserted?.length ?? 0;
  }

  if (isEmailConfigured() && !input.isDemo) {
    const { data: profiles } = await supabase.from("profiles").select("id, email").in("id", recipients);
    for (const notification of data ?? []) {
      const email = profiles?.find((p) => p.id === notification.recipient_id)?.email;
      if (!email) continue;
      const result = await sendEmail({
        to: email,
        subject: input.title,
        text: [input.body ?? "", "", "Connectez-vous à votre espace Comme à la Maison pour le détail."].join("\n").trim(),
      });
      await supabase.from("notification_deliveries").insert({
        notification_id: notification.id,
        channel: "email",
        status: result.status,
        detail: result.detail,
      });
    }
  }
  return data?.length ?? 0;
}

export async function adminIds(supabase: AdminClient) {
  const { data } = await supabase.from("user_roles").select("user_id").eq("role", "admin");
  return (data ?? []).map((row) => row.user_id);
}

/** Compte de connexion du propriétaire d'un bien (s'il a accès à son espace). */
export async function ownerProfileForProperty(supabase: AdminClient, propertyId: string) {
  const { data } = await supabase
    .from("properties")
    .select("owner:owners!inner(contact:contacts!inner(profile_id))")
    .eq("id", propertyId)
    .maybeSingle();
  return data?.owner.contact.profile_id ?? null;
}
