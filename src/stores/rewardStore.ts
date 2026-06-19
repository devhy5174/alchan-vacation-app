import { create } from 'zustand';
import type { DiaryTheme, RewardData } from '../types/reward';
import { REWARD_MILESTONES } from '../types/reward';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';

// 버전 변경 시 기존 데이터 자동 초기화
const REWARD_KEY = 'alchan_reward_v2';

interface RewardStoreState extends RewardData {
  setTheme: (theme: DiaryTheme) => void;
  checkAndUnlock: (streak: number) => void;
}


export const useRewardStore = create<RewardStoreState>((set, get) => {
  const stored = loadFromStorage<RewardData>(REWARD_KEY);
  const initial: RewardData = {
    unlockedThemes: stored?.unlockedThemes?.includes('orange')
      ? stored.unlockedThemes
      : ['orange'],
    selectedTheme: stored?.selectedTheme ?? 'orange',
    maxStreak: stored?.maxStreak ?? 0,
  };

  return {
    ...initial,

    setTheme: (theme) => {
      const { unlockedThemes } = get();
      if (!unlockedThemes.includes(theme)) return;
      set({ selectedTheme: theme });
      saveToStorage(REWARD_KEY, { ...get(), selectedTheme: theme });
    },

    checkAndUnlock: (streak) => {
      const state = get();
      const newMax = Math.max(state.maxStreak, streak);
      const newThemes = [...state.unlockedThemes];
      let changed = false;

      for (const milestone of REWARD_MILESTONES) {
        if (newMax >= milestone.streak && !newThemes.includes(milestone.id as DiaryTheme)) {
          newThemes.push(milestone.id as DiaryTheme);
          changed = true;
        }
      }

      if (changed || newMax !== state.maxStreak) {
        const next: RewardData = {
          unlockedThemes: newThemes,
          selectedTheme: state.selectedTheme,
          maxStreak: newMax,
        };
        set(next);
        saveToStorage(REWARD_KEY, next);
      }
    },
  };
});
