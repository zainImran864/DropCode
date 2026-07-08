import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { getWorkspaceById } from "@/api/workspaces";
import { buttonClasses } from "@/components/ui/button";
import { languageLabel } from "@/lib/languages";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workspace = await getWorkspaceById(id);
  if (!workspace) notFound();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 px-6 text-center dark:bg-black">
      <p className="text-xs font-medium uppercase tracking-wide text-indigo-500">
        {languageLabel(workspace.language)} workspace
      </p>
      <h1 className="text-3xl font-semibold">{workspace.name}</h1>
      <p className="max-w-md text-zinc-500">
        The real-time collaborative editor lands here in Phase 4 (Monaco +
        Liveblocks). For now this confirms routing and access control work.
      </p>
      <Link
        href="/dashboard"
        className={buttonClasses({ variant: "outline", size: "sm" })}
      >
        <FiArrowLeft size={16} className="mr-1.5" />
        Back to dashboard
      </Link>
    </div>
  );
}
