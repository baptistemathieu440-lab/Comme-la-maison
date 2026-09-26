-- =============================================================================
-- Guide voyageurs : le carnet de bonnes adresses bordelaises (/guide).
--
-- Une ligne par recommandation, gérée depuis le back-office (Guide voyageurs).
-- Le site public lit uniquement les adresses publiées et réelles, par le serveur
-- (clé secrète, colonnes choisies) : aucun accès anonyme à la table.
-- Les photos vont dans un espace de stockage public en lecture (ce sont des
-- photos de lieux publics, affichées sur le guide) et en écriture pour les
-- administrateurs seulement.
-- =============================================================================

create table public.guide_places (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (length(name) between 2 and 120),

  -- Classement
  kind text not null check (kind in (
    'patrimoine', 'culture', 'restaurant', 'bar', 'activite', 'nature', 'shopping', 'sortie', 'excursion'
  )),
  subcategory text,
  wine_region text check (wine_region in (
    'bordeaux', 'saint-emilion', 'medoc', 'graves', 'pessac-leognan', 'entre-deux-mers', 'blaye-bourg', 'sauternes'
  )),
  tags text[] not null default '{}',
  audiences text[] not null default '{}',
  -- 0 : gratuit · 1 : moins de 15 € · 2 : 15 à 30 € · 3 : 30 à 60 € · 4 : expérience premium
  budget smallint not null default 1 check (budget between 0 and 4),
  price_note text,
  zone text not null default 'centre' check (zone in ('centre', 'metropole', 'moins-30', '30-60', '60-120')),
  setting text not null default 'mixte' check (setting in ('interieur', 'exterieur', 'mixte')),

  -- Textes
  summary text not null default '',
  good_to_know text,
  tip text,
  highlights text,
  where_to_eat text,

  -- Informations pratiques
  area text not null default 'Bordeaux',
  travel_time text,
  duration text,
  best_period text,
  transport text,
  car_needed boolean,
  address text,
  lat numeric(9, 6) check (lat between -90 and 90),
  lng numeric(9, 6) check (lng between -180 and 180),
  hours text,
  booking text not null default 'non' check (booking in ('non', 'conseillee', 'obligatoire')),
  website_url text check (website_url is null or website_url ~ '^https?://'),
  booking_url text check (booking_url is null or booking_url ~ '^https?://'),
  maps_url text check (maps_url is null or maps_url ~ '^https://'),

  -- Note publique (toujours avec sa source) : jamais saisie sans vérification.
  rating numeric(2, 1) check (rating between 0 and 5),
  rating_count integer check (rating_count >= 0),
  rating_source text,

  -- Photo
  photo_path text,
  photo_alt text,
  photo_credit text,

  -- Publication et vérification
  status text not null default 'ouvert' check (status in ('ouvert', 'saisonnier', 'ferme-temporairement', 'ferme')),
  is_published boolean not null default true,
  is_favorite boolean not null default false,
  position integer not null default 0,
  verified_on date,
  sources text[] not null default '{}',
  internal_notes text,

  is_demo boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint guide_places_coordinates check ((lat is null) = (lng is null)),
  constraint guide_places_rating_source check (rating is null or rating_source is not null)
);

comment on table public.guide_places is 'Guide voyageurs : recommandations (restaurants, bars, visites, excursions…) affichées sur /guide.';
comment on column public.guide_places.verified_on is 'Date de la dernière vérification des informations (horaires, prix, liens, ouverture).';
comment on column public.guide_places.tip is '« Notre petit conseil » : recommandation éditoriale de Comme à la Maison.';

create index guide_places_published_idx on public.guide_places (is_published, kind) where not is_demo;

create trigger guide_places_touch before update on public.guide_places
  for each row execute function app.touch_updated_at();

create trigger guide_places_audit after insert or update or delete on public.guide_places
  for each row execute function app.audit();

-- Règles d'accès : administrateurs uniquement (double authentification exigée par app.is_admin()).
alter table public.guide_places enable row level security;
alter table public.guide_places force row level security;

create policy admin_all on public.guide_places for all to authenticated
  using ((select app.is_admin())) with check ((select app.is_admin()));

revoke all on public.guide_places from anon;
grant select, insert, update, delete on public.guide_places to authenticated;

-- Stockage des photos du guide -----------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('guide-photos', 'guide-photos', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy guide_photos_admin_all on storage.objects for all to authenticated
  using (bucket_id = 'guide-photos' and (select app.is_admin()))
  with check (bucket_id = 'guide-photos' and (select app.is_admin()));
