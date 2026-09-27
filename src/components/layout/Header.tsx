import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { mainNav, primaryCta } from "@/content/navigation";

import { LoginLink } from "./LoginLink";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

/**
 * En-tête du site. Six rubriques au centre à partir de 1024 px ; en dessous, un bouton « Menu »
 * ouvre le menu plein écran. L'accès à l'espace client reste visible à toutes les tailles.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-cream/92 backdrop-blur-md supports-[backdrop-filter]:bg-cream/80">
      <div className="mx-auto grid h-[4.5rem] w-full max-w-[82rem] grid-cols-[1fr_auto] items-center gap-3 px-4 sm:px-8 lg:h-20 lg:grid-cols-[auto_1fr_auto] lg:gap-4 lg:px-8 xl:px-10">
        <Link
          href="/"
          aria-label="Comme à la Maison, retour à l’accueil"
          className="-m-1 shrink-0 justify-self-start rounded-lg p-1"
        >
          <Logo layout="horizontal" className="h-9 w-auto sm:h-10 xl:h-11" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden justify-self-center lg:block">
          <NavLinks items={mainNav} />
        </nav>

        <div className="flex shrink-0 items-center gap-2 justify-self-end">
          <LoginLink compact />
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
