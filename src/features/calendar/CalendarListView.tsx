import { FiCircle, FiCheckCircle } from 'react-icons/fi';
import type { VacationPlan } from '../../types/vacation';
import { DAY_LABELS } from '../../types/vacation';
import { getDaysInRange, getDayOfWeek, formatShortDate, toDateStr } from '../../utils/date';
import { useCompletionStore } from '../../stores/completionStore';

interface Props {
  plan: VacationPlan;
}

export default function CalendarListView({ plan }: Props) {
  const { completion, toggleTask } = useCompletionStore();
  const dates = getDaysInRange(plan.startDate, plan.endDate);
  const schedule = plan.weeklySchedule;

  return (
    <div className="flex flex-col gap-2">
      {dates.map((date) => {
        const day = getDayOfWeek(date);
        const tasks = schedule?.[day] ?? [];
        const isWeekend = day === 'sat' || day === 'sun';
        const dateStr = toDateStr(date);
        const completions = completion[dateStr] ?? [];
        const completedCount = tasks.filter((_, i) => completions[i] ?? false).length;
        const allDone = tasks.length > 0 && completedCount === tasks.length;
        const pct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

        return (
          <div
            key={dateStr}
            className={`rounded-xl shadow-sm border overflow-hidden transition-colors
              ${allDone ? 'border-orange-300 bg-orange-50' : isWeekend ? 'border-orange-200 bg-white' : 'border-orange-100 bg-white'}`}
          >
            <div className="px-4 py-3 flex gap-3">
              {/* 날짜 */}
              <div className="w-12 shrink-0 text-center pt-0.5">
                <span className="block text-xs text-gray-400">{formatShortDate(date)}</span>
                <span className={`block text-sm font-bold ${isWeekend ? 'text-orange-400' : 'text-gray-700'}`}>
                  {DAY_LABELS[day]}
                </span>
              </div>

              {/* 할 일 목록 */}
              <div className="flex-1 min-w-0">
                {tasks.length > 0 ? (
                  <ul className="flex flex-col gap-1">
                    {tasks.map((task, i) => {
                      const done = completions[i] ?? false;
                      return (
                        <li key={i} className="flex items-start gap-2">
                          <button
                            type="button"
                            onClick={() => toggleTask(dateStr, i, tasks.length)}
                            className="mt-0.5 shrink-0 cursor-pointer transition-colors"
                            aria-label={done ? '완료 취소' : '완료'}
                          >
                            {done
                              ? <FiCheckCircle size={15} className="text-orange-400" />
                              : <FiCircle size={15} className="text-gray-300" />
                            }
                          </button>
                          <span className={`text-sm leading-snug ${done ? 'line-through text-gray-300' : 'text-gray-700'}`}>
                            {task.time && (
                              <span className={`font-medium mr-1 ${done ? 'text-gray-300' : 'text-orange-400'}`}>
                                [{task.time}]
                              </span>
                            )}
                            {task.text}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-300 pt-0.5">-</p>
                )}
              </div>
            </div>

            {/* 진행 게이지 */}
            {tasks.length > 0 && (
              <div className="px-4 pb-3 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out
                      ${allDone ? 'bg-orange-500' : 'bg-orange-400'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className={`text-xs font-semibold shrink-0 ${allDone ? 'text-orange-400' : 'text-gray-400'}`}>
                  {completedCount}/{tasks.length}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
