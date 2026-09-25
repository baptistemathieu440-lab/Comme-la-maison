import { Badge, Panel } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { isEncryptionConfigured } from "@/lib/crypto";
import { formatDateTime } from "@/lib/dates";
import { isAdminClientConfigured } from "@/lib/supabase/admin";
import { isEmailConfigured } from "@/server/email";

export const metadata = { title: "Services connectés" };

function Status({ ok, okLabel = "Connecté", koLabel = "Non connecté" }: { ok: boolean; okLabel?: string; koLabel?: string }) {
  return ok ? <Badge tone="positive">{okLabel}</Badge> : <Badge tone="muted">{koLabel}</Badge>;
}

export default async function IntegrationsPage() {
  const { supabase } = await adminContext();
  const [{ count: icalCount }, { data: lastRun }] = await Promise.all([
    supabase.from("listings").select("id", { count: "exact", head: true }).not("ical_import_url", "is", null),
    supabase.from("sync_runs").select("started_at, status").order("started_at", { ascending: false }).limit(1).maybeSingle(),
  ]);

  const services = [
    {
      name: "Base de données, comptes et fichiers (Supabase)",
      ok: isAdminClientConfigured(),
      detail: "Postgres, authentification, stockage privé. Région Paris recommandée.",
    },
    {
      name: "Calendriers iCal (Airbnb, Booking.com, Abritel)",
      ok: (icalCount ?? 0) > 0,
      okLabel: `${icalCount} calendrier(s)`,
      koLabel: "Aucun calendrier",
      detail: lastRun ? `Dernière synchronisation : ${formatDateTime(lastRun.started_at)}.` : "Renseignez les calendriers dans chaque annonce.",
    },
    {
      name: "Synchronisation automatique (tâches planifiées)",
      ok: Boolean(process.env.CRON_SECRET),
      okLabel: "Configurée",
      koLabel: "Non configurée",
      detail: "Toutes les heures : calendriers iCal et automatisations ; chaque nuit : statuts des réservations ; le 1er du mois : brouillons des relevés. Nécessite CRON_SECRET.",
    },
    {
      name: "Channel manager (API Airbnb, Booking.com, Vrbo)",
      ok: false,
      detail:
        "Non connecté. Airbnb, Booking.com et Vrbo n’ouvrent leur API qu’à des éditeurs agréés : la connexion passera par un channel manager (Beds24, Smoobu…) une fois l’abonnement choisi. Rien n’est simulé en attendant.",
    },
    {
      name: "Envoi d’emails (Resend)",
      ok: isEmailConfigured(),
      okLabel: "Configuré",
      detail: "Invitations, notifications et relevés par email. Nécessite un nom de domaine vérifié, RESEND_API_KEY et EMAIL_FROM. Sans lui, les liens s’affichent pour être transmis à la main et les notifications restent dans l’application.",
    },
    {
      name: "Chiffrement des IBAN",
      ok: isEncryptionConfigured(),
      okLabel: "Actif",
      koLabel: "Clé manquante",
      detail: "Clé IBAN_ENCRYPTION_KEY (32 octets, base64), côté serveur uniquement.",
    },
    { name: "Paiement en ligne (Stripe)", ok: false, detail: "Non prévu pour l’instant : les propriétaires encaissent directement les versements des plateformes." },
    { name: "SMS / WhatsApp", ok: false, detail: "Non connecté. Canal prévu dans les notifications, à brancher sur un fournisseur." },
  ];

  return (
    <Panel as="div">
      <ul className="flex flex-col divide-y divide-line">
        {services.map((service) => (
          <li key={service.name} className="flex flex-col gap-1.5 py-4 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold text-maison">{service.name}</h2>
              <Status ok={service.ok} okLabel={service.okLabel} koLabel={service.koLabel} />
            </div>
            <p className="max-w-[52rem] text-small text-ink-soft">{service.detail}</p>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
