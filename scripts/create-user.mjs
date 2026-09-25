#!/usr/bin/env node
/**
 * Crée un compte et lui donne un rôle. Sert à créer les premiers administrateurs
 * (Baptiste et Simon) ; les comptes suivants se créent depuis le back-office.
 *
 *   node --env-file=.env.local scripts/create-user.mjs --email prenom@exemple.fr --name "Prénom Nom" --role admin
 *
 * Variables : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SECRET_KEY (jamais committées).
 * Sans --password, le script affiche un lien d'invitation (valable 24 h) pour que
 * la personne choisisse elle-même son mot de passe.
 */
import { createClient } from "@supabase/supabase-js";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, value, index, all) => {
    if (value.startsWith("--")) pairs.push([value.slice(2), all[index + 1]?.startsWith("--") ? "true" : all[index + 1]]);
    return pairs;
  }, []),
);

const { email, name = "", role = "admin", password, site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000" } = args;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!email || !["admin", "staff", "owner"].includes(role)) {
  console.error("Usage : --email <adresse> --name <nom> --role admin|staff|owner [--password <mot de passe>]");
  process.exit(1);
}
if (!url || !secret) {
  console.error("NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SECRET_KEY sont nécessaires.");
  process.exit(1);
}

const supabase = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });

let userId;
let link = null;
if (password) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name },
  });
  if (error) throw error;
  userId = data.user.id;
} else {
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "invite",
    email,
    options: { data: { full_name: name } },
  });
  if (error) throw error;
  userId = data.user.id;
  link = `${site.replace(/\/$/, "")}/auth/confirm?token_hash=${data.properties.hashed_token}&type=invite`;
}

await supabase.from("profiles").update({ full_name: name }).eq("id", userId);
const { error: roleError } = await supabase.from("user_roles").upsert({ user_id: userId, role });
if (roleError) throw roleError;

console.log(`Compte ${email} (${role}) prêt.`);
if (link) console.log(`Lien d'invitation à ouvrir dans les 24 h :\n${link}`);
if (role === "admin") console.log("À la première connexion, la double authentification sera demandée.");
