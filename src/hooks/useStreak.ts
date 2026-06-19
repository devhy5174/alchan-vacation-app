import { useEffect } from 'react';
import { useVacationStore } from '../stores/vacationStore';
import { useCompletionStore } from '../stores/completionStore';
import { useSpecificTaskStore } from '../stores/specificTaskStore';
import { useRewardStore } from '../stores/rewardStore';
import { calcCurrentStreak, calcMaxStreak } from '../utils/streak';

export function useStreak() {
  const plan = useVacationStore((s) => s.plan);
  const completion = useCompletionStore((s) => s.completion);
  const { tasks: specTasks, completion: specCompletion } = useSpecificTaskStore();
  const checkAndUnlock = useRewardStore((s) => s.checkAndUnlock);

  const currentStreak = plan
    ? calcCurrentStreak(plan, completion, specTasks, specCompletion)
    : 0;
  const historicalMax = plan
    ? calcMaxStreak(plan, completion, specTasks, specCompletion)
    : 0;

  useEffect(() => {
    if (plan) checkAndUnlock(Math.max(currentStreak, historicalMax));
  }, [plan, currentStreak, historicalMax, checkAndUnlock]);

  return { currentStreak, historicalMax };
}
