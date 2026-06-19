import { FiX, FiCircle, FiCheckCircle } from 'react-icons/fi';
import type { VacationPlan } from '../../types/vacation';
import { DAY_LABELS } from '../../types/vacation';
import { getDayOfWeek } from '../../utils/date';
import { useCompletionStore } from '../../stores/completionStore';

interface Props {
  dateStr: string;
  plan: VacationPlan;
  onClose: () => void;
}

export default function DayDetailModal({ dateStr, plan, onClose }: Props) {
  const { completion, toggleTask } = useCompletionStore();

  const date = new Date(dateStr);
  const day = getDayOfWeek(date);
  const tasks = plan.weeklySchedule?.[day] ?? [];
  const completions = completion[dateStr] ?? [];
  const completedCount = tasks.filter((_, i) => completions[i] ?? false).length;
  const allDone = tasks.length > 0 && completedCount === tasks.length;
  const pct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  const label = `${date.getMonth() + 1}월 ${date.getDate()}일 (${DAY_LABELS[day]})`;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-5 pointer-events-none">
        <div className="bg-white rounded-2xl w-full max-w-sm flex flex-col max-h-[80vh] shadow-xl pointer-events-auto">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <p className="text-base font-bold text-gray-800">{label}</p>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <FiX size={20} />
            </button>
          </div>

          {/* 할 일 목록 */}
          <div className="flex-1 overflow-y-auto px-5 pb-4">
            {tasks.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {tasks.map((task, i) => {
                  const done = completions[i] ?? false;
                  return (
                    <li key={i} className="flex items-start gap-2.5">
                      <button
                        type="button"
                        onClick={() => toggleTask(dateStr, i, tasks.length)}
                        className="mt-0.5 shrink-0 cursor-pointer transition-colors"
                        aria-label={done ? '완료 취소' : '완료'}
                      >
                        {done
                          ? <FiCheckCircle size={17} className="text-orange-400" />
                          : <FiCircle size={17} className="text-gray-300" />
                        }
                      </button>
                      <span
                        onClick={() => toggleTask(dateStr, i, tasks.length)}
                        className={`text-sm leading-snug cursor-pointer select-none ${done ? 'line-through text-gray-300' : 'text-gray-700'}`}
                      >
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
              <p className="text-sm text-gray-300">이날은 할 일이 없어요</p>
            )}
          </div>

          {/* 게이지 + 확인 버튼 */}
          <div className="px-5 pt-3 pb-5 flex flex-col gap-3 border-t border-gray-100">
            {tasks.length > 0 && (
              <div className="flex items-center gap-2">
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
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-orange-400 hover:bg-orange-500 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
