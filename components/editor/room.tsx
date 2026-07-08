"use client";

import { LiveList } from "@liveblocks/client";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
import { EditorSkeleton } from "./editor-skeleton";

/** Connects children to the workspace's Liveblocks room. */
export function Room({
  workspaceId,
  children,
}: {
  workspaceId: string;
  children: React.ReactNode;
}) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={`workspace:${workspaceId}`}
        initialPresence={{ typing: false }}
        initialStorage={{ messages: new LiveList([]) }}
      >
        <ClientSideSuspense fallback={<EditorSkeleton />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
