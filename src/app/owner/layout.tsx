import type { Metadata } from "next";

import { AppShell } from "@/components/app/AppShell";
import { PlatformNotConfigured } from "@/components/app/PlatformNotConfigured";
import { requireOwner } from "@/lib/auth/session";
import { isPlatformConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: { template: "%s · Espace propriétaire", default: "Espace propriétaire" },
  robots: { index: false, follow: false },
};

export default async function OwnerLayout({ children }: LayoutProps<"/owner">) {
  if (!isPlatformConfigured()) return <PlatformNotConfigured />;
  const session = await requireOwner();
  return (
    <AppShell space="owner" session={session}>
      {children}
    </AppShell>
  );
}
