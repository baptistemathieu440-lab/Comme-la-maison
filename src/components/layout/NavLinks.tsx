"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { mainNav } from "@/content/navigation";
import { cn } from "@/lib/cn";

/** Liens de navigation du bureau. Le point terracotta marque la page en cours. */
export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-1 xl:gap-2">
      {mainNav.map((item) => {
        const current = !item.href.includes("#") && pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              className={cn(
                "relative inline-flex min-h-11 items-center rounded-full px-3 text-[0.9375rem] font-medium text-ink transition-colors duration-200 hover:bg-olive-light hover:text-maison",
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
