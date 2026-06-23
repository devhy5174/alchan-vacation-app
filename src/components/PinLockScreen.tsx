import { useState, useEffect, useRef } from 'react';
import { FiLock, FiCalendar, FiAlertTriangle } from 'react-icons/fi';
import PinPad from './PinPad';

interface Props {
  storedPin: string;
  onUnlock: () => void;
  onGoToCalendar: () => void;
  onResetPin: () => void;
}

export default function PinLockScreen({ storedPin, onUnlock, onGoToCalendar, onResetPin }: Props) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  function startHold() {
    setHoldProgress(0);
    progressTimer.current = setInterval(() => {
      setHoldProgress((p) => Math.min(p + 100 / 30, 100));
    }, 100);
    holdTimer.current = setTimeout(() => {
      clearInterval(progressTimer.current!);
      setHoldProgress(0);
      setShowResetConfirm(true);
    }, 3000);
  }

  function cancelHold() {
    clearTimeout(holdTimer.current!);
    clearInterval(progressTimer.current!);
    setHoldProgress(0);
  }

  useEffect(() => {
    if (input.length === 4) {
      if (input === storedPin) {
        onUnlock();
      } else {
        setShaking(true);
        setError('비밀번호가 틀렸어요');
        setTimeout(() => {
          setShaking(false);
          setInput('');
          setError('');
        }, 600);
      }
    }
  }, [input, storedPin, onUnlock]);

  function handleKey(key: string) {
    if (key === '⌫') {
      setInput((prev) => prev.slice(0, -1));
      return;
    }
    if (input.length < 4) setInput((prev) => prev + key);
  }

  return (
    <div className="fixed inset-0 z-50 bg-orange-50 flex flex-col items-center justify-center gap-8 px-4">
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-8px); }
          40%,80% { transform: translateX(8px); }
        }
        .shake { animation: shake 0.5s ease; }
      `}</style>

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="bg-white rounded-2xl px-6 py-6 w-full max-w-xs flex flex-col items-center gap-4 shadow-xl">
            <FiAlertTriangle size={36} className="text-orange-400" />
            <div className="text-center">
              <p className="font-bold text-gray-800">PIN을 초기화할까요?</p>
              <p className="text-sm text-gray-400 mt-1">잠금이 해제되고 PIN이 삭제돼요</p>
            </div>
            <div className="flex gap-2 w-full">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-500 text-sm font-semibold rounded-xl cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => { setShowResetConfirm(false); onResetPin(); }}
                className="flex-1 py-2.5 bg-orange-400 text-white text-sm font-semibold rounded-xl cursor-pointer"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-2">
        <div
          className="relative cursor-pointer select-none"
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
          onTouchStart={startHold}
          onTouchEnd={cancelHold}
        >
          <FiLock size={32} className="text-orange-400" />
          {holdProgress > 0 && (
            <svg
              className="absolute inset-0 -m-1.5"
              width={44} height={44}
              viewBox="0 0 44 44"
            >
              <circle
                cx={22} cy={22} r={19}
                fill="none"
                stroke="#fb923c"
                strokeWidth={2.5}
                strokeDasharray={`${(holdProgress / 100) * 2 * Math.PI * 19} ${2 * Math.PI * 19}`}
                strokeLinecap="round"
                transform="rotate(-90 22 22)"
              />
            </svg>
          )}
        </div>
        <h1 className="text-xl font-bold text-gray-800">알찬방학</h1>
        <p className="text-sm text-gray-400">비밀번호를 입력해주세요</p>
      </div>

      <div className={`flex gap-4 ${shaking ? 'shake' : ''}`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-all duration-150
              ${i < input.length
                ? shaking ? 'bg-red-400' : 'bg-orange-400'
                : 'border-2 border-gray-300'}`}
          />
        ))}
      </div>

      {error ? (
        <p className="text-sm text-red-400 -mt-4">{error}</p>
      ) : (
        <div className="-mt-4 h-5" />
      )}

      <PinPad onKey={handleKey} disabled={shaking} />

      <button
        type="button"
        onClick={onGoToCalendar}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-orange-400 transition-colors cursor-pointer"
      >
        <FiCalendar size={14} />
        캘린더로 돌아가기
      </button>
    </div>
  );
}
