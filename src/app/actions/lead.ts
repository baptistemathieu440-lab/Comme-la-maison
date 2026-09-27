"use server";

import { readValues, validateContact } from "@/lib/contact";
import { saveLead } from "@/server/leads";

const MIN_FILL_MS = 2500;

/**
 * Appelée par le formulaire du site en plus de Netlify Forms : la demande arrive
 * aussi dans le CRM de la plateforme. Renvoie false si rien n'a été enregistré.
 */
export async function recordLead(formData: FormData): Promise<boolean> {
  const honeypot = formData.get("website");
  const startedAt = Number(formData.get("startedAt"));
  if ((typeof honeypot === "string" && honeypot.length > 0) || Date.now() - startedAt < MIN_FILL_MS) return true;
  const values = readValues(formData);
  if (Object.keys(validateContact(values)).length > 0) return false;
  return (await saveLead(values)) === "saved";
}
