-- =============================================================================
-- Stockage des fichiers : quatre espaces privés, jamais d'adresse publique.
-- Les propriétaires et les agents obtiennent des liens temporaires signés par le
-- serveur, après vérification de leurs droits sur la ligne correspondante
-- (documents, photos de tâche…), elle-même protégée par les règles d'accès.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('property-photos', 'property-photos', false, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('field-photos', 'field-photos', false, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('documents', 'documents', false, 20971520, array[
    'application/pdf', 'image/jpeg', 'image/png', 'image/webp',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain', 'text/csv'
  ]),
  ('statements', 'statements', false, 5242880, array['application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy platform_files_admin_all on storage.objects for all to authenticated
  using (bucket_id in ('property-photos', 'field-photos', 'documents', 'statements') and (select app.is_admin()))
  with check (bucket_id in ('property-photos', 'field-photos', 'documents', 'statements') and (select app.is_admin()));
