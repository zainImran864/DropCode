import { FiFolder } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import { WorkspaceCard } from "./workspace-card";
import type { WorkspaceListItem } from "@/types/database";

interface Props {
  workspaces: WorkspaceListItem[];
  userId: string;
}

export function WorkspaceGrid({ workspaces, userId }: Props) {
  if (workspaces.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center gap-2 p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
          <FiFolder size={22} />
        </div>
        <p className="font-medium">No workspaces yet</p>
        <p className="max-w-xs text-sm text-zinc-500">
          Create your first workspace to start coding together in real time.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {workspaces.map((w) => (
        <WorkspaceCard
          key={w.id}
          workspace={w}
          isOwner={w.owner_id === userId}
        />
      ))}
    </div>
  );
}
