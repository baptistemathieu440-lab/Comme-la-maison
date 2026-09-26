"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Favoris du voyageur, enregistrés sur son téléphone (localStorage) :
 * aucun compte, rien n'est envoyé au serveur.
 */

const KEY = "cam-guide-favoris";
const EVENT = "cam-guide-favoris";
const EMPTY: string[] = [];

let cache: { raw: string | null; value: string[] } = { raw: null, value: EMPTY };
/** Repli en mémoire quand le stockage est indisponible (navigation privée, stockage plein). */
let memory: string[] | null = null;

function read(): string[] {
  if (memory) return memory;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cache.raw) return cache.value;
  let value: string[] = EMPTY;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    value = Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : EMPTY;
  } catch {
    value = EMPTY;
  }
  cache = { raw, value };
  return value;
}

function write(value: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // Navigation privée ou stockage plein : les favoris restent le temps de la visite.
    memory = value;
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) callback();
  };
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

/** Liste des favoris (vide côté serveur et au premier rendu). */
export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, read, () => EMPTY);
  const toggle = useCallback((slug: string) => {
    const current = read();
    write(current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]);
  }, []);
  return { favorites, toggle };
}
