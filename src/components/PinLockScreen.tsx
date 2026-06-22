import { useState, useEffect } from 'react';
import { FiLock, FiCalendar } from 'react-icons/fi';
import PinPad from './PinPad';

interface Props {
  storedPin: string;
  onUnlock: () => void;
  onGoToCalendar: () => void;
}

export default function PinLockScreen({ storedPin, onUnlock, onGoToCalendar }: Props) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);

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

      <div className="flex flex-col items-center gap-2">
        <FiLock size={32} className="text-orange-400" />
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
