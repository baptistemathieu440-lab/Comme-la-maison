"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "./database.types";
import { supabasePublishableKey, supabaseUrl } from "./env";

/** Client navigateur : utilisé uniquement pour envoyer des fichiers vers une adresse signée par le serveur. */
export function createBrowserSupabase() {
  return createBrowserClient<Database>(supabaseUrl, supabasePublishableKey);
}
