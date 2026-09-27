/** Nom affichable d'un contact (prénom nom, sinon société, sinon email). */
export function displayName(
  contact: { first_name?: string | null; last_name?: string | null; company_name?: string | null; email?: string | null } | null | undefined,
) {
  if (!contact) return "—";
  const name = `${contact.first_name ?? ""} ${contact.last_name ?? ""}`.trim();
  return name || contact.company_name || contact.email || "Sans nom";
}
