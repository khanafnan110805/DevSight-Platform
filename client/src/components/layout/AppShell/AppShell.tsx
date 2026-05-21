import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../Sidebar/Sidebar';
import { TopBar } from '../TopBar/TopBar';
import { useLocalStorage } from '@/hooks/useUtils';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/repositories': 'Repositories',
  '/dashboard/insights': 'Insights',
  '/portfolio': 'Portfolio',
  '/settings': 'Settings',
};

export const AppShell = () => {
  const [collapsed, setCollapsed] = useLocalStorage('sidebar-collapsed', false);
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-surface-900">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={title} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
