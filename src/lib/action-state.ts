/** Résultat d'une action serveur de formulaire. */
export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
};

export const idle: ActionState = { status: "idle" };

export function fail(message: string, errors?: Record<string, string>): ActionState {
  return { status: "error", message, errors };
}

export function ok(message: string): ActionState {
  return { status: "success", message };
}

/** Traduit les erreurs de la base en messages compréhensibles. */
export function dbErrorMessage(error: { code?: string; message?: string } | null | undefined): string {
  if (!error) return "Une erreur inattendue est survenue.";
  switch (error.code) {
    case "23P01":
      return "Ces dates chevauchent une autre réservation confirmée sur ce logement.";
    case "23505":
      return "Cet élément existe déjà (valeur en double).";
    case "23503":
      return "Cet élément est encore utilisé ailleurs : il ne peut pas être supprimé.";
    case "23514":
      return error.message && !error.message.includes("violates check constraint")
        ? error.message
        : "Une valeur saisie n’est pas acceptée. Vérifiez le formulaire.";
    case "42501":
      return "Vous n’avez pas les droits pour cette action.";
    case "P0001":
      return error.message ?? "Action refusée.";
    default:
      return error.message ? `Erreur : ${error.message}` : "Une erreur inattendue est survenue.";
  }
}
