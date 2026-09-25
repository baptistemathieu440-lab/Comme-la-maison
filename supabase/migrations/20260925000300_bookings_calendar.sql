-- =============================================================================
-- Réservations, blocages de calendrier et synchronisations
--
-- Base de la commission (décision de Baptiste et Simon) :
--   20 % TTC du prix des nuitées réellement perçu par le propriétaire, c'est-à-dire
--   prix des nuitées − frais prélevés par la plateforme. Ménage et taxe de séjour
--   hors base. Le propriétaire encaisse ; Comme à la Maison facture sa commission.
-- =============================================================================

create sequence public.booking_reference_seq;

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('R-' || lpad(nextval('public.booking_reference_seq')::text, 5, '0')),
  property_id uuid not null references public.properties (id) on delete restrict,
  listing_id uuid references public.listings (id) on delete set null,
  platform_id text not null default 'direct' references public.platforms (id),
  guest_id uuid references public.guests (id) on delete set null,
  status text not null default 'confirmed'
    check (status in ('inquiry', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  source text not null default 'manual' check (source in ('manual', 'ical', 'channel_manager', 'website')),
  check_in date not null,
  check_out date not null,
  stay daterange generated always as (daterange(check_in, check_out, '[)')) stored,
  nights integer generated always as (check_out - check_in) stored,
  adults integer not null default 1 check (adults >= 0),
  children integer not null default 0 check (children >= 0),
  -- Montants saisis (centimes).
  nights_amount_cents integer not null default 0 check (nights_amount_cents >= 0),
  platform_fee_cents integer not null default 0 check (platform_fee_cents >= 0),
  cleaning_fee_cents integer not null default 0 check (cleaning_fee_cents >= 0),
  tourist_tax_cents integer not null default 0 check (tourist_tax_cents >= 0),
  -- Montants calculés par la base (voir app.compute_booking_amounts).
  commission_rate_bps integer check (commission_rate_bps between 0 and 10000),
  commission_base_cents integer not null default 0,
  commission_cents integer not null default 0,
  owner_net_cents integer not null default 0,
  external_ref text,
  ical_uid text,
  internal_notes text,
  statement_id uuid,
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text,
  search_text text generated always as (
    app.normalize(coalesce(reference, '') || ' ' || coalesce(external_ref, ''))
  ) stored,
  is_demo boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_dates check (check_out > check_in),
  constraint bookings_fee_not_above_amount check (platform_fee_cents <= nights_amount_cents),
  -- Deux réservations actives ne peuvent pas se chevaucher sur le même bien.
  constraint bookings_no_overlap exclude using gist (
    property_id with =,
    stay with &&
  ) where (status in ('confirmed', 'in_progress', 'completed'))
);
comment on table public.bookings is 'Réservations. Les montants de commission sont figés à la création (taux) et recalculés si les montants changent, tant qu''aucun relevé finalisé ne les inclut.';
comment on column public.bookings.nights_amount_cents is 'Prix des nuitées (hors frais de service voyageur, hors ménage, hors taxe de séjour).';
comment on column public.bookings.platform_fee_cents is 'Frais prélevés par la plateforme sur les nuitées (côté hôte).';
comment on column public.bookings.cleaning_fee_cents is 'Frais de ménage payés par le voyageur et perçus par le propriétaire (refacturés à l''identique).';
comment on column public.bookings.commission_base_cents is 'Base de commission : prix des nuitées perçu = nuitées − frais de plateforme.';

create index bookings_property_idx on public.bookings (property_id, check_in);
create index bookings_dates_idx on public.bookings (check_in, check_out);
create index bookings_checkout_idx on public.bookings (check_out);
create index bookings_status_idx on public.bookings (status);
create index bookings_guest_idx on public.bookings (guest_id);
create index bookings_search_idx on public.bookings using gin (search_text extensions.gin_trgm_ops);
create unique index bookings_listing_uid_idx on public.bookings (listing_id, ical_uid) where ical_uid is not null;

create trigger bookings_touch before update on public.bookings
  for each row execute function app.touch_updated_at();

create or replace function app.compute_booking_amounts()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' and old.statement_id is not null and (
    new.nights_amount_cents is distinct from old.nights_amount_cents
    or new.platform_fee_cents is distinct from old.platform_fee_cents
    or new.cleaning_fee_cents is distinct from old.cleaning_fee_cents
    or new.commission_rate_bps is distinct from old.commission_rate_bps
    or new.check_out is distinct from old.check_out
    or new.property_id is distinct from old.property_id
  ) then
    raise exception 'Cette réservation figure dans un relevé finalisé : ses montants ne peuvent plus être modifiés.'
      using errcode = 'check_violation';
  end if;

  -- Le taux est une photo prise à la création : changer le taux par défaut ne réécrit pas le passé.
  if new.commission_rate_bps is null then
    new.commission_rate_bps := app.resolve_commission_rate(new.property_id);
  end if;

  new.commission_base_cents := greatest(new.nights_amount_cents - new.platform_fee_cents, 0);
  new.commission_cents := round(new.commission_base_cents * new.commission_rate_bps / 10000.0)::integer;
  new.owner_net_cents := new.commission_base_cents - new.commission_cents;

  if new.status = 'confirmed' and new.confirmed_at is null then
    new.confirmed_at := now();
  end if;
  if new.status = 'cancelled' and new.cancelled_at is null then
    new.cancelled_at := now();
  end if;
  if new.status <> 'cancelled' then
    new.cancelled_at := null;
  end if;

  return new;
