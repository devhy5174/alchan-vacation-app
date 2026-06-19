import { useState } from 'react';
import type { VacationPlan } from '../../types/vacation';
import { getDayOfWeek, toDateStr } from '../../utils/date';
import { useCompletionStore } from '../../stores/completionStore';
import { useSpecificTaskStore } from '../../stores/specificTaskStore';
import DayDetailModal from './DayDetailModal';

interface Props {
  plan: VacationPlan;
}

const WEEK_HEADERS = ['월', '화', '수', '목', '금', '토', '일'] as const;

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

  const months = getMonthsInRange(plan.startDate, plan.endDate);
  const schedule = plan.weeklySchedule;

  return (
    <>
      <div className="flex flex-col gap-6">
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
                    const remaining = taskCount - completedCount;

                    return (
                      <button
                        key={dateStr}
                        type="button"
                        disabled={!isInVacation}
                        onClick={() => setSelectedDateStr(dateStr)}
                        className={`h-14 flex flex-col items-center justify-start pt-1.5 transition-colors
                          ${allDone ? 'bg-orange-50' : ''}
                          ${isInVacation && !allDone ? 'hover:bg-orange-50 cursor-pointer' : ''}
                          ${!isInVacation ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        {allDone ? (
                          <div className="w-7 h-7 rounded-full bg-orange-400 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{date.getDate()}</span>
                          </div>
                        ) : (
                          <>
                            <span className={`text-xs font-medium leading-none
                              ${isWeekend && isInVacation ? 'text-orange-400' : ''}
                              ${!isWeekend && isInVacation ? 'text-gray-700' : ''}
                              ${!isInVacation ? 'text-gray-300' : ''}`}
                            >
                              {date.getDate()}
                            </span>
                            {taskCount > 0 && (
                              <span className="text-xs font-semibold text-orange-300 mt-2.5 leading-none">
                                {remaining}
                              </span>
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

      {/* 날짜 상세 팝업 */}
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
