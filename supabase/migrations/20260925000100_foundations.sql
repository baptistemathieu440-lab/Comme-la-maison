-- =============================================================================
-- Comme à la Maison · Fondations
-- Extensions, schéma interne « app », comptes, rôles, paramètres, journal
-- d'activité et événements métier.
--
-- Conventions :
--   · montants en centimes (integer), taux en points de base (2000 = 20,00 %) ;
--   · dates de séjour en « date », fin exclusive (jour du départ) ;
--   · chaque table métier porte is_demo pour isoler les données de démonstration ;
--   · les fonctions internes vivent dans le schéma « app », non exposé par l'API.
-- =============================================================================

create extension if not exists btree_gist with schema extensions;
create extension if not exists unaccent with schema extensions;
create extension if not exists pg_trgm with schema extensions;
create extension if not exists pgcrypto with schema extensions;

create schema if not exists app;
revoke all on schema app from public;
grant usage on schema app to authenticated, service_role;

-- -----------------------------------------------------------------------------
-- Utilitaires
-- -----------------------------------------------------------------------------

-- Date du jour à Bordeaux (les séjours et les tâches sont en heure de Paris).
create or replace function app.today()
returns date
language sql
stable
set search_path = ''
as $$
  select (now() at time zone 'Europe/Paris')::date
$$;

-- Texte normalisé pour la recherche : minuscules, sans accents.
create or replace function app.normalize(value text)
returns text
language sql
immutable
parallel safe
set search_path = ''
as $$
  select lower(extensions.unaccent('extensions.unaccent'::regdictionary, coalesce(value, '')))
$$;

create or replace function app.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Comptes et rôles
-- -----------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.profiles is 'Un profil par compte de connexion (admin, agent ou propriétaire).';

create trigger profiles_touch before update on public.profiles
  for each row execute function app.touch_updated_at();

create table public.roles (
  key text primary key,
  label text not null,
  description text not null default ''
);
comment on table public.roles is 'Rôles disponibles. Ajouter un rôle ne demande pas de changer la structure.';

insert into public.roles (key, label, description) values
  ('admin', 'Administrateur', 'Baptiste et Simon : accès complet au back-office.'),
  ('staff', 'Agent', 'Agents et intervenants terrain : leurs tâches uniquement.'),
  ('owner', 'Propriétaire', 'Propriétaires : leurs biens, réservations, revenus et documents.');

create table public.user_roles (
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null references public.roles (key),
  granted_by uuid references public.profiles (id) on delete set null,
  granted_at timestamptz not null default now(),
  primary key (user_id, role)
);

-- Le profil est créé automatiquement à la création du compte.
create or replace function app.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function app.handle_new_user();

-- L'adresse email du profil suit celle du compte.
create or replace function app.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email is distinct from old.email then
    update public.profiles set email = coalesce(new.email, '') where id = new.id;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row execute function app.handle_user_email_change();

-- -----------------------------------------------------------------------------
-- Fonctions d'autorisation (utilisées par les règles d'accès)
-- -----------------------------------------------------------------------------

create or replace function app.has_role(role_key text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.user_id = (select auth.uid()) and ur.role = role_key
  )
$$;

-- Un administrateur n'a ses droits qu'après la double authentification (aal2).
create or replace function app.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select app.has_role('admin')
    and coalesce((select auth.jwt()) ->> 'aal', 'aal1') = 'aal2'
$$;

create or replace function app.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select app.has_role('staff')
$$;

-- -----------------------------------------------------------------------------
-- Paramètres de la société (une seule ligne)
-- -----------------------------------------------------------------------------

create table public.settings (
  id boolean primary key default true check (id),
  company_name text not null default 'Comme à la Maison',
  legal_name text,
  legal_form text,
  share_capital text,
  siren text,
  registration text,
  vat_number text,
  head_office text,
  email text,
  phone text,
  website text,
  professional_card text,
  liability_insurance text,
  -- Commission par défaut : 20 % TTC du prix des nuitées réellement perçu,
  -- après les frais de la plateforme (décision de Baptiste et Simon).
  default_commission_bps integer not null default 2000 check (default_commission_bps between 0 and 10000),
  vat_registered boolean not null default false,
  vat_rate_bps integer not null default 2000 check (vat_rate_bps between 0 and 10000),
  invoice_prefix text not null default 'CAM' check (invoice_prefix ~ '^[A-Z0-9-]{1,10}$'),
  payment_terms_days integer not null default 15 check (payment_terms_days between 0 and 90),
  late_penalty_note text,
  bank_details text,
  default_check_in_time time not null default '16:00',
  default_check_out_time time not null default '11:00',
  default_cleaning_checklist jsonb not null default '[
    "Aérer toutes les pièces",
    "Changer draps et serviettes",
    "Nettoyer cuisine et électroménager",
    "Vider et nettoyer le réfrigérateur",
    "Nettoyer salle de bain et toilettes",
    "Aspirer et laver les sols",
    "Vider les poubelles",
    "Vérifier les consommables (café, papier, savon)",
    "Préparer la box de bienvenue",
    "Photographier chaque pièce après ménage"
  ]'::jsonb,
  -- Limite légale de location d'une résidence principale (nuits par an).
  primary_residence_night_limit integer not null default 120 check (primary_residence_night_limit between 0 and 366),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null
);
comment on table public.settings is 'Paramètres uniques de la société : identité légale, commission, TVA, facturation.';

