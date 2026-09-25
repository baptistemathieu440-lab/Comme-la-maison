import Link from "next/link";

import { ActionForm, SubmitButton } from "@/components/app/form";
import { Badge, DemoBadge, EmptyState, PageHeader } from "@/components/app/ui";
import { markAllRead } from "@/app/notifications-actions";
import { formatDateTime } from "@/lib/dates";
import type { Session } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

/** Liste des notifications du compte connecté (commune aux trois espaces). */
export async function NotificationList({ session, basePath }: { session: Session; basePath: string }) {
  const supabase = await createClient();
  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, title, body, link, read_at, created_at, is_demo")
    .eq("recipient_id", session.userId)
    .order("created_at", { ascending: false })
    .limit(100);
  const unread = (notifications ?? []).filter((n) => !n.read_at).length;

  return (
    <>
      <PageHeader
        title="Notifications"
        description={unread ? `${unread} non lue(s).` : "Tout est lu."}
        actions={
          unread ? (
            <ActionForm action={markAllRead.bind(null, basePath)}>
              <SubmitButton variant="secondary" pendingLabel="…">
                Tout marquer comme lu
              </SubmitButton>
            </ActionForm>
          ) : null
        }
      />
      {(notifications ?? []).length === 0 ? (
        <EmptyState title="Aucune notification pour l’instant." />
      ) : (
        <ul className="flex flex-col gap-2">
          {(notifications ?? []).map((n) => {
            const content = (
              <>
                <span className="flex flex-wrap items-center gap-2">
                  {!n.read_at ? <Badge tone="info">Nouveau</Badge> : null}
                  <span className={n.read_at ? "font-medium text-ink" : "font-semibold text-maison"}>{n.title}</span>
                  {n.is_demo ? <DemoBadge /> : null}
                </span>
                {n.body ? <span className="text-small text-ink-soft">{n.body}</span> : null}
                <span className="text-[0.8125rem] text-ink-soft">{formatDateTime(n.created_at)}</span>
              </>
            );
            const className = "flex flex-col gap-1 rounded-xl border border-line bg-surface p-4";
            return (
              <li key={n.id}>
                {n.link ? (
                  <Link href={n.link} className={`${className} hover:border-maison/40`}>
                    {content}
                  </Link>
                ) : (
                  <div className={className}>{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
