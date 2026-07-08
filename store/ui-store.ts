import { create } from "zustand";

/** Store layer — global UI state (sidebar, dialogs). */
interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebar: (collapsed: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebar: (collapsed) => set({ sidebarCollapsed: collapsed }),
}));
