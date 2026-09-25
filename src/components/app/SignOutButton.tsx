import { LogOut } from "lucide-react";

import { cn } from "@/lib/cn";

/** Déconnexion par formulaire POST (pas de lien GET déclenchable par un tiers). */
export function SignOutButton({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <form action="/auth/deconnexion" method="post" className={className}>
      <button
        type="submit"
        className={cn(
          "inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-[0.9375rem] font-semibold transition-colors",
          onDark ? "text-cream hover:bg-cream/10" : "text-maison hover:bg-olive-light",
        )}
      >
        <LogOut aria-hidden="true" className="size-4" strokeWidth={2} />
        Se déconnecter
      </button>
    </form>
  );
}
