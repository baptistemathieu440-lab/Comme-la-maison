-- =============================================================================
-- Règles d'accès (Row Level Security)
--
--   · admin  : tout, après double authentification (app.is_admin() exige aal2) ;
--   · owner  : ses biens, annonces, calendriers, relevés finalisés, dépenses,
--              incidents visibles et documents partagés, jamais ceux d'un autre ;
--   · staff  : ses tâches, les biens de ses tâches, ses photos et ses signalements.
--
-- Les réservations et les voyageurs ne sont jamais lus directement par un
-- propriétaire ou un agent : ils passent par des vues filtrées (migration suivante)
-- qui n'exposent que les colonnes utiles (prénom du voyageur, pas de coordonnées).
-- =============================================================================

-- Aucun accès anonyme aux tables : le site public passe par le serveur.
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
revoke truncate, references, trigger on all tables in schema public from authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage on all sequences in schema public to authenticated;

alter default privileges in schema public revoke all on tables from anon;
alter default privileges in schema public revoke all on sequences from anon;
alter default privileges in schema public revoke all on functions from anon;
alter default privileges in schema public revoke execute on functions from public;

-- Aides pour les règles (security definer : évitent la récursion entre règles).
create or replace function app.owns_property(target_property uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.properties p
    where p.id = target_property and p.owner_id = app.current_owner_id()
  )
$$;

create or replace function app.staff_has_property(target_property uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select app.is_staff() and exists (
    select 1 from public.tasks t
    where t.property_id = target_property
      and t.assignee_id = (select auth.uid())
      and t.status <> 'cancelled'
  )
$$;

create or replace function app.staff_has_task(target_task uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select app.is_staff() and exists (
    select 1 from public.tasks t
    where t.id = target_task and t.assignee_id = (select auth.uid())
  )
$$;

grant execute on all functions in schema app to authenticated, service_role;

do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'roles', 'user_roles', 'settings', 'audit_logs', 'domain_events', 'automation_rules',
    'automation_runs', 'contacts', 'owners', 'guests', 'providers', 'prospects', 'prospect_activities',
    'properties', 'property_photos', 'property_access', 'contracts', 'platforms', 'listings', 'bookings',
    'calendar_blocks', 'sync_runs', 'tasks', 'task_photos', 'incidents', 'incident_photos',
    'maintenance_jobs', 'expenses', 'owner_statements', 'statement_lines', 'payments', 'invoice_counters',
    'documents', 'notifications', 'notification_deliveries', 'invitations'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);
  end loop;
end;
$$;

-- Accès complet des administrateurs sur les tables de gestion.
do $$
declare
  t text;
begin
  foreach t in array array[
    'contacts', 'owners', 'guests', 'providers', 'prospects', 'prospect_activities', 'properties',
    'property_photos', 'property_access', 'contracts', 'platforms', 'listings', 'bookings',
    'calendar_blocks', 'sync_runs', 'tasks', 'task_photos', 'incidents', 'incident_photos',
    'maintenance_jobs', 'expenses', 'owner_statements', 'statement_lines', 'payments', 'documents',
    'invitations', 'user_roles'
  ] loop
    execute format(
      'create policy admin_all on public.%I for all to authenticated using ((select app.is_admin())) with check ((select app.is_admin()))',
      t
    );
  end loop;
end;
$$;

-- Comptes -------------------------------------------------------------------

create policy profiles_read on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select app.is_admin()));
create policy profiles_update_self on public.profiles for update to authenticated
  using (id = (select auth.uid()) or (select app.is_admin()))
  with check (id = (select auth.uid()) or (select app.is_admin()));

-- Seuls le nom et le téléphone se modifient depuis l'application.
create or replace function app.profiles_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.email is distinct from old.email and current_user in ('authenticated', 'anon') then
    new.email := old.email;
  end if;
  return new;
end;
$$;
create trigger profiles_guard before update on public.profiles
  for each row execute function app.profiles_guard();

create policy roles_read on public.roles for select to authenticated using (true);

create policy user_roles_read_self on public.user_roles for select to authenticated
  using (user_id = (select auth.uid()));

-- Système --------------------------------------------------------------------

create policy settings_admin_read on public.settings for select to authenticated
  using ((select app.is_admin()));
create policy settings_admin_update on public.settings for update to authenticated
  using ((select app.is_admin())) with check ((select app.is_admin()));

create policy audit_logs_admin_read on public.audit_logs for select to authenticated
  using ((select app.is_admin()));
create policy domain_events_admin_read on public.domain_events for select to authenticated
  using ((select app.is_admin()));
create policy automation_rules_admin_read on public.automation_rules for select to authenticated
  using ((select app.is_admin()));
create policy automation_rules_admin_update on public.automation_rules for update to authenticated
  using ((select app.is_admin())) with check ((select app.is_admin()));
