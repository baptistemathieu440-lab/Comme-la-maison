-- =============================================================================
-- Vues filtrées par rôle, relevés mensuels, fonctions des agents, statistiques
-- et recherche globale
-- =============================================================================

-- Appelant de confiance : administrateur (aal2), clé de service côté serveur,
-- ou connexion directe à la base (migrations, tests).
create or replace function app.is_trusted_caller()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select app.is_admin()
    or coalesce((select auth.jwt()) ->> 'role', '') = 'service_role'
    or session_user in ('postgres', 'supabase_admin')
$$;

create or replace function app.require_trusted_caller()
returns void
language plpgsql
stable
set search_path = ''
as $$
begin
  if not app.is_trusted_caller() then
    raise exception 'Action réservée aux administrateurs.' using errcode = '42501';
  end if;
end;
$$;

-- -----------------------------------------------------------------------------
-- Vues filtrées (propriétaire, agent)
-- Ces vues s'exécutent avec les droits de leur créateur : le filtre sur le
-- compte connecté est la règle d'accès. Elles n'exposent que les colonnes utiles.
-- -----------------------------------------------------------------------------

create view public.owner_bookings with (security_barrier = true) as
select
  b.id,
  b.reference,
  b.property_id,
  p.name as property_name,
  b.platform_id,
  pl.name as platform_name,
  b.status,
  b.check_in,
  b.check_out,
  b.nights,
  b.adults,
  b.children,
  b.nights_amount_cents,
  b.platform_fee_cents,
  b.cleaning_fee_cents,
  b.tourist_tax_cents,
  b.commission_rate_bps,
  b.commission_base_cents,
  b.commission_cents,
  b.owner_net_cents,
  c.first_name as guest_first_name,
  b.statement_id,
  b.is_demo
from public.bookings b
join public.properties p on p.id = b.property_id
join public.platforms pl on pl.id = b.platform_id
left join public.guests g on g.id = b.guest_id
left join public.contacts c on c.id = g.contact_id
where p.owner_id = app.current_owner_id()
  and b.status <> 'inquiry';

comment on view public.owner_bookings is 'Réservations des biens du propriétaire connecté : montants et prénom du voyageur, sans coordonnées.';

create view public.owner_tasks with (security_barrier = true) as
select
  t.id,
  t.type,
  t.status,
  t.property_id,
  p.name as property_name,
  t.due_date,
  t.completed_at,
  t.validated_at,
  t.is_demo
from public.tasks t
join public.properties p on p.id = t.property_id
where p.owner_id = app.current_owner_id()
  and t.status <> 'cancelled';

comment on view public.owner_tasks is 'Statut des ménages et contrôles des biens du propriétaire connecté.';

create view public.staff_tasks with (security_barrier = true) as
select
  t.id,
  t.type,
  t.status,
  t.title,
  t.instructions,
  t.due_date,
  t.window_start,
  t.window_end,
  t.checklist,
  t.agent_notes,
  t.started_at,
  t.completed_at,
  t.property_id,
  p.name as property_name,
  p.address_line,
  p.postal_code,
  p.city,
  p.floor_info,
  p.capacity,
  t.booking_id,
  b.check_in as booking_check_in,
  b.check_out as booking_check_out,
  b.adults as booking_adults,
  b.children as booking_children,
  gc.first_name as guest_first_name,
  (
    select min(nb.check_in)
    from public.bookings nb
    where nb.property_id = t.property_id
      and nb.status in ('confirmed', 'in_progress')
      and nb.check_in >= t.due_date
      and nb.id is distinct from t.booking_id
  ) as next_check_in,
  t.is_demo
from public.tasks t
join public.properties p on p.id = t.property_id
left join public.bookings b on b.id = t.booking_id
left join public.guests g on g.id = b.guest_id
left join public.contacts gc on gc.id = g.contact_id
where t.assignee_id = (select auth.uid())
  and app.is_staff()
  and t.status <> 'cancelled';

comment on view public.staff_tasks is 'Tâches de l''agent connecté, avec l''adresse et les dates utiles, sans montant ni coordonnées.';

