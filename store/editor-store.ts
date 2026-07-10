import { create } from "zustand";

export type SaveState = "idle" | "unsaved" | "saving" | "saved";

/**
 * Store layer — editor save status + handlers registered by the active editor,
 * so the toolbar (Save, Export, History, Lock) can drive it without prop drilling.
 */
interface EditorState {
  saveState: SaveState;
  setSaveState: (s: SaveState) => void;
  save: (() => void) | null;
  setSave: (fn: (() => void) | null) => void;
  getContent: (() => string) | null;
  setGetContent: (fn: (() => string) | null) => void;
  applyContent: ((text: string) => void) | null;
  setApplyContent: (fn: ((text: string) => void) | null) => void;
  locked: boolean;
  toggleLock: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  saveState: "idle",
  setSaveState: (saveState) => set({ saveState }),
  save: null,
  setSave: (save) => set({ save }),
  getContent: null,
  setGetContent: (getContent) => set({ getContent }),
  applyContent: null,
  setApplyContent: (applyContent) => set({ applyContent }),
  locked: false,
  toggleLock: () => set((s) => ({ locked: !s.locked })),
}));
