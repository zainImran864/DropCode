import { requireUser } from "@/lib/auth";
import { getCurrentProfile } from "@/api/profile";
import { AppShell } from "@/components/layout/app-shell";

/** Wraps dashboard-area routes in the sidebar + topbar shell. */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const profile = await getCurrentProfile();
  const userLabel = profile?.display_name ?? user.email ?? "Account";

  return <AppShell userLabel={userLabel}>{children}</AppShell>;
}
