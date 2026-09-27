import { notFound } from "next/navigation";

import { ActionForm, FormActions, SubmitButton } from "@/components/app/form";
import { DemoBadge, DescriptionList, Notice, PageHeader, Panel, StatusBadge, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { formatDateShort, formatDateTime, formatStay } from "@/lib/dates";
import { bookingSource, bookingStatus, labelOf, taskStatus, taskType, textOf } from "@/lib/labels";
import { centsToInput, formatBps, formatCents } from "@/lib/money";
import { platformOptions, propertyOptions, propertyRates } from "@/lib/options";
import { displayName } from "@/lib/people";

import { deleteBooking, setBookingStatus, updateBooking } from "../actions";
import { BookingFields } from "../BookingFields";

export const metadata = { title: "Réservation" };

export default async function BookingPage({ params, searchParams }: PageProps<"/admin/reservations/[id]">) {
  const { id } = await params;
  const query = await searchParams;
  const { supabase } = await adminContext();

  const [{ data: booking }, { data: tasks }, properties, platforms, rates] = await Promise.all([
    supabase
      .from("bookings")
      .select("*, property:properties!inner(id, name), guest:guests(contact:contacts(first_name, last_name, email, phone)), statement:owner_statements!bookings_statement_fk(id, number)")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("tasks")
      .select("id, type, status, due_date, assignee:profiles!tasks_assignee_id_fkey(full_name)")
      .eq("booking_id", id)
      .order("due_date"),
    propertyOptions(supabase),
    platformOptions(supabase),
    propertyRates(supabase),
  ]);
  if (!booking) notFound();

  const locked = Boolean(booking.statement_id);
  const guest = booking.guest?.contact ?? null;
  const platformName = platforms.find((p) => p.value === booking.platform_id)?.label ?? booking.platform_id;

  return (
    <>
      <PageHeader
        eyebrow={<TextLink href="/admin/reservations">Réservations</TextLink>}
        title={`${booking.property.name} · ${formatStay(booking.check_in, booking.check_out)}`}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <span>
              {booking.reference} · {platformName} · {textOf(bookingSource, booking.source)}
            </span>
            <StatusBadge value={labelOf(bookingStatus, booking.status)} />
            {booking.is_demo ? <DemoBadge /> : null}
          </span>
        }
        actions={
          <>
            {booking.status === "inquiry" ? (
              <ActionForm action={setBookingStatus.bind(null, id, "confirmed")}>
                <SubmitButton pendingLabel="…">Confirmer la demande</SubmitButton>
              </ActionForm>
            ) : null}
            {!["cancelled", "completed"].includes(booking.status) ? (
              <ActionForm action={setBookingStatus.bind(null, id, "cancelled")} confirmMessage="Annuler cette réservation ? Les tâches non commencées seront annulées.">
                <SubmitButton variant="ghost" pendingLabel="…">
                  Annuler la réservation
                </SubmitButton>
              </ActionForm>
            ) : null}
          </>
        }
      />

      {query.creee ? <Notice tone="positive">Réservation enregistrée. Le ménage de départ a été planifié automatiquement si la règle est active.</Notice> : null}
      {locked ? (
        <Notice tone="info" title="Réservation facturée">
          Elle figure dans le relevé{" "}
          <TextLink href={`/admin/releves/${booking.statement?.id}`}>{booking.statement?.number ?? "finalisé"}</TextLink> : ses dates et montants
          ne peuvent plus changer. Une correction se fait par un ajustement sur un relevé suivant.
        </Notice>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Montants" id="montants" description={`Taux figé à la création : ${formatBps(booking.commission_rate_bps)} TTC.`}>
          <dl className="flex flex-col text-[0.9375rem] tabular-nums">
            {[
              ["Prix des nuitées", formatCents(booking.nights_amount_cents)],
              ["Frais de la plateforme", `− ${formatCents(booking.platform_fee_cents)}`],
              ["Revenus perçus par le propriétaire (base)", formatCents(booking.commission_base_cents), true],
              [`Commission Comme à la Maison (${formatBps(booking.commission_rate_bps)} TTC)`, `− ${formatCents(booking.commission_cents)}`],
              ["Part du propriétaire", formatCents(booking.owner_net_cents), true],
              ["Frais de ménage perçus (refacturés à l’identique)", formatCents(booking.cleaning_fee_cents)],
              ["Taxe de séjour (information)", formatCents(booking.tourist_tax_cents)],
            ].map(([label, value, strong]) => (
              <div key={String(label)} className={`flex justify-between gap-4 border-b border-line py-2 last:border-0 ${strong ? "font-semibold text-maison" : ""}`}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel title="Voyageur" id="voyageur">
            <DescriptionList
              items={[
                { label: "Nom", value: displayName(guest) },
                { label: "Email", value: guest?.email },
                { label: "Téléphone", value: guest?.phone },
                { label: "Voyageurs", value: `${booking.adults} adulte(s), ${booking.children} enfant(s)` },
                { label: "Référence plateforme", value: booking.external_ref },
                { label: "Confirmée le", value: formatDateTime(booking.confirmed_at) },
              ]}
            />
          </Panel>
          <Panel title="Tâches liées" id="taches">
            {(tasks ?? []).length === 0 ? (
              <p className="text-small text-ink-soft">Aucune tâche liée.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {(tasks ?? []).map((task) => (
                  <li key={task.id} className="flex flex-wrap items-center justify-between gap-2">
                    <TextLink href={`/admin/taches/${task.id}`}>
                      {textOf(taskType, task.type)} · {formatDateShort(task.due_date)}
                    </TextLink>
                    <span className="flex items-center gap-2 text-small text-ink-soft">
                      {task.assignee?.full_name ?? "Non affectée"}
                      <StatusBadge value={labelOf(taskStatus, task.status)} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>

      <Panel title="Modifier" id="modifier">
        <ActionForm action={updateBooking.bind(null, id)} className="flex flex-col gap-6">
          {locked ? (
            <>
              <input type="hidden" name="property_id" value={booking.property_id} />
              <input type="hidden" name="check_in" value={booking.check_in} />
              <input type="hidden" name="check_out" value={booking.check_out} />
              <input type="hidden" name="nights_amount" value={centsToInput(booking.nights_amount_cents)} />
              <input type="hidden" name="platform_fee" value={centsToInput(booking.platform_fee_cents)} />
              <input type="hidden" name="cleaning_fee" value={centsToInput(booking.cleaning_fee_cents)} />
            </>
          ) : null}
          <BookingFields
            values={{ ...booking, guest }}
            properties={properties}
            platforms={platforms}
            rates={rates}
            fixedRate={booking.commission_rate_bps}
            locked={locked}
          />
          <FormActions>
            <SubmitButton>Enregistrer</SubmitButton>
          </FormActions>
        </ActionForm>
      </Panel>

      {!locked ? (
        <Panel title="Supprimer" id="suppression" description="Pour une réservation saisie par erreur. Une réservation annulée se garde (statut « Annulée »).">
          <ActionForm action={deleteBooking.bind(null, id)} confirmMessage="Supprimer définitivement cette réservation ?">
            <SubmitButton variant="ghost" pendingLabel="Suppression…">
              Supprimer
            </SubmitButton>
          </ActionForm>
        </Panel>
      ) : null}
    </>
  );
}
