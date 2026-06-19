import { useState } from 'react';
import { FiList, FiCalendar, FiBookOpen } from 'react-icons/fi';
import { useVacationStore } from '../stores/vacationStore';
import CalendarListView from '../features/calendar/CalendarListView';
import CalendarMonthView from '../features/calendar/CalendarMonthView';
import CalendarDiaryView from '../features/calendar/CalendarDiaryView';

type ViewTab = 'list' | 'month' | 'diary';

const TABS: { key: ViewTab; label: string; icon: typeof FiList }[] = [
  { key: 'list', label: '리스트', icon: FiList },
  { key: 'month', label: '달력', icon: FiCalendar },
  { key: 'diary', label: '다이어리', icon: FiBookOpen },
];

export default function CalendarPage() {
  const plan = useVacationStore((s) => s.plan);
  const [activeTab, setActiveTab] = useState<ViewTab>(() => {
    const saved = localStorage.getItem('alchan_calendar_tab');
    return (saved === 'list' || saved === 'month' || saved === 'diary') ? saved : 'list';
  });

  function handleTabChange(tab: ViewTab) {
    setActiveTab(tab);
    localStorage.setItem('alchan_calendar_tab', tab);
  }

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
    <div className="max-w-md mx-auto">
      {/* 고정 헤더: 제목 + 탭 */}
      <div className="sticky top-0 z-10 bg-orange-50 px-4 pt-8 pb-3 border-b border-orange-100">
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">{plan.childName}의 방학 캘린더</h1>
          <p className="text-sm text-gray-400 mt-1">
            {plan.startDate} ~ {plan.endDate}
          </p>
        </div>

        <div className="flex bg-gray-100 rounded-xl p-1">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleTabChange(key)}
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
      </div>

      {/* 스크롤 콘텐츠 */}
      <div className="px-4 pt-4 pb-8">
        {activeTab === 'list' ? (
          <CalendarListView plan={plan} />
        ) : activeTab === 'month' ? (
          <CalendarMonthView plan={plan} />
        ) : (
          <CalendarDiaryView plan={plan} />
        )}
      </div>
    </div>
  );
}
