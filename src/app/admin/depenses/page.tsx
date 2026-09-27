import { FilterBar, FilterField, filterControl, param } from "@/components/app/FilterBar";
import { ActionForm, Checkbox, Field, FormGrid, Input, Select, SubmitButton, Textarea } from "@/components/app/form";
import { DataTable, DemoBadge, EmptyState, PageHeader, Panel, TextLink } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { addMonths, formatDateShort, startOfMonth, todayIso } from "@/lib/dates";
import { expenseCategory, optionsOf, textOf } from "@/lib/labels";
import { formatCents } from "@/lib/money";
import { propertyOptions } from "@/lib/options";

import { createExpense, deleteExpense } from "./actions";

export const metadata = { title: "Dépenses" };

export default async function ExpensesPage({ searchParams }: PageProps<"/admin/depenses">) {
  const { supabase } = await adminContext();
  const params = await searchParams;
  const property = param(params.bien);
  const category = param(params.categorie);
  const month = /^\d{4}-\d{2}$/.test(param(params.mois)) ? param(params.mois) : "";
  const single = param(params.id);

  let query = supabase
    .from("expenses")
    .select("id, label, category, amount_cents, incurred_on, paid_by, rebill_to_owner, supplier, statement_id, is_demo, property:properties(id, name)")
    .order("incurred_on", { ascending: false })
    .limit(300);
  if (single) query = query.eq("id", single);
  if (property) query = query.eq("property_id", property);
  if (category) query = query.eq("category", category);
  if (month) query = query.gte("incurred_on", `${month}-01`).lt("incurred_on", addMonths(`${month}-01`, 1));
  const [{ data: expenses }, properties] = await Promise.all([query, propertyOptions(supabase)]);
  const total = (expenses ?? []).reduce((sum, e) => sum + e.amount_cents, 0);
  const rebill = (expenses ?? []).filter((e) => e.rebill_to_owner).reduce((sum, e) => sum + e.amount_cents, 0);

  return (
    <>
      <PageHeader
        title="Dépenses"
        description="Frais engagés pour les biens. Ceux avancés par Comme à la Maison sont refacturés au propriétaire sur son relevé mensuel."
      />
      <Panel title="Ajouter une dépense" id="nouvelle">
        <ActionForm action={createExpense} resetOnSuccess className="flex flex-col gap-4">
          <FormGrid className="lg:grid-cols-3">
            <Field name="property_id" label="Bien" required>
              <Select options={properties} placeholder="Choisir…" defaultValue={property} required />
            </Field>
            <Field name="category" label="Catégorie">
              <Select options={optionsOf(expenseCategory)} defaultValue="supplies" />
            </Field>
            <Field name="incurred_on" label="Date" required>
              <Input type="date" defaultValue={todayIso()} required />
            </Field>
            <Field name="label" label="Libellé" required className="lg:col-span-2">
              <Input required placeholder="Consommables, ampoules, clé supplémentaire…" />
            </Field>
            <Field name="amount" label="Montant TTC (€)" required>
              <Input inputMode="decimal" required />
            </Field>
            <Field name="paid_by" label="Payé par">
              <Select
                options={[
                  { value: "company", label: "Comme à la Maison (avance)" },
                  { value: "owner", label: "Le propriétaire directement" },
                ]}
                defaultValue="company"
              />
            </Field>
            <Field name="supplier" label="Fournisseur">
              <Input />
            </Field>
          </FormGrid>
          <Checkbox name="rebill_to_owner" defaultChecked label="Refacturer au propriétaire (si avancé par Comme à la Maison)" hint="Apparaît dans les « frais avancés pour votre compte » du prochain relevé." />
          <Field name="notes" label="Notes">
            <Textarea rows={2} />
          </Field>
          <div>
            <SubmitButton>Ajouter la dépense</SubmitButton>
          </div>
        </ActionForm>
      </Panel>

      <FilterBar resetHref="/admin/depenses">
        <FilterField label="Mois" id="f-mois">
          <input id="f-mois" name="mois" type="month" defaultValue={month} className={filterControl} />
        </FilterField>
        <FilterField label="Bien" id="f-bien">
          <select id="f-bien" name="bien" defaultValue={property} className={filterControl}>
            <option value="">Tous</option>
            {properties.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Catégorie" id="f-categorie">
          <select id="f-categorie" name="categorie" defaultValue={category} className={filterControl}>
            <option value="">Toutes</option>
            {optionsOf(expenseCategory).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FilterField>
      </FilterBar>

      <p className="text-small text-ink-soft">
        {(expenses ?? []).length} dépense(s) · total {formatCents(total)} · dont {formatCents(rebill)} à refacturer ou refacturés.
        {month ? ` Mois : ${month}.` : ` Mois précédent : `}
        {!month ? <TextLink href={`/admin/depenses?mois=${addMonths(startOfMonth(todayIso()), -1).slice(0, 7)}`}>filtrer</TextLink> : null}
      </p>

      <DataTable
        caption="Liste des dépenses"
        rows={expenses ?? []}
        rowKey={(row) => row.id}
        empty={<EmptyState title="Aucune dépense." />}
        columns={[
          {
            header: "Dépense",
            cell: (row) => (
              <span className="flex flex-col">
                <span className="flex flex-wrap items-center gap-2 font-semibold">
                  {row.label}
                  {row.is_demo ? <DemoBadge /> : null}
                </span>
                <span className="text-small text-ink-soft">
                  {formatDateShort(row.incurred_on)} · {textOf(expenseCategory, row.category)} {row.supplier ? `· ${row.supplier}` : ""}
                </span>
              </span>
            ),
          },
          { header: "Bien", cell: (row) => (row.property ? <TextLink href={`/admin/biens/${row.property.id}`}>{row.property.name}</TextLink> : "—") },
          { header: "Montant", numeric: true, cell: (row) => formatCents(row.amount_cents) },
          {
            header: "Refacturation",
            cell: (row) =>
              row.paid_by === "owner" ? "Payé par le propriétaire" : row.rebill_to_owner ? (row.statement_id ? <TextLink href={`/admin/releves/${row.statement_id}`}>Refacturée</TextLink> : "À refacturer") : "Non refacturée",
          },
          {
            header: "Action",
            cell: (row) =>
              row.statement_id ? (
                <span className="text-small text-ink-soft">Verrouillée</span>
              ) : (
                <ActionForm action={deleteExpense.bind(null, row.id)} confirmMessage="Supprimer cette dépense ?">
                  <SubmitButton variant="ghost" pendingLabel="…">
                    Supprimer
                  </SubmitButton>
                </ActionForm>
              ),
          },
        ]}
      />
    </>
  );
}
