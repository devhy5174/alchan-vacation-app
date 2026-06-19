import { useState } from 'react';
import { FiClock, FiChevronUp, FiChevronDown } from 'react-icons/fi';

interface Props {
  value?: string;
  onConfirm: (time: string) => void;
  onClear: () => void;
  onClose: () => void;
}

type Period = 'am' | 'pm';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function to12h(h24: number): { hour: number; period: Period } {
  if (h24 === 0) return { hour: 12, period: 'am' };
  if (h24 < 12) return { hour: h24, period: 'am' };
  if (h24 === 12) return { hour: 12, period: 'pm' };
  return { hour: h24 - 12, period: 'pm' };
}

function to24h(hour: number, period: Period): number {
  if (period === 'am') return hour === 12 ? 0 : hour;
  return hour === 12 ? 12 : hour + 12;
}

export default function TimePickerModal({ value, onConfirm, onClear, onClose }: Props) {
  const initVal = (() => {
    if (value) {
      const h24 = parseInt(value.split(':')[0]);
      const min = parseInt(value.split(':')[1]);
      const { hour, period } = to12h(h24);
      return { hour, minute: min, period };
    }
    return { hour: 8, minute: 0, period: 'am' as Period };
  })();

  const [period, setPeriod] = useState<Period>(initVal.period);
  const [hour, setHour] = useState(initVal.hour);
  const [minute, setMinute] = useState(initVal.minute);
  const [hourInput, setHourInput] = useState(String(initVal.hour));
  const [minuteInput, setMinuteInput] = useState(pad(initVal.minute));

  const incHour = () => {
    const n = hour === 12 ? 1 : hour + 1;
    setHour(n); setHourInput(String(n));
  };
  const decHour = () => {
    const n = hour === 1 ? 12 : hour - 1;
    setHour(n); setHourInput(String(n));
  };
  const incMinute = () => {
    const n = (minute + 5) % 60;
    setMinute(n); setMinuteInput(pad(n));
  };
  const decMinute = () => {
    const n = minute - 5 < 0 ? 55 : minute - 5;
    setMinute(n); setMinuteInput(pad(n));
  };

  const handleHourChange = (val: string) => {
    setHourInput(val);
    const n = parseInt(val);
    if (!isNaN(n) && n >= 1 && n <= 12) setHour(n);
  };
  const handleHourBlur = () => {
    const n = parseInt(hourInput);
    const clamped = isNaN(n) ? 12 : Math.min(12, Math.max(1, n));
    setHour(clamped); setHourInput(String(clamped));
  };

  const handleMinuteChange = (val: string) => {
    setMinuteInput(val);
    const n = parseInt(val);
    if (!isNaN(n) && n >= 0 && n <= 59) setMinute(n);
  };
  const handleMinuteBlur = () => {
    const n = parseInt(minuteInput);
    const clamped = isNaN(n) ? 0 : Math.min(59, Math.max(0, n));
    setMinute(clamped); setMinuteInput(pad(clamped));
  };

  const handleConfirm = () => {
    onConfirm(`${pad(to24h(hour, period))}:${pad(minute)}`);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-8 pointer-events-none">
        <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-xl pointer-events-auto w-full max-w-xs">

          {/* 헤더 */}
          <div className="flex items-center justify-center gap-2">
            <FiClock size={18} className="text-orange-400" />
            <p className="text-base font-bold text-gray-700">시간 선택</p>
          </div>

          {/* 오전/오후 토글 */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            {(['am', 'pm'] as Period[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer
                  ${period === p ? 'bg-white text-orange-400 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {p === 'am' ? '오전' : '오후'}
              </button>
            ))}
          </div>

          {/* 시 : 분 */}
          <div className="flex items-center justify-center gap-3">
            {/* 시 */}
            <div className="flex flex-col items-center gap-1">
              <button type="button" onClick={incHour}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-orange-400 cursor-pointer transition-colors">
                <FiChevronUp size={22} />
              </button>
              <input
                type="text"
                inputMode="numeric"
                value={hourInput}
                onChange={(e) => handleHourChange(e.target.value)}
                onBlur={handleHourBlur}
                className="w-16 text-center text-4xl font-bold text-gray-800 bg-gray-50 border border-orange-200 rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <button type="button" onClick={decHour}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-orange-400 cursor-pointer transition-colors">
                <FiChevronDown size={22} />
              </button>
            </div>

            <span className="text-3xl font-bold text-gray-300">:</span>

            {/* 분 */}
            <div className="flex flex-col items-center gap-1">
              <button type="button" onClick={incMinute}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-orange-400 cursor-pointer transition-colors">
                <FiChevronUp size={22} />
              </button>
              <input
                type="text"
                inputMode="numeric"
                value={minuteInput}
                onChange={(e) => handleMinuteChange(e.target.value)}
                onBlur={handleMinuteBlur}
                className="w-16 text-center text-4xl font-bold text-gray-800 bg-gray-50 border border-orange-200 rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <button type="button" onClick={decMinute}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-orange-400 cursor-pointer transition-colors">
                <FiChevronDown size={22} />
              </button>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex gap-2">
            <button type="button" onClick={onClear}
              className="flex-1 py-2.5 border border-gray-200 text-gray-400 text-sm font-semibold rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
              시간 없음
            </button>
            <button type="button" onClick={handleConfirm}
              className="flex-1 py-2.5 bg-orange-400 hover:bg-orange-500 text-white text-sm font-semibold rounded-xl cursor-pointer transition-colors">
              확인
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
