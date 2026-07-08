"use client";

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
      <RoomProvider id={`workspace:${workspaceId}`} initialPresence={{}}>
        <ClientSideSuspense fallback={<EditorSkeleton />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
