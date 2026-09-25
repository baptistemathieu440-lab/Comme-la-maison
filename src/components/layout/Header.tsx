import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { mainNav, primaryCta } from "@/content/navigation";

import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-cream/92 backdrop-blur-md supports-[backdrop-filter]:bg-cream/80">
      <div className="mx-auto grid h-[4.5rem] w-full max-w-[82rem] grid-cols-[1fr_auto] items-center gap-4 px-5 sm:px-8 lg:h-20 lg:grid-cols-[1fr_auto_1fr] lg:px-10">
        <Link
          href="/"
          aria-label="Comme à la Maison, retour à l’accueil"
          className="-m-1 shrink-0 justify-self-start rounded-lg p-1"
        >
          <Logo layout="horizontal" className="h-10 w-auto lg:h-11" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <NavLinks items={mainNav} />
        </nav>

        <div className="flex shrink-0 items-center gap-2 justify-self-end">
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
