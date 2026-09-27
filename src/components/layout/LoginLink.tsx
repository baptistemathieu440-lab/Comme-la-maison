import Link from "next/link";
import { UserRound } from "lucide-react";

import { loginNav } from "@/content/navigation";
import { cn } from "@/lib/cn";

/**
 * Accès à l'espace propriétaire, agent ou gestion : une pastille discrète avec une icône,
 * distincte des liens du menu sans concurrencer « Confier mon bien ».
 * « compact » : l'icône seule sous xl (le nom accessible reste complet).
 */
export function LoginLink({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link
      href={loginNav.href}
      aria-label={loginNav.label}
      title={loginNav.label}
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-maison/25 bg-surface/80 text-[0.9375rem] font-semibold leading-none text-maison transition-colors duration-200 hover:border-maison/60 hover:bg-olive-light",
        compact ? "px-0 xl:px-4" : "px-4",
        className,
      )}
    >
      <UserRound aria-hidden="true" className="size-[1.125rem] shrink-0" strokeWidth={1.75} />
      <span className={cn(compact && "hidden xl:inline")}>Connexion</span>
    </Link>
  );
}