create policy automation_runs_admin_read on public.automation_runs for select to authenticated
  using ((select app.is_admin()));
create policy notification_deliveries_admin_read on public.notification_deliveries for select to authenticated
  using ((select app.is_admin()));

-- Personnes ------------------------------------------------------------------

create policy contacts_read_self on public.contacts for select to authenticated
  using (profile_id = (select auth.uid()));
create policy owners_read_self on public.owners for select to authenticated
  using (id = (select app.current_owner_id()));
create policy platforms_read on public.platforms for select to authenticated using (true);

-- Biens ----------------------------------------------------------------------

create policy properties_owner_read on public.properties for select to authenticated
  using (owner_id = (select app.current_owner_id()));
create policy properties_staff_read on public.properties for select to authenticated
  using (app.staff_has_property(id));

create policy property_photos_owner_read on public.property_photos for select to authenticated
  using (app.owns_property(property_id));
create policy property_photos_staff_read on public.property_photos for select to authenticated
  using (app.staff_has_property(property_id));

create policy contracts_owner_read on public.contracts for select to authenticated
  using (owner_id = (select app.current_owner_id()));

create policy listings_owner_read on public.listings for select to authenticated
  using (app.owns_property(property_id));

create policy calendar_blocks_owner_read on public.calendar_blocks for select to authenticated
  using (app.owns_property(property_id));

-- Opérations -----------------------------------------------------------------

create policy tasks_staff_read on public.tasks for select to authenticated
  using ((select app.is_staff()) and assignee_id = (select auth.uid()));

create policy task_photos_staff_read on public.task_photos for select to authenticated
  using (app.staff_has_task(task_id));
create policy task_photos_staff_insert on public.task_photos for insert to authenticated
  with check (app.staff_has_task(task_id) and uploaded_by = (select auth.uid()));

create policy incidents_staff_read on public.incidents for select to authenticated
  using ((select app.is_staff()) and reported_by = (select auth.uid()));
create policy incidents_staff_insert on public.incidents for insert to authenticated
  with check (
    reported_by = (select auth.uid())
    and app.staff_has_property(property_id)
    and (task_id is null or app.staff_has_task(task_id))
    and booking_id is null
  );
create policy incidents_owner_read on public.incidents for select to authenticated
  using (visible_to_owner and app.owns_property(property_id));

create policy incident_photos_staff_read on public.incident_photos for select to authenticated
  using (exists (
    select 1 from public.incidents i
    where i.id = incident_id and i.reported_by = (select auth.uid()) and (select app.is_staff())
  ));
create policy incident_photos_staff_insert on public.incident_photos for insert to authenticated
  with check (
    uploaded_by = (select auth.uid())
    and exists (
      select 1 from public.incidents i
      where i.id = incident_id and i.reported_by = (select auth.uid()) and (select app.is_staff())
    )
  );
create policy incident_photos_owner_read on public.incident_photos for select to authenticated
  using (exists (
    select 1 from public.incidents i
    where i.id = incident_id and i.visible_to_owner and app.owns_property(i.property_id)
  ));

create policy maintenance_jobs_owner_read on public.maintenance_jobs for select to authenticated
  using (app.owns_property(property_id));

-- Finances -------------------------------------------------------------------

create policy expenses_owner_read on public.expenses for select to authenticated
  using (owner_id = (select app.current_owner_id()));

create policy owner_statements_owner_read on public.owner_statements for select to authenticated
  using (owner_id = (select app.current_owner_id()) and status <> 'draft');

create policy statement_lines_owner_read on public.statement_lines for select to authenticated
  using (exists (
    select 1 from public.owner_statements s
    where s.id = statement_id and s.owner_id = (select app.current_owner_id()) and s.status <> 'draft'
  ));

create policy payments_owner_read on public.payments for select to authenticated
  using (exists (
    select 1 from public.owner_statements s
    where s.id = statement_id and s.owner_id = (select app.current_owner_id()) and s.status <> 'draft'
  ));

-- Documents et notifications ---------------------------------------------------

create policy documents_owner_read on public.documents for select to authenticated
  using (visible_to_owner and owner_id = (select app.current_owner_id()));

create policy notifications_read_own on public.notifications for select to authenticated
  using (recipient_id = (select auth.uid()));
create policy notifications_update_own on public.notifications for update to authenticated
  using (recipient_id = (select auth.uid())) with check (recipient_id = (select auth.uid()));

-- Un destinataire ne peut que marquer ses notifications comme lues.
create or replace function app.notifications_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user = 'authenticated' and (
    (to_jsonb(new) - 'read_at') is distinct from (to_jsonb(old) - 'read_at')
  ) then
    raise exception 'Seule la lecture d''une notification peut être enregistrée.';
  end if;
  return new;
end;
$$;
create trigger notifications_guard before update on public.notifications
  for each row execute function app.notifications_guard();
