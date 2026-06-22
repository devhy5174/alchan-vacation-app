import { create } from 'zustand';
import type { ParentReward, RewardIcon } from '../types/parentReward';
import { loadFromStorage, saveToStorage, PARENT_REWARDS_KEY } from '../utils/localStorage';

interface ParentRewardState {
  rewards: ParentReward[];
  addReward: (date: string, text: string, icon: RewardIcon) => void;
  removeReward: (id: string) => void;
}

export const useParentRewardStore = create<ParentRewardState>((set) => ({
  rewards: loadFromStorage<ParentReward[]>(PARENT_REWARDS_KEY) ?? [],

  addReward: (date, text, icon) =>
    set((state) => {
      const reward: ParentReward = { id: crypto.randomUUID(), date, text, icon };
      const next = [...state.rewards, reward].sort((a, b) => a.date.localeCompare(b.date));
      saveToStorage(PARENT_REWARDS_KEY, next);
      return { rewards: next };
    }),

  removeReward: (id) =>
    set((state) => {
      const next = state.rewards.filter((r) => r.id !== id);
      saveToStorage(PARENT_REWARDS_KEY, next);
      return { rewards: next };
    }),
}));
