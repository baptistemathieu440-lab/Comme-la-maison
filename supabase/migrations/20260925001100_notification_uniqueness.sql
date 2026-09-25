-- Unicité (événement, destinataire, type) sur toute la table : les notifications sans
-- événement (event_id nul) restent libres, et l'upsert de l'application peut cibler cet index.
drop index if exists public.notifications_event_recipient_idx;
create unique index notifications_event_recipient_idx on public.notifications (event_id, recipient_id, kind);
