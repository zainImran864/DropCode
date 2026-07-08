import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { MemberWithProfile } from "@/types/database";

interface Props {
  members: MemberWithProfile[];
  max?: number;
}

/** Overlapping avatar stack for a workspace's members. */
export function MemberAvatars({ members, max = 4 }: Props) {
  const shown = members.slice(0, max);
  const extra = members.length - shown.length;

  return (
    <div className="flex -space-x-2">
      {shown.map((m) => (
        <Avatar
          key={m.user_id}
          name={m.display_name}
          src={m.avatar_url}
          className="ring-2 ring-white dark:ring-zinc-950"
        />
      ))}
      {extra > 0 && (
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium text-zinc-600 ring-2 ring-white dark:bg-zinc-700 dark:text-zinc-200 dark:ring-zinc-950",
          )}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}
