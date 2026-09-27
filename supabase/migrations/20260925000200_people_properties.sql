-- =============================================================================
-- Personnes (CRM), propriétaires, biens, contrats et annonces
-- Une personne n'existe qu'une fois (contacts) : un prospect qui signe devient
-- propriétaire sans ressaisie.
-- =============================================================================

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  first_name text not null default '',
  last_name text not null default '',
  company_name text,
  email text,
  phone text,
  address_line text,
  postal_code text,
  city text,
  country text not null default 'France',
  notes text,
  -- Compte de connexion associé (propriétaire ou agent), s'il existe.
  profile_id uuid unique references public.profiles (id) on delete set null,
  search_text text generated always as (
    app.normalize(
      coalesce(first_name, '') || ' ' || coalesce(last_name, '') || ' ' || coalesce(company_name, '') || ' ' ||
      coalesce(email, '') || ' ' || coalesce(phone, '') || ' ' || coalesce(city, '')
    )
  ) stored,
  is_demo boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contacts_email_format check (email is null or email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$')
);
comment on table public.contacts is 'Toutes les personnes : prospects, propriétaires, voyageurs, prestataires.';

create index contacts_search_idx on public.contacts using gin (search_text extensions.gin_trgm_ops);
create index contacts_email_idx on public.contacts (lower(email));
create trigger contacts_touch before update on public.contacts
  for each row execute function app.touch_updated_at();

create or replace function app.contact_display_name(c public.contacts)
returns text
language sql
immutable
set search_path = ''
as $$
  select coalesce(nullif(trim(c.first_name || ' ' || c.last_name), ''), c.company_name, c.email, 'Sans nom')
$$;

-- -----------------------------------------------------------------------------
-- Propriétaires
-- -----------------------------------------------------------------------------

