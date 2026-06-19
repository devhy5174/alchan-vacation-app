export interface SpecificTask {
  id: string;
  date: string;      // YYYY-MM-DD
  text: string;
  time?: string;     // HH:MM (24h)
  important?: boolean;
}

// YYYY-MM-DD → tasks[]
export type SpecificTaskRecord = Record<string, SpecificTask[]>;

// YYYY-MM-DD → { taskId: isDone }
export type SpecificCompletionRecord = Record<string, Record<string, boolean>>;
