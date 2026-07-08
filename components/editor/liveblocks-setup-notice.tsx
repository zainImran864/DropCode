import { FiZap } from "react-icons/fi";
import { Card } from "@/components/ui/card";

/** Shown when LIVEBLOCKS_SECRET_KEY is missing, so the page still renders. */
export function LiveblocksSetupNotice() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="flex max-w-md flex-col items-center gap-3 p-8 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-500 dark:bg-amber-500/10">
          <FiZap size={20} />
        </div>
        <h2 className="text-lg font-semibold">Real-time editing not configured</h2>
        <p className="text-sm text-zinc-500">
          Add a <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">LIVEBLOCKS_SECRET_KEY</code>{" "}
          to your <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">.env</code> (from the
          Liveblocks dashboard) and restart the dev server to enable the
          collaborative editor.
        </p>
      </Card>
    </div>
  );
}