create table public.owners (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null unique references public.contacts (id) on delete restrict,
  status text not null default 'active' check (status in ('onboarding', 'active', 'inactive')),
  -- Taux propre au propriétaire (sinon celui du bien, sinon le taux par défaut).
  commission_rate_bps integer check (commission_rate_bps between 0 and 10000),
  -- IBAN chiffré par l'application (clé côté serveur uniquement) ; 4 derniers caractères affichés.
  iban_encrypted text,
  iban_last4 text,
  iban_holder text,
  sepa_mandate_reference text,
  sepa_mandate_signed_on date,
  billing_email text,
  vat_number text,
  notes text,
  is_demo boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.owners is 'Propriétaires clients. Ils encaissent les versements des plateformes ; Comme à la Maison leur facture sa commission.';

create trigger owners_touch before update on public.owners
  for each row execute function app.touch_updated_at();

-- Propriétaire rattaché au compte connecté.
create or replace function app.current_owner_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select o.id
  from public.owners o
  join public.contacts c on c.id = o.contact_id
  where c.profile_id = (select auth.uid())
    and exists (select 1 from public.user_roles ur where ur.user_id = (select auth.uid()) and ur.role = 'owner')
  limit 1
$$;

-- -----------------------------------------------------------------------------
-- Voyageurs et prestataires
-- -----------------------------------------------------------------------------

create table public.guests (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null unique references public.contacts (id) on delete restrict,
  language text,
  notes text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger guests_touch before update on public.guests
  for each row execute function app.touch_updated_at();

create table public.providers (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null unique references public.contacts (id) on delete restrict,
  trade text not null default 'Autre',
  siret text,
  active boolean not null default true,
  notes text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.providers is 'Prestataires : ménage, plomberie, électricité, serrurerie…';
create trigger providers_touch before update on public.providers
  for each row execute function app.touch_updated_at();

-- -----------------------------------------------------------------------------
-- Prospects (CRM)
-- -----------------------------------------------------------------------------

create table public.prospects (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts (id) on delete restrict,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'meeting', 'proposal_sent', 'thinking', 'won', 'lost')),
  source text not null default 'website' check (source in ('website', 'phone', 'email', 'referral', 'event', 'other')),
  property_city text,
  property_type text,
  bedrooms text,
  capacity text,
  message text,
  next_action text,
  next_action_on date,
  assigned_to uuid references public.profiles (id) on delete set null,
  lost_reason text,
  converted_owner_id uuid references public.owners (id) on delete set null,
  is_demo boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.prospects is 'Pipeline commercial. Le formulaire d''estimation du site crée un prospect.';

create index prospects_status_idx on public.prospects (status);
create index prospects_contact_idx on public.prospects (contact_id);
create trigger prospects_touch before update on public.prospects
  for each row execute function app.touch_updated_at();

create table public.prospect_activities (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects (id) on delete cascade,
  kind text not null default 'note' check (kind in ('note', 'call', 'email', 'meeting', 'status_change')),
  content text not null,
  is_demo boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index prospect_activities_prospect_idx on public.prospect_activities (prospect_id, created_at desc);

-- -----------------------------------------------------------------------------
-- Biens
-- -----------------------------------------------------------------------------

create sequence public.property_reference_seq;

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('B-' || lpad(nextval('public.property_reference_seq')::text, 3, '0')),
  owner_id uuid not null references public.owners (id) on delete restrict,
  name text not null,
  status text not null default 'onboarding'
    check (status in ('active', 'inactive', 'onboarding', 'maintenance', 'unavailable')),
  property_type text not null default 'apartment'
    check (property_type in ('studio', 'apartment', 'house', 'villa', 'room', 'other')),
  address_line text,
  postal_code text,
  city text not null default 'Bordeaux',
  surface_m2 numeric(7, 2) check (surface_m2 is null or surface_m2 > 0),
  bedrooms integer check (bedrooms is null or bedrooms >= 0),
  beds integer check (beds is null or beds >= 0),
  bathrooms numeric(3, 1) check (bathrooms is null or bathrooms >= 0),
  capacity integer check (capacity is null or capacity > 0),
  floor_info text,
  description text,
  -- Présentation publique (utilisée si le bien est visible sur le site).
  public_title text,
  public_description text,
  visible_on_site boolean not null default false,
  slug text unique check (slug is null or slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  commission_rate_bps integer check (commission_rate_bps between 0 and 10000),
  default_cleaning_fee_cents integer check (default_cleaning_fee_cents is null or default_cleaning_fee_cents >= 0),
  check_in_time time,
  check_out_time time,
  -- Numéro d'enregistrement exigé pour la location meublée de tourisme.
  registration_number text,
  is_primary_residence boolean not null default false,
  cleaning_checklist jsonb,
  internal_notes text,
  search_text text generated always as (
    app.normalize(
      coalesce(reference, '') || ' ' || coalesce(name, '') || ' ' || coalesce(address_line, '') || ' ' ||
      coalesce(postal_code, '') || ' ' || coalesce(city, '')
    )
  ) stored,
  is_demo boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint properties_public_needs_slug check (not visible_on_site or slug is not null)
);
comment on table public.properties is 'Logements gérés. Le taux de commission propre au bien remplace le taux par défaut.';

create index properties_owner_idx on public.properties (owner_id);
create index properties_status_idx on public.properties (status);
create index properties_search_idx on public.properties using gin (search_text extensions.gin_trgm_ops);
create trigger properties_touch before update on public.properties
  for each row execute function app.touch_updated_at();

create table public.property_photos (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  storage_path text not null unique,
  caption text,
  position integer not null default 0,
  is_public boolean not null default false,
  is_demo boolean not null default false,
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index property_photos_property_idx on public.property_photos (property_id, position);

-- Codes et accès : table séparée, lue par les admins et, le jour de sa tâche, par l'agent affecté.
create table public.property_access (
  property_id uuid primary key references public.properties (id) on delete cascade,
  door_code text,
  key_box_code text,
  key_box_location text,
  alarm_code text,
  wifi_name text,
  wifi_password text,
  parking_info text,
  access_instructions text,
  is_demo boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null
);
create trigger property_access_touch before update on public.property_access
  for each row execute function app.touch_updated_at();

create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.owners (id) on delete cascade,
  property_id uuid references public.properties (id) on delete set null,
  reference text,
  status text not null default 'draft' check (status in ('draft', 'active', 'ended')),
  start_date date,
  end_date date,
  commission_rate_bps integer check (commission_rate_bps between 0 and 10000),
  signed_on date,
  notes text,
  is_demo boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contracts_dates check (end_date is null or start_date is null or end_date >= start_date)
);
create index contracts_owner_idx on public.contracts (owner_id);
create trigger contracts_touch before update on public.contracts
  for each row execute function app.touch_updated_at();

-- Taux applicable : bien, puis propriétaire, puis taux par défaut.
create or replace function app.resolve_commission_rate(target_property uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(p.commission_rate_bps, o.commission_rate_bps, s.default_commission_bps)
  from public.properties p
  join public.owners o on o.id = p.owner_id
  cross join public.settings s
  where p.id = target_property
$$;

-- -----------------------------------------------------------------------------
-- Plateformes et annonces
-- -----------------------------------------------------------------------------

create table public.platforms (
  id text primary key check (id ~ '^[a-z0-9_]+$'),
  name text not null,
  position integer not null default 0
);

insert into public.platforms (id, name, position) values
  ('airbnb', 'Airbnb', 1),
  ('booking', 'Booking.com', 2),
  ('abritel', 'Abritel / Vrbo', 3),
  ('direct', 'Réservation directe', 4),
  ('other', 'Autre', 5);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  platform_id text not null references public.platforms (id),
  external_id text,
  listing_url text check (listing_url is null or listing_url ~ '^https://'),
  -- Calendrier iCal fourni par la plateforme (import).
  ical_import_url text check (ical_import_url is null or ical_import_url ~ '^https://'),
  -- Jeton du calendrier exporté vers cette plateforme (adresse secrète).
  ical_export_token text not null unique default encode(extensions.gen_random_bytes(24), 'hex'),
  status text not null default 'active' check (status in ('active', 'inactive')),
  last_import_at timestamptz,
  last_import_status text check (last_import_status in ('success', 'partial', 'error')),
  last_import_error text,
  notes text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (property_id, platform_id)
);
comment on table public.listings is 'Une annonce par plateforme et par bien, avec ses calendriers iCal.';
create trigger listings_touch before update on public.listings
  for each row execute function app.touch_updated_at();
