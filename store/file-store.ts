import { create } from "zustand";

/** Store layer — which file is open in the editor (client-only selection). */
interface FileState {
  activeFileId: string | null;
  setActiveFile: (id: string | null) => void;
}

export const useFileStore = create<FileState>((set) => ({
  activeFileId: null,
  setActiveFile: (id) => set({ activeFileId: id }),
}));
