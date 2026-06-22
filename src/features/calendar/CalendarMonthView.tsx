import { useState, useEffect, useRef } from 'react';
import { FiGift } from 'react-icons/fi';
import type { VacationPlan } from '../../types/vacation';
import { getDayOfWeek, toDateStr } from '../../utils/date';
import { useCompletionStore } from '../../stores/completionStore';
import { useSpecificTaskStore } from '../../stores/specificTaskStore';
import { calcMilestonePositions } from '../../utils/streak';
import StreakBanner from '../reward/StreakBanner';
import DayDetailModal from './DayDetailModal';

interface Props {
  plan: VacationPlan;
}

const WEEK_HEADERS = ['월', '화', '수', '목', '금', '토', '일'] as const;

const MILESTONE_INFO: Record<number, { label: string; color: string }> = {
  7:  { label: '스카이블루', color: '#0ea5e9' },
  14: { label: '핑크 노트',  color: '#ec4899' },
  21: { label: '민트 노트',  color: '#10b981' },
  30: { label: '무지개 노트', color: '#a855f7' },
};
const MILESTONES = [7, 14, 21, 30];

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
  const [selectedMilestoneLabel, setSelectedMilestoneLabel] = useState<{ text: string; color: string } | null>(null);
  const { completion } = useCompletionStore();
  const { tasks: specTasks, completion: specCompletion } = useSpecificTaskStore();
  const todayStr = toDateStr(new Date());
  const todayRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const months = getMonthsInRange(plan.startDate, plan.endDate);
  const schedule = plan.weeklySchedule;

  const milestonePositions = calcMilestonePositions(plan, completion, specTasks, specCompletion, MILESTONES);

  return (
    <>
      <div className="flex flex-col gap-6">
        <StreakBanner />

        {months.map(({ year, month }) => {
          const grid = buildMonthGrid(year, month);

          return (
            <div key={`${year}-${month}`}>
              <p className="text-sm font-bold text-gray-600 mb-2">{year}년 {month + 1}월</p>

              <div className="bg-white rounded-xl border border-orange-100 overflow-hidden shadow-sm">
                <div className="grid grid-cols-7 border-b border-orange-100">
                  {WEEK_HEADERS.map((label, i) => (
                    <div key={label} className={`text-center text-xs font-bold py-2 ${i >= 5 ? 'text-orange-400' : 'text-gray-500'}`}>
                      {label}
                    </div>
                  ))}
                </div>

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
                    const isWeekendRestDay = isWeekend && taskCount === 0 && dateStr <= todayStr && isInVacation;
                    const allDone = taskCount > 0 ? completedCount === taskCount : isWeekendRestDay;
                    const isToday = dateStr === todayStr;
                    const hasImportant = specificTasks.some(
                      (t) => t.important && !(specDone[t.id] ?? false)
                    );

                    const milestoneInfo = isInVacation ? (milestonePositions[dateStr] ?? null) : null;
                    const milestone = milestoneInfo ? MILESTONE_INFO[milestoneInfo.milestone] : null;

                    return (
                      <button
                        key={dateStr}
                        ref={(el) => { if (isToday) todayRef.current = el; }}
                        type="button"
                        disabled={!isInVacation}
                        onClick={() => {
                          setSelectedDateStr(dateStr);
                          setSelectedMilestoneLabel(
                            milestone && milestoneInfo?.achieved
                              ? { text: `${milestone.label} 획득!`, color: milestone.color }
                              : null
                          );
                        }}
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
                            {milestone && (
                              <FiGift
                                size={11}
                                className="mt-0.5"
                                style={{ color: milestoneInfo?.achieved ? milestone.color : '#d1d5db' }}
                              />
                            )}
                          </>
                        ) : isToday ? (
                          <>
                            <div className="w-7 h-7 rounded-full border-2 border-orange-400 flex items-center justify-center">
                              <span className="text-xs font-bold text-orange-500">{date.getDate()}</span>
                            </div>
                            {milestone
                              ? <FiGift size={11} className="mt-0.5" style={{ color: milestoneInfo?.achieved ? milestone.color : '#d1d5db' }} />
                              : hasImportant && <span className="mt-0.5 leading-none text-yellow-400" style={{ fontSize: 11 }}>★</span>
                            }
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
                            {milestone
                              ? <FiGift size={11} className="mt-1" style={{ color: milestoneInfo?.achieved ? milestone.color : '#d1d5db' }} />
                              : hasImportant && <span className="mt-2 leading-none text-yellow-400" style={{ fontSize: 11 }}>★</span>
                            }
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
          milestoneLabel={selectedMilestoneLabel ?? undefined}
          onClose={() => { setSelectedDateStr(null); setSelectedMilestoneLabel(null); }}
        />
      )}
    </>
  );
}
