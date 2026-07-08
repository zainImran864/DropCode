import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

interface AppShellProps {
  userLabel: string;
  children: React.ReactNode;
}

/** Dashboard chrome: persistent sidebar + topbar around scrollable content. */
export function AppShell({ userLabel, children }: AppShellProps) {
  return (
    <div className="flex flex-1 bg-zinc-50 dark:bg-black">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar userLabel={userLabel} />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
