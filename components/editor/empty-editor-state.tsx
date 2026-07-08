import { FiFilePlus } from "react-icons/fi";

export function EmptyEditorState({ canEdit }: { canEdit: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
        <FiFilePlus size={22} />
      </div>
      <p className="font-medium">No file open</p>
      <p className="max-w-xs text-sm text-zinc-500">
        {canEdit
          ? "Create a file with the + button in the sidebar to start coding."
          : "No files in this workspace yet."}
      </p>
    </div>
  );
}
