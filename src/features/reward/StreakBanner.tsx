import { FiZap } from 'react-icons/fi';
import { useRewardStore } from '../../stores/rewardStore';
import { REWARD_MILESTONES } from '../../types/reward';
import { useStreak } from '../../hooks/useStreak';

export default function StreakBanner() {
  const { currentStreak, historicalMax } = useStreak();
  const storedMax = useRewardStore((s) => s.maxStreak);
  const displayMax = Math.max(storedMax, historicalMax, currentStreak);

  const nextMilestoneStreak = REWARD_MILESTONES.find((m) => m.streak > displayMax)?.streak ?? null;
  const daysLeft = nextMilestoneStreak ? nextMilestoneStreak - currentStreak : 0;
  const nextRewards = nextMilestoneStreak
    ? REWARD_MILESTONES.filter((m) => m.streak === nextMilestoneStreak).map((m) => m.label)
    : [];

  return (
    <div className="flex items-center justify-between px-3 py-2 mb-3 bg-orange-50 rounded-xl border border-orange-100">
      <div className="flex items-center gap-2">
        <FiZap size={15} className="text-orange-400" style={{ fill: '#fed7aa' }} />
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-orange-500">
            {currentStreak > 0 ? `${currentStreak}일 연속` : '시작해볼까요!'}
          </span>
          {displayMax > 0 && (
            <span className="text-xs text-gray-400">/ 최고 {displayMax}일</span>
          )}
        </div>
      </div>

      {nextRewards.length > 0 ? (
        <span className="text-xs text-gray-500 text-right">
          <span className="font-medium text-orange-400">{daysLeft}일 후</span>{' '}
          {nextRewards[0]}{nextRewards.length > 1 ? ` 외 ${nextRewards.length - 1}개` : ''}
        </span>
      ) : (
        <span className="text-xs text-orange-400 font-medium">모든 보상 달성!</span>
      )}
    </div>
  );
}
