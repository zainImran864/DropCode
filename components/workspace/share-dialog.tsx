"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FiCopy, FiRefreshCw, FiShare2, FiLogOut } from "react-icons/fi";
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
import { MemberRow } from "./member-row";
import { useMemberActions } from "@/hooks/use-member-actions";
import { MAX_WORKSPACE_MEMBERS, type MemberWithProfile, type Role } from "@/types/database";

interface Props {
  workspaceId: string;
  inviteToken: string;
  siteUrl: string;
  members: MemberWithProfile[];
  currentUserId: string;
  currentRole: Role | null;
}

export function ShareDialog({
  workspaceId,
  inviteToken,
  siteUrl,
  members,
  currentUserId,
  currentRole,
}: Props) {
  const [token, setToken] = useState(inviteToken);
  const { resetToken, leave, isPending } = useMemberActions(workspaceId);

  const canManage = currentRole === "owner" || currentRole === "admin";
  const isOwner = currentRole === "owner";
  const inviteLink = `${siteUrl}/join/${token}`;
  const isFull = members.length >= MAX_WORKSPACE_MEMBERS;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Invite link copied");
    } catch {
      toast.error("Couldn't copy — copy it manually");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <FiShare2 size={15} className="mr-1.5" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share workspace</DialogTitle>
          <DialogDescription>
            Anyone with the link can join, up to {MAX_WORKSPACE_MEMBERS} members
            ({members.length}/{MAX_WORKSPACE_MEMBERS} used).
          </DialogDescription>
        </DialogHeader>

        {/* Invite link */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Input readOnly value={inviteLink} className="text-xs" />
            <Button size="icon" variant="outline" aria-label="Copy link" onClick={copyLink}>
              <FiCopy size={16} />
            </Button>
          </div>
          {isFull && (
            <p className="text-xs text-amber-600">
              This workspace is full — remove a member to invite someone new.
            </p>
          )}
          {canManage && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => resetToken((t) => setToken(t))}
              className="flex w-fit items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 disabled:opacity-60 dark:hover:text-zinc-200"
            >
              <FiRefreshCw size={12} />
              Reset link (revokes the old one)
            </button>
          )}
        </div>

        {/* Members */}
        <div className="mt-2 border-t border-zinc-200 pt-2 dark:border-zinc-800">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-400">
            Members
          </p>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {members.map((m) => (
              <MemberRow
                key={m.user_id}
                member={m}
                workspaceId={workspaceId}
                canManage={canManage}
                isSelf={m.user_id === currentUserId}
              />
            ))}
          </div>
        </div>

        {!isOwner && (
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={leave}
            className="mt-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <FiLogOut size={15} className="mr-1.5" />
            Leave workspace
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
