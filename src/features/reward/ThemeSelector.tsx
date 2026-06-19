import { FiLock, FiCheck } from 'react-icons/fi';
import { useRewardStore } from '../../stores/rewardStore';
import type { DiaryTheme } from '../../types/reward';

const ALL_THEMES: {
  id: DiaryTheme;
  label: string;
  color: string;
  gradient?: string;
  ringColor: string;
  streakRequired: number | null;
}[] = [
  { id: 'orange', label: '기본', color: '#fb923c', ringColor: '#fb923c', streakRequired: null },
  { id: 'blue', label: '스카이블루', color: '#0ea5e9', ringColor: '#0ea5e9', streakRequired: 7 },
  { id: 'pink', label: '핑크', color: '#ec4899', ringColor: '#ec4899', streakRequired: 14 },
  { id: 'mint', label: '민트', color: '#10b981', ringColor: '#10b981', streakRequired: 21 },
  {
    id: 'rainbow',
    label: '무지개',
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #f87171, #fb923c, #facc15, #4ade80, #60a5fa, #a78bfa)',
    ringColor: '#a78bfa',
    streakRequired: 5,
  },
];

export default function ThemeSelector() {
  const { unlockedThemes, selectedTheme, setTheme } = useRewardStore();

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <span className="text-xs font-bold text-gray-400 shrink-0">테마</span>
      <div className="flex items-center gap-2">
        {ALL_THEMES.map(({ id, label, color, gradient, ringColor, streakRequired }) => {
          const unlocked = unlockedThemes.includes(id);
          const selected = selectedTheme === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => unlocked && setTheme(id)}
              disabled={!unlocked}
              title={unlocked ? label : `${streakRequired}일 연속 달성 시 해금`}
              className="relative w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90"
              style={{
                background: gradient || color,
                filter: unlocked ? 'none' : 'grayscale(100%) opacity(0.35)',
                boxShadow: selected ? `0 0 0 2px white, 0 0 0 3.5px ${ringColor}` : 'none',
                cursor: unlocked ? 'pointer' : 'not-allowed',
              }}
            >
              {selected && <FiCheck size={13} color="white" strokeWidth={3} />}
              {!unlocked && !selected && <FiLock size={9} color="rgba(80,80,80,0.6)" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
