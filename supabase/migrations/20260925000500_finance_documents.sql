-- =============================================================================
-- Finances (dépenses, relevés mensuels, factures, règlements), documents,
-- notifications et invitations
--
-- Modèle retenu : le propriétaire encaisse les versements des plateformes.
-- Chaque mois, Comme à la Maison lui adresse un relevé qui vaut facture :
--   · commission : 20 % TTC du prix des nuitées perçu (après frais de plateforme) ;
--   · ménage : frais de ménage perçus par le propriétaire, refacturés à l'identique ;
--   · frais avancés pour son compte (débours), s'il y en a.
-- =============================================================================

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties (id) on delete set null,
  owner_id uuid references public.owners (id) on delete set null,
  booking_id uuid references public.bookings (id) on delete set null,
  maintenance_job_id uuid references public.maintenance_jobs (id) on delete set null,
  category text not null default 'other'
    check (category in ('cleaning', 'maintenance', 'repair', 'supplies', 'linen', 'platform', 'equipment', 'other')),
  label text not null,
  amount_cents integer not null check (amount_cents > 0),
  incurred_on date not null default app.today(),
  -- Qui a payé : la conciergerie (et le refacture) ou directement le propriétaire.
  paid_by text not null default 'company' check (paid_by in ('company', 'owner')),
  rebill_to_owner boolean not null default false,
  supplier text,
  notes text,
  statement_id uuid,
  is_demo boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint expenses_rebill_needs_company check (not rebill_to_owner or paid_by = 'company'),
  constraint expenses_rebill_needs_owner check (not rebill_to_owner or owner_id is not null)
);
comment on table public.expenses is 'Dépenses par bien. Refacturées au propriétaire si la conciergerie les a avancées.';

create index expenses_property_idx on public.expenses (property_id, incurred_on);
create index expenses_owner_idx on public.expenses (owner_id, incurred_on);
create trigger expenses_touch before update on public.expenses
  for each row execute function app.touch_updated_at();

create or replace function app.expense_defaults()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' and old.statement_id is not null and (
    new.amount_cents is distinct from old.amount_cents
    or new.rebill_to_owner is distinct from old.rebill_to_owner
    or new.owner_id is distinct from old.owner_id
  ) then
    raise exception 'Cette dépense figure dans un relevé finalisé : elle ne peut plus être modifiée.'
      using errcode = 'check_violation';
  end if;
  if new.property_id is not null and new.owner_id is null then
    select p.owner_id into new.owner_id from public.properties p where p.id = new.property_id;
  end if;
  return new;
end;
$$;

create trigger expenses_defaults before insert or update on public.expenses
  for each row execute function app.expense_defaults();

-- -----------------------------------------------------------------------------
-- Relevés mensuels (valant facture)
-- -----------------------------------------------------------------------------

create table public.owner_statements (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.owners (id) on delete restrict,
  period_month date not null check (extract(day from period_month) = 1),
  status text not null default 'draft' check (status in ('draft', 'final', 'sent', 'paid')),
  number text unique,
  issued_on date,
  due_on date,
  nights_amount_cents integer not null default 0,
  platform_fee_cents integer not null default 0,
  commission_base_cents integer not null default 0,
  commission_cents integer not null default 0,
  commission_ht_cents integer not null default 0,
  commission_vat_cents integer not null default 0,
  cleaning_rebill_cents integer not null default 0,
  cleaning_ht_cents integer not null default 0,
  cleaning_vat_cents integer not null default 0,
  expenses_rebill_cents integer not null default 0,
  adjustments_cents integer not null default 0,
  total_due_cents integer not null default 0,
  total_vat_cents integer not null default 0,
  owner_net_cents integer not null default 0,
  booking_count integer not null default 0,
  nights_count integer not null default 0,
  vat_registered boolean not null default false,
  vat_rate_bps integer not null default 2000,
  company_snapshot jsonb,
  owner_snapshot jsonb,
  pdf_path text,
  notes text,
  generated_at timestamptz,
  finalized_at timestamptz,
  finalized_by uuid references public.profiles (id) on delete set null,
  sent_at timestamptz,
  paid_at timestamptz,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, period_month)
);
comment on table public.owner_statements is 'Relevé mensuel par propriétaire, figé à la finalisation (numéro de facture, identité, montants).';

create index owner_statements_period_idx on public.owner_statements (period_month desc);
create trigger owner_statements_touch before update on public.owner_statements
  for each row execute function app.touch_updated_at();

alter table public.bookings
  add constraint bookings_statement_fk foreign key (statement_id) references public.owner_statements (id) on delete set null;
alter table public.expenses
  add constraint expenses_statement_fk foreign key (statement_id) references public.owner_statements (id) on delete set null;

