import type { Metadata } from "next";
import Link from "next/link";

import { Logo } from "@/components/brand/Logo";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: LayoutProps<"/connexion">) {
  return (
    <main id="contenu" tabIndex={-1} className="flex flex-1 flex-col items-center bg-cream px-4 py-10 outline-none sm:py-16">
      <Link href="/" aria-label="Comme à la Maison, retour au site" className="rounded-lg p-1">
        <Logo layout="horizontal" className="h-12 w-auto" />
      </Link>
      <div className="mt-8 w-full max-w-[28rem] rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-soft sm:p-8">
        {children}
      </div>
      <p className="mt-6 max-w-[28rem] text-center text-small text-ink-soft">
        Espace réservé à l’équipe Comme à la Maison, à ses propriétaires et à ses agents. Les comptes sont créés
        sur invitation.
      </p>
    </main>
  );
}
