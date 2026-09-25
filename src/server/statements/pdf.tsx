import "server-only";

import { Circle, Document, Page, Path, StyleSheet, Svg, Text, View, renderToBuffer } from "@react-pdf/renderer";

import { horizontal, symbol } from "@/components/brand/logo-paths";
import { formatDateShort, formatMonth } from "@/lib/dates";
import { formatBps, formatCents } from "@/lib/money";

import type { StatementDocument } from "./load";

const colors = { maison: "#354943", cream: "#f5f0e7", terra: "#bb6c51", ink: "#23302b", soft: "#56625c", line: "#ddd3c1", olive: "#e4e8d8" };

/** Les polices PDF standard ne connaissent pas les espaces fines insécables de la mise en forme française. */
const clean = (value: string) => value.replace(/[\u202f\u00a0]/g, " ").replace(/ \u2192 /g, " au ");
const euros = (cents: number) => clean(formatCents(cents));
const missing = "À compléter";

const styles = StyleSheet.create({
  page: { padding: 36, paddingBottom: 54, fontFamily: "Helvetica", fontSize: 9, color: colors.ink, lineHeight: 1.35 },
  row: { flexDirection: "row" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 },
  title: { fontFamily: "Helvetica-Bold", fontSize: 15, color: colors.maison, marginBottom: 3 },
  muted: { color: colors.soft },
  bold: { fontFamily: "Helvetica-Bold" },
  parties: { flexDirection: "row", gap: 16, marginBottom: 16 },
  party: { flex: 1, padding: 10, borderRadius: 6, backgroundColor: colors.cream },
  partyTitle: { fontFamily: "Helvetica-Bold", fontSize: 8, color: colors.soft, textTransform: "uppercase", marginBottom: 4, letterSpacing: 0.6 },
  sectionTitle: { fontFamily: "Helvetica-Bold", fontSize: 11, color: colors.maison, marginTop: 12, marginBottom: 6 },
  table: { borderTopWidth: 1, borderTopColor: colors.line },
  th: { flexDirection: "row", backgroundColor: colors.olive, paddingVertical: 4, paddingHorizontal: 4, fontFamily: "Helvetica-Bold", fontSize: 8 },
  tr: { flexDirection: "row", paddingVertical: 4, paddingHorizontal: 4, borderBottomWidth: 0.5, borderBottomColor: colors.line },
  total: { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 4, fontFamily: "Helvetica-Bold", backgroundColor: colors.cream },
  num: { textAlign: "right" },
  note: { marginTop: 10, padding: 8, borderRadius: 6, borderWidth: 0.5, borderColor: colors.line, color: colors.soft, fontSize: 8 },
  draft: { position: "absolute", top: 300, left: 60, fontSize: 70, color: "#e8e1d4", transform: "rotate(-30deg)", fontFamily: "Helvetica-Bold" },
  footer: { position: "absolute", bottom: 24, left: 36, right: 36, fontSize: 7, color: colors.soft, flexDirection: "row", justifyContent: "space-between" },
});

function Logo() {
  const [, , width, height] = horizontal.viewBox.split(" ").map(Number);
  return (
    <Svg viewBox={horizontal.viewBox} style={{ width: 150, height: (150 * height) / width }}>
      <Circle cx={symbol.disc.cx} cy={symbol.disc.cy} r={symbol.disc.r} fill={colors.maison} />
      <Path d={symbol.door} fill={colors.cream} />
      <Circle cx={symbol.knob.cx} cy={symbol.knob.cy} r={symbol.knob.r} fill={colors.terra} />
      <Path d={horizontal.wordmark} fill={colors.maison} />
      <Path d={horizontal.tagline} fill={colors.terra} />
    </Svg>
  );
}

function Cell({ children, width, align = "left", bold = false }: { children: React.ReactNode; width: string; align?: "left" | "right"; bold?: boolean }) {
  return <Text style={[{ width, textAlign: align }, bold ? styles.bold : {}]}>{children}</Text>;
}

