import { useEffect, type ReactNode } from 'react';
import { FiCheckCircle } from 'react-icons/fi';

interface Props {
  message: string;
  subMessage?: string;
  icon?: ReactNode;
  buttonLabel?: string;
  onClose: () => void;
}

export default function AlertModal({ message, subMessage, icon, buttonLabel = '확인', onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-8 pointer-events-none">
        <div className="bg-white rounded-2xl px-8 py-8 flex flex-col items-center gap-4 shadow-xl pointer-events-auto w-full max-w-xs">
          <div className="text-orange-400">
            {icon ?? <FiCheckCircle size={48} />}
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-base font-bold text-gray-800 text-center">{message}</p>
            {subMessage && (
              <p className="text-sm text-gray-400 text-center">{subMessage}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </>
  );
}
