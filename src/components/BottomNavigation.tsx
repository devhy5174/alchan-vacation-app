import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiCalendar, FiAward, FiSettings } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { useVacationStore } from '../stores/vacationStore';
import { toDateStr } from '../utils/date';

type NavItem = { label: string; icon: IconType; path: string };

const BASE_NAV: NavItem[] = [
  { label: '홈', icon: FiHome, path: '/' },
  { label: '캘린더', icon: FiCalendar, path: '/calendar' },
  { label: '설정', icon: FiSettings, path: '/settings' },
];

const RESULT_NAV: NavItem = { label: '결과', icon: FiAward, path: '/result' };

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = useVacationStore((s) => s.plan);

  // 종료일 다음날부터 결과 탭 활성화
  const showResult = plan ? toDateStr(new Date()) > plan.endDate : false;
  const navItems = showResult ? [...BASE_NAV, RESULT_NAV] : BASE_NAV;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-area-bottom">
      <div className="max-w-md mx-auto flex">
      {navItems.map(({ label, icon: Icon, path }) => {
        const active = location.pathname === path;
        return (
          <button
            key={path}
            type="button"
            onClick={() => navigate(path)}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 cursor-pointer transition-colors
              ${active ? 'text-orange-400' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Icon size={20} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        );
      })}
      </div>
    </nav>
  );
}
