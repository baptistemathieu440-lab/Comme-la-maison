"use server";

import {
  directContactMessage,
  fieldLabels,
  readValues,
  validateContact,
  type ContactState,
  type ContactValues,
} from "@/lib/contact";

/** Délai minimal entre l'affichage du formulaire et son envoi (anti-robots). */
const MIN_FILL_MS = 2500;

function buildEmail(values: ContactValues) {
  const lines = (Object.keys(fieldLabels) as Array<keyof ContactValues>)
    .filter((field) => values[field])
    .map((field) => `${fieldLabels[field]} : ${values[field]}`);
  return [
    "Nouvelle demande d’estimation reçue depuis le site Comme à la Maison.",
    "",
    ...lines,
  ].join("\n");
}

/**
 * Envoi par l'API Resend si les variables d'environnement sont renseignées :
 * RESEND_API_KEY, CONTACT_TO_EMAIL et, facultativement, CONTACT_FROM_EMAIL.
 */
async function deliver(values: ContactValues): Promise<"sent" | "not-configured" | "failed"> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) return "not-configured";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "Comme à la Maison <onboarding@resend.dev>",
        to: to.split(",").map((address) => address.trim()),
        reply_to: values.email,
        subject: `Estimation : ${values.firstName} ${values.lastName}, ${values.city}`,
        text: buildEmail(values),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    return response.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = readValues(formData);

  // Pièges à robots : champ invisible rempli, ou envoi quasi instantané.
  const honeypot = formData.get("website");
  const startedAt = Number(formData.get("startedAt"));
  if ((typeof honeypot === "string" && honeypot.length > 0) || Date.now() - startedAt < MIN_FILL_MS) {
    return { status: "success", firstName: values.firstName };
  }

  const errors = validateContact(values);
  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Certains champs sont à corriger avant l’envoi.",
      errors,
      values,
    };
  }

  const result = await deliver(values);

  if (result === "sent") return { status: "success", firstName: values.firstName };

  const logOnly = process.env.CONTACT_DELIVERY === "log" || process.env.NODE_ENV !== "production";
  if (result === "not-configured" && logOnly) {
    // En développement (ou avec CONTACT_DELIVERY=log), la demande est affichée
    // dans les journaux du serveur au lieu d'être envoyée.
    console.info("[formulaire] Envoi non configuré, demande reçue :\n" + buildEmail(values));
    return { status: "success", firstName: values.firstName };
  }

  return {
    status: "error",
    message:
      result === "not-configured"
        ? `L’envoi du formulaire n’est pas encore activé. ${directContactMessage()}`
        : `Votre demande n’a pas pu être envoyée. Vérifiez votre connexion puis réessayez. ${directContactMessage()}`,
    errors: {},
    values,
  };
}
