import { FiX, FiStar, FiAward, FiGift } from 'react-icons/fi';
import type { VacationPlan } from '../../types/vacation';
import { getDaysInRange, getDayOfWeek, toDateStr } from '../../utils/date';
import { useCompletionStore } from '../../stores/completionStore';
import { useSpecificTaskStore } from '../../stores/specificTaskStore';
import { calcMilestonePositions } from '../../utils/streak';
import StreakBanner from '../reward/StreakBanner';

interface Props {
  plan: VacationPlan;
  onClose: () => void;
}

const STAMP_ROTATIONS = [-4, 2, -2, 3, -3, 1, -1, 4, -2, 3, -3, 2, 4, -1, 3];

const MILESTONE_COLORS: Record<number, string> = {
  7:  '#0ea5e9',
  14: '#ec4899',
  21: '#10b981',
  30: '#a855f7',
};
const MILESTONES = [7, 14, 21, 30];

export default function StickerBook({ plan, onClose }: Props) {
  const { completion } = useCompletionStore();
  const { tasks: specTasks, completion: specCompletion } = useSpecificTaskStore();

  const dates = getDaysInRange(plan.startDate, plan.endDate);
  const todayStr = toDateStr(new Date());

  const stickerMap: Record<string, boolean> = {};
  const hasAnyTask: Record<string, boolean> = {};

  for (const date of dates) {
    const day = getDayOfWeek(date);
    const dateStr = toDateStr(date);
    const weeklyTasks = plan.weeklySchedule?.[day] ?? [];
    const specificTasks = specTasks[dateStr] ?? [];
    const totalCount = weeklyTasks.length + specificTasks.length;

    hasAnyTask[dateStr] = totalCount > 0;

    const isWeekend = day === 'sat' || day === 'sun';
    const isPastOrToday = toDateStr(date) <= todayStr;

    if (totalCount === 0) {
      // 주말에 할 일이 없으면 자동 달성
      stickerMap[toDateStr(date)] = isWeekend && isPastOrToday;
    } else {
      const comps = completion[dateStr] ?? [];
      const specDone = specCompletion[dateStr] ?? {};
      const weeklyDone = weeklyTasks.filter((_, i) => comps[i] ?? false).length;
      const specDoneCount = specificTasks.filter((t) => specDone[t.id] ?? false).length;
      stickerMap[dateStr] = weeklyDone + specDoneCount === totalCount;
    }
  }

  const milestonePositions = calcMilestonePositions(plan, completion, specTasks, specCompletion, MILESTONES);

  const stickerCount = Object.values(stickerMap).filter(Boolean).length;
  const totalDays = dates.length;
  const pct = totalDays > 0 ? Math.round((stickerCount / totalDays) * 100) : 0;

  const COLS = 5;
  const rows: Array<Array<{ date: Date; dateStr: string; index: number }>> = [];
  let currentRow: typeof rows[0] = [];
  dates.forEach((date, index) => {
    currentRow.push({ date, dateStr: toDateStr(date), index });
    if (currentRow.length === COLS) {
      rows.push(currentRow);
      currentRow = [];
    }
  });
  if (currentRow.length > 0) rows.push(currentRow);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-2xl pt-5 pb-10"
        style={{ maxHeight: '88vh', overflowY: 'auto', background: '#fffbf3' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="px-5 flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <FiAward size={18} className="text-orange-400" />
            <h2 className="text-lg font-bold text-gray-800">도장판</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>
        <p className="px-5 text-sm text-gray-400 mb-4">할 일을 모두 완료하면 도장이 찍혀요!</p>

        {/* 스트릭 배너 */}
        <div className="px-5 mb-2">
          <StreakBanner />
        </div>

        {/* 통계 바 */}
        <div className="mx-5 mb-5 bg-orange-100 rounded-2xl px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center shrink-0 shadow">
            <FiStar size={20} className="text-white" style={{ fill: 'white' }} />
          </div>
          <div className="shrink-0">
            <p className="text-xs text-orange-300 font-medium">모은 도장</p>
            <p className="text-base font-bold text-orange-600 leading-tight">
              {stickerCount}개{' '}
              <span className="text-sm font-normal text-orange-400">/ {totalDays}일</span>
            </p>
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <div className="h-2.5 bg-orange-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-400 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-right text-orange-400 font-semibold">{pct}%</p>
          </div>
        </div>

        {/* 도장판 그리드 - 5열 */}
        <div className="px-4 flex flex-col gap-3">
          {rows.map((row, ri) => (
            <div key={ri} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
              {row.map(({ date, dateStr, index }) => {
                const hasSticker = stickerMap[dateStr] ?? false;
                const isToday = dateStr === todayStr;
                const isFuture = dateStr > todayStr;
                const noTask = !hasAnyTask[dateStr];
                const dayNum = index + 1;
                const rotation = STAMP_ROTATIONS[index % STAMP_ROTATIONS.length];

                // 연속 스트릭 기반 마일스톤
                const milestoneInfo = milestonePositions[dateStr] ?? null;
                const milestoneColor = milestoneInfo ? MILESTONE_COLORS[milestoneInfo.milestone] : null;
                const milestoneAchieved = milestoneInfo?.achieved ?? false;

                return (
                  <div key={dateStr} className="flex flex-col items-center gap-0.5">
                    {/* 도장 영역 */}
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      {hasSticker ? (
                        <div
                          className="w-14 h-14 rounded-full bg-orange-400 flex items-center justify-center shadow-md"
                          style={{
                            transform: `rotate(${rotation}deg)`,
                            ...(milestoneAchieved && milestoneColor
                              ? { boxShadow: `0 0 0 2px white, 0 0 0 4px ${milestoneColor}` }
                              : {}),
                          }}
                        >
                          <FiStar size={26} className="text-white" style={{ fill: 'white' }} />
                        </div>
                      ) : milestoneInfo ? (
                        <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-200 bg-white flex items-center justify-center">
                          <FiGift size={18} className="text-gray-200" />
                        </div>
                      ) : noTask ? (
                        <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-100 flex items-center justify-center">
                          <span className="text-gray-200 text-xs">휴식</span>
                        </div>
                      ) : isToday ? (
                        <div className="w-14 h-14 rounded-full border-2 border-dashed border-orange-400 bg-orange-50 flex items-center justify-center">
                          <span className="text-orange-300 text-xs font-bold">오늘</span>
                        </div>
                      ) : isFuture ? (
                        <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-200 bg-white" />
                      ) : (
                        <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-300" />
                      )}
                    </div>

                    {/* 날짜 라벨 */}
                    <div className="text-center leading-none mt-0.5">
                      <span
                        className={`text-xs font-medium
                          ${hasSticker ? 'text-orange-500'
                            : isToday ? 'text-orange-400 font-bold'
                            : 'text-gray-400'}`}
                      >
                        {dayNum}일
                      </span>
                      <br />
                      <span className="text-gray-300" style={{ fontSize: 10 }}>
                        {date.getMonth() + 1}/{date.getDate()}
                      </span>
                    </div>

                    {/* 마일스톤 선물 아이콘 - 달성 시에만 */}
                    {milestoneAchieved && milestoneColor && (
                      <FiGift size={13} style={{ color: milestoneColor }} />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {stickerCount > 0 && (
          <p className="text-center text-xs text-orange-400 font-medium mt-6 px-4">
            {stickerCount === totalDays
              ? '방학 모든 날 도장을 모았어요!'
              : `${stickerCount}일 도전 중이에요! 조금만 더!`}
          </p>
        )}
      </div>
    </div>
  );
}
