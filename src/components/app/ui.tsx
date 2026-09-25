import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  Clock3,
  FlaskConical,
  Info,
  MinusCircle,
  type LucideIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { Labelled, Tone } from "@/lib/labels";

/* ---------- Badges ---------- */

const toneStyles: Record<Tone, { className: string; icon: LucideIcon }> = {
  positive: { className: "bg-olive-light text-maison", icon: CheckCircle2 },
  info: { className: "border border-maison/35 bg-surface text-maison", icon: Info },
  warning: { className: "bg-terra-wash text-terra-deep", icon: Clock3 },
  danger: { className: "bg-error-wash text-error", icon: AlertTriangle },
  neutral: { className: "bg-stone text-ink", icon: Circle },
  muted: { className: "border border-dashed border-line-strong text-ink-soft", icon: MinusCircle },
};

export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  const { className: toneClass, icon: Icon } = toneStyles[tone];
  return (
    <span
      className={cn(
        "inline-flex w-fit min-h-7 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.8125rem] font-semibold leading-none",
        toneClass,
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2.25} />
      {children}
    </span>
  );
}

export function StatusBadge({ value, className }: { value: Labelled; className?: string }) {
  return (
    <Badge tone={value.tone} className={className}>
      {value.label}
    </Badge>
  );
}

/** Signale une donnée de démonstration : hachures + icône + texte. */
export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "hatch inline-flex w-fit min-h-6 items-center gap-1 rounded-full px-2 py-0.5 text-[0.75rem] font-bold uppercase leading-none tracking-[0.06em] text-ink",
        className,
      )}
      title="Donnée de démonstration"
    >
      <FlaskConical aria-hidden="true" className="size-3" strokeWidth={2.5} />
      Démo
    </span>
  );
}

/* ---------- Structure de page ---------- */

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  eyebrow?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex min-w-0 flex-col gap-2">
        {eyebrow ? <div className="text-caption text-ink-soft">{eyebrow}</div> : null}
        <h1 className="font-display text-[1.75rem] font-medium leading-tight tracking-[-0.015em] text-maison [font-stretch:92%] sm:text-[2.125rem]">
          {title}
        </h1>
        {description ? <div className="max-w-[46rem] text-ink-soft">{description}</div> : null}
        {children}
      </div>
      {actions ? <div className="flex flex-wrap gap-2 sm:justify-end">{actions}</div> : null}
    </header>
  );
}

