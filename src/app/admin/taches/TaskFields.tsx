import { Field, FormGrid, Input, Select, Textarea } from "@/components/app/form";
import { optionsOf, taskType } from "@/lib/labels";
import type { Option } from "@/lib/options";

export type TaskDefaults = {
  type?: string;
  property_id?: string;
  booking_id?: string | null;
  assignee_id?: string | null;
  title?: string;
  instructions?: string | null;
  due_date?: string;
  window_start?: string | null;
  window_end?: string | null;
  checklist?: string[];
};

export function TaskFields({ values = {}, properties, staff }: { values?: TaskDefaults; properties: Option[]; staff: Option[] }) {
  return (
    <>
      <FormGrid>
        <Field name="type" label="Type">
          <Select options={optionsOf(taskType)} defaultValue={values.type ?? "cleaning"} />
        </Field>
        <Field name="property_id" label="Bien" required>
          <Select options={properties} placeholder="Choisir…" defaultValue={values.property_id ?? ""} required />
        </Field>
        <Field name="due_date" label="Date" required>
          <Input type="date" defaultValue={values.due_date ?? ""} required />
        </Field>
        <Field name="assignee_id" label="Agent" hint="L’agent est prévenu dans son espace.">
          <Select options={staff} placeholder="À affecter plus tard" defaultValue={values.assignee_id ?? ""} />
        </Field>
        <Field name="window_start" label="À partir de">
          <Input type="time" defaultValue={values.window_start?.slice(0, 5) ?? ""} />
        </Field>
        <Field name="window_end" label="Terminé avant">
          <Input type="time" defaultValue={values.window_end?.slice(0, 5) ?? ""} />
        </Field>
        <Field name="title" label="Intitulé" hint="Vide : type et nom du bien." className="sm:col-span-2">
          <Input defaultValue={values.title ?? ""} />
        </Field>
      </FormGrid>
      <Field name="instructions" label="Consignes pour l’agent">
        <Textarea rows={3} defaultValue={values.instructions ?? ""} />
      </Field>
      <Field name="checklist" label="Liste de contrôle (une ligne par point)" hint="Vide pour un ménage : liste du bien ou liste par défaut.">
        <Textarea rows={6} defaultValue={(values.checklist ?? []).join("\n")} />
      </Field>
      {values.booking_id ? <input type="hidden" name="booking_id" value={values.booking_id} /> : null}
    </>
  );
}
