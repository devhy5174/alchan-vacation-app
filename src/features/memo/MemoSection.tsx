import { useState, useRef } from 'react';
import { FiFileText, FiTrash2 } from 'react-icons/fi';
import { loadFromStorage, saveToStorage, MEMO_KEY } from '../../utils/localStorage';

export default function MemoSection() {
  const [memo, setMemo] = useState(() => loadFromStorage<string>(MEMO_KEY) ?? '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
    setMemo(e.target.value);
    saveToStorage(MEMO_KEY, e.target.value);
  };

  const handleClear = () => {
    setMemo('');
    saveToStorage(MEMO_KEY, '');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FiFileText size={15} className="text-orange-400" />
          <h2 className="text-base font-bold text-gray-800">메모</h2>
        </div>
        {memo && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
          >
            <FiTrash2 size={12} />
            전체 삭제
          </button>
        )}
      </div>

      <textarea
        ref={textareaRef}
        value={memo}
        onChange={handleChange}
        placeholder="고민이나 생각을 자유롭게 기록해보세요"
        rows={4}
        className="w-full text-sm text-gray-700 resize-none focus:outline-none placeholder-gray-300 bg-transparent leading-relaxed"
        style={{ minHeight: '96px' }}
      />
    </div>
  );
}
