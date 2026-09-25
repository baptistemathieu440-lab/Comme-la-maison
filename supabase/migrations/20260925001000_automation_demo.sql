-- =============================================================================
-- Règles d'automatisation et données de démonstration
-- =============================================================================

insert into public.automation_rules (key, name, description, event_type, enabled, config) values
  ('booking_cleaning_task', 'Ménage à chaque départ',
   'Crée une tâche de ménage le jour du départ de chaque réservation confirmée, avec la liste de contrôle du bien.',
   'booking.confirmed', true, '{}'),
  ('booking_cancel_tasks', 'Annulation des tâches',
   'Annule les tâches non commencées d''une réservation annulée.',
   'booking.cancelled', true, '{}'),
  ('booking_move_tasks', 'Changement de dates',
   'Déplace la tâche de ménage non commencée quand les dates d''une réservation changent.',
   'booking.dates_changed', true, '{}'),
  ('booking_notify', 'Nouvelles réservations et annulations',
   'Prévient les administrateurs et le propriétaire du bien d''une réservation confirmée ou annulée.',
   'booking.status_changed', true, '{}'),
  ('primary_residence_limit', 'Limite de location des résidences principales',
   'Alerte les administrateurs quand une résidence principale approche de la limite annuelle de nuits louées.',
   'booking.confirmed', true, '{"warn_before": 10}'),
  ('task_assigned_notify', 'Nouvelle tâche pour un agent',
   'Prévient l''agent quand une tâche lui est confiée.',
   'task.assigned', true, '{}'),
  ('task_done_notify', 'Tâche terminée à valider',
   'Prévient les administrateurs quand un agent termine une tâche.',
   'task.status_changed', true, '{}'),
  ('incident_notify', 'Alerte incident',
   'Prévient les administrateurs d''un incident, et le propriétaire si l''incident est grave et visible par lui.',
   'incident.created', true, '{}'),
  ('prospect_notify', 'Nouvelle demande d''estimation',
   'Prévient les administrateurs quand le formulaire du site crée un prospect.',
   'prospect.created', true, '{}'),
  ('statement_notify', 'Relevé disponible',
   'Prévient le propriétaire quand son relevé mensuel est finalisé.',
   'statement.finalized', true, '{}'),
  ('sync_conflict_notify', 'Conflit de calendrier',
   'Prévient les administrateurs quand une synchronisation détecte un chevauchement.',
   'sync.conflict', true, '{}'),
  ('booking_status_rollover', 'Statuts des réservations',
   'Chaque jour, passe les réservations « en cours » puis « terminées » selon leurs dates.',
   'schedule.daily', true, '{}'),
  ('monthly_statements', 'Brouillons des relevés mensuels',
   'Le 1er de chaque mois, prépare le brouillon du relevé du mois écoulé pour chaque propriétaire qui a eu une activité.',
   'schedule.monthly', true, '{}');

-- -----------------------------------------------------------------------------
-- Données de démonstration : clairement marquées (is_demo, « Démo » dans les noms),
-- créées et supprimées en un clic depuis les paramètres.
-- -----------------------------------------------------------------------------

create or replace function public.seed_demo_data()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  today date := app.today();
  first_names text[] := array['Camille', 'Louis', 'Emma', 'Hugo', 'Léa', 'Arthur', 'Chloé', 'Jules', 'Manon', 'Nathan', 'Inès', 'Gabriel'];
  checklist jsonb;
  owner_jean uuid; owner_claire uuid; owner_paul uuid;
  prop uuid;
  props uuid[] := array[]::uuid[];
  prop_names text[] := array['Démo · T2 Chartrons', 'Démo · Studio Saint-Pierre', 'Démo · Maison Caudéran', 'Démo · T3 La Bastide', 'Démo · Appartement Talence'];
  prices integer[] := array[9500, 6800, 17500, 11500, 8900];
  cleaning integer[] := array[5500, 4000, 9000, 6500, 5000];
  types text[] := array['apartment', 'studio', 'house', 'apartment', 'apartment'];
  cities text[] := array['Bordeaux', 'Bordeaux', 'Bordeaux', 'Bordeaux', 'Talence'];
  owners_of uuid[];
  i integer; k integer;
  d date; n integer; gap integer;
  platform text; fee_bps integer;
  guest uuid; contact uuid; booking uuid; st text;
  booking_count integer := 0;
  prov_plumber uuid; prov_cleaning uuid;
  incident uuid;
  statement uuid;
  prospect uuid;
  prospect_names text[][] := array[['Sophie', 'new', 'Bordeaux'], ['Marc', 'contacted', 'Mérignac'], ['Inès', 'meeting', 'Pessac'], ['Thomas', 'proposal_sent', 'Bègles'], ['Julie', 'lost', 'Le Bouscat']];
