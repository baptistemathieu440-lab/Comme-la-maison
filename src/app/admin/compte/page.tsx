import { AccountPage } from "@/components/app/AccountPage";
import { requireAdmin } from "@/lib/auth/session";

export const metadata = { title: "Mon compte" };

export default async function AdminAccountPage() {
  const session = await requireAdmin();
  return <AccountPage session={session} space="admin" />;
}
