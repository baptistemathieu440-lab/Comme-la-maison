/**
 * Durée de validité des liens envoyés par la plateforme (invitation, connexion sans
 * mot de passe, nouveau mot de passe). Elle dépend du réglage « Email OTP expiration »
 * de Supabase (Authentication › Providers › Email) : 1 heure par défaut, 24 heures au
 * maximum. NEXT_PUBLIC_AUTH_LINK_VALIDITY_HOURS doit reprendre la même valeur ; sans
 * variable, la durée la plus courte est affichée pour ne jamais annoncer plus que la réalité.
 */
const hours = Number(process.env.NEXT_PUBLIC_AUTH_LINK_VALIDITY_HOURS);

export const linkValidityHours = Number.isInteger(hours) && hours >= 1 && hours <= 24 ? hours : 1;

/** « 1 heure », « 24 heures »… */
export const linkValidity = linkValidityHours === 1 ? "1 heure" : `${linkValidityHours} heures`;
