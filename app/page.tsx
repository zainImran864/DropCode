import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-lg font-semibold tracking-tight">DropCode</span>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Code together, in real time.
          </h1>
          <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
            Spin up a shared workspace, invite up to 4 people, and edit the same
            code live — with cursors, presence, chat, and one-click run.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/register"
            className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-zinc-300 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Log in
          </Link>
        </div>
      </main>

      <footer className="px-6 py-4 text-center text-sm text-zinc-500">
        DropCode — Phase 0 foundation
      </footer>
    </div>
  );
}
