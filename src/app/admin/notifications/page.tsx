import { NotificationList } from "@/components/app/NotificationList";
import { requireAdmin } from "@/lib/auth/session";

export const metadata = { title: "Notifications" };

export default async function AdminNotificationsPage() {
  const session = await requireAdmin();
  return <NotificationList session={session} basePath="/admin" />;
}
