import Link from "next/link";
import {
  FiUsers,
  FiMousePointer,
  FiMessageSquare,
  FiPlay,
  FiGitBranch,
  FiCode,
  FiArrowRight,
  FiZap,
} from "react-icons/fi";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonClasses } from "@/components/ui/button";
import { FeatureCard } from "@/components/landing/feature-card";
import { EditorPreview } from "@/components/landing/editor-preview";

const FEATURES = [
  {
    icon: <FiUsers size={20} />,
    title: "Real-time collaboration",
    description:
      "Up to 4 people edit the same file together, with every keystroke synced instantly and conflict-free.",
  },
  {
    icon: <FiMousePointer size={20} />,
    title: "Live cursors & presence",
    description:
      "See who's online and follow their colored cursors and selections as they move through the code.",
  },
  {
    icon: <FiPlay size={20} />,
    title: "Run code instantly",
    description:
      "Execute JavaScript, Python, C++, Go and more right in the browser and see the output in a click.",
  },
  {
    icon: <FiMessageSquare size={20} />,
    title: "Built-in chat",
    description:
      "Talk through changes without leaving the editor — real-time chat with typing indicators.",
  },
  {
    icon: <FiCode size={20} />,
    title: "Multi-file workspaces",
    description:
      "A full file explorer with auto-save, syntax highlighting, and one-click export to a zip.",
  },
  {
    icon: <FiGitBranch size={20} />,
    title: "Roles & sharing",
    description:
      "Invite by link, manage owner/admin/editor/viewer roles, and drop into read-only mode anytime.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white dark:bg-black">
      {/* Nav */}
      <header className="sticky top-0 z-10 border-b border-zinc-200/60 bg-white/80 backdrop-blur dark:border-zinc-800/60 dark:bg-black/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3.5">
          <span className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <FiCode className="text-indigo-500" size={22} />
            DropCode
          </span>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white sm:inline"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className={buttonClasses({ size: "sm" })}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-80 max-w-4xl bg-linear-to-r from-indigo-400/20 via-purple-400/20 to-pink-400/20 blur-3xl"
        />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div className="flex flex-col items-start gap-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              <FiZap size={12} className="text-indigo-500" />
              Real-time collaborative code editor
            </span>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              Code together,
              <br />
              <span className="bg-linear-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
                in real time.
              </span>
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Spin up a shared workspace, invite up to 4 people, and build
              together — live cursors, presence, chat, and one-click run.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className={buttonClasses({ className: "gap-1.5" })}
              >
                Start coding free
                <FiArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className={buttonClasses({ variant: "outline" })}
              >
                Log in
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <EditorPreview />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Everything you need to pair on code
          </h2>
          <p className="mt-2 text-zinc-500">
            A complete collaborative coding space — no setup, no installs.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-zinc-200 bg-linear-to-br from-zinc-50 to-white px-6 py-14 text-center dark:border-zinc-800 dark:from-zinc-900 dark:to-black">
          <h2 className="max-w-lg text-2xl font-semibold tracking-tight sm:text-3xl">
            Ready to build together?
          </h2>
          <p className="max-w-md text-zinc-500">
            Create your first workspace in seconds and invite your team.
          </p>
          <Link
            href="/register"
            className={buttonClasses({ className: "gap-1.5" })}
          >
            Get started free
            <FiArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-zinc-500 sm:flex-row">
          <span className="flex items-center gap-1.5">
            <FiCode className="text-indigo-500" size={16} />
            DropCode
          </span>
          <span>Built with Next.js, Supabase & Liveblocks.</span>
        </div>
      </footer>
    </div>
  );
}
