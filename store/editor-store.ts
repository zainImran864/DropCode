import { create } from "zustand";

export type SaveState = "idle" | "unsaved" | "saving" | "saved";

/**
 * Store layer — editor save status + handlers registered by the active editor,
 * so the toolbar (Save button, Export) can drive it without prop drilling.
 */
interface EditorState {
  saveState: SaveState;
  setSaveState: (s: SaveState) => void;
  save: (() => void) | null;
  setSave: (fn: (() => void) | null) => void;
  getContent: (() => string) | null;
  setGetContent: (fn: (() => string) | null) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  saveState: "idle",
  setSaveState: (saveState) => set({ saveState }),
  save: null,
  setSave: (save) => set({ save }),
  getContent: null,
  setGetContent: (getContent) => set({ getContent }),
}));
