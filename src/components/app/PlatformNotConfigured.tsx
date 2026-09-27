import { Logo } from "@/components/brand/Logo";

import { Notice } from "./ui";

/** Affiché quand les variables Supabase ne sont pas renseignées sur l'hébergement. */
export function PlatformNotConfigured() {
  return (
    <main id="contenu" tabIndex={-1} className="flex flex-1 flex-col items-center gap-8 bg-cream px-4 py-16 outline-none">
      <Logo layout="horizontal" className="h-12 w-auto" />
      <div className="w-full max-w-[34rem]">
        <Notice tone="warning" title="Plateforme pas encore branchée">
          Cet espace a besoin de sa base de données (Supabase). Renseignez NEXT_PUBLIC_SUPABASE_URL,
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY et SUPABASE_SECRET_KEY dans les variables d’environnement du site,
          puis redéployez. Le guide se trouve dans docs/plateforme-exploitation.md.
        </Notice>
      </div>
    </main>
  );
}
