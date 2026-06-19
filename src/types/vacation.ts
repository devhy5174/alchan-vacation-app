export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export const DAY_LABELS: Record<DayOfWeek, string> = {
  mon: '월',
  tue: '화',
  wed: '수',
  thu: '목',
  fri: '금',
  sat: '토',
  sun: '일',
};

export const DAYS_OF_WEEK: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export interface Task {
  text: string;
  time?: string;
}

export type WeeklySchedule = Record<DayOfWeek, Task[]>;

export interface VacationPlan {
  childName: string;
  startDate: string;
  endDate: string;
  goal: string;
  weeklySchedule?: WeeklySchedule;
}
