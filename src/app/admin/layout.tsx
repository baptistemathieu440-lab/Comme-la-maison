import type { Metadata } from "next";

import { AppShell } from "@/components/app/AppShell";
import { PlatformNotConfigured } from "@/components/app/PlatformNotConfigured";
import { requireAdmin } from "@/lib/auth/session";
import { isPlatformConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: { template: "%s · Back-office", default: "Back-office" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  if (!isPlatformConfigured()) return <PlatformNotConfigured />;
  const session = await requireAdmin();
  return (
    <AppShell space="admin" session={session}>
      {children}
    </AppShell>
  );
}
