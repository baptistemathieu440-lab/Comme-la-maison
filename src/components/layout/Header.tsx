import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { primaryCta } from "@/content/navigation";

import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-cream/92 backdrop-blur-md supports-[backdrop-filter]:bg-cream/85">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-[82rem] items-center justify-between gap-4 px-5 sm:px-8 lg:h-20 lg:px-10">
        <Link
          href="/"
          aria-label="Comme à la Maison, retour à l’accueil"
          className="-m-1 shrink-0 rounded-lg p-1"
        >
          <Logo layout="horizontal" className="h-10 w-auto lg:h-11" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden xl:block">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ButtonLink href={primaryCta.href} size="sm">
              {primaryCta.label}
            </ButtonLink>
          </div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
