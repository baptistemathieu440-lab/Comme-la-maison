-- =============================================================================
-- Événements métier et journal d'activité : branchement des déclencheurs
-- =============================================================================

-- Réservations ---------------------------------------------------------------

create or replace function app.bookings_events()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    perform app.emit_event('booking.created', 'bookings', new.id,
      jsonb_build_object('status', new.status, 'property_id', new.property_id,
        'check_in', new.check_in, 'check_out', new.check_out), new.is_demo);
  elsif tg_op = 'UPDATE' then
    if new.status is distinct from old.status then
      perform app.emit_event('booking.status_changed', 'bookings', new.id,
        jsonb_build_object('from', old.status, 'to', new.status, 'property_id', new.property_id), new.is_demo);
    end if;
    if new.check_in is distinct from old.check_in or new.check_out is distinct from old.check_out
       or new.property_id is distinct from old.property_id then
      perform app.emit_event('booking.dates_changed', 'bookings', new.id,
        jsonb_build_object('property_id', new.property_id,
          'from', jsonb_build_object('check_in', old.check_in, 'check_out', old.check_out),
          'to', jsonb_build_object('check_in', new.check_in, 'check_out', new.check_out)), new.is_demo);
    end if;
  end if;
  return new;
end;
$$;

create trigger bookings_events after insert or update on public.bookings
  for each row execute function app.bookings_events();

-- Tâches -----------------------------------------------------------------------

create or replace function app.tasks_events()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' and new.assignee_id is not null then
    perform app.emit_event('task.assigned', 'tasks', new.id,
      jsonb_build_object('assignee_id', new.assignee_id, 'due_date', new.due_date), new.is_demo);
  elsif tg_op = 'UPDATE' then
    if new.status is distinct from old.status then
      perform app.emit_event('task.status_changed', 'tasks', new.id,
        jsonb_build_object('from', old.status, 'to', new.status, 'type', new.type, 'property_id', new.property_id), new.is_demo);
    end if;
    if new.assignee_id is distinct from old.assignee_id and new.assignee_id is not null then
      perform app.emit_event('task.assigned', 'tasks', new.id,
        jsonb_build_object('assignee_id', new.assignee_id, 'due_date', new.due_date), new.is_demo);
    end if;
  end if;
  return new;
end;
$$;

create trigger tasks_events after insert or update on public.tasks
  for each row execute function app.tasks_events();

-- Incidents, prospects, relevés ---------------------------------------------------

create or replace function app.incidents_events()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform app.emit_event('incident.created', 'incidents', new.id,
    jsonb_build_object('severity', new.severity, 'property_id', new.property_id), new.is_demo);
  return new;
end;
$$;
create trigger incidents_events after insert on public.incidents
  for each row execute function app.incidents_events();

create or replace function app.prospects_events()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform app.emit_event('prospect.created', 'prospects', new.id,
    jsonb_build_object('source', new.source), new.is_demo);
  return new;
end;
$$;
create trigger prospects_events after insert on public.prospects
  for each row execute function app.prospects_events();

create or replace function app.statements_events()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.status = 'draft' and new.status = 'final' then
    perform app.emit_event('statement.finalized', 'owner_statements', new.id,
      jsonb_build_object('owner_id', new.owner_id, 'number', new.number, 'period_month', new.period_month), new.is_demo);
  end if;
  return new;
end;
$$;
create trigger owner_statements_events after update on public.owner_statements
  for each row execute function app.statements_events();

-- Journal d'activité -----------------------------------------------------------------

do $$
declare
  t text;
begin
  foreach t in array array[
    'settings', 'user_roles', 'contacts', 'owners', 'guests', 'providers', 'prospects', 'properties',
    'property_access', 'contracts', 'listings', 'bookings', 'calendar_blocks', 'tasks', 'incidents',
    'maintenance_jobs', 'expenses', 'owner_statements', 'payments', 'documents', 'invitations',
    'automation_rules'
  ] loop
    execute format(
      'create trigger %I after insert or update or delete on public.%I for each row execute function app.audit()',
      t || '_audit', t
    );
  end loop;
end;
$$;
