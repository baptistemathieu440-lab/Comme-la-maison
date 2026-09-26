"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { contactNav, mainNav, primaryCta } from "@/content/navigation";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { telHref } from "@/lib/format";

import { isCurrent } from "./NavLinks";

const items = [...mainNav, contactNav];

/**
 * Menu plein écran pour mobile et tablette.
 * Utilise <dialog> : focus piégé dans le menu, fermeture avec Échap,
 * reste de la page inactif pendant l'ouverture.
 */
export function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 text-button text-maison transition-colors hover:bg-olive-light lg:hidden"
      >
        <Menu aria-hidden="true" className="size-6" strokeWidth={1.5} />
        <span className="max-xs:sr-only">Menu</span>
      </button>

      <dialog
        ref={dialogRef}
        id="menu-principal"
        aria-label="Menu"
        onClose={close}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-cream p-0 text-ink backdrop:bg-ink/30 open:flex open:flex-col"
      >
        <div className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-line/60 px-5 sm:px-8">
          <Logo layout="horizontal" className="h-10 w-auto" />
          <button
            type="button"
            onClick={close}
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 text-button text-maison transition-colors hover:bg-olive-light"
          >
            <X aria-hidden="true" className="size-6" strokeWidth={1.5} />
            <span>Fermer</span>
          </button>
        </div>

        <nav aria-label="Navigation principale" className="flex flex-1 flex-col overflow-y-auto px-5 py-8 sm:px-8">
          <ul className="flex flex-col">
            {items.map((item) => {
              const current = isCurrent(pathname, item.href);
              return (
                <li key={item.href} className="border-b border-line/70">
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={current ? "page" : undefined}
                    className="flex min-h-16 items-center justify-between py-3 font-display text-[1.75rem] leading-none text-maison"
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn("size-2 rounded-full", current ? "bg-terra" : "bg-olive")}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto flex flex-col gap-4 pt-10">
            <ButtonLink href={primaryCta.href} onClick={close} arrow className="w-full">
              {primaryCta.label}
            </ButtonLink>
            {site.contact.phones.length > 0 ? (
              <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1">
                {site.contact.phones.map((phone) => (
                  <li key={phone.number}>
                    <a href={telHref(phone.number)} className="inline-flex min-h-11 items-center gap-1.5 font-medium text-maison underline-offset-4 hover:underline">
                      Appeler {phone.name}
                      <span className="whitespace-nowrap text-ink-soft">{phone.number}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="text-small text-center text-ink-soft">
              Conciergerie à {site.area.city} et dans sa métropole
            </p>
          </div>
        </nav>
      </dialog>
    </>
  );
}
