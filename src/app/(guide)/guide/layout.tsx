import type { Metadata, Viewport } from "next";
import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { GuideTabBar, GuideTopNav } from "@/components/guide/GuideNav";
import { guide } from "@/content/guide/guide";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: {
    default: guide.seo.title,
    template: `%s · Guide ${site.name}`,
  },
  description: guide.seo.description,
  alternates: { canonical: "/guide" },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: guide.seo.title,
    description: guide.seo.description,
    url: "/guide",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: guide.signature }],
  },
  // Ajout à l'écran d'accueil du téléphone : le guide s'ouvre comme une application.
  appleWebApp: { capable: true, title: "Guide Bordeaux", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#f5f0e7",
  colorScheme: "light",
};

/**
 * Le carnet de bonnes adresses des voyageurs (/guide), ouvert par QR code dans
 * les logements. Même identité que le site, mais une navigation d'application :
 * en-tête léger et onglets fixes en bas de l'écran.
 */
export default function GuideLayout({ children }: LayoutProps<"/guide">) {
  return (
    <div className="site-theme flex flex-1 flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
      <header className="sticky top-0 z-40 border-b border-line/60 bg-cream/92 backdrop-blur-md supports-[backdrop-filter]:bg-cream/80">
        <div className="mx-auto flex h-16 w-full max-w-[76rem] items-center justify-between gap-4 px-4 sm:px-8 lg:h-20 lg:px-12">
          <Link href="/guide" aria-label="Guide Comme à la Maison, accueil" className="-m-1 flex items-center gap-3 rounded-lg p-1">
            <Logo layout="horizontal" className="h-9 w-auto lg:h-10" />
          </Link>
          <GuideTopNav />
          <Link
            href="/guide#contact"
            className="inline-flex min-h-11 items-center rounded-full px-3 text-[0.875rem] font-semibold text-maison underline-offset-4 hover:underline lg:hidden"
          >
            Un conseil ?
          </Link>
        </div>
      </header>
      <main id="contenu" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <footer className="border-t border-line/70 bg-stone/60">
        <div className="mx-auto flex w-full max-w-[76rem] flex-col gap-3 px-4 py-8 text-small text-ink-soft sm:px-8 lg:px-12">
          <p>{guide.signature}</p>
          <p>
            <Link href="/" className="font-semibold text-maison underline-offset-4 hover:underline">
              Découvrir {site.name}, conciergerie à Bordeaux
            </Link>
          </p>
        </div>
      </footer>
      <GuideTabBar />
    </div>
  );
}
