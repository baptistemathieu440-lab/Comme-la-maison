import { AccountPage } from "@/components/app/AccountPage";
import { requireStaff } from "@/lib/auth/session";

export const metadata = { title: "Mon compte" };

export default async function StaffAccountPage() {
  const session = await requireStaff();
  return <AccountPage session={session} space="staff" />;
}
