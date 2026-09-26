"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavItem } from "@/content/navigation";
import { cn } from "@/lib/cn";

/** La page en cours (l'accueil seulement sur « / », les autres avec leurs sous-pages). */
export function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Liens de navigation du bureau. Un trait terracotta souligne la page en cours. */
export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-1 xl:gap-3">
      {items.map((item) => {
        const current = isCurrent(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              className={cn(
                "relative inline-flex min-h-11 items-center whitespace-nowrap px-3 text-[0.9375rem] font-medium text-ink transition-colors duration-200 hover:text-maison",
                "after:absolute after:inset-x-3 after:bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-terra after:transition-transform after:duration-300 after:ease-soft hover:after:scale-x-100",
                current && "text-maison after:scale-x-100",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
