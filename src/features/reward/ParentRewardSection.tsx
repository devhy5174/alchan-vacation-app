import { useState } from 'react';
import { FiPlus, FiTrash2, FiGift, FiMessageCircle } from 'react-icons/fi';
import type { VacationPlan } from '../../types/vacation';
import type { RewardIcon } from '../../types/parentReward';
import { useParentRewardStore } from '../../stores/parentRewardStore';
import { toDateStr } from '../../utils/date';

interface Props {
  plan: VacationPlan;
}

const ICON_OPTIONS: { value: RewardIcon; icon: typeof FiGift; label: string }[] = [
  { value: 'gift',    icon: FiGift,          label: '선물' },
  { value: 'message', icon: FiMessageCircle, label: '메시지' },
];

export default function ParentRewardSection({ plan }: Props) {
  const { rewards, addReward, removeReward } = useParentRewardStore();
  const [date, setDate] = useState('');
  const [text, setText] = useState('');
  const [icon, setIcon] = useState<RewardIcon>('gift');

  const todayStr = toDateStr(new Date());

  function handleAdd() {
    if (!date || !text.trim()) return;
    addReward(date, text.trim(), icon);
    setDate('');
    setText('');
    setIcon('gift');
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-gray-400 leading-relaxed">
        날짜와 응원 메시지를 입력하면 스티커판에서 해당 날짜에 표시돼요.
      </p>

      {/* 입력 폼 */}
      <div className="flex flex-col gap-2">
        {/* 아이콘 선택 */}
        <div className="flex gap-2">
          {ICON_OPTIONS.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setIcon(value)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer
                ${icon === value
                  ? 'border-orange-400 bg-orange-50 text-orange-500'
                  : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        <input
          type="date"
          value={date}
          min={plan.startDate}
          max={plan.endDate}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-orange-300"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="응원 메시지 입력 (예: 치킨 사줄게!)"
            maxLength={30}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-orange-300"
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!date || !text.trim()}
            className="shrink-0 w-11 h-11 rounded-xl bg-orange-400 disabled:bg-gray-100 text-white disabled:text-gray-300 flex items-center justify-center cursor-pointer disabled:cursor-default transition-colors"
          >
            <FiPlus size={18} />
          </button>
        </div>
      </div>

      {/* 응원 목록 */}
      {rewards.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {rewards.map((r) => {
            const IconComp = r.icon === 'message' ? FiMessageCircle : FiGift;
            const revealed = r.date <= todayStr;
            return (
              <li key={r.id} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <IconComp
                  size={13}
                  className="shrink-0"
                  style={{ color: revealed ? '#fb923c' : '#d1d5db' }}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-gray-400 block">{r.date}</span>
                  <span className="text-sm truncate block text-gray-700">{r.text}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeReward(r.id)}
                  className="shrink-0 p-1 text-gray-300 hover:text-red-400 cursor-pointer transition-colors"
                >
                  <FiTrash2 size={14} />
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-gray-300 text-center py-2">아직 작성한 응원이 없어요</p>
      )}
    </div>
  );
}
