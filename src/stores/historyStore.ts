import { create } from 'zustand';
import type { VacationResult } from '../types/history';
import { loadFromStorage, saveToStorage, HISTORY_KEY } from '../utils/localStorage';

interface HistoryState {
  results: VacationResult[];
  addResult: (result: VacationResult) => void;
  hasResult: (startDate: string, endDate: string) => boolean;
  clearAll: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  results: loadFromStorage<VacationResult[]>(HISTORY_KEY) ?? [],

  addResult: (result) =>
    set((state) => {
      const next = [result, ...state.results];
      saveToStorage(HISTORY_KEY, next);
      return { results: next };
    }),

  hasResult: (startDate, endDate) =>
    get().results.some((r) => r.startDate === startDate && r.endDate === endDate),

  clearAll: () => {
    saveToStorage(HISTORY_KEY, []);
    set({ results: [] });
  },
}));
