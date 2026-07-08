/**
 * Global Liveblocks types. Room id convention: `workspace:<workspaceId>`.
 * Cursors/selections are driven by Yjs awareness; Liveblocks Presence stays
 * empty and UserMeta carries the display info resolved by the auth endpoint.
 */
declare global {
  interface Liveblocks {
    Presence: Record<string, never>;
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