export function Panel({
  title,
  description,
  actions,
  children,
  className,
  id,
  as: Tag = "section",
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div";
}) {
  const headingId = id ? `${id}-titre` : undefined;
  return (
    <Tag
      id={id}
      aria-labelledby={title && headingId ? headingId : undefined}
      className={cn("rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:p-6", className)}
    >
      {title || actions ? (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            {title ? (
              <h2 id={headingId} className="font-display text-[1.25rem] font-medium leading-snug text-maison [font-stretch:92%]">
                {title}
              </h2>
            ) : null}
            {description ? <p className="text-small text-ink-soft">{description}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </Tag>
  );
}

export function StatCard({
  label,
  value,
  hint,
  href,
  badge,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  href?: string;
  badge?: ReactNode;
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <span className="text-small font-medium text-ink-soft">{label}</span>
        {badge}
      </div>
      <span className="font-display text-[1.75rem] font-medium leading-none tracking-[-0.01em] text-maison tabular-nums [font-stretch:92%]">
        {value}
      </span>
      {hint ? <span className="text-small text-ink-soft">{hint}</span> : null}
    </>
  );
  const className =
    "flex min-h-32 flex-col justify-between gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-5";
  return href ? (
    <Link href={href} className={cn(className, "transition-colors hover:border-maison/40 hover:bg-cream")}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-[var(--radius-card)] border border-dashed border-line-strong/60 bg-cream/60 p-6">
      <p className="font-semibold text-maison">{title}</p>
      {children ? <div className="max-w-[40rem] text-small text-ink-soft">{children}</div> : null}
      {action}
    </div>
  );
}

export function Notice({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: Tone;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const { icon: Icon } = toneStyles[tone];
  const box: Record<Tone, string> = {
    positive: "border-olive-deep/50 bg-olive-light/70",
    info: "border-maison/25 bg-surface",
    warning: "border-terra/40 bg-terra-wash/70",
    danger: "border-error/40 bg-error-wash/70",
    neutral: "border-line bg-stone/70",
    muted: "border-line bg-cream",
  };
  return (
    <div className={cn("flex gap-3 rounded-[var(--radius-field)] border p-4 text-small text-ink", box[tone], className)}>
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={2.25} />
      <div className="flex min-w-0 flex-col gap-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div>{children}</div>
      </div>
    </div>
  );
}

/* ---------- Listes de valeurs ---------- */

export function DescriptionList({
  items,
  className,
}: {
  items: Array<{ label: string; value: ReactNode; hidden?: boolean }>;
  className?: string;
}) {
  return (
    <dl className={cn("grid gap-x-6 gap-y-3 sm:grid-cols-2", className)}>
      {items
        .filter((item) => !item.hidden)
        .map((item) => (
          <div key={item.label} className="flex min-w-0 flex-col gap-0.5">
            <dt className="text-small text-ink-soft">{item.label}</dt>
            <dd className="break-words text-ink">{item.value ?? "—"}</dd>
          </div>
        ))}
    </dl>
  );
}

/* ---------- Tableau adapté au mobile ---------- */

export type Column<Row> = {
  header: string;
  cell: (row: Row) => ReactNode;
  className?: string;
  /** Aligné à droite (montants). */
  numeric?: boolean;
  /** Masqué sur téléphone (information secondaire). */
  hideOnMobile?: boolean;
};

/**
 * Tableau classique sur ordinateur, fiches empilées sur téléphone.
 * Les rôles ARIA conservent la sémantique de tableau quand l'affichage change.
 */
export function DataTable<Row>({
  columns,
  rows,
  rowKey,
  caption,
  empty,
}: {
  columns: Column<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  caption: string;
  empty?: ReactNode;
}) {
  if (rows.length === 0) {
    return <>{empty ?? <EmptyState title="Aucun élément pour l’instant." />}</>;
  }
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
      <table role="table" className="data-table w-full border-collapse text-left text-[0.9375rem]">
        <caption className="sr-only">{caption}</caption>
        <thead role="rowgroup" className="hidden bg-stone/60 md:table-header-group">
          <tr role="row">
            {columns.map((column) => (
              <th
                role="columnheader"
                key={column.header}
                scope="col"
                className={cn(
                  "px-4 py-3 text-[0.8125rem] font-semibold text-ink-soft",
                  column.numeric && "text-right",
                  column.className,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {rows.map((row) => (
            <tr
              role="row"
              key={rowKey(row)}
              className="flex flex-col gap-1.5 border-t border-line p-4 first:border-t-0 md:table-row md:p-0 md:first:border-t"
            >
              {columns.map((column, index) => (
                <td
                  role="cell"
                  key={column.header}
                  data-label={column.header}
                  className={cn(
                    "align-middle md:px-4 md:py-3",
                    index > 0 && "data-cell",
                    column.numeric && "tabular-nums md:text-right",
                    column.hideOnMobile && "hidden md:table-cell",
                    column.className,
                  )}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Navigation secondaire ---------- */

export function Tabs({ items, current }: { items: Array<{ href: string; label: string; count?: number }>; current: string }) {
  return (
    <nav aria-label="Sections" className="-mx-1 overflow-x-auto">
      <ul className="flex min-w-max gap-1 px-1">
        {items.map((item) => {
          const active = item.href === current;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[0.9375rem] font-semibold transition-colors",
                  active ? "bg-maison text-cream" : "text-ink hover:bg-olive-light",
                )}
              >
                {item.label}
                {item.count !== undefined ? (
                  <span className={cn("rounded-full px-1.5 text-[0.75rem]", active ? "bg-cream/20" : "bg-stone")}>
                    {item.count}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function TextLink({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn("font-semibold text-maison underline decoration-maison/30 underline-offset-4 hover:decoration-maison", className)}
      {...props}
    />
  );
}

export function Pagination({
  page,
  pageSize,
  total,
  hrefFor,
}: {
  page: number;
  pageSize: number;
  total: number;
  hrefFor: (page: number) => string;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-3 text-small">
      <span className="text-ink-soft">
        Page {page} sur {pages} · {total} éléments
      </span>
      <div className="flex gap-2">
        {page > 1 ? <TextLink href={hrefFor(page - 1)}>Précédente</TextLink> : null}
        {page < pages ? <TextLink href={hrefFor(page + 1)}>Suivante</TextLink> : null}
      </div>
    </nav>
  );
}
