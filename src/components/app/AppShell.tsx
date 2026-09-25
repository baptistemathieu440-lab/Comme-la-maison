import Link from "next/link";
import { Bell, Search } from "lucide-react";
import type { ReactNode } from "react";

import { Logo } from "@/components/brand/Logo";
import type { Session } from "@/lib/auth/session";
import { roleLabel } from "@/lib/labels";
import { createClient } from "@/lib/supabase/server";

import { MobileNav, SideNav } from "./AppNav";
import { spaceLabel, type Space } from "./nav-config";
import { SignOutButton } from "./SignOutButton";

const homes: Record<Space, string> = { admin: "/admin", owner: "/owner", staff: "/staff" };

function UserBlock({ session, space, onDark }: { session: Session; space: Space; onDark?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col px-3">
        <span className={onDark ? "font-semibold text-cream" : "font-semibold text-ink"}>
          {session.fullName || session.email}
        </span>
        <span className={onDark ? "text-small text-cream/75" : "text-small text-ink-soft"}>
          {space === "admin" ? roleLabel.admin : space === "owner" ? roleLabel.owner : roleLabel.staff}
        </span>
      </div>
      <SignOutButton onDark={onDark} />
    </div>
  );
}

/**
 * Coquille commune aux trois espaces connectés : barre latérale sur ordinateur,
 * barre du haut, onglets en bas sur téléphone. La vérification des droits se fait
 * dans chaque page (voir src/lib/auth/session.ts), pas ici.
 */
export async function AppShell({ space, session, children }: { space: Space; session: Session; children: ReactNode }) {
  const supabase = await createClient();
  const [{ count: unread }, demo] = await Promise.all([
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("recipient_id", session.userId)
      .is("read_at", null),
    space === "admin"
      ? supabase.from("properties").select("id", { count: "exact", head: true }).eq("is_demo", true)
      : Promise.resolve({ count: 0 }),
  ]);
  const unreadCount = unread ?? 0;
  const hasDemo = (demo.count ?? 0) > 0;

  return (
    <div className="flex min-h-dvh flex-1 bg-cream">
      <aside className="on-dark sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-6 overflow-y-auto bg-maison px-3 py-5 text-cream lg:flex">
        <Link href={homes[space]} className="flex flex-col gap-2 rounded-xl px-3 py-1" aria-label={`${spaceLabel[space]}, accueil`}>
          <Logo layout="horizontal" tone="dark" className="h-10 w-auto self-start" />
          <span className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-cream/70">{spaceLabel[space]}</span>
        </Link>
        <SideNav space={space} />
        <div className="mt-auto border-t border-cream/20 pt-4">
          <UserBlock session={session} space={space} onDark />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-line bg-cream/92 backdrop-blur">
          <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6 lg:px-10">
            <Link href={homes[space]} className="flex items-center gap-2 rounded-lg lg:hidden" aria-label={`${spaceLabel[space]}, accueil`}>
              <Logo layout="symbol" className="size-9" />
              <span className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-ink-soft">{spaceLabel[space]}</span>
            </Link>

            {space === "admin" ? (
              <form action="/admin/recherche" role="search" className="ml-auto hidden max-w-[28rem] flex-1 sm:block lg:ml-0">
                <label htmlFor="recherche-globale" className="sr-only">
                  Rechercher un bien, un propriétaire, une réservation…
                </label>
                <div className="relative">
                  <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
                  <input
                    id="recherche-globale"
                    name="q"
                    type="search"
                    placeholder="Rechercher un bien, un propriétaire, une réservation…"
                    className="min-h-11 w-full rounded-full border-[1.5px] border-line-strong/70 bg-surface pl-10 pr-4 text-[0.9375rem] placeholder:text-ink-soft focus-visible:border-maison"
                  />
                </div>
              </form>
            ) : null}

            <div className="ml-auto flex items-center gap-1">
              {space === "admin" ? (
                <Link
                  href="/admin/recherche"
                  className="grid size-11 place-items-center rounded-full text-maison hover:bg-olive-light sm:hidden"
                >
                  <Search aria-hidden="true" className="size-5" />
                  <span className="sr-only">Rechercher</span>
                </Link>
              ) : null}
              <Link
                href={`${homes[space]}/notifications`}
                className="relative grid size-11 place-items-center rounded-full text-maison hover:bg-olive-light"
              >
                <Bell aria-hidden="true" className="size-5" />
                {unreadCount > 0 ? (
                  <span
                    aria-hidden="true"
                    className="absolute right-1 top-1 grid min-w-5 place-items-center rounded-full bg-terra-text px-1 text-[0.6875rem] font-bold leading-5 text-white"
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                ) : null}
                <span className="sr-only">
                  Notifications{unreadCount > 0 ? ` : ${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : ""}
                </span>
              </Link>
            </div>
          </div>
          {hasDemo ? (
            <div className="hatch border-t border-line px-4 py-1.5 text-center text-[0.8125rem] font-semibold text-ink sm:px-6">
              Des données de démonstration sont présentes (marquées « Démo »).{" "}
              <Link href="/admin/parametres/demonstration" className="underline underline-offset-2">
                Les gérer
              </Link>
            </div>
          ) : null}
        </header>

        <main id="contenu" tabIndex={-1} className="flex-1 px-4 pb-28 pt-6 outline-none sm:px-6 lg:px-10 lg:pb-12">
          <div className="mx-auto flex w-full max-w-[80rem] flex-col gap-6">{children}</div>
        </main>
      </div>

      <MobileNav space={space} footer={<UserBlock session={session} space={space} onDark />} />
    </div>
  );
}
