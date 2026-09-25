"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/cn";

import { MenuIcon, isActive, mobileTabs, navigation, type Space } from "./nav-config";

/** Navigation latérale (ordinateur). */
export function SideNav({ space }: { space: Space }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Navigation principale" className="flex flex-col gap-5">
      {navigation[space].map((group, index) => (
        <div key={group.label ?? index} className="flex flex-col gap-1">
          {group.label ? (
            <p className="px-3 pb-1 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-cream/65">{group.label}</p>
          ) : null}
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex min-h-10 items-center gap-3 rounded-xl px-3 text-[0.9375rem] transition-colors",
                      active ? "bg-cream/12 font-semibold text-cream" : "text-cream/85 hover:bg-cream/8 hover:text-cream",
                    )}
                  >
                    {active ? (
                      <span aria-hidden="true" className="absolute inset-y-2 left-0 w-1 rounded-full bg-terra-on-dark" />
                    ) : null}
                    <Icon aria-hidden="true" className="size-[1.125rem] shrink-0" strokeWidth={1.9} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/** Onglets du bas (téléphone) + menu complet dans une boîte de dialogue. */
export function MobileNav({ space, footer }: { space: Space; footer?: React.ReactNode }) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  return (
    <>
      <nav
        aria-label="Navigation rapide"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <ul className="mx-auto grid max-w-[40rem] grid-cols-5">
          {mobileTabs[space].map((item) => {
            const active = isActive(pathname, item);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-[0.6875rem] font-semibold",
                    active ? "text-maison" : "text-ink-soft",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-7 w-12 place-items-center rounded-full transition-colors",
                      active && "bg-olive-light",
                    )}
                  >
                    <Icon aria-hidden="true" className="size-5" strokeWidth={active ? 2.2 : 1.9} />
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => dialogRef.current?.showModal()}
              aria-haspopup="dialog"
              className="flex min-h-14 w-full flex-col items-center justify-center gap-0.5 px-1 text-[0.6875rem] font-semibold text-ink-soft"
            >
              <span className="grid h-7 w-12 place-items-center">
                <MenuIcon aria-hidden="true" className="size-5" strokeWidth={1.9} />
              </span>
              Menu
            </button>
          </li>
        </ul>
      </nav>

      <dialog
        ref={dialogRef}
        aria-label="Menu"
        className="on-dark m-0 ml-auto h-dvh max-h-none w-[min(22rem,88vw)] max-w-none overflow-y-auto bg-maison p-5 text-cream backdrop:bg-ink/50"
      >
        <div className="mb-5 flex items-center justify-between">
          <p className="font-display text-[1.25rem] font-medium">Menu</p>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="grid size-11 place-items-center rounded-full hover:bg-cream/10"
          >
            <X aria-hidden="true" className="size-5" />
            <span className="sr-only">Fermer le menu</span>
          </button>
        </div>
        <SideNav space={space} />
        {footer ? <div className="mt-6 border-t border-cream/20 pt-4">{footer}</div> : null}
      </dialog>
    </>
  );
}
