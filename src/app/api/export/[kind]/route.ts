import { getSession } from "@/lib/auth/session";
import { addMonths } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";

/** Exports CSV pour l'expert-comptable (séparateur « ; », encodage UTF-8 avec BOM pour Excel). */
function csv(rows: Array<Array<string | number | null>>) {
  const escape = (value: string | number | null) => {
    const text = value === null ? "" : String(value);
    return /[;"\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return "﻿" + rows.map((row) => row.map(escape).join(";")).join("\r\n");
}

const euros = (cents: number | null) => (cents === null ? "" : (cents / 100).toFixed(2).replace(".", ","));

export async function GET(request: Request, { params }: RouteContext<"/api/export/[kind]">) {
  const session = await getSession();
  if (!session?.roles.includes("admin") || session.aal !== "aal2") return new Response("Accès réservé aux administrateurs.", { status: 403 });
  const { kind } = await params;
  const month = new URL(request.url).searchParams.get("mois") ?? "";
  if (!/^\d{4}-\d{2}$/.test(month)) return new Response("Paramètre mois=AAAA-MM attendu.", { status: 400 });
  const from = `${month}-01`;
  const to = addMonths(from, 1);
  const supabase = await createClient();
  let content: string;

  if (kind === "reservations") {
    const { data } = await supabase
      .from("bookings")
      .select("reference, status, platform_id, check_in, check_out, nights, nights_amount_cents, platform_fee_cents, commission_base_cents, commission_rate_bps, commission_cents, owner_net_cents, cleaning_fee_cents, tourist_tax_cents, external_ref, is_demo, property:properties!inner(name, reference)")
      .gte("check_out", from)
      .lt("check_out", to)
      .order("check_out");
    content = csv([
      ["Référence", "Statut", "Bien", "Réf. bien", "Plateforme", "Arrivée", "Départ", "Nuits", "Nuitées", "Frais plateforme", "Revenus perçus", "Taux (%)", "Commission TTC", "Part propriétaire", "Ménage", "Taxe de séjour", "Réf. plateforme", "Démo"],
      ...(data ?? []).map((b) => [
        b.reference, b.status, b.property.name, b.property.reference, b.platform_id, b.check_in, b.check_out, b.nights,
        euros(b.nights_amount_cents), euros(b.platform_fee_cents), euros(b.commission_base_cents), ((b.commission_rate_bps ?? 0) / 100).toString().replace(".", ","),
        euros(b.commission_cents), euros(b.owner_net_cents), euros(b.cleaning_fee_cents), euros(b.tourist_tax_cents), b.external_ref, b.is_demo ? "oui" : "non",
      ]),
    ]);
  } else if (kind === "depenses") {
    const { data } = await supabase
      .from("expenses")
      .select("incurred_on, label, category, amount_cents, paid_by, rebill_to_owner, supplier, is_demo, property:properties(name)")
      .gte("incurred_on", from)
      .lt("incurred_on", to)
      .order("incurred_on");
    content = csv([
      ["Date", "Libellé", "Catégorie", "Bien", "Montant TTC", "Payé par", "Refacturée", "Fournisseur", "Démo"],
      ...(data ?? []).map((e) => [e.incurred_on, e.label, e.category, e.property?.name ?? "", euros(e.amount_cents), e.paid_by, e.rebill_to_owner ? "oui" : "non", e.supplier, e.is_demo ? "oui" : "non"]),
    ]);
  } else if (kind === "releves") {
    const { data } = await supabase
      .from("owner_statements")
      .select("number, status, period_month, issued_on, due_on, commission_cents, commission_ht_cents, commission_vat_cents, cleaning_rebill_cents, expenses_rebill_cents, adjustments_cents, total_vat_cents, total_due_cents, is_demo, owner:owners!inner(contact:contacts!inner(first_name, last_name, company_name))")
      .eq("period_month", from)
      .neq("status", "draft");
    content = csv([
      ["Numéro", "Statut", "Mois", "Émise le", "Échéance", "Propriétaire", "Commission TTC", "Commission HT", "TVA commission", "Ménage refacturé", "Frais avancés", "Ajustements", "TVA totale", "Total à régler", "Démo"],
      ...(data ?? []).map((s) => [
        s.number, s.status, s.period_month, s.issued_on, s.due_on,
        s.owner.contact.company_name || `${s.owner.contact.first_name} ${s.owner.contact.last_name}`.trim(),
        euros(s.commission_cents), euros(s.commission_ht_cents), euros(s.commission_vat_cents), euros(s.cleaning_rebill_cents),
        euros(s.expenses_rebill_cents), euros(s.adjustments_cents), euros(s.total_vat_cents), euros(s.total_due_cents), s.is_demo ? "oui" : "non",
      ]),
    ]);
  } else {
    return new Response("Export inconnu.", { status: 404 });
  }

  return new Response(content, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${kind}-${month}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
