"use client";

import { FiLock } from "react-icons/fi";
import { Room } from "./room";
import { CollaborativeEditor } from "./collaborative-editor";
import { PresenceAvatars } from "./presence-avatars";

interface Props {
  workspaceId: string;
  language: string;
  readOnly: boolean;
}

/** The live editor area: presence bar + collaborative Monaco, inside the room. */
export function EditorPane({ workspaceId, language, readOnly }: Props) {
  return (
    <Room workspaceId={workspaceId}>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-1.5 dark:border-zinc-800 dark:bg-zinc-950">
          <PresenceAvatars />
          {readOnly && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
              <FiLock size={12} />
              Read-only
            </span>
          )}
        </div>
        <div className="min-h-0 flex-1">
          <CollaborativeEditor language={language} readOnly={readOnly} />
        </div>
      </div>
    </Room>
  );
}
