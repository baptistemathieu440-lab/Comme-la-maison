-- =============================================================================
-- Mise à jour automatique des statuts de réservation (confirmée → en cours → terminée) :
-- appelée uniquement par la tâche planifiée, côté serveur, avec la clé de service.
-- Par précaution, les comptes connectés (même administrateurs) ne peuvent plus
-- l'appeler directement ; la fonction garde aussi sa vérification interne.
-- =============================================================================

revoke execute on function public.roll_booking_statuses() from authenticated;
grant execute on function public.roll_booking_statuses() to service_role;
