import { NavTabs } from "@/components/app/NavTabs";
import { PageHeader } from "@/components/app/ui";
import { requireAdmin } from "@/lib/auth/session";

export default async function SettingsLayout({ children }: LayoutProps<"/admin/parametres">) {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Paramètres" description="Société, commission, facturation, comptes et services connectés." />
      <NavTabs
        label="Sections des paramètres"
        items={[
          { href: "/admin/parametres", label: "Société et facturation", exact: true },
          { href: "/admin/parametres/utilisateurs", label: "Utilisateurs" },
          { href: "/admin/parametres/integrations", label: "Services connectés" },
          { href: "/admin/parametres/securite", label: "Sécurité" },
          { href: "/admin/parametres/demonstration", label: "Démonstration" },
        ]}
      />
      {children}
    </>
  );
}
