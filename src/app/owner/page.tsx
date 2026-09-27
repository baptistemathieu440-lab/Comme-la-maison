import Link from "next/link";
import { Phone } from "lucide-react";

import { OwnerNotLinked } from "@/components/app/OwnerNotLinked";
import { DemoBadge, EmptyState, PageHeader, Panel, StatCard, StatusBadge, TextLink } from "@/components/app/ui";
import { site } from "@/content/site";
import { ownerContext } from "@/lib/auth/admin-context";
import { formatDayMonth, formatMonth, startOfMonth, todayIso } from "@/lib/dates";
import { telHref } from "@/lib/format";
import { incidentStatus, labelOf, propertyStatus, statementStatus, taskStatus, taskType, textOf } from "@/lib/labels";
import { formatCents, formatCentsRounded } from "@/lib/money";
import { signedUrls } from "@/lib/storage";
import { formatRatio, occupancy, sumMonths } from "@/lib/stats";

export const metadata = { title: "Accueil" };

export default async function OwnerHome() {
  const { supabase, owner, session } = await ownerContext();
  if (!owner) return <OwnerNotLinked />;
  const today = todayIso();
  const month = startOfMonth(today);
  const year = today.slice(0, 4);

  const [{ data: properties }, monthStats, yearStats, { data: upcoming }, { data: statements }, { data: cleanings }, { data: incidents }] = await Promise.all([
    supabase.from("properties").select("id, name, city, status, is_demo, property_photos(storage_path, position)").order("name"),
    supabase.rpc("stats_property_months", { p_from: month, p_to: month }),
    supabase.rpc("stats_property_months", { p_from: `${year}-01-01`, p_to: month }),
    supabase
      .from("owner_bookings")
      .select("id, property_name, check_in, check_out, guest_first_name, adults, children, platform_name, is_demo")
      .gte("check_out", today)
      .in("status", ["confirmed", "in_progress"])
      .order("check_in")
      .limit(5),
    supabase.from("owner_statements").select("id, period_month, number, status, total_due_cents, owner_net_cents").order("period_month", { ascending: false }).limit(3),
    supabase.from("owner_tasks").select("id, type, status, property_name, due_date").gte("due_date", today).order("due_date").limit(4),
    supabase.from("incidents").select("id, title, status, property:properties!inner(name)").neq("status", "resolved").order("created_at", { ascending: false }),
  ]);

  const covers = (properties ?? []).map((p) => [...(p.property_photos ?? [])].sort((a, b) => a.position - b.position)[0]?.storage_path).filter(Boolean) as string[];
  const urls = await signedUrls("property-photos", covers, 600);
  const m = sumMonths(monthStats.data ?? []);
  const y = sumMonths(yearStats.data ?? []);
  const firstName = owner.contact.first_name || session.fullName.split(" ")[0];

  return (
    <>
      <PageHeader
        title={firstName ? `Bonjour ${firstName}` : "Bonjour"}
        description="Vos logements, vos séjours et vos revenus, mis à jour à chaque réservation."
      >
        {owner.is_demo ? <DemoBadge /> : null}
      </PageHeader>

      <section aria-labelledby="chiffres" className="flex flex-col gap-3">
        <h2 id="chiffres" className="font-display text-[1.25rem] font-medium text-maison [font-stretch:92%]">
          Vos revenus
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label={`Revenus perçus en ${formatMonth(month)}`} value={formatCentsRounded(m.base)} hint="Versés par les plateformes, après leurs frais" href="/owner/revenus" />
          <StatCard label="Après commission ce mois-ci" value={formatCentsRounded(m.ownerNet)} hint="Avant frais avancés éventuels" href="/owner/revenus" />
          <StatCard label={`Revenus perçus en ${year}`} value={formatCentsRounded(y.base)} hint={`Après commission : ${formatCentsRounded(y.ownerNet)}`} href="/owner/revenus" />
          <StatCard label="Occupation ce mois-ci" value={formatRatio(occupancy(m))} hint={`${m.bookedNights + m.importedNights} nuit(s) louée(s)`} href="/owner/calendrier" />
        </div>
        <p className="text-small text-ink-soft">
          Montants enregistrés à partir des relevés des plateformes, répartis par nuit.{" "}
          <TextLink href="/owner/revenus">Comment est calculée la commission ?</TextLink>
        </p>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Prochains séjours" id="sejours" actions={<TextLink href="/owner/reservations" className="text-small">Toutes les réservations</TextLink>}>
          {(upcoming ?? []).length === 0 ? (
            <EmptyState title="Aucun séjour à venir pour l’instant." />
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {(upcoming ?? []).map((b) => (
                <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 first:pt-0">
                  <span className="flex flex-col">
                    <span className="font-semibold text-maison">{b.property_name}</span>
                    <span className="text-small text-ink-soft">
                      {b.guest_first_name ?? "Voyageur"} · {(b.adults ?? 0) + (b.children ?? 0)} voyageur(s) · {b.platform_name}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 text-small font-semibold">
                    {b.is_demo ? <DemoBadge /> : null}
                    {formatDayMonth(b.check_in)} → {formatDayMonth(b.check_out)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Derniers relevés" id="releves" actions={<TextLink href="/owner/releves" className="text-small">Tous les relevés</TextLink>}>
          {(statements ?? []).length === 0 ? (
            <EmptyState title="Aucun relevé pour l’instant.">Votre relevé arrive au début de chaque mois pour le mois écoulé.</EmptyState>
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {(statements ?? []).map((s) => (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 first:pt-0">
                  <TextLink href={`/owner/releves/${s.id}`} className="capitalize">
                    {formatMonth(s.period_month)}
                  </TextLink>
                  <span className="flex items-center gap-2 text-small">
                    Revenu net {formatCents(s.owner_net_cents)}
                    <StatusBadge value={labelOf(statementStatus, s.status)} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel title="Vos logements" id="logements">
        {(properties ?? []).length === 0 ? (
          <EmptyState title="Aucun logement pour l’instant." />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {(properties ?? []).map((p) => {
              const cover = [...(p.property_photos ?? [])].sort((a, b) => a.position - b.position)[0]?.storage_path;
              return (
                <li key={p.id}>
                  <Link href={`/owner/biens/${p.id}`} className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-cream hover:border-maison/40">
                    {cover && urls.get(cover) ? (
                      // eslint-disable-next-line @next/next/no-img-element -- lien signé temporaire
                      <img src={urls.get(cover) ?? undefined} alt="" className="aspect-[16/9] w-full object-cover" />
                    ) : (
                      <div className="hatch aspect-[16/9] w-full opacity-40" aria-hidden="true" />
                    )}
                    <span className="flex flex-col gap-1 p-4">
                      <span className="flex flex-wrap items-center gap-2 font-semibold text-maison">
                        {p.name} {p.is_demo ? <DemoBadge /> : null}
                      </span>
                      <span className="flex items-center gap-2 text-small text-ink-soft">
                        {p.city} <StatusBadge value={labelOf(propertyStatus, p.status)} />
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Ménages à venir" id="menages">
          {(cleanings ?? []).length === 0 ? (
            <p className="text-small text-ink-soft">Aucun ménage prévu.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {(cleanings ?? []).map((t) => (
                <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 text-[0.9375rem]">
                  <span>
                    {textOf(taskType, t.type)} · {t.property_name} · {formatDayMonth(t.due_date)}
                  </span>
                  <StatusBadge value={labelOf(taskStatus, t.status)} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Incidents en cours" id="incidents">
          {(incidents ?? []).length === 0 ? (
            <p className="text-small text-ink-soft">Aucun incident en cours.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {(incidents ?? []).map((i) => (
                <li key={i.id} className="flex flex-col gap-1">
                  <span className="font-semibold">{i.title}</span>
                  <span className="flex items-center gap-2 text-small text-ink-soft">
                    {i.property.name} <StatusBadge value={labelOf(incidentStatus, i.status)} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Une question ?" id="contact">
          <p className="mb-3 text-small text-ink-soft">Baptiste et Simon restent vos interlocuteurs directs.</p>
          <ul className="flex flex-col gap-2">
            {site.contact.phones.map((phone) => (
              <li key={phone.number}>
                <a href={telHref(phone.number)} className="inline-flex min-h-11 items-center gap-2 font-semibold text-maison underline-offset-4 hover:underline">
                  <Phone aria-hidden="true" className="size-4" />
                  {phone.name} · {phone.number}
                </a>
              </li>
            ))}
            {site.contact.email ? (
              <li>
                <a href={`mailto:${site.contact.email}`} className="break-all text-maison underline underline-offset-4">
                  {site.contact.email}
                </a>
              </li>
            ) : null}
          </ul>
        </Panel>
      </div>
    </>
  );
}
