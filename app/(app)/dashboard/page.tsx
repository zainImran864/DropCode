import { getUser } from "@/lib/auth";
import { getCurrentProfile } from "@/api/profile";
import { LogoutButton } from "@/components/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card } from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await getUser();
  const profile = await getCurrentProfile();
  const name = profile?.display_name ?? user?.email ?? "there";

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <span className="text-lg font-semibold tracking-tight">DropCode</span>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        <h1 className="text-2xl font-semibold">Welcome, {name} 👋</h1>
        <p className="mt-1 text-zinc-500">
          Your workspaces will show up here (Phase 2).
        </p>

        <Card className="mt-8 p-6 text-sm text-zinc-500">
          No workspaces yet. Creating and joining workspaces comes next.
        </Card>
      </main>
    </div>
  );
}
