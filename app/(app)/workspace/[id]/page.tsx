import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { getWorkspaceById } from "@/api/workspaces";
import { getWorkspaceMembers } from "@/api/members";
import { getFiles } from "@/api/files";
import { requireUser } from "@/lib/auth";
import { publicEnv, serverEnv } from "@/lib/env";
import { buttonClasses } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { MemberAvatars } from "@/components/workspace/member-avatars";
import { ShareDialog } from "@/components/workspace/share-dialog";
import { LanguageSwitcher } from "@/components/editor/language-switcher";
import { EditorPane } from "@/components/editor/editor-pane";
import { LiveblocksSetupNotice } from "@/components/editor/liveblocks-setup-notice";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    return await renderWorkspace(id);
  } catch (err) {
    // Let Next handle its own control-flow signals (redirect / notFound).
    const digest = (err as { digest?: string })?.digest;
    if (typeof digest === "string" && digest.startsWith("NEXT_")) throw err;

    // TEMPORARY diagnostic: surface the real error (prod hides it otherwise).
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-3 bg-zinc-50 p-6 text-center dark:bg-black">
        <h1 className="text-lg font-semibold">Workspace failed to load</h1>
        <pre className="max-w-2xl overflow-auto whitespace-pre-wrap rounded bg-zinc-100 p-4 text-left text-xs text-red-600 dark:bg-zinc-900">
          {(err as Error)?.message ?? String(err)}
        </pre>
        <Link
          href="/dashboard"
          className={buttonClasses({ variant: "outline", size: "sm" })}
        >
          Back to dashboard
        </Link>
      </div>
    );
  }
}

async function renderWorkspace(id: string) {
  const user = await requireUser();
  const workspace = await getWorkspaceById(id);
  if (!workspace) notFound();

  const members = await getWorkspaceMembers(id);
  const myRole = members.find((m) => m.user_id === user.id)?.role ?? null;
  const canManage = myRole === "owner" || myRole === "admin";
  const canEdit =
    myRole === "owner" || myRole === "admin" || myRole === "editor";
  const readOnly = myRole === "viewer";
  const liveblocksEnabled = Boolean(serverEnv().LIVEBLOCKS_SECRET_KEY);
  const files = liveblocksEnabled ? await getFiles(id) : [];

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-zinc-50 dark:bg-black">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className={buttonClasses({ variant: "ghost", size: "icon" })}
            aria-label="Back to dashboard"
          >
            <FiArrowLeft size={18} />
          </Link>
          <span className="font-semibold">{workspace.name}</span>
          <LanguageSwitcher
            workspaceId={workspace.id}
            language={workspace.language}
            canManage={canManage}
          />
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

      {liveblocksEnabled ? (
        <EditorPane
          workspaceId={workspace.id}
          workspaceName={workspace.name}
          files={files}
          fallbackLanguage={workspace.language}
          canEdit={canEdit}
          readOnly={readOnly}
        />
      ) : (
        <LiveblocksSetupNotice />
      )}
    </div>
  );
}
