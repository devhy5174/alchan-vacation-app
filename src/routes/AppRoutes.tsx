import { useEffect, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import CalendarPage from '../pages/CalendarPage';
import ResultPage from '../pages/ResultPage';
import SettingsPage from '../pages/SettingsPage';
import PrivacyPage from '../pages/PrivacyPage';
import TermsPage from '../pages/TermsPage';
import BottomNavigation from '../components/BottomNavigation';
import { useVacationStore } from '../stores/vacationStore';
import { useAutoSaveResult } from '../hooks/useAutoSaveResult';

function AutoSaver() {
  useAutoSaveResult();
  return null;
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-orange-50 pb-20">
      <AutoSaver />
      <div className="max-w-md mx-auto">
        {children}
      </div>
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
        <Route path="/result" element={<Layout><ResultPage /></Layout>} />
        <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
