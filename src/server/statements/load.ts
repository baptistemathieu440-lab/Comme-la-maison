import "server-only";

import type { AdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/database.types";
import type { ServerClient } from "@/lib/supabase/server";
import { displayName } from "@/lib/people";

type Statement = Database["public"]["Tables"]["owner_statements"]["Row"];
type Line = Database["public"]["Tables"]["statement_lines"]["Row"];
type Settings = Database["public"]["Tables"]["settings"]["Row"];

export type Company = Partial<
  Pick<
    Settings,
    | "company_name"
    | "legal_name"
    | "legal_form"
    | "share_capital"
    | "siren"
    | "registration"
    | "vat_number"
    | "head_office"
    | "email"
    | "phone"
    | "website"
    | "vat_registered"
    | "vat_rate_bps"
    | "payment_terms_days"
    | "late_penalty_note"
    | "bank_details"
    | "professional_card"
    | "liability_insurance"
  >
>;

export type Customer = {
  name: string;
  company_name?: string | null;
  address_line?: string | null;
  postal_code?: string | null;
  city?: string | null;
  country?: string | null;
  email?: string | null;
  vat_number?: string | null;
};

export type StatementDocument = { statement: Statement; lines: Line[]; company: Company; customer: Customer };

/**
 * Données d'un relevé pour le PDF. Un relevé finalisé utilise les photos
 * (identité de la société et du propriétaire au jour de la facture) ;
 * un brouillon utilise les informations actuelles.
 */
export async function loadStatementDocument(supabase: ServerClient | AdminClient, id: string): Promise<StatementDocument | null> {
  const { data: statement } = await supabase.from("owner_statements").select("*").eq("id", id).maybeSingle();
  if (!statement) return null;
  const { data: lines } = await supabase.from("statement_lines").select("*").eq("statement_id", id).order("position");

  if (statement.status !== "draft" && statement.company_snapshot && statement.owner_snapshot) {
    return {
      statement,
      lines: lines ?? [],
      company: statement.company_snapshot as Company,
      customer: statement.owner_snapshot as unknown as Customer,
    };
  }

  const [{ data: settings }, { data: owner }] = await Promise.all([
    supabase.from("settings").select("*").maybeSingle(),
    supabase
      .from("owners")
      .select("billing_email, vat_number, contact:contacts!inner(first_name, last_name, company_name, email, address_line, postal_code, city, country)")
      .eq("id", statement.owner_id)
      .maybeSingle(),
  ]);
  return {
    statement,
    lines: lines ?? [],
    company: settings ?? {},
    customer: {
      name: displayName(owner?.contact),
      company_name: owner?.contact.company_name,
      address_line: owner?.contact.address_line,
      postal_code: owner?.contact.postal_code,
      city: owner?.contact.city,
      country: owner?.contact.country,
      email: owner?.billing_email ?? owner?.contact.email,
      vat_number: owner?.vat_number,
    },
  };
}
