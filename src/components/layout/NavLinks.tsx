"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavItem } from "@/content/navigation";
import { cn } from "@/lib/cn";

/** Liens de navigation du bureau. Le point terracotta marque la page en cours. */
export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-0.5 2xl:gap-2">
      {items.map((item) => {
        const current = !item.href.includes("#") && (pathname === item.href || pathname.startsWith(`${item.href}/`));
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              className={cn(
                "relative inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-2.5 text-[0.9375rem] font-medium text-ink 2xl:px-3 transition-colors duration-200 hover:bg-olive-light hover:text-maison",
                current && "text-maison",
              )}
            >
              {item.label}
              {current ? (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0.5 left-1/2 size-[5px] -translate-x-1/2 rounded-full bg-terra"
                />
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
