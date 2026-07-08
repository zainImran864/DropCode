import Link from "next/link";

// Placeholder — full Supabase sign-up lands in Phase 1.
export default function RegisterPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold">Create your account</h1>
      <p className="text-zinc-600 dark:text-zinc-400">Coming in Phase 1.</p>
      <Link href="/" className="text-sm underline">
        ← Back home
      </Link>
    </div>
  );
}
