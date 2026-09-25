-- =============================================================================
-- Opérations terrain : tâches (ménage, contrôle, accueil, maintenance),
-- photos, incidents et interventions
-- =============================================================================

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'cleaning'
    check (type in ('cleaning', 'inspection', 'check_in', 'check_out', 'maintenance', 'linen', 'other')),
  status text not null default 'todo'
    check (status in ('todo', 'in_progress', 'done', 'validated', 'cancelled')),
  property_id uuid not null references public.properties (id) on delete cascade,
  booking_id uuid references public.bookings (id) on delete set null,
  assignee_id uuid references public.profiles (id) on delete set null,
  title text not null,
  instructions text,
  due_date date not null,
  window_start time,
  window_end time,
  -- Liste de contrôle : [{ "label": "…", "done": false }]
  checklist jsonb not null default '[]'::jsonb check (jsonb_typeof(checklist) = 'array'),
  agent_notes text,
  started_at timestamptz,
  completed_at timestamptz,
  validated_at timestamptz,
  validated_by uuid references public.profiles (id) on delete set null,
  -- Tâche créée par une règle d'automatisation (clé de la règle).
  created_by_rule text,
  is_demo boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_text text generated always as (app.normalize(coalesce(title, ''))) stored
);
comment on table public.tasks is 'Tâches terrain. Un agent ne voit que les siennes.';

create index tasks_due_idx on public.tasks (due_date, status);
create index tasks_assignee_idx on public.tasks (assignee_id, due_date);
create index tasks_property_idx on public.tasks (property_id, due_date);
create index tasks_booking_idx on public.tasks (booking_id);
create index tasks_search_idx on public.tasks using gin (search_text extensions.gin_trgm_ops);
-- Une seule tâche automatique d'un type donné par réservation.
create unique index tasks_rule_booking_idx on public.tasks (booking_id, type)
  where created_by_rule is not null and booking_id is not null;

create trigger tasks_touch before update on public.tasks
  for each row execute function app.touch_updated_at();

create or replace function app.task_timestamps()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'in_progress' and new.started_at is null then
    new.started_at := now();
  end if;
  if new.status in ('done', 'validated') and new.completed_at is null then
    new.completed_at := now();
  end if;
  if new.status = 'validated' and new.validated_at is null then
    new.validated_at := now();
    new.validated_by := coalesce(new.validated_by, (select auth.uid()));
  end if;
  if new.status in ('todo', 'in_progress') then
    new.completed_at := null;
    new.validated_at := null;
    new.validated_by := null;
  end if;
  return new;
end;
$$;

create trigger tasks_timestamps before insert or update on public.tasks
  for each row execute function app.task_timestamps();

create table public.task_photos (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  storage_path text not null unique,
  kind text not null default 'after' check (kind in ('before', 'after', 'issue')),
  caption text,
  is_demo boolean not null default false,
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index task_photos_task_idx on public.task_photos (task_id);

create table public.incidents (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  task_id uuid references public.tasks (id) on delete set null,
  booking_id uuid references public.bookings (id) on delete set null,
  reported_by uuid references public.profiles (id) on delete set null,
  title text not null,
  description text,
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved')),
  visible_to_owner boolean not null default true,
  resolution text,
  resolved_at timestamptz,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_text text generated always as (app.normalize(coalesce(title, '') || ' ' || coalesce(description, ''))) stored
);
comment on table public.incidents is 'Problèmes constatés (casse, panne, manque). Un incident peut devenir une intervention.';

create index incidents_property_idx on public.incidents (property_id, created_at desc);
create index incidents_status_idx on public.incidents (status);
create index incidents_reporter_idx on public.incidents (reported_by);
create index incidents_search_idx on public.incidents using gin (search_text extensions.gin_trgm_ops);
create trigger incidents_touch before update on public.incidents
  for each row execute function app.touch_updated_at();

create or replace function app.incident_timestamps()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'resolved' and new.resolved_at is null then
    new.resolved_at := now();
  elsif new.status <> 'resolved' then
    new.resolved_at := null;
  end if;
  return new;
end;
$$;
create trigger incidents_timestamps before insert or update on public.incidents
  for each row execute function app.incident_timestamps();

create table public.incident_photos (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references public.incidents (id) on delete cascade,
  storage_path text not null unique,
  is_demo boolean not null default false,
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index incident_photos_incident_idx on public.incident_photos (incident_id);

create table public.maintenance_jobs (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  incident_id uuid references public.incidents (id) on delete set null,
  provider_id uuid references public.providers (id) on delete set null,
  title text not null,
  description text,
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'done', 'cancelled')),
  scheduled_on date,
  completed_on date,
  cost_cents integer check (cost_cents is null or cost_cents >= 0),
  is_demo boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.maintenance_jobs is 'Interventions (réparations, entretien), avec prestataire et coût.';
create index maintenance_jobs_property_idx on public.maintenance_jobs (property_id, scheduled_on);
create trigger maintenance_jobs_touch before update on public.maintenance_jobs
  for each row execute function app.touch_updated_at();
