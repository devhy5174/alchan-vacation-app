export const VACATION_KEY = 'alchan_vacation_plan';
export const COMPLETION_KEY = 'alchan_completion';
export const MEMO_KEY = 'alchan_memo';
export const HISTORY_KEY = 'alchan_history';
export const SPECIFIC_TASKS_KEY = 'alchan_specific_tasks';
export const SPECIFIC_COMPLETION_KEY = 'alchan_specific_completion';

export function loadFromStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
