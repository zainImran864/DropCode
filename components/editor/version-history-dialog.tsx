"use client";

import { useCallback, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { FiClock, FiRotateCcw } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { listVersionsAction } from "@/app/(app)/version-actions";
import { useVersions } from "@/hooks/use-versions";
import type { VersionMeta } from "@/types/database";

interface Props {
  workspaceId: string;
  fileId: string;
  canEdit: boolean;
}

export function VersionHistoryDialog({ workspaceId, fileId, canEdit }: Props) {
  const [open, setOpen] = useState(false);
  const [versions, setVersions] = useState<VersionMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { save, restore, isPending } = useVersions(workspaceId, fileId);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await listVersionsAction(fileId);
    setLoading(false);
    if (res.ok) setVersions(res.data);
  }, [fileId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) load();
  }, [open, load]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Version history">
          <FiClock size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Version history</DialogTitle>
          <DialogDescription>
            Snapshots of this file you can restore anytime.
          </DialogDescription>
        </DialogHeader>

        {canEdit && (
          <div className="mb-3 flex items-center gap-2">
            <Input
              value={message}
              placeholder="Snapshot message (optional)"
              onChange={(e) => setMessage(e.target.value)}
              className="h-9 text-sm"
            />
            <Button
              size="sm"
              disabled={isPending}
              onClick={() => save(message, () => {
                setMessage("");
                load();
              })}
            >
              Save version
            </Button>
          </div>
        )}

        <div className="max-h-72 divide-y divide-zinc-100 overflow-y-auto dark:divide-zinc-800">
          {loading ? (
            <div className="flex flex-col gap-3 py-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : versions.length === 0 ? (
            <p className="py-6 text-center text-sm text-zinc-400">
              No versions yet. Save one above.
            </p>
          ) : (
            versions.map((v) => (
              <div key={v.id} className="flex items-center gap-3 py-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {v.message || "Untitled snapshot"}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {v.author_name ?? "Someone"} ·{" "}
                    {formatDistanceToNow(new Date(v.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                {canEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => restore(v.id, () => setOpen(false))}
                  >
                    <FiRotateCcw size={14} className="mr-1.5" />
                    Restore
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