revoke all on public.owner_bookings, public.owner_tasks, public.staff_tasks from anon, public;
grant select on public.owner_bookings, public.owner_tasks, public.staff_tasks to authenticated;

-- -----------------------------------------------------------------------------
-- Fonctions des agents
-- -----------------------------------------------------------------------------

-- Codes d'accès : seulement pour l'agent affecté, le jour de la tâche ou pendant qu'elle est en cours.
create or replace function public.staff_task_access(p_task uuid)
returns table (
  door_code text,
  key_box_code text,
  key_box_location text,
  alarm_code text,
  wifi_name text,
  wifi_password text,
  parking_info text,
  access_instructions text
)
language sql
stable
security definer
set search_path = ''
as $$
  select a.door_code, a.key_box_code, a.key_box_location, a.alarm_code,
         a.wifi_name, a.wifi_password, a.parking_info, a.access_instructions
  from public.tasks t
  join public.property_access a on a.property_id = t.property_id
  where t.id = p_task
    and t.assignee_id = (select auth.uid())
    and app.is_staff()
    and (t.due_date = app.today() or t.status = 'in_progress')
    and t.status not in ('cancelled', 'validated')
$$;

-- Mise à jour d'une tâche par l'agent : statut (à faire → en cours → terminée),
-- cases de la liste de contrôle et notes. Rien d'autre.
create or replace function public.staff_update_task(
  p_task uuid,
  p_status text default null,
  p_checklist jsonb default null,
  p_notes text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_task public.tasks%rowtype;
  merged jsonb;
begin
  select * into current_task from public.tasks
  where id = p_task and assignee_id = (select auth.uid())
  for update;

  if not found or not app.is_staff() then
    raise exception 'Tâche introuvable.' using errcode = '42501';
  end if;
  if current_task.status in ('validated', 'cancelled') then
    raise exception 'Cette tâche est close.';
  end if;
  if p_status is not null and p_status not in ('todo', 'in_progress', 'done') then
    raise exception 'Statut non autorisé.';
  end if;

  merged := current_task.checklist;
  if p_checklist is not null then
    -- Seules les cases « fait » changent ; les intitulés restent ceux de la tâche.
    select coalesce(jsonb_agg(
      jsonb_set(item, '{done}', to_jsonb(coalesce((p_checklist -> (ord - 1)::int ->> 'done')::boolean, false)))
      order by ord
    ), '[]'::jsonb)
    into merged
    from jsonb_array_elements(current_task.checklist) with ordinality as e(item, ord);
  end if;

  update public.tasks
  set status = coalesce(p_status, status),
      checklist = merged,
      agent_notes = coalesce(p_notes, agent_notes)
  where id = p_task;
end;
$$;

revoke all on function public.staff_task_access(uuid) from public, anon;
revoke all on function public.staff_update_task(uuid, text, jsonb, text) from public, anon;
grant execute on function public.staff_task_access(uuid) to authenticated;
grant execute on function public.staff_update_task(uuid, text, jsonb, text) to authenticated;

-- -----------------------------------------------------------------------------
-- Relevés mensuels
-- -----------------------------------------------------------------------------

create or replace function app.ht_from_ttc(amount_ttc bigint, vat_registered boolean, rate_bps integer)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case
    when vat_registered then round(amount_ttc * 10000.0 / (10000 + rate_bps))::integer
    else amount_ttc::integer
  end
$$;

-- Calcule (ou recalcule) le brouillon du relevé d'un propriétaire pour un mois.
-- Inclut : réservations dont le départ tombe dans le mois (et celles des mois
-- précédents jamais facturées), ménages perçus, dépenses à refacturer.
-- Les lignes d'ajustement saisies à la main sont conservées.
create or replace function public.generate_statement(p_owner uuid, p_month date)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_month date := date_trunc('month', p_month)::date;
  v_end date := (date_trunc('month', p_month) + interval '1 month')::date;
  v_statement public.owner_statements%rowtype;
  v_settings public.settings%rowtype;
  v_owner public.owners%rowtype;
  v_commission bigint;
  v_cleaning bigint;
  v_expenses bigint;
  v_adjustments bigint;
  v_base bigint;
begin
  perform app.require_trusted_caller();

  select * into v_owner from public.owners where id = p_owner;
  if not found then
    raise exception 'Propriétaire introuvable.';
  end if;
  select * into v_settings from public.settings where id;

  select * into v_statement from public.owner_statements
  where owner_id = p_owner and period_month = v_month
  for update;

  if found and v_statement.status <> 'draft' then
    raise exception 'Le relevé de ce mois est déjà finalisé.';
  end if;
  if not found then
    insert into public.owner_statements (owner_id, period_month, is_demo)
    values (p_owner, v_month, v_owner.is_demo)
    returning * into v_statement;
  end if;

  delete from public.statement_lines where statement_id = v_statement.id and kind <> 'adjustment';

  -- Réservations.
  insert into public.statement_lines (
    statement_id, position, kind, booking_id, property_id, label, service_date, nights,
    nights_amount_cents, platform_fee_cents, commission_base_cents, commission_rate_bps,
    commission_cents, amount_cents, is_demo
  )
  select
    v_statement.id,
    (row_number() over (order by b.check_out, b.reference) * 10)::integer,
    'booking',
    b.id,
    b.property_id,
    p.name || ' · ' || pl.name || ' · ' || to_char(b.check_in, 'DD/MM/YYYY') || ' → '
      || to_char(b.check_out, 'DD/MM/YYYY') || ' · ' || b.reference
      || case when b.status = 'cancelled' then ' (annulée, montant conservé)' else '' end,
    b.check_out,
    b.nights,
    b.nights_amount_cents,
    b.platform_fee_cents,
    b.commission_base_cents,
    b.commission_rate_bps,
    b.commission_cents,
    b.commission_cents,
    b.is_demo
  from public.bookings b
  join public.properties p on p.id = b.property_id
  join public.platforms pl on pl.id = b.platform_id
  where p.owner_id = p_owner
    and b.check_out < v_end
    and (b.check_out >= v_month or b.statement_id is null)
    and (b.statement_id is null or b.statement_id = v_statement.id)
    and (b.status in ('confirmed', 'in_progress', 'completed') or (b.status = 'cancelled' and b.nights_amount_cents > 0))
    and not exists (
      select 1 from public.statement_lines other
      where other.booking_id = b.id and other.statement_id <> v_statement.id
    );

  -- Ménages perçus par le propriétaire, refacturés à l'identique.
  insert into public.statement_lines (
    statement_id, position, kind, booking_id, property_id, label, service_date, amount_cents, is_demo
  )
  select
    v_statement.id,
    l.position + 1,
    'cleaning',
    b.id,
    b.property_id,
    'Ménage · ' || b.reference || ' (frais de ménage perçus, refacturés à l''identique)',
    b.check_out,
    b.cleaning_fee_cents,
    b.is_demo
  from public.statement_lines l
  join public.bookings b on b.id = l.booking_id
  where l.statement_id = v_statement.id
    and l.kind = 'booking'
    and b.cleaning_fee_cents > 0;

  -- Dépenses avancées pour le compte du propriétaire.
  insert into public.statement_lines (
    statement_id, position, kind, expense_id, property_id, label, service_date, amount_cents, is_demo
  )
  select
    v_statement.id,
    (100000 + row_number() over (order by e.incurred_on, e.created_at) * 10)::integer,
    'expense',
    e.id,
    e.property_id,
    e.label || coalesce(' · ' || e.supplier, ''),
    e.incurred_on,
    e.amount_cents,
    e.is_demo
  from public.expenses e
  where e.owner_id = p_owner
    and e.rebill_to_owner
    and e.incurred_on < v_end
    and (e.statement_id is null or e.statement_id = v_statement.id)
    and not exists (
      select 1 from public.statement_lines other
      where other.expense_id = e.id and other.statement_id <> v_statement.id
    );

  select
    coalesce(sum(commission_cents) filter (where kind = 'booking'), 0),
    coalesce(sum(amount_cents) filter (where kind = 'cleaning'), 0),
    coalesce(sum(amount_cents) filter (where kind = 'expense'), 0),
    coalesce(sum(amount_cents) filter (where kind = 'adjustment'), 0),
    coalesce(sum(commission_base_cents) filter (where kind = 'booking'), 0)
  into v_commission, v_cleaning, v_expenses, v_adjustments, v_base
  from public.statement_lines
  where statement_id = v_statement.id;

  update public.owner_statements s set
    nights_amount_cents = agg.nights_amount,
    platform_fee_cents = agg.platform_fee,
    commission_base_cents = v_base,
    commission_cents = v_commission,
    commission_ht_cents = app.ht_from_ttc(v_commission, v_settings.vat_registered, v_settings.vat_rate_bps),
    commission_vat_cents = v_commission - app.ht_from_ttc(v_commission, v_settings.vat_registered, v_settings.vat_rate_bps),
    cleaning_rebill_cents = v_cleaning,
    cleaning_ht_cents = app.ht_from_ttc(v_cleaning, v_settings.vat_registered, v_settings.vat_rate_bps),
    cleaning_vat_cents = v_cleaning - app.ht_from_ttc(v_cleaning, v_settings.vat_registered, v_settings.vat_rate_bps),
    expenses_rebill_cents = v_expenses,
    adjustments_cents = v_adjustments,
    total_vat_cents =
      (v_commission - app.ht_from_ttc(v_commission, v_settings.vat_registered, v_settings.vat_rate_bps))
      + (v_cleaning - app.ht_from_ttc(v_cleaning, v_settings.vat_registered, v_settings.vat_rate_bps))
      + (v_adjustments - app.ht_from_ttc(v_adjustments, v_settings.vat_registered, v_settings.vat_rate_bps)),
    total_due_cents = v_commission + v_cleaning + v_expenses + v_adjustments,
    owner_net_cents = v_base - v_commission - v_expenses - v_adjustments,
    booking_count = agg.booking_count,
    nights_count = agg.nights_count,
    vat_registered = v_settings.vat_registered,
    vat_rate_bps = v_settings.vat_rate_bps,
    generated_at = now()
  from (
    select
      coalesce(sum(nights_amount_cents), 0)::integer as nights_amount,
      coalesce(sum(platform_fee_cents), 0)::integer as platform_fee,
      count(*)::integer as booking_count,
      coalesce(sum(nights), 0)::integer as nights_count
    from public.statement_lines
    where statement_id = v_statement.id and kind = 'booking'
  ) agg
  where s.id = v_statement.id;

  return v_statement.id;
end;
$$;

-- Finalise un relevé : numéro de facture définitif, identité figée,
-- réservations et dépenses verrouillées.
create or replace function public.finalize_statement(p_statement uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_statement public.owner_statements%rowtype;
  v_settings public.settings%rowtype;
  v_contact public.contacts%rowtype;
  v_owner public.owners%rowtype;
  v_prefix text;
  v_year integer := extract(year from app.today())::integer;
  v_number integer;
  v_label text;
begin
  perform app.require_trusted_caller();

  select * into v_statement from public.owner_statements where id = p_statement for update;
  if not found then
    raise exception 'Relevé introuvable.';
  end if;
  if v_statement.status <> 'draft' then
    raise exception 'Ce relevé est déjà finalisé.';
  end if;

  perform public.generate_statement(v_statement.owner_id, v_statement.period_month);
  select * into v_statement from public.owner_statements where id = p_statement;

  if exists (
    select 1 from public.statement_lines l
    join public.bookings b on b.id = l.booking_id
    where l.statement_id = p_statement and b.statement_id is not null and b.statement_id <> p_statement
  ) then
    raise exception 'Une réservation de ce relevé est déjà facturée dans un autre relevé.';
  end if;

  select * into v_settings from public.settings where id;
  select * into v_owner from public.owners where id = v_statement.owner_id;
  select * into v_contact from public.contacts where id = v_owner.contact_id;

  -- Les relevés de démonstration ont leur propre numérotation.
  v_prefix := case when v_statement.is_demo then 'DEMO' else v_settings.invoice_prefix end;

  insert into public.invoice_counters (prefix, year, last_number)
  values (v_prefix, v_year, 1)
  on conflict (prefix, year) do update set last_number = public.invoice_counters.last_number + 1
  returning last_number into v_number;

  v_label := v_prefix || '-' || v_year || '-' || lpad(v_number::text, 4, '0');

  update public.owner_statements set
    status = 'final',
    number = v_label,
    issued_on = app.today(),
    due_on = app.today() + v_settings.payment_terms_days,
    company_snapshot = to_jsonb(v_settings) - array['id', 'default_cleaning_checklist', 'updated_at', 'updated_by',
      'default_check_in_time', 'default_check_out_time', 'primary_residence_night_limit', 'default_commission_bps'],
    owner_snapshot = jsonb_build_object(
      'name', app.contact_display_name(v_contact),
      'company_name', v_contact.company_name,
      'address_line', v_contact.address_line,
      'postal_code', v_contact.postal_code,
      'city', v_contact.city,
      'country', v_contact.country,
      'email', coalesce(v_owner.billing_email, v_contact.email),
      'vat_number', v_owner.vat_number
    ),
    finalized_at = now(),
    finalized_by = (select auth.uid())
  where id = p_statement;

  update public.bookings b set statement_id = p_statement
  from public.statement_lines l
  where l.statement_id = p_statement and l.kind = 'booking' and l.booking_id = b.id;

  update public.expenses e set statement_id = p_statement
  from public.statement_lines l
  where l.statement_id = p_statement and l.kind = 'expense' and l.expense_id = e.id;

  return v_label;
end;
$$;

-- Statut « payé » tenu à jour par les règlements.
create or replace function app.refresh_statement_payment()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target uuid := coalesce(new.statement_id, old.statement_id);
  paid bigint;
  st public.owner_statements%rowtype;
begin
  select * into st from public.owner_statements where id = target;
  if not found or st.status = 'draft' then
    return coalesce(new, old);
  end if;
  select coalesce(sum(amount_cents), 0) into paid from public.payments where statement_id = target;
  if paid >= st.total_due_cents and st.status <> 'paid' then
    update public.owner_statements set status = 'paid', paid_at = now() where id = target;
  elsif paid < st.total_due_cents and st.status = 'paid' then
    update public.owner_statements
    set status = case when sent_at is null then 'final' else 'sent' end, paid_at = null
    where id = target;
  end if;
  return coalesce(new, old);
end;
$$;

create trigger payments_refresh_statement after insert or update or delete on public.payments
  for each row execute function app.refresh_statement_payment();

create or replace function app.payments_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if exists (select 1 from public.owner_statements s where s.id = new.statement_id and s.status = 'draft') then
    raise exception 'Un règlement se rattache à un relevé finalisé.';
  end if;
  return new;
end;
$$;
create trigger payments_guard before insert or update on public.payments
  for each row execute function app.payments_guard();

revoke all on function public.generate_statement(uuid, date) from public, anon;
revoke all on function public.finalize_statement(uuid) from public, anon;
grant execute on function public.generate_statement(uuid, date) to authenticated, service_role;
grant execute on function public.finalize_statement(uuid) to authenticated, service_role;

-- -----------------------------------------------------------------------------
-- Statistiques (calculées, jamais recopiées)
-- Répartition par nuit : une réservation à cheval sur deux mois compte pour chacun
-- au prorata de ses nuits. Admin : tous les biens ; propriétaire : les siens.
-- -----------------------------------------------------------------------------

create or replace function public.stats_property_months(p_from date, p_to date)
returns table (
  property_id uuid,
  owner_id uuid,
  month date,
  days integer,
  booked_nights integer,
  imported_nights integer,
  blocked_nights integer,
  nights_amount_cents bigint,
  platform_fee_cents bigint,
  commission_base_cents bigint,
  commission_cents bigint,
  owner_net_cents bigint,
  is_demo boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  with bounds as (
    select date_trunc('month', p_from)::date as start_on,
           (date_trunc('month', p_to) + interval '1 month')::date as end_on
  ),
  scope as (
    select p.id, p.owner_id, p.is_demo
    from public.properties p
    where app.is_admin() or p.owner_id = app.current_owner_id()
  ),
  months as (
    select s.id as property_id, s.owner_id, s.is_demo, m::date as month
    from scope s
    cross join bounds bd
    cross join generate_series(bd.start_on, bd.end_on - 1, interval '1 month') m
  ),
  booked as (
    select b.property_id,
           date_trunc('month', d)::date as month,
           count(*) as nights,
           sum(b.nights_amount_cents::numeric / b.nights) as amount,
           sum(b.platform_fee_cents::numeric / b.nights) as fee,
           sum(b.commission_base_cents::numeric / b.nights) as base,
           sum(b.commission_cents::numeric / b.nights) as commission,
           sum(b.owner_net_cents::numeric / b.nights) as owner_net
    from public.bookings b
    join scope s on s.id = b.property_id
    cross join bounds bd
    cross join lateral generate_series(greatest(b.check_in, bd.start_on), least(b.check_out, bd.end_on) - 1, interval '1 day') d
    where b.status in ('confirmed', 'in_progress', 'completed')
      and b.check_out > bd.start_on and b.check_in < bd.end_on
    group by 1, 2
  ),
  imported as (
    select cb.property_id, date_trunc('month', d)::date as month, count(distinct d) as nights
    from public.calendar_blocks cb
    join scope s on s.id = cb.property_id
    cross join bounds bd
    cross join lateral generate_series(greatest(cb.start_date, bd.start_on), least(cb.end_date, bd.end_on) - 1, interval '1 day') d
    where cb.kind = 'platform_reservation' and cb.booking_id is null
      and cb.end_date > bd.start_on and cb.start_date < bd.end_on
      and not exists (
        select 1 from public.bookings b
        where b.property_id = cb.property_id and b.status in ('confirmed', 'in_progress', 'completed')
          and b.stay @> d::date
      )
    group by 1, 2
  ),
  blocked as (
    select cb.property_id, date_trunc('month', d)::date as month, count(distinct d) as nights
    from public.calendar_blocks cb
    join scope s on s.id = cb.property_id
    cross join bounds bd
    cross join lateral generate_series(greatest(cb.start_date, bd.start_on), least(cb.end_date, bd.end_on) - 1, interval '1 day') d
    where cb.kind in ('owner_stay', 'maintenance', 'blocked')
      and cb.end_date > bd.start_on and cb.start_date < bd.end_on
    group by 1, 2
  )
  select
    m.property_id,
    m.owner_id,
    m.month,
    extract(day from (m.month + interval '1 month' - interval '1 day'))::integer as days,
    coalesce(bk.nights, 0)::integer,
    coalesce(im.nights, 0)::integer,
    coalesce(bl.nights, 0)::integer,
    coalesce(round(bk.amount), 0)::bigint,
    coalesce(round(bk.fee), 0)::bigint,
    coalesce(round(bk.base), 0)::bigint,
    coalesce(round(bk.commission), 0)::bigint,
    coalesce(round(bk.owner_net), 0)::bigint,
    m.is_demo
  from months m
  left join booked bk on bk.property_id = m.property_id and bk.month = m.month
  left join imported im on im.property_id = m.property_id and im.month = m.month
  left join blocked bl on bl.property_id = m.property_id and bl.month = m.month
$$;

revoke all on function public.stats_property_months(date, date) from public, anon;
grant execute on function public.stats_property_months(date, date) to authenticated;

-- Nuits louées dans l'année pour les résidences principales (limite légale).
create or replace function public.primary_residence_usage(p_year integer)
returns table (property_id uuid, nights integer, night_limit integer)
language sql
stable
security definer
set search_path = ''
as $$
  select p.id,
         coalesce((
           select sum(
             least(b.check_out, make_date(p_year + 1, 1, 1)) - greatest(b.check_in, make_date(p_year, 1, 1))
           )
           from public.bookings b
           where b.property_id = p.id
             and b.status in ('confirmed', 'in_progress', 'completed')
             and b.check_out > make_date(p_year, 1, 1)
             and b.check_in < make_date(p_year + 1, 1, 1)
         ), 0)::integer,
         (select s.primary_residence_night_limit from public.settings s where s.id)
  from public.properties p
  where p.is_primary_residence
    and (app.is_admin() or p.owner_id = app.current_owner_id())
$$;

revoke all on function public.primary_residence_usage(integer) from public, anon;
grant execute on function public.primary_residence_usage(integer) to authenticated;

-- -----------------------------------------------------------------------------
-- Recherche globale (administrateurs)
-- -----------------------------------------------------------------------------

create or replace function public.search_global(p_query text)
returns table (kind text, id uuid, title text, subtitle text, is_demo boolean)
language plpgsql
stable
security invoker
set search_path = ''
as $$
declare
  q text := '%' || app.normalize(trim(coalesce(p_query, ''))) || '%';
begin
  if length(trim(coalesce(p_query, ''))) < 2 or not app.is_admin() then
    return;
  end if;

  return query
  (select 'property'::text, p.id, p.name, p.reference || ' · ' || coalesce(p.address_line || ', ', '') || p.city, p.is_demo
   from public.properties p where p.search_text like q order by p.name limit 8)
  union all
  (select 'owner'::text, o.id, app.contact_display_name(c), coalesce(c.email, c.phone, ''), o.is_demo
   from public.owners o join public.contacts c on c.id = o.contact_id
   where c.search_text like q order by c.last_name limit 8)
  union all
  (select 'prospect'::text, pr.id, app.contact_display_name(c),
          coalesce(pr.property_city, c.city, '') || ' · ' || pr.status, pr.is_demo
   from public.prospects pr join public.contacts c on c.id = pr.contact_id
   where c.search_text like q order by pr.created_at desc limit 8)
  union all
  (select 'booking'::text, b.id, b.reference || coalesce(' · ' || app.contact_display_name(c), ''),
          p.name || ' · ' || to_char(b.check_in, 'DD/MM/YYYY') || ' → ' || to_char(b.check_out, 'DD/MM/YYYY'), b.is_demo
   from public.bookings b
   join public.properties p on p.id = b.property_id
   left join public.guests g on g.id = b.guest_id
   left join public.contacts c on c.id = g.contact_id
   where b.search_text like q or c.search_text like q
   order by b.check_in desc limit 8)
  union all
  (select 'guest'::text, g.id, app.contact_display_name(c), coalesce(c.email, c.phone, ''), g.is_demo
   from public.guests g join public.contacts c on c.id = g.contact_id
   where c.search_text like q order by c.last_name limit 8)
  union all
  (select 'provider'::text, pv.id, app.contact_display_name(c), pv.trade, pv.is_demo
   from public.providers pv join public.contacts c on c.id = pv.contact_id
   where c.search_text like q or app.normalize(pv.trade) like q order by c.last_name limit 8)
  union all
  (select 'task'::text, t.id, t.title, to_char(t.due_date, 'DD/MM/YYYY'), t.is_demo
   from public.tasks t where t.search_text like q order by t.due_date desc limit 8)
  union all
  (select 'incident'::text, i.id, i.title, i.status, i.is_demo
   from public.incidents i where i.search_text like q order by i.created_at desc limit 8)
  union all
  (select 'document'::text, d.id, d.title, d.category, d.is_demo
   from public.documents d where d.search_text like q order by d.created_at desc limit 8);
end;
$$;

revoke all on function public.search_global(text) from public, anon;
grant execute on function public.search_global(text) to authenticated;

-- Réservations à faire avancer selon les dates (tâche planifiée).
create or replace function public.roll_booking_statuses()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  changed integer := 0;
  n integer;
begin
  perform app.require_trusted_caller();
  update public.bookings set status = 'in_progress'
  where status = 'confirmed' and check_in <= app.today() and check_out > app.today();
  get diagnostics n = row_count;
  changed := changed + n;
  update public.bookings set status = 'completed'
  where status in ('confirmed', 'in_progress') and check_out <= app.today();
  get diagnostics n = row_count;
  changed := changed + n;
  return changed;
end;
$$;

revoke all on function public.roll_booking_statuses() from public, anon;
grant execute on function public.roll_booking_statuses() to authenticated, service_role;
