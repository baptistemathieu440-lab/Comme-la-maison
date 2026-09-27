import { DescriptionList, Notice, Panel } from "@/components/app/ui";
import { adminContext } from "@/lib/auth/admin-context";
import { formatDateTime } from "@/lib/dates";

export const metadata = { title: "Sécurité" };

export default async function SecurityPage() {
  const { supabase, session } = await adminContext();
  const { data } = await supabase.auth.mfa.listFactors();
  const factors = data?.totp ?? [];

  return (
    <>
      <Panel title="Votre compte" id="compte">
        <DescriptionList
          items={[
            { label: "Email", value: session.email },
            { label: "Double authentification", value: factors.length ? "Active (application d’authentification)" : "Non configurée" },
            ...factors.map((factor) => ({ label: "Facteur enregistré", value: `${factor.friendly_name ?? "Application"} · ${formatDateTime(factor.created_at)}` })),
          ]}
        />
        <p className="mt-4 text-small text-ink-soft">
          Téléphone perdu ? Un autre administrateur peut réinitialiser votre double authentification depuis l’onglet
          Utilisateurs.
        </p>
      </Panel>
      <Panel title="Protections en place" id="protections">
        <ul className="flex list-disc flex-col gap-2 pl-5 text-[0.9375rem]">
          <li>Comptes créés sur invitation uniquement ; inscriptions libres fermées.</li>
          <li>Double authentification obligatoire pour les administrateurs, vérifiée par la base elle-même.</li>
          <li>Règles d’accès par ligne dans la base : un propriétaire ne reçoit que ses données, un agent que ses tâches.</li>
          <li>Codes d’accès aux logements visibles par l’agent le seul jour de sa tâche.</li>
          <li>IBAN chiffrés (AES-256-GCM) avec une clé stockée uniquement sur le serveur.</li>
          <li>Fichiers privés, servis par liens temporaires signés.</li>
          <li>Journal d’activité en écriture seule, alimenté par la base.</li>
        </ul>
        <Notice tone="info" className="mt-4">
          Mots de passe : 10 caractères minimum, lettres et chiffres. Les sessions expirent et se renouvellent
          automatiquement.
        </Notice>
      </Panel>
    </>
  );
}
