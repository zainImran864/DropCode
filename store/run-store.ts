import { create } from "zustand";
import type { RunResult } from "@/types/run";

/** Store layer — code execution state shared by the Run button + output panel. */
interface RunState {
  isRunning: boolean;
  result: RunResult | null;
  error: string | null;
  isOpen: boolean;
  setRunning: (b: boolean) => void;
  setResult: (r: RunResult | null) => void;
  setError: (e: string | null) => void;
  setOpen: (b: boolean) => void;
}

export const useRunStore = create<RunState>((set) => ({
  isRunning: false,
  result: null,
  error: null,
  isOpen: false,
  setRunning: (isRunning) => set({ isRunning }),
  setResult: (result) => set({ result }),
  setError: (error) => set({ error }),
  setOpen: (isOpen) => set({ isOpen }),
}));
