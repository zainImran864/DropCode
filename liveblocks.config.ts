import type { LiveList } from "@liveblocks/client";

/** A single chat message stored in the room's Liveblocks storage. */
export type ChatMessage = {
  id: string;
  userId: string;
  name: string;
  color: string;
  body: string;
  at: number;
};

/**
 * Global Liveblocks types. Room id convention: `workspace:<workspaceId>`.
 * Editor cursors/selections use Yjs awareness; Liveblocks Presence carries the
 * typing flag, Storage holds chat history, and UserMeta the display info.
 */
declare global {
  interface Liveblocks {
    Presence: {
      typing: boolean;
    };
    Storage: {
      messages: LiveList<ChatMessage>;
    };
    UserMeta: {
      id: string;
      info: {
        name: string;
        color: string;
        avatar?: string;
      };
    };
  }
}

export {};