function StatementPdf({ statement, lines, company, customer }: StatementDocument) {
  const draft = statement.status === "draft";
  const vat = statement.vat_registered;
  const rate = statement.vat_rate_bps;
  const bookings = lines.filter((l) => l.kind === "booking");
  const cleaning = lines.filter((l) => l.kind === "cleaning");
  const expenses = lines.filter((l) => l.kind === "expense");
  const adjustments = lines.filter((l) => l.kind === "adjustment");
  const ht = (ttc: number) => (vat ? Math.round((ttc * 10000) / (10000 + rate)) : ttc);
  const totalHt = ht(statement.commission_cents) + ht(statement.cleaning_rebill_cents) + ht(statement.adjustments_cents) + statement.expenses_rebill_cents;

  const invoiceLines = [
    {
      label: `Commission de gestion : ${formatBps(bookings[0]?.commission_rate_bps ?? 2000)} TTC des revenus perçus (${bookings.length} réservation(s))`,
      ttc: statement.commission_cents,
      vatable: true,
    },
    ...(statement.cleaning_rebill_cents ? [{ label: `Ménage refacturé à l’identique (${cleaning.length} séjour(s))`, ttc: statement.cleaning_rebill_cents, vatable: true }] : []),
    ...expenses.map((e) => ({ label: `Frais avancés pour votre compte : ${e.label}`, ttc: e.amount_cents, vatable: false })),
    ...adjustments.map((a) => ({ label: `Ajustement : ${a.label}`, ttc: a.amount_cents, vatable: true })),
  ];

  const seller = [
    company.legal_name || company.company_name || missing,
    [company.legal_form, company.share_capital ? `au capital de ${company.share_capital}` : null].filter(Boolean).join(" ") || null,
    company.head_office || `Siège : ${missing}`,
    company.siren ? `SIREN/SIRET ${company.siren}` : `SIREN : ${missing}`,
    company.registration,
    vat ? (company.vat_number ? `TVA intracommunautaire ${company.vat_number}` : `N° TVA : ${missing}`) : "TVA non applicable, art. 293 B du CGI",
    company.professional_card,
    [company.email, company.phone].filter(Boolean).join(" · ") || null,
  ].filter(Boolean) as string[];

  const buyer = [
    customer.company_name && customer.company_name !== customer.name ? customer.company_name : null,
    customer.name,
    customer.address_line,
    [customer.postal_code, customer.city].filter(Boolean).join(" ") || null,
    customer.email,
    customer.vat_number ? `TVA ${customer.vat_number}` : null,
  ].filter(Boolean) as string[];

  return (
    <Document title={`Relevé ${statement.number ?? "brouillon"}`} author="Comme à la Maison" language="fr-FR">
      <Page size="A4" style={styles.page}>
        {draft ? <Text style={styles.draft} fixed>BROUILLON</Text> : null}
        <View style={styles.header}>
          <Logo />
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.title}>{draft ? "Relevé de gestion (brouillon)" : `Facture n° ${statement.number}`}</Text>
            <Text>Relevé de gestion de {clean(formatMonth(statement.period_month))}</Text>
            {draft ? (
              <Text style={styles.muted}>Document provisoire, non valable comme facture</Text>
            ) : (
              <>
                <Text>Date d’émission : {formatDateShort(statement.issued_on)}</Text>
                <Text>À régler avant le : {formatDateShort(statement.due_on)}</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.parties}>
          <View style={styles.party}>
            <Text style={styles.partyTitle}>Émetteur</Text>
            {seller.map((line, i) => (
              <Text key={i} style={i === 0 ? styles.bold : {}}>
                {line}
              </Text>
            ))}
          </View>
          <View style={styles.party}>
            <Text style={styles.partyTitle}>Propriétaire</Text>
            {buyer.map((line, i) => (
              <Text key={i} style={i === 0 ? styles.bold : {}}>
                {line}
              </Text>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>1. Réservations du mois</Text>
        <Text style={[styles.muted, { marginBottom: 4 }]}>
          Versements encaissés directement par le propriétaire. La commission se calcule sur les revenus perçus : prix des nuitées moins les frais de la plateforme.
        </Text>
        <View style={styles.table}>
          <View style={styles.th}>
            <Cell width="40%">Bien, séjour, plateforme</Cell>
            <Cell width="15%" align="right">Nuitées</Cell>
            <Cell width="15%" align="right">Frais plateforme</Cell>
            <Cell width="15%" align="right">Revenus perçus</Cell>
            <Cell width="15%" align="right">Commission</Cell>
          </View>
          {bookings.length === 0 ? (
            <View style={styles.tr}>
              <Text style={styles.muted}>Aucune réservation sur la période.</Text>
            </View>
          ) : (
            bookings.map((line) => (
              <View key={line.id} style={styles.tr} wrap={false}>
                <Cell width="40%">{clean(line.label)}</Cell>
                <Cell width="15%" align="right">{euros(line.nights_amount_cents)}</Cell>
                <Cell width="15%" align="right">{euros(line.platform_fee_cents)}</Cell>
                <Cell width="15%" align="right">{euros(line.commission_base_cents)}</Cell>
                <Cell width="15%" align="right">{euros(line.commission_cents)}</Cell>
              </View>
            ))
          )}
          <View style={styles.total}>
            <Cell width="40%">Total ({statement.nights_count} nuits)</Cell>
            <Cell width="15%" align="right">{euros(statement.nights_amount_cents)}</Cell>
            <Cell width="15%" align="right">{euros(statement.platform_fee_cents)}</Cell>
            <Cell width="15%" align="right">{euros(statement.commission_base_cents)}</Cell>
            <Cell width="15%" align="right">{euros(statement.commission_cents)}</Cell>
          </View>
        </View>

        <Text style={styles.sectionTitle}>2. {draft ? "Montants à facturer" : "Facture"}</Text>
        <View style={styles.table}>
          <View style={styles.th}>
            <Cell width={vat ? "52%" : "76%"}>Désignation</Cell>
            {vat ? <Cell width="16%" align="right">Montant HT</Cell> : null}
            {vat ? <Cell width="12%" align="right">TVA</Cell> : null}
            <Cell width={vat ? "20%" : "24%"} align="right">{vat ? "Montant TTC" : "Montant"}</Cell>
          </View>
          {invoiceLines.map((line, i) => {
            const lineHt = line.vatable ? ht(line.ttc) : line.ttc;
            return (
              <View key={i} style={styles.tr} wrap={false}>
                <Cell width={vat ? "52%" : "76%"}>{clean(line.label)}</Cell>
                {vat ? <Cell width="16%" align="right">{euros(lineHt)}</Cell> : null}
                {vat ? <Cell width="12%" align="right">{line.vatable ? euros(line.ttc - lineHt) : "débours"}</Cell> : null}
                <Cell width={vat ? "20%" : "24%"} align="right">{euros(line.ttc)}</Cell>
              </View>
            );
          })}
          {vat ? (
            <>
              <View style={styles.tr}>
                <Cell width="80%" align="right">Total HT</Cell>
                <Cell width="20%" align="right">{euros(totalHt)}</Cell>
              </View>
              <View style={styles.tr}>
                <Cell width="80%" align="right">TVA {formatBps(rate)}</Cell>
                <Cell width="20%" align="right">{euros(statement.total_vat_cents)}</Cell>
              </View>
            </>
          ) : null}
          <View style={styles.total}>
            <Cell width="76%" align="right">{vat ? "Total TTC à régler" : "Total à régler"}</Cell>
            <Cell width="24%" align="right">{euros(statement.total_due_cents)}</Cell>
          </View>
        </View>
        {!vat ? <Text style={[styles.muted, { marginTop: 4 }]}>TVA non applicable, art. 293 B du CGI.</Text> : null}

        <Text style={styles.sectionTitle}>3. Synthèse pour le propriétaire</Text>
        <View style={styles.table}>
          {[
            ["Revenus perçus des plateformes (après leurs frais)", statement.commission_base_cents],
            ["Commission Comme à la Maison", -statement.commission_cents],
            ...(statement.expenses_rebill_cents ? [["Frais avancés pour votre compte", -statement.expenses_rebill_cents] as [string, number]] : []),
            ...(statement.adjustments_cents ? [["Ajustements", -statement.adjustments_cents] as [string, number]] : []),
          ].map(([label, value]) => (
            <View key={String(label)} style={styles.tr}>
              <Cell width="76%">{String(label)}</Cell>
              <Cell width="24%" align="right">{euros(Number(value))}</Cell>
            </View>
          ))}
          <View style={styles.total}>
            <Cell width="76%">Revenu net après gestion</Cell>
            <Cell width="24%" align="right">{euros(statement.owner_net_cents)}</Cell>
          </View>
        </View>
        {statement.cleaning_rebill_cents ? (
          <Text style={[styles.muted, { marginTop: 4 }]}>
            Ménage : {euros(statement.cleaning_rebill_cents)} payés par les voyageurs et perçus par vous, refacturés à l’identique : sans effet sur votre revenu.
          </Text>
        ) : null}

        <View style={styles.note} wrap={false}>
          <Text>
            {draft ? "Conditions de paiement indiquées à la finalisation." : `Paiement à réception, au plus tard le ${formatDateShort(statement.due_on)}.`}{" "}
            {company.bank_details ? `Règlement par virement : ${company.bank_details}. ` : ""}
            {company.late_penalty_note ?? ""}
          </Text>
          {company.liability_insurance ? <Text>Assurance responsabilité civile professionnelle : {company.liability_insurance}.</Text> : null}
          {statement.is_demo ? <Text style={styles.bold}>Document de démonstration : données fictives.</Text> : null}
        </View>

        <View style={styles.footer} fixed>
          <Text>{company.company_name ?? "Comme à la Maison"} · Conciergerie à Bordeaux et dans sa métropole</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

export async function renderStatementPdf(document: StatementDocument) {
  return renderToBuffer(<StatementPdf {...document} />);
}

export function statementFileName(document: StatementDocument) {
  const month = document.statement.period_month.slice(0, 7);
  return `releve-${month}-${document.statement.number ?? "brouillon"}.pdf`;
}
