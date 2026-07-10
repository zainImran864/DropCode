import { requireUser } from "@/lib/auth";
import { getWorkspaces } from "@/api/workspaces";
import { WorkspaceGrid } from "@/components/workspace/workspace-grid";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";

export default async function WorkspacesPage() {
  const user = await requireUser();
  const workspaces = await getWorkspaces();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Workspaces</h1>
          <p className="text-sm text-zinc-500">
            All the spaces you own or collaborate in.
          </p>
        </div>
        <CreateWorkspaceDialog />
      </div>

      <WorkspaceGrid workspaces={workspaces} userId={user.id} />
    </div>
  );
}
