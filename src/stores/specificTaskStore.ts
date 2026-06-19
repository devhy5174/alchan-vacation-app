import { create } from 'zustand';
import type { SpecificTask, SpecificTaskRecord, SpecificCompletionRecord } from '../types/specificTask';
import {
  loadFromStorage,
  saveToStorage,
  SPECIFIC_TASKS_KEY,
  SPECIFIC_COMPLETION_KEY,
} from '../utils/localStorage';

interface SpecificTaskState {
  tasks: SpecificTaskRecord;
  completion: SpecificCompletionRecord;
  addTask: (date: string, text: string, time?: string, important?: boolean) => void;
  updateTask: (date: string, id: string, text: string, time?: string, important?: boolean) => void;
  removeTask: (date: string, id: string) => void;
  toggleTask: (dateStr: string, taskId: string) => void;
}

export const useSpecificTaskStore = create<SpecificTaskState>((set) => ({
  tasks: loadFromStorage<SpecificTaskRecord>(SPECIFIC_TASKS_KEY) ?? {},
  completion: loadFromStorage<SpecificCompletionRecord>(SPECIFIC_COMPLETION_KEY) ?? {},

  addTask: (date, text, time, important) =>
    set((state) => {
      const task: SpecificTask = {
        id: crypto.randomUUID(),
        date,
        text,
        ...(time ? { time } : {}),
        ...(important ? { important: true } : {}),
      };
      const next = { ...state.tasks, [date]: [...(state.tasks[date] ?? []), task] };
      saveToStorage(SPECIFIC_TASKS_KEY, next);
      return { tasks: next };
    }),

  updateTask: (date, id, text, time, important) =>
    set((state) => {
      const next = {
        ...state.tasks,
        [date]: (state.tasks[date] ?? []).map((t) =>
          t.id === id ? { ...t, text, time: time || undefined, important: important ?? false } : t
        ),
      };
      saveToStorage(SPECIFIC_TASKS_KEY, next);
      return { tasks: next };
    }),

  removeTask: (date, id) =>
    set((state) => {
      const filtered = (state.tasks[date] ?? []).filter((t) => t.id !== id);
      const nextTasks = { ...state.tasks };
      if (filtered.length > 0) {
        nextTasks[date] = filtered;
      } else {
        delete nextTasks[date];
      }
      saveToStorage(SPECIFIC_TASKS_KEY, nextTasks);

      // 해당 task 완료 데이터도 정리
      const nextCompletion = { ...state.completion };
      if (nextCompletion[date]) {
        const dateComp = { ...nextCompletion[date] };
        delete dateComp[id];
        if (Object.keys(dateComp).length > 0) {
          nextCompletion[date] = dateComp;
        } else {
          delete nextCompletion[date];
        }
        saveToStorage(SPECIFIC_COMPLETION_KEY, nextCompletion);
      }

      return { tasks: nextTasks, completion: nextCompletion };
    }),

  toggleTask: (dateStr, taskId) =>
    set((state) => {
      const prev = state.completion[dateStr]?.[taskId] ?? false;
      const next = {
        ...state.completion,
        [dateStr]: { ...(state.completion[dateStr] ?? {}), [taskId]: !prev },
      };
      saveToStorage(SPECIFIC_COMPLETION_KEY, next);
      return { completion: next };
    }),
}));
