import { useEffect } from 'react';
import { useVacationStore } from '../stores/vacationStore';
import { useCompletionStore } from '../stores/completionStore';
import { useHistoryStore } from '../stores/historyStore';
import { calcResultStats } from '../utils/resultStats';
import { toDateStr } from '../utils/date';

export function useAutoSaveResult() {
  const plan = useVacationStore((s) => s.plan);
  const completion = useCompletionStore((s) => s.completion);
  const addResult = useHistoryStore((s) => s.addResult);
  const hasResult = useHistoryStore((s) => s.hasResult);

  useEffect(() => {
    if (!plan) return;

    const today = toDateStr(new Date());
    if (today <= plan.endDate) return; // 방학 미종료

    if (hasResult(plan.startDate, plan.endDate)) return; // 이미 저장됨

    const stats = calcResultStats(plan, completion);
    addResult({
      id: `${plan.startDate}_${plan.endDate}`,
      childName: plan.childName,
      startDate: plan.startDate,
      endDate: plan.endDate,
      goal: plan.goal,
      achievementRate: stats.achievementRate,
      totalTasks: stats.totalTasks,
      completedTasks: stats.completedTasks,
      longestStreak: stats.longestStreak,
      bestDayOfWeek: stats.bestDayOfWeek,
      stickerCount: stats.stickerCount,
      savedAt: new Date().toISOString(),
    });
  // plan, completion이 변할 때만 재평가; addResult/hasResult는 stable
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, completion]);
}
