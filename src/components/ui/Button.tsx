import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "light" | "ghost-light";

export type ButtonSize = "md" | "sm";

const base =
  "group/btn inline-flex items-center justify-center gap-2.5 rounded-full border-[1.5px] " +
  "text-center transition-[background-color,border-color,color,transform] duration-200 ease-soft " +
  "active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100 " +
  "disabled:border-transparent disabled:bg-disabled-bg disabled:text-disabled-fg " +
  "aria-disabled:cursor-not-allowed aria-disabled:border-transparent aria-disabled:bg-disabled-bg aria-disabled:text-disabled-fg";

const variants: Record<ButtonVariant, string> = {
  // Vert maison : l'action principale
  primary:
    "border-transparent bg-maison text-cream hover:bg-maison-hover active:bg-maison-active",
  // Olive pastel : action secondaire
  secondary:
    "border-transparent bg-olive text-ink hover:bg-olive-strong active:bg-olive-deep",
  // Contour : action tertiaire sur fond clair
  ghost:
    "border-maison bg-transparent text-maison hover:bg-olive-light active:bg-olive-mist",
  // Crème sur fond vert
  light:
    "border-transparent bg-cream text-maison hover:bg-olive-light active:bg-olive-mist",
  // Contour crème sur fond vert
  "ghost-light":
    "border-cream/80 bg-transparent text-cream hover:bg-cream/10 active:bg-cream/15",
};

// Les tailles sont exclusives : ne jamais repasser min-h, px ou taille de texte via className.
const sizes: Record<ButtonSize, string> = {
  md: "min-h-[3.125rem] px-6 text-button",
  sm: "min-h-11 px-5 text-[0.9375rem] font-semibold leading-none tracking-[0.005em]",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  className?: string,
  size: ButtonSize = "md",
) {
  return cn(base, sizes[size], variants[variant], className);
}

function Arrow() {
  return (
    <ArrowRight
      aria-hidden="true"
      className="size-[1.125rem] shrink-0 transition-transform duration-300 ease-soft group-hover/btn:translate-x-[3px]"
      strokeWidth={1.75}
    />
  );
}

type Common = { variant?: ButtonVariant; size?: ButtonSize; arrow?: boolean; children: ReactNode };

export function ButtonLink({
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  children,
  ...props
}: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={buttonClasses(variant, className, size)} {...props}>
      {children}
      {arrow ? <Arrow /> : null}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  children,
  type = "button",
  ...props
}: Common & ComponentProps<"button">) {
  return (
    <button type={type} className={buttonClasses(variant, className, size)} {...props}>
      {children}
      {arrow ? <Arrow /> : null}
    </button>
  );
}

/** Lien discret avec flèche : « Découvrir… ». Pour les renvois secondaires, sans alourdir la page. */
export function ArrowLink({
  className,
  children,
  onDark = false,
  ...props
}: { children: ReactNode; onDark?: boolean } & ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "group/btn inline-flex min-h-11 items-center gap-2.5 text-button",
        onDark ? "text-cream" : "text-maison",
        className,
      )}
      {...props}
    >
      <span className="border-b border-current/35 pb-1 transition-colors duration-200 group-hover/btn:border-current">
        {children}
      </span>
      <Arrow />
    </Link>
  );
}