begin
  perform app.require_trusted_caller();

  if exists (select 1 from public.properties where is_demo) or exists (select 1 from public.owners where is_demo) then
    raise exception 'Des données de démonstration existent déjà. Supprimez-les avant d''en créer de nouvelles.';
  end if;

  select default_cleaning_checklist into checklist from public.settings where id;

  -- Propriétaires.
  insert into public.contacts (first_name, last_name, email, phone, address_line, postal_code, city, is_demo, notes)
  values ('Jean', 'Démo', 'jean.demo@example.com', '06 00 00 00 01', 'Adresse de démonstration', '33000', 'Bordeaux', true, 'Contact de démonstration.')
  returning id into contact;
  insert into public.owners (contact_id, status, is_demo, iban_last4, notes)
  values (contact, 'active', true, '0001', 'Propriétaire de démonstration.') returning id into owner_jean;

  insert into public.contacts (first_name, last_name, email, phone, address_line, postal_code, city, is_demo)
  values ('Claire', 'Démo', 'claire.demo@example.com', '06 00 00 00 02', 'Adresse de démonstration', '33700', 'Mérignac', true)
  returning id into contact;
  insert into public.owners (contact_id, status, is_demo) values (contact, 'active', true) returning id into owner_claire;

  insert into public.contacts (first_name, last_name, email, phone, address_line, postal_code, city, is_demo)
  values ('Paul', 'Démo', 'paul.demo@example.com', '06 00 00 00 03', 'Adresse de démonstration', '33400', 'Talence', true)
  returning id into contact;
  insert into public.owners (contact_id, status, is_demo) values (contact, 'onboarding', true) returning id into owner_paul;

  owners_of := array[owner_jean, owner_jean, owner_claire, owner_claire, owner_paul];

  -- Biens, annonces, accès.
  for i in 1..5 loop
    insert into public.properties (
      owner_id, name, status, property_type, address_line, postal_code, city, surface_m2, bedrooms, beds,
      bathrooms, capacity, description, default_cleaning_fee_cents, is_primary_residence, registration_number, is_demo
    ) values (
      owners_of[i], prop_names[i], case when i = 5 then 'onboarding' else 'active' end, types[i],
      'Adresse de démonstration', case when i = 5 then '33400' else '33000' end, cities[i],
      (array[42, 24, 110, 68, 55])[i], (array[1, 0, 3, 2, 1])[i], (array[2, 1, 4, 3, 2])[i], 1, (array[4, 2, 7, 5, 4])[i],
      'Bien de démonstration : aucune donnée réelle.', cleaning[i], i = 2,
      case when i < 5 then 'DEMO-' || lpad(i::text, 5, '0') end, true
    ) returning id into prop;
    props := props || prop;

    insert into public.listings (property_id, platform_id, external_id, is_demo)
    values (prop, 'airbnb', 'demo-airbnb-' || i, true), (prop, 'booking', 'demo-booking-' || i, true);

    if i in (1, 3) then
      insert into public.property_access (property_id, door_code, key_box_code, key_box_location, wifi_name, wifi_password, access_instructions, is_demo)
      values (prop, 'DEMO-1234', 'DEMO-5678', 'Boîte à clés à droite de la porte (démo)', 'Wifi-Demo', 'demo-wifi', 'Instructions de démonstration.', true);
    end if;
  end loop;

  insert into public.contracts (owner_id, property_id, reference, status, start_date, signed_on, commission_rate_bps, is_demo)
  values
    (owner_jean, props[1], 'DEMO-C-001', 'active', today - 120, today - 125, 2000, true),
    (owner_claire, props[3], 'DEMO-C-002', 'active', today - 90, today - 92, 2000, true);

  -- Réservations et ménages sur cinq mois (deux passés, le mois en cours, deux à venir).
  for i in 1..4 loop
    d := (date_trunc('month', today) - interval '2 months')::date + (i - 1) * 2;
    k := 0;
    while d < today + 60 loop
      k := k + 1;
      n := 2 + ((i * 7 + k * 3) % 4);
      gap := 1 + ((i * 5 + k) % 4);
      platform := case (i + k) % 3 when 0 then 'booking' when 1 then 'airbnb' else 'direct' end;
      fee_bps := case platform when 'booking' then 1700 when 'airbnb' then 300 else 0 end;
      st := case
        when k % 11 = 0 then 'cancelled'
        when d + n <= today then 'completed'
        when d <= today then 'in_progress'
        else 'confirmed'
      end;

      insert into public.contacts (first_name, last_name, is_demo)
      values (first_names[1 + ((i * 3 + k) % array_length(first_names, 1))], 'Démo', true)
      returning id into contact;
      insert into public.guests (contact_id, is_demo) values (contact, true) returning id into guest;

      insert into public.bookings (
        property_id, listing_id, platform_id, guest_id, status, source, check_in, check_out, adults, children,
        nights_amount_cents, platform_fee_cents, cleaning_fee_cents, tourist_tax_cents, external_ref, is_demo
      ) values (
        props[i],
        (select l.id from public.listings l where l.property_id = props[i] and l.platform_id = platform),
        platform, guest, st, 'manual', d, d + n, 2, case when k % 4 = 0 then 1 else 0 end,
        case when st = 'cancelled' then 0 else prices[i] * n end,
        case when st = 'cancelled' then 0 else round(prices[i] * n * fee_bps / 10000.0)::integer end,
        case when st = 'cancelled' then 0 else cleaning[i] end,
        case when st = 'cancelled' then 0 else 2 * n * 250 end,
        'DEMO-' || i || '-' || k, true
      ) returning id into booking;
      booking_count := booking_count + 1;

      if st <> 'cancelled' then
        insert into public.tasks (
          type, status, property_id, booking_id, title, due_date, window_start, window_end, checklist,
          created_by_rule, is_demo
        ) values (
          'cleaning',
          case when d + n < today then 'validated' else 'todo' end,
          props[i], booking, 'Ménage · ' || prop_names[i], d + n, '11:00', '16:00',
          (select coalesce(jsonb_agg(jsonb_build_object('label', item, 'done', d + n < today)), '[]'::jsonb)
           from jsonb_array_elements_text(checklist) item),
          'booking_cleaning_task', true
        );
      end if;

      d := d + n + gap;
    end loop;
  end loop;

  -- Une demande en attente et un séjour du propriétaire.
  insert into public.contacts (first_name, last_name, is_demo) values ('Gabriel', 'Démo', true) returning id into contact;
  insert into public.guests (contact_id, is_demo) values (contact, true) returning id into guest;
  insert into public.bookings (property_id, platform_id, guest_id, status, source, check_in, check_out, adults,
    nights_amount_cents, is_demo, internal_notes)
  values (props[3], 'direct', guest, 'inquiry', 'website', today + 75, today + 79, 4, prices[3] * 4, true,
    'Demande de démonstration en attente de réponse.');

  insert into public.calendar_blocks (property_id, kind, start_date, end_date, summary, is_demo)
  values (props[3], 'owner_stay', today + 64, today + 70, 'Séjour du propriétaire (démo)', true);

  -- Prestataires, incidents, intervention.
  insert into public.contacts (first_name, last_name, company_name, phone, is_demo)
  values ('', '', 'Plomberie Démo', '05 00 00 00 01', true) returning id into contact;
  insert into public.providers (contact_id, trade, is_demo) values (contact, 'Plomberie', true) returning id into prov_plumber;
  insert into public.contacts (first_name, last_name, company_name, phone, is_demo)
  values ('', '', 'Pressing Démo', '05 00 00 00 02', true) returning id into contact;
  insert into public.providers (contact_id, trade, is_demo) values (contact, 'Blanchisserie', true) returning id into prov_cleaning;

  insert into public.incidents (property_id, title, description, severity, status, is_demo)
  values (props[1], 'Fuite sous l''évier (démo)', 'Incident de démonstration : petite fuite constatée pendant le ménage.', 'high', 'in_progress', true)
  returning id into incident;
  insert into public.maintenance_jobs (property_id, incident_id, provider_id, title, status, scheduled_on, cost_cents, is_demo)
  values (props[1], incident, prov_plumber, 'Remplacement du joint de l''évier (démo)', 'planned', today + 2, 12000, true);
  insert into public.incidents (property_id, title, description, severity, status, resolution, is_demo)
  values (props[3], 'Ampoule grillée dans la chambre (démo)', 'Incident de démonstration.', 'low', 'resolved', 'Ampoule remplacée.', true);

  -- Dépenses.
  insert into public.expenses (property_id, category, label, amount_cents, incurred_on, paid_by, rebill_to_owner, supplier, is_demo)
  values
    (props[1], 'supplies', 'Consommables : café, thé, savon (démo)', 3450, (date_trunc('month', today) - interval '1 month')::date + 5, 'company', true, 'Fournisseur démo', true),
    (props[3], 'repair', 'Remplacement d''ampoules (démo)', 890, (date_trunc('month', today) - interval '1 month')::date + 12, 'company', true, null, true),
    (props[2], 'linen', 'Parure de draps (démo)', 7900, (date_trunc('month', today) - interval '2 months')::date + 3, 'owner', false, null, true);

  -- Prospects.
  for i in 1..5 loop
    insert into public.contacts (first_name, last_name, email, phone, city, is_demo)
    values (prospect_names[i][1], 'Démo', lower(prospect_names[i][1]) || '.demo@example.com', '06 00 00 01 0' || i, prospect_names[i][3], true)
    returning id into contact;
    insert into public.prospects (contact_id, status, source, property_city, property_type, bedrooms, message, next_action, next_action_on, lost_reason, is_demo)
    values (
      contact, prospect_names[i][2], case when i % 2 = 0 then 'phone' else 'website' end, prospect_names[i][3],
      (array['Appartement', 'Maison', 'Studio', 'Appartement', 'Maison'])[i], (array['2', '3', 'Studio', '1', '4'])[i],
      'Demande de démonstration.',
      case prospect_names[i][2] when 'new' then 'Rappeler pour qualifier la demande' when 'meeting' then 'Visite du logement' when 'proposal_sent' then 'Relancer la proposition' end,
      case when prospect_names[i][2] in ('new', 'meeting', 'proposal_sent') then today + i end,
      case when prospect_names[i][2] = 'lost' then 'A choisi de gérer seul (démo)' end,
      true
    ) returning id into prospect;
    insert into public.prospect_activities (prospect_id, kind, content, is_demo)
    values (prospect, 'note', 'Premier échange de démonstration.', true);
  end loop;

  -- Relevés : finalisé il y a deux mois (avec règlement), brouillon le mois dernier.
  statement := public.generate_statement(owner_jean, (date_trunc('month', today) - interval '2 months')::date);
  perform public.finalize_statement(statement);
  insert into public.payments (statement_id, amount_cents, paid_on, method, reference, is_demo)
  select statement, total_due_cents, today - 20, 'transfer', 'DEMO-VIR-001', true
  from public.owner_statements where id = statement and total_due_cents > 0;
  perform public.generate_statement(owner_jean, (date_trunc('month', today) - interval '1 month')::date);
  perform public.generate_statement(owner_claire, (date_trunc('month', today) - interval '1 month')::date);

  -- Les événements créés par la démonstration ne déclenchent pas de notifications.
  update public.domain_events set processed_at = now() where is_demo and processed_at is null;

  return jsonb_build_object('owners', 3, 'properties', 5, 'bookings', booking_count + 1);
