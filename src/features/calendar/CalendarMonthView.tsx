import { useState, useEffect, useRef } from 'react';
import type { VacationPlan } from '../../types/vacation';
import { getDayOfWeek, toDateStr } from '../../utils/date';
import { useCompletionStore } from '../../stores/completionStore';
import { useSpecificTaskStore } from '../../stores/specificTaskStore';
import { calcStreakPerDay } from '../../utils/streak';
import StreakBanner from '../reward/StreakBanner';
import DayDetailModal from './DayDetailModal';

interface Props {
  plan: VacationPlan;
}

const WEEK_HEADERS = ['월', '화', '수', '목', '금', '토', '일'] as const;

// 테마 해금 마일스톤 달성일 표시 (컬러 닷)
const MILESTONE_STREAKS: Record<number, React.ReactNode> = {
  5:  <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'linear-gradient(135deg,#f87171,#facc15,#4ade80,#60a5fa,#a78bfa)' }} />,
  7:  <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#0ea5e9' }} />,
  14: <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#ec4899' }} />,
  21: <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#10b981' }} />,
};

const MILESTONE_SET = new Set([5, 7, 14, 21]);

function getMonthsInRange(startDate: string, endDate: string): Array<{ year: number; month: number }> {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months: Array<{ year: number; month: number }> = [];
  let year = start.getFullYear();
  let month = start.getMonth();
  while (year < end.getFullYear() || (year === end.getFullYear() && month <= end.getMonth())) {
    months.push({ year, month });
    month++;
    if (month > 11) { month = 0; year++; }
  }
  return months;
}

function buildMonthGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;
  const grid: (Date | null)[] = Array(startOffset).fill(null);
  for (let d = 1; d <= lastDate; d++) grid.push(new Date(year, month, d));
  while (grid.length % 7 !== 0) grid.push(null);
  return grid;
}

export default function CalendarMonthView({ plan }: Props) {
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const { completion } = useCompletionStore();
  const { tasks: specTasks, completion: specCompletion } = useSpecificTaskStore();
  const todayStr = toDateStr(new Date());
  const todayRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const months = getMonthsInRange(plan.startDate, plan.endDate);
  const schedule = plan.weeklySchedule;

  const streakPerDay = calcStreakPerDay(plan, completion, specTasks, specCompletion);

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* 연속 달성 배너 */}
        <StreakBanner />

        {months.map(({ year, month }) => {
          const grid = buildMonthGrid(year, month);

          return (
            <div key={`${year}-${month}`}>
              <p className="text-sm font-bold text-gray-600 mb-2">{year}년 {month + 1}월</p>

              <div className="bg-white rounded-xl border border-orange-100 overflow-hidden shadow-sm">
                {/* 요일 헤더 */}
                <div className="grid grid-cols-7 border-b border-orange-100">
                  {WEEK_HEADERS.map((label, i) => (
                    <div key={label} className={`text-center text-xs font-bold py-2 ${i >= 5 ? 'text-orange-400' : 'text-gray-500'}`}>
                      {label}
                    </div>
                  ))}
                </div>

                {/* 날짜 그리드 */}
                <div className="grid grid-cols-7">
                  {grid.map((date, i) => {
                    if (!date) return <div key={`empty-${i}`} className="h-14" />;

                    const dateStr = toDateStr(date);
                    const isInVacation = dateStr >= plan.startDate && dateStr <= plan.endDate;
                    const day = getDayOfWeek(date);
                    const isWeekend = day === 'sat' || day === 'sun';
                    const weeklyTasks = isInVacation ? (schedule?.[day] ?? []) : [];
                    const specificTasks = isInVacation ? (specTasks[dateStr] ?? []) : [];
                    const taskCount = weeklyTasks.length + specificTasks.length;
                    const completions = completion[dateStr] ?? [];
                    const specDone = specCompletion[dateStr] ?? {};
                    const weeklyDone = weeklyTasks.filter((_, idx) => completions[idx] ?? false).length;
                    const specDoneCount = specificTasks.filter((t) => specDone[t.id] ?? false).length;
                    const completedCount = weeklyDone + specDoneCount;
                    const allDone = taskCount > 0 && completedCount === taskCount;
                    const isToday = dateStr === todayStr;
                    const hasImportant = specificTasks.some(
                      (t) => t.important && !(specDone[t.id] ?? false)
                    );

                    const streakCount = streakPerDay[dateStr] ?? 0;
                    const milestoneIcon = MILESTONE_SET.has(streakCount)
                      ? MILESTONE_STREAKS[streakCount]
                      : null;

                    return (
                      <button
                        key={dateStr}
                        ref={(el) => { if (isToday) todayRef.current = el; }}
                        type="button"
                        disabled={!isInVacation}
                        onClick={() => setSelectedDateStr(dateStr)}
                        className={`h-14 flex flex-col items-center justify-start pt-1.5 transition-colors
                          ${allDone ? 'bg-orange-50' : ''}
                          ${isInVacation && !allDone ? 'hover:bg-orange-50 cursor-pointer' : ''}
                          ${!isInVacation ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        {allDone ? (
                          <>
                            <div className={`w-7 h-7 rounded-full bg-orange-400 flex items-center justify-center
                              ${isToday ? 'ring-2 ring-offset-1 ring-orange-300' : ''}`}>
                              <span className="text-xs font-bold text-white">{date.getDate()}</span>
                            </div>
                            {milestoneIcon && (
                              <div className="mt-0.5 flex items-center justify-center">
                                {milestoneIcon}
                              </div>
                            )}
                          </>
                        ) : isToday ? (
                          <>
                            <div className="w-7 h-7 rounded-full border-2 border-orange-400 flex items-center justify-center">
                              <span className="text-xs font-bold text-orange-500">{date.getDate()}</span>
                            </div>
                            {hasImportant && (
                              <span className="mt-0.5 leading-none text-yellow-400" style={{ fontSize: 11 }}>★</span>
                            )}
                          </>
                        ) : (
                          <>
                            <span className={`text-xs font-medium leading-none
                              ${isWeekend && isInVacation ? 'text-orange-400' : ''}
                              ${!isWeekend && isInVacation ? 'text-gray-700' : ''}
                              ${!isInVacation ? 'text-gray-300' : ''}`}
                            >
                              {date.getDate()}
                            </span>
                            {hasImportant && !milestoneIcon && (
                              <span className="mt-2 leading-none text-yellow-400" style={{ fontSize: 11 }}>★</span>
                            )}
                            {milestoneIcon && (
                              <div className="mt-1 flex items-center justify-center">
                                {milestoneIcon}
                              </div>
                            )}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        <p className="text-center text-xs text-gray-300 pb-2">날짜를 클릭하면 할 일을 확인할 수 있어요</p>
      </div>

      {selectedDateStr && (
        <DayDetailModal
          dateStr={selectedDateStr}
          plan={plan}
          onClose={() => setSelectedDateStr(null)}
        />
      )}
    </>
  );
}
