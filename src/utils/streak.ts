import type { CompletionRecord } from '../types/completion';
import type { SpecificCompletionRecord, SpecificTaskRecord } from '../types/specificTask';
import type { VacationPlan } from '../types/vacation';
import { getDaysInRange, getDayOfWeek, toDateStr } from './date';

function isDayComplete(
  dateStr: string,
  plan: VacationPlan,
  completion: CompletionRecord,
  specTasks: SpecificTaskRecord,
  specCompletion: SpecificCompletionRecord
): boolean | null {
  const date = new Date(dateStr + 'T00:00:00');
  const day = getDayOfWeek(date);
  const weeklyTasks = plan.weeklySchedule?.[day] ?? [];
  const specificTasks = specTasks[dateStr] ?? [];
  const total = weeklyTasks.length + specificTasks.length;
  if (total === 0) return null;

  const completions = completion[dateStr] ?? [];
  const specDone = specCompletion[dateStr] ?? {};
  const done =
    weeklyTasks.filter((_, i) => completions[i] ?? false).length +
    specificTasks.filter((t) => specDone[t.id] ?? false).length;
  return done === total;
}

export function calcCurrentStreak(
  plan: VacationPlan,
  completion: CompletionRecord,
  specTasks: SpecificTaskRecord,
  specCompletion: SpecificCompletionRecord
): number {
  const today = toDateStr(new Date());
  const dates = getDaysInRange(plan.startDate, plan.endDate)
    .map((d) => toDateStr(d))
    .filter((d) => d <= today);

  let streak = 0;
  for (let i = dates.length - 1; i >= 0; i--) {
    const result = isDayComplete(dates[i], plan, completion, specTasks, specCompletion);
    if (result === null) continue;
    if (result) {
      streak++;
    } else {
      // 오늘이 아직 미완료 상태면 끊지 않고 전날부터 계속 계산
      if (dates[i] === today) continue;
      break;
    }
  }
  return streak;
}

export function calcMaxStreak(
  plan: VacationPlan,
  completion: CompletionRecord,
  specTasks: SpecificTaskRecord,
  specCompletion: SpecificCompletionRecord
): number {
  const today = toDateStr(new Date());
  const dates = getDaysInRange(plan.startDate, plan.endDate)
    .map((d) => toDateStr(d))
    .filter((d) => d <= today);

  let maxStreak = 0;
  let current = 0;
  for (const dateStr of dates) {
    const result = isDayComplete(dateStr, plan, completion, specTasks, specCompletion);
    if (result === null) continue;
    if (result) {
      current++;
      if (current > maxStreak) maxStreak = current;
    } else {
      current = 0;
    }
  }
  return maxStreak;
}

// 날짜별 연속 달성 카운트 (오늘까지만 / 달력 마일스톤 표시용)
export function calcStreakPerDay(
  plan: VacationPlan,
  completion: CompletionRecord,
  specTasks: SpecificTaskRecord,
  specCompletion: SpecificCompletionRecord
): Record<string, number> {
  const today = toDateStr(new Date());
  const dates = getDaysInRange(plan.startDate, plan.endDate)
    .map((d) => toDateStr(d))
    .filter((d) => d <= today);

  const result: Record<string, number> = {};
  let streak = 0;

  for (const dateStr of dates) {
    const complete = isDayComplete(dateStr, plan, completion, specTasks, specCompletion);
    if (complete === true) {
      streak++;
      result[dateStr] = streak;
    } else {
      if (complete === false) streak = 0;
      result[dateStr] = 0;
    }
  }
  return result;
}