-- Un relevé finalisé ne change plus (hors statut d'envoi et de paiement).
create or replace function app.statement_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    if old.status <> 'draft' and current_setting('app.purging_demo', true) is distinct from 'on' then
      raise exception 'Un relevé finalisé ne peut pas être supprimé.';
    end if;
    return old;
  end if;
  if old.status <> 'draft' and current_setting('app.finalizing', true) is distinct from 'on' then
    if (to_jsonb(new) - array['status', 'sent_at', 'paid_at', 'pdf_path', 'notes', 'updated_at'])
       is distinct from (to_jsonb(old) - array['status', 'sent_at', 'paid_at', 'pdf_path', 'notes', 'updated_at']) then
      raise exception 'Un relevé finalisé ne peut plus être modifié.';
    end if;
    if new.status = 'draft' then
      raise exception 'Un relevé finalisé ne peut pas redevenir un brouillon.';
    end if;
  end if;
  return new;
end;
$$;

create trigger owner_statements_guard before update or delete on public.owner_statements
  for each row execute function app.statement_guard();

create table public.statement_lines (
  id uuid primary key default gen_random_uuid(),
  statement_id uuid not null references public.owner_statements (id) on delete cascade,
  position integer not null default 0,
  kind text not null check (kind in ('booking', 'cleaning', 'expense', 'adjustment')),
  booking_id uuid references public.bookings (id) on delete set null,
  expense_id uuid references public.expenses (id) on delete set null,
  property_id uuid references public.properties (id) on delete set null,
  label text not null,
  service_date date,
  nights integer,
  nights_amount_cents integer not null default 0,
  platform_fee_cents integer not null default 0,
  commission_base_cents integer not null default 0,
  commission_rate_bps integer,
  commission_cents integer not null default 0,
  -- Montant facturé pour une ligne de ménage, de dépense ou d'ajustement (TTC, négatif = avoir).
  amount_cents integer not null default 0,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
create index statement_lines_statement_idx on public.statement_lines (statement_id, position);

create or replace function app.statement_lines_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  parent_status text;
begin
  select s.status into parent_status
  from public.owner_statements s
  where s.id = coalesce(new.statement_id, old.statement_id);
  if parent_status is not null and parent_status <> 'draft'
     and current_setting('app.purging_demo', true) is distinct from 'on' then
    raise exception 'Les lignes d''un relevé finalisé ne peuvent plus être modifiées.';
  end if;
  return coalesce(new, old);
end;
$$;

create trigger statement_lines_guard before insert or update or delete on public.statement_lines
  for each row execute function app.statement_lines_guard();

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  statement_id uuid not null references public.owner_statements (id) on delete restrict,
  amount_cents integer not null check (amount_cents <> 0),
  paid_on date not null default app.today(),
  method text not null default 'transfer'
    check (method in ('transfer', 'sepa_debit', 'airbnb_split', 'card', 'cash', 'other')),
  reference text,
  notes text,
  is_demo boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
comment on table public.payments is 'Règlements reçus du propriétaire (virement, prélèvement SEPA, part co-hôte Airbnb…).';
create index payments_statement_idx on public.payments (statement_id);

create table public.invoice_counters (
  prefix text not null,
  year integer not null,
  last_number integer not null default 0,
  primary key (prefix, year)
);

-- -----------------------------------------------------------------------------
-- Documents
-- -----------------------------------------------------------------------------

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'other'
    check (category in ('contract', 'invoice', 'statement', 'receipt', 'identity', 'insurance', 'diagnostic', 'inventory', 'photo', 'other')),
  storage_path text not null unique,
  mime_type text,
  size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  owner_id uuid references public.owners (id) on delete cascade,
  property_id uuid references public.properties (id) on delete cascade,
  booking_id uuid references public.bookings (id) on delete set null,
  expense_id uuid references public.expenses (id) on delete set null,
  maintenance_job_id uuid references public.maintenance_jobs (id) on delete set null,
  statement_id uuid references public.owner_statements (id) on delete set null,
  visible_to_owner boolean not null default false,
  is_demo boolean not null default false,
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  search_text text generated always as (app.normalize(coalesce(title, ''))) stored
);
comment on table public.documents is 'Fichiers privés (stockage privé, liens temporaires signés).';
create index documents_owner_idx on public.documents (owner_id);
create index documents_property_idx on public.documents (property_id);
create index documents_search_idx on public.documents using gin (search_text extensions.gin_trgm_ops);

create or replace function app.document_defaults()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.property_id is not null and new.owner_id is null then
    select p.owner_id into new.owner_id from public.properties p where p.id = new.property_id;
  end if;
  return new;
end;
$$;
create trigger documents_defaults before insert or update on public.documents
  for each row execute function app.document_defaults();

-- -----------------------------------------------------------------------------
-- Notifications
-- -----------------------------------------------------------------------------

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null,
  title text not null,
  body text,
  link text check (link is null or link ~ '^/'),
  event_id bigint references public.domain_events (id) on delete set null,
  read_at timestamptz,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
create index notifications_recipient_idx on public.notifications (recipient_id, created_at desc);
create index notifications_unread_idx on public.notifications (recipient_id) where read_at is null;
-- Une notification par destinataire et par événement.
create unique index notifications_event_recipient_idx on public.notifications (event_id, recipient_id, kind)
  where event_id is not null;

create table public.notification_deliveries (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid not null references public.notifications (id) on delete cascade,
  channel text not null check (channel in ('email', 'sms', 'whatsapp')),
  status text not null check (status in ('sent', 'failed', 'skipped')),
  detail text,
  attempted_at timestamptz not null default now()
);
comment on table public.notification_deliveries is 'Envois hors application. « skipped » : canal non configuré, rien n''est envoyé.';
create index notification_deliveries_notification_idx on public.notification_deliveries (notification_id);

-- -----------------------------------------------------------------------------
-- Invitations (les comptes sont créés sur invitation uniquement)
-- -----------------------------------------------------------------------------

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  full_name text not null default '',
  role text not null references public.roles (key),
  owner_id uuid references public.owners (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  invited_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  revoked_at timestamptz,
  constraint invitations_owner_role check (role <> 'owner' or owner_id is not null)
);
create index invitations_email_idx on public.invitations (lower(email));
