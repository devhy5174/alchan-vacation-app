import type { VacationPlan, DayOfWeek } from '../types/vacation';
import type { CompletionRecord } from '../types/completion';
import type { SpecificTaskRecord, SpecificCompletionRecord } from '../types/specificTask';
import { DAY_LABELS } from '../types/vacation';
import { getDaysInRange, getDayOfWeek, toDateStr } from './date';

export interface ResultStats {
  totalTasks: number;
  completedTasks: number;
  achievementRate: number;
  longestStreak: number;
  bestDayOfWeek: string;
  stickerCount: number;
}

export function calcResultStats(
  plan: VacationPlan,
  completion: CompletionRecord,
  specTasks: SpecificTaskRecord = {},
  specCompletion: SpecificCompletionRecord = {},
): ResultStats {
  const empty: ResultStats = {
    totalTasks: 0,
    completedTasks: 0,
    achievementRate: 0,
    longestStreak: 0,
    bestDayOfWeek: '-',
    stickerCount: 0,
  };

  if (!plan.weeklySchedule || !plan.startDate || !plan.endDate) return empty;

  const { weeklySchedule } = plan;
  const todayStr = toDateStr(new Date());

  // 오늘까지의 날짜만 집계
  const dates = getDaysInRange(plan.startDate, plan.endDate).filter(
    (d) => toDateStr(d) <= todayStr
  );

  if (dates.length === 0) return empty;

  let totalTasks = 0;
  let completedTasks = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  let stickerCount = 0;

  const dayTotals: Partial<Record<DayOfWeek, number>> = {};
  const dayDoneMap: Partial<Record<DayOfWeek, number>> = {};

  for (const date of dates) {
    const dow = getDayOfWeek(date);
    const dateStr = toDateStr(date);

    // 반복 할 일
    const weekly = weeklySchedule[dow] ?? [];
    const comps = completion[dateStr] ?? [];
    const weeklyTotal = weekly.length;
    const weeklyDone = weekly.filter((_, i) => comps[i] ?? false).length;

    // 특별 할 일
    const specific = specTasks[dateStr] ?? [];
    const specDone = specCompletion[dateStr] ?? {};
    const specificTotal = specific.length;
    const specificDone = specific.filter(t => specDone[t.id] ?? false).length;

    const dayTotal = weeklyTotal + specificTotal;
    const dayDone = weeklyDone + specificDone;

    // 달성판 스티커 로직 (StickerBook과 동일)
    const isWeekend = dow === 'sat' || dow === 'sun';
    let hasSticker: boolean;
    if (dayTotal === 0) {
      // 할 일 없는 날 → 주말만 자동 도장
      hasSticker = isWeekend;
    } else {
      hasSticker = dayDone === dayTotal;
    }

    if (hasSticker) {
      stickerCount++;
      currentStreak++;
      if (currentStreak > longestStreak) longestStreak = currentStreak;
    } else {
      currentStreak = 0;
    }

    // 달성률 집계 (할 일 있는 날만)
    if (dayTotal > 0) {
      totalTasks += dayTotal;
      completedTasks += dayDone;

      dayTotals[dow] = (dayTotals[dow] ?? 0) + dayTotal;
      dayDoneMap[dow] = (dayDoneMap[dow] ?? 0) + dayDone;
    }
  }

  const achievementRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 가장 성실한 요일
  let bestDayOfWeek = '-';
  let bestRate = -1;
  for (const [day, total] of Object.entries(dayTotals) as [DayOfWeek, number][]) {
    if (!total) continue;
    const rate = (dayDoneMap[day] ?? 0) / total;
    if (rate > bestRate) {
      bestRate = rate;
      bestDayOfWeek = DAY_LABELS[day] + '요일';
    }
  }

  return { totalTasks, completedTasks, achievementRate, longestStreak, bestDayOfWeek, stickerCount };
}
