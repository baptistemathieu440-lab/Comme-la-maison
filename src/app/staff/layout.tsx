import type { Metadata } from "next";

import { AppShell } from "@/components/app/AppShell";
import { PlatformNotConfigured } from "@/components/app/PlatformNotConfigured";
import { requireStaff } from "@/lib/auth/session";
import { isPlatformConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: { template: "%s · Espace agent", default: "Espace agent" },
  robots: { index: false, follow: false },
};

export default async function StaffLayout({ children }: LayoutProps<"/staff">) {
  if (!isPlatformConfigured()) return <PlatformNotConfigured />;
  const session = await requireStaff();
  return (
    <AppShell space="staff" session={session}>
      {children}
    </AppShell>
  );
}
