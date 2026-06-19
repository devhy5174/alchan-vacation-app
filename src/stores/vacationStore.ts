import { create } from 'zustand';
import type { VacationPlan, WeeklySchedule, Task } from '../types/vacation';
import { DAYS_OF_WEEK } from '../types/vacation';
import { loadFromStorage, saveToStorage, removeFromStorage, VACATION_KEY } from '../utils/localStorage';

function migrateTask(val: unknown): Task {
  if (typeof val === 'string') return { text: val };
  if (val && typeof val === 'object' && 'text' in val && typeof (val as Task).text === 'string') {
    return {
      text: (val as Task).text,
      time: typeof (val as Task).time === 'string' ? (val as Task).time : undefined,
    };
  }
  return { text: String(val) };
}

function migrateWeeklySchedule(raw: unknown): WeeklySchedule {
  const empty = DAYS_OF_WEEK.reduce((acc, d) => ({ ...acc, [d]: [] }), {} as WeeklySchedule);
  if (!raw || typeof raw !== 'object') return empty;
  const result = { ...empty };
  for (const day of DAYS_OF_WEEK) {
    const val = (raw as Record<string, unknown>)[day];
    if (Array.isArray(val)) {
      result[day] = val.map(migrateTask);
    } else if (typeof val === 'string' && val.trim()) {
      result[day] = [{ text: val }];
    }
  }
  return result;
}

function loadPlan(): VacationPlan | null {
  const raw = loadFromStorage<Record<string, unknown>>(VACATION_KEY);
  if (!raw) return null;
  return {
    childName: String(raw.childName ?? ''),
    startDate: String(raw.startDate ?? ''),
    endDate: String(raw.endDate ?? ''),
    goal: String(raw.goal ?? ''),
    weeklySchedule: migrateWeeklySchedule(raw.weeklySchedule),
  };
}

interface VacationState {
  plan: VacationPlan | null;
  setPlan: (plan: VacationPlan) => void;
  clearPlan: () => void;
}

export const useVacationStore = create<VacationState>((set) => ({
  plan: loadPlan(),
  setPlan: (plan) => {
    saveToStorage(VACATION_KEY, plan);
    set({ plan });
  },
  clearPlan: () => {
    removeFromStorage(VACATION_KEY);
    set({ plan: null });
  },
}));
