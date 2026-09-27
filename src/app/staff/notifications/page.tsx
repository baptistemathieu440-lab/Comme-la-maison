import { NotificationList } from "@/components/app/NotificationList";
import { requireStaff } from "@/lib/auth/session";

export const metadata = { title: "Notifications" };

export default async function StaffNotificationsPage() {
  const session = await requireStaff();
  return <NotificationList session={session} basePath="/staff" />;
}
