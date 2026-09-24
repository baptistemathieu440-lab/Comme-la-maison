/**
 * Formulaire d'estimation : champs, options et validation.
 * Partagé entre le navigateur (retour immédiat) et le serveur (contrôle final).
 */

export const propertyTypeOptions = [
  "Studio",
  "Appartement",
  "Maison",
  "Résidence secondaire",
  "Logement d’investissement",
  "Autre",
] as const;

export const bedroomOptions = ["Studio", "1", "2", "3", "4", "5 ou plus"] as const;

export const contactFields = [
  "firstName",
  "lastName",
  "phone",
  "email",
  "city",
  "propertyType",
  "bedrooms",
  "capacity",
  "message",
] as const;

export type ContactField = (typeof contactFields)[number];
export type ContactValues = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const requiredFields: ContactField[] = ["firstName", "lastName", "phone", "email", "city"];

export const fieldLabels: Record<ContactField, string> = {
  firstName: "Prénom",
  lastName: "Nom",
  phone: "Téléphone",
  email: "Email",
  city: "Ville du logement",
  propertyType: "Type de logement",
  bedrooms: "Nombre de chambres",
  capacity: "Capacité (voyageurs)",
  message: "Message",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function readValues(formData: FormData): ContactValues {
  const values = {} as ContactValues;
  for (const field of contactFields) {
    const raw = formData.get(field);
    values[field] = typeof raw === "string" ? raw.trim() : "";
  }
  return values;
}

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};

  if (!values.firstName) errors.firstName = "Indiquez votre prénom.";
  else if (values.firstName.length > 60) errors.firstName = "Votre prénom doit faire moins de 60 caractères.";

  if (!values.lastName) errors.lastName = "Indiquez votre nom.";
  else if (values.lastName.length > 80) errors.lastName = "Votre nom doit faire moins de 80 caractères.";

  const digits = values.phone.replace(/[\s.\-()]/g, "").replace(/^\+/, "");
  if (!values.phone) errors.phone = "Indiquez votre numéro de téléphone.";
  else if (!/^\d{9,15}$/.test(digits)) {
    errors.phone = "Ce numéro semble incomplet. Exemple : 06 12 34 56 78.";
  }

  if (!values.email) errors.email = "Indiquez votre adresse email.";
  else if (!EMAIL.test(values.email) || values.email.length > 120) {
    errors.email = "Cette adresse email semble incomplète. Exemple : prenom@domaine.fr.";
  }

  if (!values.city) errors.city = "Indiquez la ville où se trouve le logement.";
  else if (values.city.length > 80) errors.city = "Le nom de la ville doit faire moins de 80 caractères.";

  if (values.propertyType && !(propertyTypeOptions as readonly string[]).includes(values.propertyType)) {
    errors.propertyType = "Choisissez un type de logement dans la liste.";
  }

  if (values.bedrooms && !(bedroomOptions as readonly string[]).includes(values.bedrooms)) {
    errors.bedrooms = "Choisissez un nombre de chambres dans la liste.";
  }

  if (values.capacity) {
    const n = Number(values.capacity);
    if (!Number.isInteger(n) || n < 1 || n > 30) {
      errors.capacity = "Indiquez un nombre de voyageurs entre 1 et 30.";
    }
  }

  if (values.message.length > 2000) {
    errors.message = "Votre message doit faire moins de 2 000 caractères.";
  }

  return errors;
}

export type ContactState =
  | { status: "idle" }
  | { status: "success"; firstName: string }
  | { status: "error"; message: string; errors: ContactErrors; values: ContactValues };

export const initialContactState: ContactState = { status: "idle" };
