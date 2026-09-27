-- =============================================================================
-- Avis clients affichés sur le site public (section « Avis » de l'accueil).
--
-- Règle : uniquement de vrais avis (message, plateforme, email…), publiés avec
-- l'accord de leur auteur. Un avis ne peut être visible que si cet accord est
-- coché. Gérés depuis le back-office (Avis clients) ; le site public les lit par
-- le serveur (clé secrète, colonnes choisies) : aucun accès anonyme à la table.
-- =============================================================================

create table public.site_reviews (
  id uuid primary key default gen_random_uuid(),
  author_name text not null check (length(btrim(author_name)) between 2 and 60),
  city text check (city is null or length(city) <= 60),
  category text not null default 'proprietaire' check (category in ('proprietaire', 'voyageur', 'client')),
  rating smallint not null check (rating between 1 and 5),
  body text not null check (length(btrim(body)) between 10 and 1200),
  -- Où l'avis a été reçu : Airbnb, Booking.com, Google, message, email…
  source text check (source is null or length(source) <= 60),
  received_on date,

  -- Publication : jamais sans l'accord de l'auteur.
  consent_confirmed boolean not null default false,
  is_published boolean not null default false,
  position integer not null default 0,
  internal_notes text,

  is_demo boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint site_reviews_consent_before_publication check (not is_published or consent_confirmed)
);

comment on table public.site_reviews is 'Avis clients (propriétaires, voyageurs) affichés sur l''accueil du site public.';
comment on column public.site_reviews.consent_confirmed is 'L''auteur a accepté que son avis soit publié sur le site.';

create index site_reviews_published_idx on public.site_reviews (is_published, position) where not is_demo;

create trigger site_reviews_touch before update on public.site_reviews
  for each row execute function app.touch_updated_at();

create trigger site_reviews_audit after insert or update or delete on public.site_reviews
  for each row execute function app.audit();

-- Règles d'accès : administrateurs uniquement (double authentification exigée par app.is_admin()).
alter table public.site_reviews enable row level security;
alter table public.site_reviews force row level security;

create policy admin_all on public.site_reviews for all to authenticated
  using ((select app.is_admin())) with check ((select app.is_admin()));

revoke all on public.site_reviews from anon;
grant select, insert, update, delete on public.site_reviews to authenticated;
