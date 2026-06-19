import { useState } from 'react';
import { FiClock } from 'react-icons/fi';
import { DAYS_OF_WEEK, DAY_LABELS } from '../../types/vacation';
import type { DayOfWeek, Task } from '../../types/vacation';
import Button from '../../components/Button';
import TimePickerModal from '../../components/TimePickerModal';

interface Props {
  onAdd: (task: Task, days: DayOfWeek[]) => void;
}

const WEEKDAYS: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri'];
const WEEKEND: DayOfWeek[] = ['sat', 'sun'];

const QUICK_SELECTS = [
  { label: '평일', days: WEEKDAYS },
  { label: '주말', days: WEEKEND },
  { label: '매일', days: DAYS_OF_WEEK },
] as const;

export default function RepeatTaskAdder({ onAdd }: Props) {
  const [taskInput, setTaskInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAdd = () => {
    const trimmed = taskInput.trim();
    if (!trimmed || selectedDays.length === 0) return;
    onAdd({ text: trimmed, ...(timeInput ? { time: timeInput } : {}) }, selectedDays);
    setTaskInput('');
    setTimeInput('');
    setSelectedDays([]);
  };

  return (
    <>
      {showPicker && (
        <TimePickerModal
          value={timeInput || undefined}
          onConfirm={(t) => { setTimeInput(t); setShowPicker(false); }}
          onClear={() => { setTimeInput(''); setShowPicker(false); }}
          onClose={() => setShowPicker(false)}
        />
      )}

    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex flex-col gap-3">
      <span className="text-sm font-bold text-gray-700">반복 할 일 추가</span>

      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className="flex items-center gap-1 shrink-0 px-2 py-2 rounded-lg border border-orange-200 bg-white text-xs font-medium hover:border-orange-300 transition-colors cursor-pointer"
        >
          <FiClock size={12} className="text-orange-400" />
          <span className={timeInput ? 'text-orange-400' : 'text-gray-400'}>
            {timeInput || '시간'}
          </span>
        </button>
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyUp={(e) => { if (e.key === 'Enter') handleAdd(); }}
          placeholder="여러 요일에 반복할 할 일 입력"
          className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-orange-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder-gray-300"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-1.5 flex-wrap">
          {QUICK_SELECTS.map(({ label, days }) => (
            <button
              key={label}
              type="button"
              onClick={() => setSelectedDays([...days])}
              className="px-3 py-1 text-xs font-medium rounded-full border border-orange-300 text-orange-500 hover:bg-orange-100 transition-colors cursor-pointer"
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelectedDays([])}
            className="px-3 py-1 text-xs font-medium rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            선택 초기화
          </button>
        </div>

        <div className="flex gap-1.5">
          {DAYS_OF_WEEK.map((day) => {
            const checked = selectedDays.includes(day);
            const isWeekend = day === 'sat' || day === 'sun';
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-colors cursor-pointer
                  ${checked
                    ? isWeekend
                      ? 'bg-orange-400 text-white'
                      : 'bg-gray-700 text-white'
                    : 'bg-white border border-gray-200 text-gray-400 hover:border-orange-200'
                  }`}
              >
                {DAY_LABELS[day]}
              </button>
            );
          })}
        </div>
      </div>

      <Button type="button" onClick={handleAdd} fullWidth>
        선택한 요일에 추가
      </Button>
    </div>
    </>
  );
}
