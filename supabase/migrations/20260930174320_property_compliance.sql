-- =============================================================================
-- Conformité des logements (meublés de tourisme)
--
-- Informations déclarées par le propriétaire et vérifiées par l'équipe : elles
-- servent au suivi, pas à certifier la conformité d'un logement. Le propriétaire
-- reste responsable de ses obligations (voir JURIDIQUE_A_FAIRE.md).
--
-- Aucune nouvelle table : ces colonnes suivent les règles d'accès de `properties`
-- (administrateurs ; le propriétaire pour ses propres biens ; l'agent affecté).
-- Les justificatifs se déposent dans `documents` (catégorie « Conformité »).
-- =============================================================================

alter table public.properties
  -- Limite de nuits propre à la commune du bien (résidence principale) ; sinon celle des paramètres.
  add column night_limit integer check (night_limit is null or night_limit between 0 and 366),
  add column change_of_use_status text not null default 'to_check'
    check (change_of_use_status in ('to_check', 'not_required', 'pending', 'granted', 'refused')),
  add column change_of_use_reference text,
  add column condo_rules_status text not null default 'to_check'
    check (condo_rules_status in ('to_check', 'not_applicable', 'allowed', 'forbidden')),
  add column owner_insurance text,
  add column owner_insurance_expires_on date,
  add column energy_class text check (energy_class is null or energy_class in ('A', 'B', 'C', 'D', 'E', 'F', 'G')),
  add column energy_diagnosis_on date,
  add column compliance_status text not null default 'to_check'
    check (compliance_status in ('to_check', 'in_progress', 'documents_received', 'issue')),
  add column compliance_checked_on date,
  add column compliance_notes text;

comment on column public.properties.night_limit is 'Nuits par an autorisées pour une résidence principale dans la commune du bien (vide : valeur des paramètres).';
comment on column public.properties.compliance_status is 'Suivi interne des justificatifs du propriétaire. Ne vaut pas attestation de conformité.';

-- Justificatifs de conformité (déclaration, enregistrement, autorisation, copropriété).
alter table public.documents drop constraint documents_category_check;
alter table public.documents add constraint documents_category_check
  check (category in ('contract', 'invoice', 'statement', 'receipt', 'identity', 'insurance', 'diagnostic', 'inventory', 'photo', 'compliance', 'other'));

-- La limite propre au bien remplace celle des paramètres.
create or replace function public.primary_residence_usage(p_year integer)
returns table (property_id uuid, nights integer, night_limit integer)
language sql
stable
security definer
set search_path = ''
as $$
  select p.id,
         coalesce((
           select sum(
             least(b.check_out, make_date(p_year + 1, 1, 1)) - greatest(b.check_in, make_date(p_year, 1, 1))
           )
           from public.bookings b
           where b.property_id = p.id
             and b.status in ('confirmed', 'in_progress', 'completed')
             and b.check_out > make_date(p_year, 1, 1)
             and b.check_in < make_date(p_year + 1, 1, 1)
         ), 0)::integer,
         coalesce(p.night_limit, (select s.primary_residence_night_limit from public.settings s where s.id))
  from public.properties p
  where p.is_primary_residence
    and (app.is_admin() or p.owner_id = app.current_owner_id())
$$;

revoke all on function public.primary_residence_usage(integer) from public, anon;
grant execute on function public.primary_residence_usage(integer) to authenticated;
