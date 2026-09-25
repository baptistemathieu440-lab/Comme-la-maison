import { PageHeader } from "@/components/app/ui";
import { requireAdmin } from "@/lib/auth/session";

export const metadata = { title: "Tableau de bord" };

export default async function AdminDashboard() {
  const session = await requireAdmin();
  return <PageHeader title={`Bonjour ${session.fullName.split(" ")[0] || ""}`.trim()} description="Tableau de bord" />;
}
