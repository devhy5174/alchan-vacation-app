import { useEffect, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import CalendarPage from '../pages/CalendarPage';
import BottomNavigation from '../components/BottomNavigation';
import { useVacationStore } from '../stores/vacationStore';

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-orange-50 pb-20">
      {children}
      <BottomNavigation />
    </div>
  );
}

function InitialRedirect() {
  const navigate = useNavigate();
  const plan = useVacationStore((s) => s.plan);

  useEffect(() => {
    if (plan?.weeklySchedule) {
      navigate('/calendar', { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <InitialRedirect />
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
