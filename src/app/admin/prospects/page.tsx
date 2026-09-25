import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { FilterBar, FilterField, filterControl, param } from "@/components/app/FilterBar";
import { DemoBadge, PageHeader, StatusBadge } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { formatDayMonth, todayIso } from "@/lib/dates";
import { labelOf, prospectSource, prospectStatus, textOf } from "@/lib/labels";
import { displayName } from "@/lib/people";
import { normalizeQuery } from "@/lib/search";

export const metadata = { title: "Prospects" };

const pipeline = ["new", "contacted", "meeting", "proposal_sent", "thinking", "won", "lost"] as const;

export default async function ProspectsPage({ searchParams }: PageProps<"/admin/prospects">) {
  const { supabase } = await adminContext();
  const params = await searchParams;
  const status = param(params.statut);
  const followUp = param(params.relance) === "1";
  const q = normalizeQuery(param(params.q));
  const today = todayIso();

  let query = supabase
    .from("prospects")
    .select("id, status, source, property_city, property_type, next_action, next_action_on, is_demo, created_at, contact:contacts!inner(first_name, last_name, company_name, email, phone, search_text)")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  if (followUp) query = query.lte("next_action_on", today).not("status", "in", "(won,lost)");
  if (q) query = query.like("contact.search_text", `%${q}%`);
  const { data: prospects } = await query;
  const rows = prospects ?? [];

  const columns = pipeline
    .filter((key) => !status || key === status)
    .map((key) => ({ key, items: rows.filter((row) => row.status === key) }));

  return (
    <>
      <PageHeader
        title="Prospects"
        description="Le pipeline commercial. Chaque demande d’estimation envoyée depuis le site arrive ici automatiquement."
        actions={<ButtonLink href="/admin/prospects/nouveau" size="sm">Ajouter un prospect</ButtonLink>}
      />
      <FilterBar resetHref="/admin/prospects">
        <FilterField label="Recherche" id="f-q">
          <input id="f-q" name="q" type="search" defaultValue={param(params.q)} className={filterControl} placeholder="Nom, email, téléphone" />
        </FilterField>
        <FilterField label="Étape" id="f-statut">
          <select id="f-statut" name="statut" defaultValue={status} className={filterControl}>
            <option value="">Toutes</option>
            {pipeline.map((key) => (
              <option key={key} value={key}>
                {prospectStatus[key].label}
              </option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Relances" id="f-relance">
          <select id="f-relance" name="relance" defaultValue={followUp ? "1" : ""} className={filterControl}>
            <option value="">Toutes</option>
            <option value="1">À relancer aujourd’hui ou en retard</option>
          </select>
        </FilterField>
      </FilterBar>

      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        <div className="flex flex-col gap-4 lg:grid lg:min-w-max lg:auto-cols-[17rem] lg:grid-flow-col">
          {columns.map((column) => (
            <section key={column.key} aria-labelledby={`col-${column.key}`} className="flex flex-col gap-2 rounded-[var(--radius-card)] bg-stone/60 p-3">
              <h2 id={`col-${column.key}`} className="flex items-center justify-between gap-2 px-1">
                <StatusBadge value={labelOf(prospectStatus, column.key)} />
                <span className="text-small font-semibold text-ink-soft">{column.items.length}</span>
              </h2>
              {column.items.length === 0 ? (
                <p className="px-1 py-2 text-small text-ink-soft">Aucun prospect.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {column.items.map((row) => {
                    const late = row.next_action_on && row.next_action_on <= today && !["won", "lost"].includes(row.status);
                    return (
                      <li key={row.id}>
                        <Link
                          href={`/admin/prospects/${row.id}`}
                          className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3 hover:border-maison/40"
                        >
                          <span className="flex flex-wrap items-center gap-2 font-semibold text-maison">
                            {displayName(row.contact)}
                            {row.is_demo ? <DemoBadge /> : null}
                          </span>
                          <span className="text-small text-ink-soft">
                            {[row.property_type, row.property_city].filter(Boolean).join(" · ") || "Logement non précisé"}
                          </span>
                          <span className="text-[0.8125rem] text-ink-soft">
                            {textOf(prospectSource, row.source)} · reçu le {formatDayMonth(row.created_at)}
                          </span>
                          {row.next_action ? (
                            <span className={late ? "text-[0.8125rem] font-semibold text-terra-text" : "text-[0.8125rem] text-ink"}>
                              {late ? "À faire : " : "Ensuite : "}
                              {row.next_action}
                              {row.next_action_on ? ` (${formatDayMonth(row.next_action_on)})` : ""}
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
