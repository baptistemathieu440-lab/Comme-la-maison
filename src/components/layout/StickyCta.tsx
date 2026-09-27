"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { primaryCta } from "@/content/navigation";
import { cn } from "@/lib/cn";

/**
 * Bouton « Confier mon bien » fixé en bas de l’écran, sur mobile uniquement.
 * Il apparaît une fois le premier écran passé et s'efface quand le formulaire
 * ou le pied de page sont visibles, pour ne jamais masquer de contenu utile.
 */
export function StickyCta() {
  // Remonté à chaque page : l'état repart de zéro et les observateurs visent la bonne page.
  const pathname = usePathname();
  return <StickyCtaBar key={pathname} />;
}

function StickyCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("[data-hero]");
    const blockers = Array.from(document.querySelectorAll("#estimation, footer"));
    if (!hero) return;
    let pastHero = false;
    const blocked = new Set<Element>();

    const update = () => setVisible(pastHero && blocked.size === 0);

    const heroObserver = new IntersectionObserver(([entry]) => {
      pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      update();
    });
    const blockObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) blocked.add(entry.target);
        else blocked.delete(entry.target);
      }
      update();
    });

    heroObserver.observe(hero);
    blockers.forEach((el) => blockObserver.observe(el));
    update();

    return () => {
      heroObserver.disconnect();
      blockObserver.disconnect();
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 transition-[transform,opacity] duration-300 ease-soft md:hidden",
        "bg-linear-to-t from-cream via-cream/90 to-cream/0",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
      aria-hidden={!visible}
      inert={!visible}
    >
      <ButtonLink href={primaryCta.href} arrow className="w-full shadow-float" tabIndex={visible ? 0 : -1}>
        {primaryCta.label}
      </ButtonLink>
    </div>
  );
}
