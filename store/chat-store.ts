import { create } from "zustand";

/** Store layer — chat sidebar open state + unread counter. */
interface ChatState {
  isOpen: boolean;
  unread: number;
  toggle: () => void;
  close: () => void;
  incUnread: (n: number) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  unread: 0,
  // Opening the sidebar clears the unread badge.
  toggle: () =>
    set((s) => ({ isOpen: !s.isOpen, unread: s.isOpen ? s.unread : 0 })),
  close: () => set({ isOpen: false }),
  incUnread: (n) => set((s) => ({ unread: s.unread + n })),
}));
