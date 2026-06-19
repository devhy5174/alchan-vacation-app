import { create } from 'zustand';
import type { CompletionRecord } from '../types/completion';
import { loadFromStorage, saveToStorage, COMPLETION_KEY } from '../utils/localStorage';

interface CompletionState {
  completion: CompletionRecord;
  toggleTask: (dateStr: string, taskIndex: number, totalTasks: number) => void;
  clearAll: () => void;
}

export const useCompletionStore = create<CompletionState>((set) => ({
  completion: loadFromStorage<CompletionRecord>(COMPLETION_KEY) ?? {},

  toggleTask: (dateStr, taskIndex, totalTasks) =>
    set((state) => {
      const existing = state.completion[dateStr] ?? [];
      const updated = Array.from({ length: Math.max(totalTasks, existing.length) }, (_, i) => existing[i] ?? false);
      updated[taskIndex] = !updated[taskIndex];
      const next = { ...state.completion, [dateStr]: updated };
      saveToStorage(COMPLETION_KEY, next);
      return { completion: next };
    }),

  clearAll: () => {
    saveToStorage(COMPLETION_KEY, {});
    set({ completion: {} });
  },
}));
