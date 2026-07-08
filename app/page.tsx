import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonClasses } from "@/components/ui/button";

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
          <Link href="/register" className={buttonClasses()}>
            Get started
          </Link>
          <Link href="/login" className={buttonClasses({ variant: "outline" })}>
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
