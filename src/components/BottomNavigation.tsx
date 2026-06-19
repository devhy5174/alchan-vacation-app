import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiCalendar } from 'react-icons/fi';

const NAV_ITEMS = [
  { label: '홈', icon: FiHome, path: '/' },
  { label: '캘린더', icon: FiCalendar, path: '/calendar' },
] as const;

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex safe-area-bottom">
      {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
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
    </nav>
  );
}
