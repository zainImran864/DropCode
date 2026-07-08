"use client";

import { FiX } from "react-icons/fi";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useMemberActions } from "@/hooks/use-member-actions";
import type { MemberWithProfile, Role } from "@/types/database";

interface Props {
  member: MemberWithProfile;
  workspaceId: string;
  canManage: boolean;
  isSelf: boolean;
}

const ASSIGNABLE_ROLES: Role[] = ["admin", "editor", "viewer"];

export function MemberRow({ member, workspaceId, canManage, isSelf }: Props) {
  const { updateRole, removeMember, isPending } = useMemberActions(workspaceId);
  const isOwner = member.role === "owner";
  const editable = canManage && !isOwner && !isSelf;

  return (
    <div className="flex items-center gap-3 py-2">
      <Avatar name={member.display_name} src={member.avatar_url} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {member.display_name ?? "Unknown"}
          {isSelf && <span className="text-zinc-400"> (you)</span>}
        </p>
      </div>

      {editable ? (
        <Select
          value={member.role}
          disabled={isPending}
          onChange={(e) => updateRole(member.user_id, e.target.value as Role)}
          className="h-8 w-24 py-0 text-xs"
        >
          {ASSIGNABLE_ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
      ) : (
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium capitalize text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          {member.role}
        </span>
      )}

      {editable && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Remove member"
          disabled={isPending}
          onClick={() => removeMember(member.user_id)}
          className="h-8 w-8 text-zinc-400 hover:text-red-500"
        >
          <FiX size={16} />
        </Button>
      )}
    </div>
  );
}
