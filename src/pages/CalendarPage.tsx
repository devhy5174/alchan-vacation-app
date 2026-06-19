import { useState } from 'react';
import { FiList, FiCalendar } from 'react-icons/fi';
import { useVacationStore } from '../stores/vacationStore';
import CalendarListView from '../features/calendar/CalendarListView';
import CalendarMonthView from '../features/calendar/CalendarMonthView';

type ViewTab = 'list' | 'month';

const TABS: { key: ViewTab; label: string; icon: typeof FiList }[] = [
  { key: 'list', label: '리스트 보기', icon: FiList },
  { key: 'month', label: '달력 보기', icon: FiCalendar },
];

export default function CalendarPage() {
  const plan = useVacationStore((s) => s.plan);
  const [activeTab, setActiveTab] = useState<ViewTab>('list');

  if (!plan) {
    return (
      <div className="px-4 py-8 max-w-md mx-auto">
        <p className="text-center text-gray-400 mt-20 text-sm">
          홈에서 방학 정보를 먼저 입력해주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-md mx-auto">
      <div className="text-center mb-5">
        <h1 className="text-xl font-bold text-gray-800">{plan.childName}의 방학 캘린더</h1>
        <p className="text-sm text-gray-400 mt-1">
          {plan.startDate} ~ {plan.endDate}
        </p>
      </div>

      {/* 탭 */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer
              ${activeTab === key
                ? 'bg-white text-orange-400 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'list' ? (
        <CalendarListView plan={plan} />
      ) : (
        <CalendarMonthView plan={plan} />
      )}
    </div>
  );
}
