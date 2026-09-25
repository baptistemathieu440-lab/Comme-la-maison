import { NotificationList } from "@/components/app/NotificationList";
import { requireOwner } from "@/lib/auth/session";

export const metadata = { title: "Notifications" };

export default async function OwnerNotificationsPage() {
  const session = await requireOwner();
  return <NotificationList session={session} basePath="/owner" />;
}
