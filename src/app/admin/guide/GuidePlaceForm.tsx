import { ActionForm, Checkbox, Field, Fieldset, FormActions, FormGrid, Input, Select, SubmitButton, Textarea } from "@/components/app/form";
import type { ActionState } from "@/lib/action-state";
import {
  audienceKeys,
  audiences,
  bookingKeys,
  bookings,
  budgetKeys,
  budgets,
  kindKeys,
  kinds,
  settingKeys,
  settings,
  statusKeys,
  statuses,
  tagKeys,
  tags,
  wineRegionKeys,
  wineRegions,
  zoneKeys,
  zones,
} from "@/lib/guide/taxonomy";
import type { Database } from "@/lib/supabase/database.types";

type Values = Partial<Database["public"]["Tables"]["guide_places"]["Row"]>;

const subcategories = [
  "Cuisine bordelaise",
  "Petit budget",
  "Bon rapport qualité/prix",
  "Bistrot",
  "Poissons et fruits de mer",
  "Gastronomique",
  "Brunch et café",
  "Burgers et street-food",
  "Street-food et cantine",
  "Italien",
  "Asiatique",
  "Végétarien",
  "Restaurant romantique",
  "Terrasse avec vue",
  "Restaurant avec vue",
  "Adresse originale",
  "Bar à vin",
  "Bar à cocktails",
  "Bar à bières",
  "Rooftop",
  "Bar animé",
  "Bar tranquille",
  "Bar insolite",
  "Musée",
  "Concerts",
  "Comedy club",
  "Spectacles",
  "Escape game",
  "Bowling et karting",
  "Balade en bateau",
  "Visite de château",
  "Atelier dégustation",
  "Excursion organisée",
  "Village et vignoble",
  "Plage océane",
  "Station balnéaire",
  "Parc",
  "Marché",
  "Spécialités et souvenirs",
  "Brocante et antiquités",
];

function num(value: number | null | undefined) {
  return value === null || value === undefined ? "" : String(value);
}

