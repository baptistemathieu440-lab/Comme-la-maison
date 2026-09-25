import "server-only";

/**
 * Envoi d'emails via Resend, seulement si RESEND_API_KEY et EMAIL_FROM sont renseignés
 * (un domaine vérifié est nécessaire). Sinon rien n'est envoyé et l'appelant le sait :
 * aucun envoi n'est simulé.
 */
export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && (process.env.EMAIL_FROM ?? process.env.CONTACT_FROM_EMAIL));
}

export async function sendEmail({ to, subject, text }: { to: string; subject: string; text: string }) {
  if (!isEmailConfigured()) return { status: "skipped" as const, detail: "Service d’email non configuré." };
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.EMAIL_FROM ?? process.env.CONTACT_FROM_EMAIL, to: [to], subject, text }),
      signal: AbortSignal.timeout(10_000),
    });
    return response.ok
      ? { status: "sent" as const, detail: null }
      : { status: "failed" as const, detail: `Resend a répondu ${response.status}.` };
  } catch {
    return { status: "failed" as const, detail: "Connexion à Resend impossible." };
  }
}
