import { useState } from "react";
import { FiFileText, FiX } from "react-icons/fi";
import {
  loadFromStorage,
  saveToStorage,
  MEMO_KEY,
} from "../../utils/localStorage";
import { filterBadWords } from "../../utils/filter";

function loadMemos(): string[] {
  const raw = loadFromStorage<unknown>(MEMO_KEY);
  return Array.isArray(raw) ? (raw as string[]) : [];
}

export default function MemoSection() {
  const [items, setItems] = useState<string[]>(loadMemos);
  const [draft, setDraft] = useState("");

  const commit = (next: string[]) => {
    setItems(next);
    saveToStorage(MEMO_KEY, next);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
    const text = draft.trim();
    if (!text) return;
    commit([...items, text]);
    setDraft("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-orange-100 px-4 py-3">
      <div className="flex items-center gap-1.5 mb-2">
        <FiFileText size={13} className="text-orange-400" />
        <h2 className="text-sm font-bold text-gray-800">부모 메모</h2>
      </div>

      <div className="divide-y divide-gray-50">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 py-1.5">
            <span className="flex-1 text-sm text-gray-700 break-all">
              {item}
            </span>
            <button
              type="button"
              onClick={() => commit(items.filter((_, idx) => idx !== i))}
              className="shrink-0 text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
              aria-label="삭제"
            >
              <FiX size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className={items.length > 0 ? "border-t border-gray-50 pt-1.5" : ""}>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(filterBadWords(e.target.value))}
          onKeyUp={handleKeyUp}
          placeholder={
            items.length === 0
              ? "ex) 방학특강 알아보기"
              : "Enter 또는 Shift+Enter로 추가"
          }
          className="w-full py-1.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none bg-transparent"
        />
      </div>
    </div>
  );
}
