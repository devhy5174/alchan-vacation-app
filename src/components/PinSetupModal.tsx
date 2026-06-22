import { useState, useEffect } from 'react';
import { FiLock, FiX, FiChevronLeft } from 'react-icons/fi';
import PinPad from './PinPad';

interface Props {
  hasPin: boolean;
  onSave: (pin: string) => void;
  onRemove: () => void;
  onClose: () => void;
}

type Step = 'menu' | 'new' | 'confirm' | 'remove-confirm';

function PinDots({ count, error }: { count: number; error?: boolean }) {
  return (
    <div className="flex gap-4 justify-center">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`w-3.5 h-3.5 rounded-full transition-all duration-150
            ${i < count
              ? error ? 'bg-red-400' : 'bg-orange-400'
              : 'border-2 border-gray-300'}`}
        />
      ))}
    </div>
  );
}

export default function PinSetupModal({ hasPin, onSave, onRemove, onClose }: Props) {
  const [step, setStep] = useState<Step>(hasPin ? 'menu' : 'new');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (step === 'new' && newPin.length === 4) {
      setStep('confirm');
    }
  }, [newPin, step]);

  useEffect(() => {
    if (step === 'confirm' && confirmPin.length === 4) {
      if (confirmPin === newPin) {
        onSave(newPin);
      } else {
        setShaking(true);
        setError('비밀번호가 일치하지 않아요');
        setTimeout(() => {
          setShaking(false);
          setConfirmPin('');
          setError('');
        }, 600);
      }
    }
  }, [confirmPin, newPin, step, onSave]);

  function handleKey(key: string) {
    if (shaking) return;
    const setter = step === 'new' ? setNewPin : setConfirmPin;
    const current = step === 'new' ? newPin : confirmPin;
    if (key === '⌫') { setter((p) => p.slice(0, -1)); return; }
    if (current.length < 4) setter((p) => p + key);
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
        <div className="bg-white rounded-t-3xl w-full max-w-sm pointer-events-auto pb-10">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
            {step !== 'menu' ? (
              <button type="button" onClick={() => { setStep(hasPin ? 'menu' : 'new'); setNewPin(''); setConfirmPin(''); setError(''); }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <FiChevronLeft size={20} />
              </button>
            ) : <div className="w-6" />}
            <div className="flex items-center gap-2">
              <FiLock size={15} className="text-orange-400" />
              <p className="text-sm font-bold text-gray-800">
                {step === 'menu' ? '잠금 설정' : step === 'new' ? '새 비밀번호 입력' : '비밀번호 확인'}
              </p>
            </div>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <FiX size={18} />
            </button>
          </div>

          {step === 'menu' ? (
            <div className="flex flex-col gap-3 px-5 pt-5">
              <button
                type="button"
                onClick={() => { setStep('new'); setNewPin(''); setConfirmPin(''); }}
                className="w-full py-3.5 bg-orange-400 hover:bg-orange-500 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                비밀번호 변경
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="w-full py-3.5 border border-red-200 text-red-400 hover:bg-red-50 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                잠금 해제 (비밀번호 삭제)
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 pt-8 px-5">
              <p className="text-sm text-gray-400">
                {step === 'new' ? '사용할 4자리 비밀번호를 입력해주세요' : '한 번 더 입력해주세요'}
              </p>

              {step === 'new' && !hasPin && (
                <div className="w-full bg-orange-50 rounded-xl px-4 py-3 text-xs text-gray-500 leading-relaxed -mt-1">
                  <p className="font-semibold text-orange-400 mb-1">홈화면 잠금이란?</p>
                  <p>아이가 방학 계획을 임의로 수정하지 못하도록 홈화면에 잠금을 걸 수 있어요.</p>
                  <p className="mt-1">잠금 설정 후 홈화면에 들어오려면 비밀번호를 입력해야 합니다.</p>
                </div>
              )}

              <div className={shaking ? 'shake' : ''}>
                <PinDots count={step === 'new' ? newPin.length : confirmPin.length} error={shaking} />
              </div>
              {error
                ? <p className="text-xs text-red-400 -mt-2">{error}</p>
                : <div className="h-4 -mt-2" />}
              <PinPad onKey={handleKey} disabled={shaking} />
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-8px); }
          40%,80% { transform: translateX(8px); }
        }
        .shake { animation: shake 0.5s ease; }
      `}</style>
    </>
  );
}
