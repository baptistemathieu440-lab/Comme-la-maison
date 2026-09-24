"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { mainNav, primaryCta } from "@/content/navigation";
import { site } from "@/content/site";

/**
 * Menu plein écran pour mobile et tablette.
 * Utilise <dialog> : focus piégé dans le menu, fermeture avec Échap,
 * reste de la page inactif pendant l'ouverture.
 */
export function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="menu-principal"
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border-[1.5px] border-maison px-3.5 text-button text-maison transition-colors hover:bg-olive-light xl:hidden"
      >
        <Menu aria-hidden="true" className="size-5" strokeWidth={1.75} />
        <span className="max-xs:sr-only">Menu</span>
      </button>

      <dialog
        ref={dialogRef}
        id="menu-principal"
        aria-label="Menu"
        onClose={close}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-cream p-0 text-ink backdrop:bg-ink/30 open:flex open:flex-col"
      >
        <div className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-line/70 px-5 sm:px-8">
          <Logo layout="horizontal" className="h-10 w-auto" />
          <button
            type="button"
            onClick={close}
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border-[1.5px] border-maison px-3.5 text-button text-maison transition-colors hover:bg-olive-light"
          >
            <X aria-hidden="true" className="size-5" strokeWidth={1.75} />
            <span>Fermer</span>
          </button>
        </div>

        <nav aria-label="Navigation principale" className="flex flex-1 flex-col overflow-y-auto px-5 py-8 sm:px-8">
          <ul className="flex flex-col">
            {mainNav.map((item) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  onClick={close}
                  className="flex min-h-16 items-center justify-between py-3 font-display text-[1.75rem] font-medium tracking-[-0.015em] text-maison [font-stretch:92%]"
                >
                  {item.label}
                  <span aria-hidden="true" className="size-2 rounded-full bg-olive" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-col gap-4 pt-10">
            <ButtonLink href={primaryCta.href} onClick={close} arrow className="w-full">
              {primaryCta.label}
            </ButtonLink>
            <p className="text-small text-center text-ink-soft">
              Conciergerie à {site.area.city} et dans sa métropole · {site.commission.label} {site.commission.taxNote} des revenus locatifs
            </p>
          </div>
        </nav>
      </dialog>
    </>
  );
}