end;
$$;

create trigger bookings_amounts before insert or update on public.bookings
  for each row execute function app.compute_booking_amounts();

-- -----------------------------------------------------------------------------
-- Blocages de calendrier (séjour du propriétaire, travaux, réservations importées par iCal)
-- -----------------------------------------------------------------------------

create table public.calendar_blocks (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  listing_id uuid references public.listings (id) on delete cascade,
  kind text not null default 'blocked'
    check (kind in ('owner_stay', 'maintenance', 'blocked', 'platform_reservation')),
  start_date date not null,
  end_date date not null,
  span daterange generated always as (daterange(start_date, end_date, '[)')) stored,
  summary text,
  external_uid text,
  notes text,
  -- Réservation saisie qui correspond à ce blocage importé (même séjour).
  booking_id uuid references public.bookings (id) on delete set null,
  is_demo boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint calendar_blocks_dates check (end_date > start_date),
  constraint calendar_blocks_import_source check (kind <> 'platform_reservation' or listing_id is not null)
);
comment on table public.calendar_blocks is 'Dates indisponibles. Les réservations importées par iCal n''ont que des dates : aucun montant, aucun voyageur.';

create index calendar_blocks_property_idx on public.calendar_blocks (property_id, start_date);
create index calendar_blocks_span_idx on public.calendar_blocks using gist (property_id, span);
create unique index calendar_blocks_uid_idx on public.calendar_blocks (listing_id, external_uid) where external_uid is not null;

create trigger calendar_blocks_touch before update on public.calendar_blocks
  for each row execute function app.touch_updated_at();

create table public.sync_runs (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  kind text not null default 'ical_import' check (kind in ('ical_import', 'channel_manager')),
  trigger text not null default 'schedule' check (trigger in ('schedule', 'manual')),
  status text not null default 'running' check (status in ('running', 'success', 'partial', 'error')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  events_found integer not null default 0,
  created_count integer not null default 0,
  updated_count integer not null default 0,
  removed_count integer not null default 0,
  conflicts jsonb not null default '[]'::jsonb,
  error text,
  is_demo boolean not null default false
);
comment on table public.sync_runs is 'Journal de chaque synchronisation (iCal aujourd''hui, channel manager ensuite).';
create index sync_runs_listing_idx on public.sync_runs (listing_id, started_at desc);
