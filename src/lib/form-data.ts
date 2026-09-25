import { isIsoDate } from "./dates";
import { parseEuros, parsePercentToBps } from "./money";

/** Lecture typée d'un FormData (valeurs non fiables : toujours revalidées). */
export class FormReader {
  readonly errors: Record<string, string> = {};

  constructor(private readonly data: FormData) {}

  raw(name: string) {
    const value = this.data.get(name);
    return typeof value === "string" ? value.trim() : "";
  }

  /** Texte obligatoire. */
  text(name: string, message = "Ce champ est obligatoire.", max = 500) {
    const value = this.raw(name);
    if (!value) this.errors[name] = message;
    else if (value.length > max) this.errors[name] = `${max} caractères au maximum.`;
    return value;
  }

  /** Texte facultatif (null si vide). */
  optional(name: string, max = 5000) {
    const value = this.raw(name);
    if (value.length > max) this.errors[name] = `${max} caractères au maximum.`;
    return value || null;
  }

  email(name: string, required = false) {
    const value = this.raw(name).toLowerCase();
    if (!value) {
      if (required) this.errors[name] = "Indiquez une adresse email.";
      return null;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) this.errors[name] = "Adresse email incomplète.";
    return value;
  }

  choice<T extends string>(name: string, allowed: readonly T[], fallback?: T): T {
    const value = this.raw(name) as T;
    if (allowed.includes(value)) return value;
    if (fallback !== undefined && !value) return fallback;
    this.errors[name] = "Choisissez une valeur dans la liste.";
    return (fallback ?? allowed[0]) as T;
  }

  /** Identifiant (uuid) facultatif. */
  id(name: string, required = false, message = "Choisissez un élément dans la liste.") {
    const value = this.raw(name);
    if (!value) {
      if (required) this.errors[name] = message;
      return null;
    }
    if (!/^[0-9a-f-]{36}$/i.test(value)) this.errors[name] = message;
    return value;
  }

  int(name: string, { required = false, min = 0, max = 100000 } = {}) {
    const value = this.raw(name);
    if (!value) {
      if (required) this.errors[name] = "Ce champ est obligatoire.";
      return null;
    }
    const n = Number(value);
    if (!Number.isInteger(n) || n < min || n > max) {
      this.errors[name] = `Nombre entier entre ${min} et ${max}.`;
      return null;
    }
    return n;
  }

  decimal(name: string, { min = 0, max = 100000 } = {}) {
    const value = this.raw(name).replace(",", ".");
    if (!value) return null;
    const n = Number(value);
    if (!Number.isFinite(n) || n < min || n > max) {
      this.errors[name] = `Nombre entre ${min} et ${max}.`;
      return null;
    }
    return n;
  }

  date(name: string, required = false) {
    const value = this.raw(name);
    if (!value) {
      if (required) this.errors[name] = "Indiquez une date.";
      return null;
    }
    if (!isIsoDate(value)) {
      this.errors[name] = "Date invalide.";
      return null;
    }
    return value;
  }

  time(name: string) {
    const value = this.raw(name);
    if (!value) return null;
    if (!/^\d{2}:\d{2}$/.test(value)) {
      this.errors[name] = "Heure invalide (HH:MM).";
      return null;
    }
    return value;
  }

  /** Montant en euros saisi → centimes. */
  cents(name: string, { required = false, allowNegative = false } = {}) {
    const raw = this.raw(name);
    if (!raw) {
      if (required) this.errors[name] = "Indiquez un montant.";
      return null;
    }
    const value = parseEuros(raw);
    if (value === null || (!allowNegative && value < 0)) {
      this.errors[name] = "Montant invalide (exemple : 125,50).";
      return null;
    }
    return value;
  }

  /** Pourcentage saisi → points de base. */
  bps(name: string, required = false) {
    const raw = this.raw(name);
    if (!raw) {
      if (required) this.errors[name] = "Indiquez un pourcentage.";
      return null;
    }
    const value = parsePercentToBps(raw);
    if (value === null) this.errors[name] = "Pourcentage entre 0 et 100.";
    return value;
  }

  bool(name: string) {
    const value = this.data.get(name);
    return value === "on" || value === "true" || value === "1";
  }

  url(name: string) {
    const value = this.raw(name);
    if (!value) return null;
    try {
      const parsed = new URL(value);
      if (parsed.protocol !== "https:") throw new Error();
      return parsed.toString();
    } catch {
      this.errors[name] = "Adresse complète en https:// attendue.";
      return null;
    }
  }

  get ok() {
    return Object.keys(this.errors).length === 0;
  }
}
