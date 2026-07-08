import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { getWorkspacePreview } from "@/api/members";
import { Card } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { JoinCard } from "./join-card";

export default async function JoinPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const user = await getUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/join/${token}`)}`);
  }

  const preview = await getWorkspacePreview(token);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
          DropCode
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <Card className="w-full max-w-sm p-6">
          {preview ? (
            <JoinCard token={token} preview={preview} />
          ) : (
            <div className="flex flex-col items-center gap-3 text-center">
              <h1 className="text-xl font-semibold">Invalid invite</h1>
              <p className="text-sm text-zinc-500">
                This invite link is invalid or has been reset.
              </p>
              <Link
                href="/dashboard"
                className={buttonClasses({ variant: "outline", size: "sm" })}
              >
                Go to dashboard
              </Link>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
