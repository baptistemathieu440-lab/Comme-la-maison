/** Normalise une saisie de recherche comme la base (minuscules, sans accents). */
export function normalizeQuery(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[%_\\]/g, " ")
    .trim()
    .slice(0, 80);
}
