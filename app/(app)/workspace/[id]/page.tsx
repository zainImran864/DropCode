import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { getWorkspaceById } from "@/api/workspaces";
import { getWorkspaceMembers } from "@/api/members";
import { requireUser } from "@/lib/auth";
import { publicEnv } from "@/lib/env";
import { buttonClasses } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { MemberAvatars } from "@/components/workspace/member-avatars";
import { ShareDialog } from "@/components/workspace/share-dialog";
import { languageLabel } from "@/lib/languages";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const workspace = await getWorkspaceById(id);
  if (!workspace) notFound();

  const members = await getWorkspaceMembers(id);
  const myRole = members.find((m) => m.user_id === user.id)?.role ?? null;

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className={buttonClasses({ variant: "ghost", size: "icon" })}
            aria-label="Back to dashboard"
          >
            <FiArrowLeft size={18} />
          </Link>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold">{workspace.name}</span>
            <span className="text-xs text-zinc-500">
              {languageLabel(workspace.language)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MemberAvatars members={members} />
          <ShareDialog
            workspaceId={workspace.id}
            inviteToken={workspace.invite_token}
            siteUrl={publicEnv.NEXT_PUBLIC_SITE_URL}
            members={members}
            currentUserId={user.id}
            currentRole={myRole}
          />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="text-2xl font-semibold">{workspace.name}</h1>
        <p className="max-w-md text-zinc-500">
          The real-time collaborative editor (Monaco + Liveblocks) lands here in
          Phase 4. Invites, roles, and access control are live now — try the
          Share button.
        </p>
      </main>
    </div>
  );
}
