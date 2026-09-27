"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

/** Onglets de navigation entre sous-pages ; l'onglet actif suit l'adresse. */
export function NavTabs({ items, label = "Sections" }: { items: Array<{ href: string; label: string; exact?: boolean }>; label?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className="-mx-1 overflow-x-auto">
      <ul className="flex min-w-max gap-1 px-1">
        {items.map((item) => {
          const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-full px-4 text-[0.9375rem] font-semibold transition-colors",
                  active ? "bg-maison text-cream" : "text-ink hover:bg-olive-light",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
