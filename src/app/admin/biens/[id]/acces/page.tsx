import { ActionForm, Field, FormActions, FormGrid, Input, SubmitButton, Textarea } from "@/components/app/form";
import { Notice, Panel } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { formatDateTime } from "@/lib/dates";

import { saveAccess } from "../../actions";

export const metadata = { title: "Accès au logement" };

export default async function AccessPage({ params }: PageProps<"/admin/biens/[id]/acces">) {
  const { id } = await params;
  const { supabase } = await adminContext();
  const { data: access } = await supabase.from("property_access").select("*").eq("property_id", id).maybeSingle();

  return (
    <>
      <Notice tone="warning" title="Informations sensibles">
        Ces codes sont visibles des administrateurs et, uniquement le jour de sa tâche, de l’agent affecté. Ils ne
        sont jamais montrés aux propriétaires ni aux voyageurs, et n’apparaissent pas en clair dans le journal
        d’activité.
      </Notice>
      <Panel as="div">
        <ActionForm action={saveAccess.bind(null, id)} className="flex flex-col gap-4">
          <FormGrid>
            <Field name="door_code" label="Code de la porte">
              <Input defaultValue={access?.door_code ?? ""} autoComplete="off" />
            </Field>
            <Field name="alarm_code" label="Code de l’alarme">
              <Input defaultValue={access?.alarm_code ?? ""} autoComplete="off" />
            </Field>
            <Field name="key_box_code" label="Code de la boîte à clés">
              <Input defaultValue={access?.key_box_code ?? ""} autoComplete="off" />
            </Field>
            <Field name="key_box_location" label="Emplacement de la boîte à clés">
              <Input defaultValue={access?.key_box_location ?? ""} />
            </Field>
            <Field name="wifi_name" label="Nom du wifi">
              <Input defaultValue={access?.wifi_name ?? ""} autoComplete="off" />
            </Field>
            <Field name="wifi_password" label="Mot de passe du wifi">
              <Input defaultValue={access?.wifi_password ?? ""} autoComplete="off" />
            </Field>
          </FormGrid>
          <Field name="parking_info" label="Stationnement">
            <Textarea rows={2} defaultValue={access?.parking_info ?? ""} />
          </Field>
          <Field name="access_instructions" label="Instructions d’accès">
            <Textarea defaultValue={access?.access_instructions ?? ""} />
          </Field>
          <FormActions>
            <SubmitButton>Enregistrer les accès</SubmitButton>
            {access?.updated_at ? (
              <span className="text-small text-ink-soft">Dernière modification : {formatDateTime(access.updated_at)}</span>
            ) : null}
          </FormActions>
        </ActionForm>
      </Panel>
    </>
  );
}
