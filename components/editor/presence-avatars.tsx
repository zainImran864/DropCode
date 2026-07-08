"use client";

import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { Avatar } from "@/components/ui/avatar";

function PresenceAvatar({
  info,
  you,
}: {
  info: { name: string; color: string; avatar?: string };
  you?: boolean;
}) {
  return (
    <div
      title={you ? `${info.name} (you)` : info.name}
      className="rounded-full ring-2"
      style={{ boxShadow: `0 0 0 2px ${info.color}` }}
    >
      <Avatar name={info.name} src={info.avatar} className="h-7 w-7" />
    </div>
  );
}

/** Live "who's online" stack for the current room. */
export function PresenceAvatars() {
  const others = useOthers();
  const self = useSelf();

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-1.5">
        {self && <PresenceAvatar info={self.info} you />}
        {others.map((o) => (
          <PresenceAvatar key={o.connectionId} info={o.info} />
        ))}
      </div>
      <span className="text-xs text-zinc-500">
        {others.length + 1} online
      </span>
    </div>
  );
}