/** Fiche d'une adresse du guide voyageurs (création et modification). */
export function GuidePlaceForm({
  action,
  values = {},
  submitLabel,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  values?: Values;
  submitLabel: string;
}) {
  const checkedAudiences = new Set(values.audiences ?? []);
  const checkedTags = new Set(values.tags ?? []);
  return (
    <ActionForm action={action} className="flex flex-col gap-6">
      <Fieldset legend="Le lieu">
        <FormGrid>
          <Field name="name" label="Nom" required>
            <Input defaultValue={values.name ?? ""} required maxLength={120} />
          </Field>
          <Field name="slug" label="Identifiant dans l’adresse web" hint="Laissez vide : il est créé à partir du nom. Évitez de le changer ensuite (liens partagés).">
            <Input defaultValue={values.slug ?? ""} maxLength={80} placeholder="cafe-du-port" />
          </Field>
          <Field name="kind" label="Catégorie" required>
            <Select defaultValue={values.kind ?? "restaurant"} options={kindKeys.map((key) => ({ value: key, label: kinds[key].label }))} />
          </Field>
          <Field name="subcategory" label="Sous-catégorie" hint="Sert à regrouper les adresses (ex. « Bar à vin », « Brunch et café »).">
            <Input defaultValue={values.subcategory ?? ""} list="guide-sous-categories" maxLength={80} />
          </Field>
          <Field name="wine_region" label="Vignoble" hint="Pour la rubrique « Vins de Bordeaux » uniquement.">
            <Select defaultValue={values.wine_region ?? ""} placeholder="—" options={wineRegionKeys.map((key) => ({ value: key, label: wineRegions[key].label }))} />
          </Field>
          <Field name="status" label="Statut d’ouverture">
            <Select defaultValue={values.status ?? "ouvert"} options={statusKeys.map((key) => ({ value: key, label: statuses[key].label }))} />
          </Field>
        </FormGrid>
        <datalist id="guide-sous-categories">
          {subcategories.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>
        <div className="flex flex-col gap-3">
          <Checkbox name="is_published" defaultChecked={values.is_published ?? true} label="Visible dans le guide" hint="Décochez pour masquer l’adresse sans la supprimer." />
          <Checkbox name="is_favorite" defaultChecked={values.is_favorite ?? false} label="Coup de cœur de Comme à la Maison" />
        </div>
      </Fieldset>

      <Fieldset legend="Les textes">
        <Field name="summary" label="Pourquoi on vous le recommande" required hint="2 à 4 lignes, sur le ton d’un ami qui connaît Bordeaux.">
          <Textarea defaultValue={values.summary ?? ""} rows={4} maxLength={700} required />
        </Field>
        <Field name="tip" label="Notre petit conseil" hint="Facultatif. Ex. « Allez-y plutôt en fin d’après-midi pour profiter de l’ambiance. »">
          <Textarea defaultValue={values.tip ?? ""} rows={2} maxLength={400} />
        </Field>
        <Field name="good_to_know" label="Bon à savoir" hint="Informations pratiques : fermetures, accès, conseils.">
          <Textarea defaultValue={values.good_to_know ?? ""} rows={3} maxLength={700} />
        </Field>
        <FormGrid>
          <Field name="highlights" label="À voir sur place" hint="Excursions : les principales choses à voir.">
            <Textarea defaultValue={values.highlights ?? ""} rows={3} maxLength={700} />
          </Field>
          <Field name="where_to_eat" label="Où manger" hint="Excursions : restaurant ou type d’adresse conseillé.">
            <Textarea defaultValue={values.where_to_eat ?? ""} rows={3} maxLength={400} />
          </Field>
        </FormGrid>
      </Fieldset>

      <Fieldset legend="Budget, public et filtres">
        <FormGrid>
          <Field name="budget" label="Budget indicatif par personne" required>
            <Select
              defaultValue={String(values.budget ?? 1)}
              options={budgetKeys.map((key) => ({ value: String(key), label: key === 0 ? "Gratuit" : `${budgets[key].symbol} (${budgets[key].detail})` }))}
            />
          </Field>
          <Field name="price_note" label="Prix vérifié" hint="Uniquement un prix lu sur une source datée. Ex. « Entrée 20 € adulte ».">
            <Input defaultValue={values.price_note ?? ""} maxLength={200} />
          </Field>
          <Field name="zone" label="Distance depuis le centre">
            <Select defaultValue={values.zone ?? "centre"} options={zoneKeys.map((key) => ({ value: key, label: zones[key].label }))} />
          </Field>
          <Field name="setting" label="Intérieur ou extérieur" hint="Sert au filtre météo.">
            <Select defaultValue={values.setting ?? "mixte"} options={settingKeys.map((key) => ({ value: key, label: settings[key].label }))} />
          </Field>
        </FormGrid>
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-[0.9375rem] font-semibold text-ink">Pour qui ?</legend>
          <div className="grid gap-2 sm:grid-cols-4">
            {audienceKeys.map((key) => (
              <Checkbox key={key} name="audiences" value={key} defaultChecked={checkedAudiences.has(key)} label={audiences[key].label} />
            ))}
          </div>
        </fieldset>
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-[0.9375rem] font-semibold text-ink">Étiquettes</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {tagKeys.map((key) => (
              <Checkbox key={key} name="tags" value={key} defaultChecked={checkedTags.has(key)} label={tags[key].label} />
            ))}
          </div>
        </fieldset>
      </Fieldset>

      <Fieldset legend="Informations pratiques">
        <FormGrid>
          <Field name="area" label="Quartier ou commune" required>
            <Input defaultValue={values.area ?? "Bordeaux"} maxLength={120} required />
          </Field>
          <Field name="address" label="Adresse">
            <Input defaultValue={values.address ?? ""} maxLength={200} />
          </Field>
          <Field name="lat" label="Latitude" hint="Pour la carte. Ex. 44.8412 (clic droit sur Google Maps pour la copier).">
            <Input defaultValue={num(values.lat)} inputMode="decimal" />
          </Field>
          <Field name="lng" label="Longitude" hint="Ex. -0.5725">
            <Input defaultValue={num(values.lng)} inputMode="decimal" />
          </Field>
          <Field name="hours" label="Horaires" hint="Laissez vide si non vérifiés : le guide invite à consulter le site officiel.">
            <Input defaultValue={values.hours ?? ""} maxLength={300} />
          </Field>
          <Field name="booking" label="Réservation">
            <Select defaultValue={values.booking ?? "non"} options={bookingKeys.map((key) => ({ value: key, label: bookings[key].label }))} />
          </Field>
          <Field name="travel_time" label="Temps de trajet depuis Bordeaux" hint="Ex. « Environ 50 min en voiture ».">
            <Input defaultValue={values.travel_time ?? ""} maxLength={160} />
          </Field>
          <Field name="duration" label="Durée conseillée">
            <Input defaultValue={values.duration ?? ""} maxLength={160} />
          </Field>
          <Field name="best_period" label="Période idéale">
            <Input defaultValue={values.best_period ?? ""} maxLength={160} />
          </Field>
          <Field name="car_needed" label="Voiture nécessaire ?">
            <Select
              defaultValue={values.car_needed === true ? "oui" : values.car_needed === false ? "non" : ""}
              placeholder="Non précisé"
              options={[
                { value: "oui", label: "Oui, voiture conseillée" },
                { value: "non", label: "Non, accessible sans voiture" },
              ]}
            />
          </Field>
        </FormGrid>
        <Field name="transport" label="Comment y aller" hint="Train, tram, bateau, parking…">
          <Textarea defaultValue={values.transport ?? ""} rows={2} maxLength={300} />
        </Field>
      </Fieldset>

      <Fieldset legend="Liens">
        <FormGrid>
          <Field name="website_url" label="Site officiel">
            <Input type="url" defaultValue={values.website_url ?? ""} placeholder="https://" />
          </Field>
          <Field name="booking_url" label="Lien de réservation" hint="Affiche le bouton « Réserver ».">
            <Input type="url" defaultValue={values.booking_url ?? ""} placeholder="https://" />
          </Field>
          <Field name="maps_url" label="Lien Google Maps" hint="Facultatif : sinon, une recherche sur le nom et l’adresse.">
            <Input type="url" defaultValue={values.maps_url ?? ""} placeholder="https://maps.app.goo.gl/…" />
          </Field>
        </FormGrid>
      </Fieldset>

      <Fieldset legend="Note publique">
        <p className="text-small text-ink-soft">
          À recopier depuis la fiche Google Maps ou Tripadvisor le jour de la vérification. Une note n’est jamais affichée sans sa source.
        </p>
        <FormGrid className="sm:grid-cols-3">
          <Field name="rating" label="Note sur 5">
            <Input defaultValue={num(values.rating)} inputMode="decimal" placeholder="4,6" />
          </Field>
          <Field name="rating_count" label="Nombre d’avis">
            <Input defaultValue={num(values.rating_count)} inputMode="numeric" />
          </Field>
          <Field name="rating_source" label="Source">
            <Input defaultValue={values.rating_source ?? ""} list="guide-sources-note" maxLength={60} />
          </Field>
        </FormGrid>
        <datalist id="guide-sources-note">
          <option value="Google" />
          <option value="Tripadvisor" />
        </datalist>
      </Fieldset>

      <Fieldset legend="Photo">
        <FormGrid>
          <Field name="photo_alt" label="Description de la photo" hint="Pour les personnes aveugles et pour Google.">
            <Input defaultValue={values.photo_alt ?? ""} maxLength={200} />
          </Field>
          <Field name="photo_credit" label="Crédit et licence" hint="Ex. « Photo : Château X (autorisation du 12/09/2026) » ou « Nom, CC BY-SA 4.0 ».">
            <Input defaultValue={values.photo_credit ?? ""} maxLength={200} />
          </Field>
        </FormGrid>
      </Fieldset>

      <Fieldset legend="Vérification">
        <FormGrid>
          <Field name="verified_on" label="Dernière vérification" hint="Affichée aux voyageurs : « Informations vérifiées le … ».">
            <Input type="date" defaultValue={values.verified_on ?? ""} />
          </Field>
          <Field name="position" label="Ordre d’affichage" hint="Les plus petits nombres apparaissent en premier.">
            <Input defaultValue={num(values.position ?? 0)} inputMode="numeric" />
          </Field>
        </FormGrid>
        <Field name="sources" label="Sources consultées" hint="Une adresse par ligne (site officiel, Google Maps, Bordeaux Tourisme…).">
          <Textarea defaultValue={(values.sources ?? []).join("\n")} rows={3} />
        </Field>
        <Field name="internal_notes" label="Notes internes" hint="Jamais affichées aux voyageurs.">
          <Textarea defaultValue={values.internal_notes ?? ""} rows={2} maxLength={2000} />
        </Field>
      </Fieldset>

      <FormActions>
        <SubmitButton>{submitLabel}</SubmitButton>
      </FormActions>
    </ActionForm>
  );
}
