import { notFound } from "next/navigation";

import { Meter } from "@/components/app/charts";
import { ActionForm, SubmitButton } from "@/components/app/form";
import { DescriptionList, EmptyState, Notice, Panel, StatCard, StatusBadge, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { formatDayMonth, formatTime, startOfMonth, todayIso } from "@/lib/dates";
import { bookingStatus, incidentStatus, labelOf, propertyType, taskStatus, taskType, textOf } from "@/lib/labels";
import { formatBps, formatCents, formatCentsRounded } from "@/lib/money";
import { displayName } from "@/lib/people";
import { averageNightly, formatRatio, occupancy, sumMonths } from "@/lib/stats";

import { deleteProperty } from "../actions";

export default async function PropertyOverview({ params }: PageProps<"/admin/biens/[id]">) {
  const { id } = await params;
  const { supabase } = await adminContext();
  const today = todayIso();
  const year = today.slice(0, 4);

  const [{ data: property }, { data: settings }, monthStats, yearStats, bookings, tasks, incidents, usage] = await Promise.all([
    supabase
      .from("properties")
      .select("*, owner:owners!inner(commission_rate_bps)")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("settings").select("default_commission_bps, default_check_in_time, default_check_out_time").single(),
    supabase.rpc("stats_property_months", { p_from: startOfMonth(today), p_to: startOfMonth(today) }),
    supabase.rpc("stats_property_months", { p_from: `${year}-01-01`, p_to: `${year}-12-01` }),
    supabase
      .from("bookings")
      .select("id, reference, check_in, check_out, status, platform_id, guest:guests(contact:contacts(first_name, last_name))")
      .eq("property_id", id)
      .gte("check_out", today)
      .neq("status", "cancelled")
      .order("check_in")
      .limit(6),
    supabase
      .from("tasks")
      .select("id, type, status, due_date, assignee:profiles!tasks_assignee_id_fkey(full_name)")
      .eq("property_id", id)
      .gte("due_date", today)
      .in("status", ["todo", "in_progress", "done"])
      .order("due_date")
      .limit(6),
    supabase.from("incidents").select("id, title, status, created_at").eq("property_id", id).neq("status", "resolved").order("created_at", { ascending: false }),
    supabase.rpc("primary_residence_usage", { p_year: Number(year) }),
  ]);
  if (!property) notFound();

  const month = sumMonths((monthStats.data ?? []).filter((row) => row.property_id === id));
  const yearTotals = sumMonths((yearStats.data ?? []).filter((row) => row.property_id === id));
  const rate = property.commission_rate_bps ?? property.owner.commission_rate_bps ?? settings?.default_commission_bps ?? 2000;
  const residence = (usage.data ?? []).find((row) => row.property_id === id);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenus perçus ce mois-ci" value={formatCentsRounded(month.base)} hint="Après frais de plateforme" />
        <StatCard label="Occupation ce mois-ci" value={formatRatio(occupancy(month))} hint={`${month.bookedNights + month.importedNights} nuit(s) louée(s)`} />
        <StatCard label={`Revenus perçus en ${year}`} value={formatCentsRounded(yearTotals.base)} hint={`Commissions : ${formatCentsRounded(yearTotals.commission)}`} />
        <StatCard
          label={`Prix moyen par nuit en ${year}`}
          value={averageNightly(yearTotals) === null ? "—" : formatCents(averageNightly(yearTotals))}
        />
      </div>

      {residence ? (
        <Panel title="Résidence principale : nuits louées cette année" id="residence">
          <div className="flex flex-col gap-2">
            <p className="text-[0.9375rem]">
              <strong className="font-display text-[1.25rem] text-maison">{residence.nights}</strong> nuit(s) sur une limite de{" "}
              {residence.night_limit} en {year}.
            </p>
            <Meter value={residence.nights} max={residence.night_limit} label={`Nuits louées en ${year}`} />
            {residence.nights >= residence.night_limit - 10 ? (
              <Notice tone={residence.nights >= residence.night_limit ? "danger" : "warning"}>
                {residence.nights >= residence.night_limit
                  ? "La limite annuelle est atteinte : n’acceptez plus de réservation cette année sans vérifier la situation."
                  : "La limite annuelle approche."}
              </Notice>
            ) : null}
          </div>
        </Panel>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Fiche" id="fiche" actions={<TextLink href={`/admin/biens/${id}/modifier`} className="text-small">Modifier</TextLink>}>
          <DescriptionList
            items={[
              { label: "Type", value: textOf(propertyType, property.property_type) },
              { label: "Adresse", value: [property.address_line, property.postal_code, property.city].filter(Boolean).join(", ") },
              { label: "Surface", value: property.surface_m2 ? `${property.surface_m2} m²` : null },
              { label: "Capacité", value: property.capacity ? `${property.capacity} voyageurs` : null },
              { label: "Chambres / lits", value: `${property.bedrooms ?? "—"} / ${property.beds ?? "—"}` },
              { label: "Commission", value: `${formatBps(rate)} TTC des nuitées perçues${property.commission_rate_bps !== null ? " (taux propre au bien)" : ""}` },
              { label: "Frais de ménage par séjour", value: property.default_cleaning_fee_cents !== null ? formatCents(property.default_cleaning_fee_cents) : null },
              {
                label: "Arrivée / départ",
                value: `${formatTime(property.check_in_time ?? settings?.default_check_in_time)} / ${formatTime(property.check_out_time ?? settings?.default_check_out_time)}`,
              },
              { label: "Numéro d’enregistrement", value: property.registration_number },
              { label: "Résidence principale", value: property.is_primary_residence ? "Oui" : "Non" },
            ]}
          />
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-4 text-small">
            <TextLink href={`/admin/reservations?bien=${id}`}>Réservations</TextLink>
            <TextLink href={`/admin/calendrier?bien=${id}`}>Calendrier</TextLink>
            <TextLink href={`/admin/taches?bien=${id}`}>Tâches</TextLink>
            <TextLink href={`/admin/depenses?bien=${id}`}>Dépenses</TextLink>
            <TextLink href={`/admin/documents?bien=${id}`}>Documents</TextLink>
          </div>
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel title="Prochains séjours" id="sejours">
            {(bookings.data ?? []).length === 0 ? (
              <EmptyState title="Aucun séjour à venir." />
            ) : (
              <ul className="flex flex-col divide-y divide-line">
                {(bookings.data ?? []).map((b) => (
                  <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 py-2 first:pt-0">
                    <span className="flex flex-col">
                      <TextLink href={`/admin/reservations/${b.id}`}>
                        {formatDayMonth(b.check_in)} → {formatDayMonth(b.check_out)}
                      </TextLink>
                      <span className="text-small text-ink-soft">
                        {displayName(b.guest?.contact)} · {b.platform_id} · {b.reference}
                      </span>
                    </span>
                    <StatusBadge value={labelOf(bookingStatus, b.status)} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Tâches à venir" id="taches">
            {(tasks.data ?? []).length === 0 ? (
              <EmptyState title="Aucune tâche à venir." />
            ) : (
              <ul className="flex flex-col divide-y divide-line">
                {(tasks.data ?? []).map((t) => (
                  <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 py-2 first:pt-0">
                    <span className="flex flex-col">
                      <TextLink href={`/admin/taches/${t.id}`}>
                        {textOf(taskType, t.type)} · {formatDayMonth(t.due_date)}
                      </TextLink>
                      <span className="text-small text-ink-soft">{t.assignee?.full_name || "Aucun agent affecté"}</span>
                    </span>
                    <StatusBadge value={labelOf(taskStatus, t.status)} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          {(incidents.data ?? []).length > 0 ? (
            <Panel title="Incidents en cours" id="incidents">
              <ul className="flex flex-col gap-2">
                {(incidents.data ?? []).map((i) => (
                  <li key={i.id} className="flex flex-wrap items-center justify-between gap-2">
                    <TextLink href={`/admin/incidents/${i.id}`}>{i.title}</TextLink>
                    <StatusBadge value={labelOf(incidentStatus, i.status)} />
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}
        </div>
      </div>

      <Panel title="Supprimer ce bien" id="suppression" description="Possible uniquement si aucune réservation n’y est rattachée. Sinon, passez-le en statut « Inactif ».">
        <ActionForm action={deleteProperty.bind(null, id)} confirmMessage={`Supprimer définitivement « ${property.name} » ?`}>
          <SubmitButton variant="ghost" pendingLabel="Suppression…">
            Supprimer le bien
          </SubmitButton>
        </ActionForm>
      </Panel>
    </>
  );
}