insert into public.settings (id) values (true);

create trigger settings_touch before update on public.settings
  for each row execute function app.touch_updated_at();

-- -----------------------------------------------------------------------------
-- Journal d'activité (écriture seule, alimenté par la base)
-- -----------------------------------------------------------------------------

create table public.audit_logs (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  actor_id uuid,
  table_name text not null,
  record_id text,
  action text not null check (action in ('insert', 'update', 'delete')),
  changes jsonb not null default '{}'::jsonb,
  is_demo boolean not null default false
);
comment on table public.audit_logs is 'Journal d''activité en écriture seule, alimenté par des déclencheurs.';

create index audit_logs_occurred_idx on public.audit_logs (occurred_at desc);
create index audit_logs_record_idx on public.audit_logs (table_name, record_id);
create index audit_logs_actor_idx on public.audit_logs (actor_id);

-- Colonnes jamais recopiées dans le journal (codes d'accès, IBAN chiffré).
create or replace function app.redacted_columns(table_name text)
returns text[]
language sql
immutable
set search_path = ''
as $$
  select case table_name
    when 'property_access' then array['door_code', 'key_box_code', 'alarm_code', 'wifi_password']
    when 'owners' then array['iban_encrypted']
    else array[]::text[]
  end
$$;

create or replace function app.audit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  old_row jsonb := case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end;
  new_row jsonb := case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end;
  row_data jsonb := coalesce(new_row, old_row);
  hidden text[] := app.redacted_columns(tg_table_name);
  diff jsonb := '{}'::jsonb;
  col text;
  record_key text;
begin
  record_key := coalesce(
    row_data ->> 'id',
    row_data ->> 'property_id',
    case when row_data ? 'user_id' then (row_data ->> 'user_id') || ':' || coalesce(row_data ->> 'role', '') end
  );

  if tg_op = 'UPDATE' then
    for col in select jsonb_object_keys(new_row) loop
      if col in ('updated_at', 'search_text') then
        continue;
      end if;
      if (old_row -> col) is distinct from (new_row -> col) then
        diff := diff || jsonb_build_object(
          col,
          case when col = any (hidden)
            then jsonb_build_object('from', '•••', 'to', '•••')
            else jsonb_build_object('from', old_row -> col, 'to', new_row -> col)
          end
        );
      end if;
    end loop;
    if diff = '{}'::jsonb then
      return new;
    end if;
  else
    diff := row_data - 'search_text';
    foreach col in array hidden loop
      if diff ? col and diff ->> col is not null then
        diff := jsonb_set(diff, array[col], '"•••"'::jsonb);
      end if;
    end loop;
  end if;

  insert into public.audit_logs (actor_id, table_name, record_id, action, changes, is_demo)
  values (
    (select auth.uid()),
    tg_table_name,
    record_key,
    lower(tg_op),
    diff,
    coalesce((row_data ->> 'is_demo')::boolean, false)
  );

  return coalesce(new, old);
end;
$$;

-- Le journal ne se modifie pas et ne s'efface pas (sauf purge des données de démonstration).
create or replace function app.audit_logs_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' and old.is_demo and current_setting('app.purging_demo', true) = 'on' then
    return old;
  end if;
  raise exception 'Le journal d''activité est en écriture seule.';
end;
$$;

create trigger audit_logs_no_update before update on public.audit_logs
  for each row execute function app.audit_logs_guard();
create trigger audit_logs_no_delete before delete on public.audit_logs
  for each row execute function app.audit_logs_guard();

-- -----------------------------------------------------------------------------
-- Événements métier (traités une seule fois par le moteur d'automatisation)
-- -----------------------------------------------------------------------------

create table public.domain_events (
  id bigint generated always as identity primary key,
  type text not null,
  entity_table text not null,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  actor_id uuid,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  processed_at timestamptz,
  attempts integer not null default 0,
  last_error text
);
comment on table public.domain_events is 'Événements métier écrits par la base, consommés dans l''ordre par le moteur d''automatisation.';

create index domain_events_pending_idx on public.domain_events (id) where processed_at is null;
create index domain_events_entity_idx on public.domain_events (entity_table, entity_id);

create or replace function app.emit_event(
  event_type text,
  entity_table text,
  entity_id uuid,
  payload jsonb default '{}'::jsonb,
  is_demo boolean default false
)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.domain_events (type, entity_table, entity_id, payload, actor_id, is_demo)
  values (event_type, entity_table, entity_id, coalesce(payload, '{}'::jsonb), (select auth.uid()), coalesce(is_demo, false));
$$;

create table public.automation_rules (
  key text primary key,
  name text not null,
  description text not null,
  event_type text not null,
  enabled boolean not null default true,
  config jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null
);
comment on table public.automation_rules is 'Règles d''automatisation activables depuis les paramètres.';

create trigger automation_rules_touch before update on public.automation_rules
  for each row execute function app.touch_updated_at();

create table public.automation_runs (
  id bigint generated always as identity primary key,
  event_id bigint references public.domain_events (id) on delete cascade,
  rule_key text not null references public.automation_rules (key) on delete cascade,
  status text not null check (status in ('success', 'skipped', 'error')),
  result jsonb not null default '{}'::jsonb,
  error text,
  created_at timestamptz not null default now(),
  unique (event_id, rule_key)
);
create index automation_runs_created_idx on public.automation_runs (created_at desc);
