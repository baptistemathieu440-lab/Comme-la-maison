import { AccountPage } from "@/components/app/AccountPage";
import { requireOwner } from "@/lib/auth/session";

export const metadata = { title: "Mon compte" };

export default async function OwnerAccountPage() {
  const session = await requireOwner();
  return <AccountPage session={session} space="owner" />;
}