end;
$$;

create or replace function public.purge_demo_data()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  removed_bookings integer;
begin
  perform app.require_trusted_caller();
  perform set_config('app.purging_demo', 'on', true);

  delete from public.notifications where is_demo;
  delete from public.payments where is_demo;
  update public.bookings set statement_id = null where is_demo;
  update public.expenses set statement_id = null where is_demo;
  delete from public.statement_lines where is_demo;
  delete from public.owner_statements where is_demo;
  delete from public.invoice_counters where prefix = 'DEMO';
  delete from public.documents where is_demo;
  delete from public.expenses where is_demo;
  delete from public.maintenance_jobs where is_demo;
  delete from public.incident_photos where is_demo;
  delete from public.incidents where is_demo;
  delete from public.task_photos where is_demo;
  delete from public.tasks where is_demo;
  delete from public.calendar_blocks where is_demo;
  delete from public.bookings where is_demo;
  get diagnostics removed_bookings = row_count;
  delete from public.guests where is_demo;
  delete from public.sync_runs where is_demo;
  delete from public.listings where is_demo;
  delete from public.property_access where is_demo;
  delete from public.property_photos where is_demo;
  delete from public.contracts where is_demo;
  delete from public.properties where is_demo;
  delete from public.prospect_activities where is_demo;
  delete from public.prospects where is_demo;
  delete from public.invitations where owner_id in (select id from public.owners where is_demo);
  delete from public.owners where is_demo;
  delete from public.providers where is_demo;
  delete from public.contacts where is_demo;
  delete from public.domain_events where is_demo;
  delete from public.audit_logs where is_demo;

  perform set_config('app.purging_demo', 'off', true);
  return jsonb_build_object('bookings', removed_bookings);
end;
$$;

revoke all on function public.seed_demo_data() from public, anon;
revoke all on function public.purge_demo_data() from public, anon;
grant execute on function public.seed_demo_data() to authenticated, service_role;
grant execute on function public.purge_demo_data() to authenticated, service_role;
