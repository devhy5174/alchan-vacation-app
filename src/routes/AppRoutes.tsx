import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import CalendarPage from '../pages/CalendarPage';
import BottomNavigation from '../components/BottomNavigation';

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-orange-50 pb-20">
      {children}
      <BottomNavigation />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
