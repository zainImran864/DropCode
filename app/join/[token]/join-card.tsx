"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FiUsers } from "react-icons/fi";
import { joinWorkspaceAction } from "@/app/(app)/member-actions";
import { Button } from "@/components/ui/button";
import { languageLabel } from "@/lib/languages";
import { MAX_WORKSPACE_MEMBERS, type WorkspacePreview } from "@/types/database";

export function JoinCard({
  token,
  preview,
}: {
  token: string;
  preview: WorkspacePreview;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isFull = preview.member_count >= MAX_WORKSPACE_MEMBERS;

  function join() {
    startTransition(async () => {
      const res = await joinWorkspaceAction(token);
      if (!res.ok) return toast.error(res.error);
      toast.success("Joined workspace");
      router.push(`/workspace/${res.data.workspaceId}`);
    });
  }

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <p className="text-xs font-medium uppercase tracking-wide text-indigo-500">
        {languageLabel(preview.language)} workspace
      </p>
      <h1 className="text-2xl font-semibold">{preview.name}</h1>
      <div className="flex items-center gap-1.5 text-sm text-zinc-500">
        <FiUsers size={14} />
        {preview.member_count}/{MAX_WORKSPACE_MEMBERS} members
      </div>
      <Button
        onClick={join}
        disabled={isPending || isFull}
        className="w-full"
      >
        {isFull ? "Workspace is full" : isPending ? "Joining…" : "Join workspace"}
      </Button>
    </div>
  );
}
