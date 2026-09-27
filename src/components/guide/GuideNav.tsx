"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { useFavorites } from "@/lib/guide/favorites";

import { guideNav, isGuideNavActive } from "./nav";

function FavoriteCount({ className }: { className?: string }) {
  const { favorites } = useFavorites();
  if (favorites.length === 0) return null;
  return (
    <span className={cn("grid min-w-5 place-items-center rounded-full bg-terra px-1 text-[0.6875rem] font-bold leading-5 text-white", className)}>
      {favorites.length}
      <span className="sr-only"> adresses enregistrées</span>
    </span>
  );
}

/** Barre d'onglets fixe en bas de l'écran (téléphone et tablette), à portée de pouce. */
export function GuideTabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navigation du guide"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto grid max-w-[32rem] grid-cols-4">
        {guideNav.map((item) => {
          const active = isGuideNavActive(pathname, item);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-[0.75rem] font-semibold",
                  active ? "text-maison" : "text-ink-soft",
                )}
              >
                <span className={cn("relative grid h-8 w-14 place-items-center rounded-full transition-colors", active && "bg-olive-light")}>
                  <Icon aria-hidden="true" className="size-[1.375rem]" strokeWidth={active ? 2.2 : 1.8} />
                  {item.href === "/guide/favoris" ? <FavoriteCount className="absolute -right-0.5 -top-1" /> : null}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Mêmes onglets dans l'en-tête, sur ordinateur. */
export function GuideTopNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navigation du guide" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {guideNav.map((item) => {
          const active = isGuideNavActive(pathname, item);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[0.9375rem] font-semibold transition-colors",
                  active ? "bg-olive-light text-maison" : "text-ink hover:bg-olive-light/60",
                )}
              >
                <Icon aria-hidden="true" className="size-[1.125rem]" strokeWidth={1.9} />
                {item.label}
                {item.href === "/guide/favoris" ? <FavoriteCount /> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
