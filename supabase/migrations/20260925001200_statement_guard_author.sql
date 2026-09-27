-- Un relevé finalisé reste figé, à une exception : l'auteur de la finalisation
-- peut être effacé (null) quand son compte est supprimé.
create or replace function app.statement_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  mutable text[] := array['status', 'sent_at', 'paid_at', 'pdf_path', 'notes', 'updated_at', 'finalized_by'];
begin
  if tg_op = 'DELETE' then
    if old.status <> 'draft' and current_setting('app.purging_demo', true) is distinct from 'on' then
      raise exception 'Un relevé finalisé ne peut pas être supprimé.';
    end if;
    return old;
  end if;
  if old.status <> 'draft' then
    if (to_jsonb(new) - mutable) is distinct from (to_jsonb(old) - mutable) then
      raise exception 'Un relevé finalisé ne peut plus être modifié.';
    end if;
    if new.finalized_by is distinct from old.finalized_by and new.finalized_by is not null then
      raise exception 'L''auteur de la finalisation ne peut pas être changé.';
    end if;
    if new.status = 'draft' then
      raise exception 'Un relevé finalisé ne peut pas redevenir un brouillon.';
    end if;
  end if;
  return new;
end;
$$;
