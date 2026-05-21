import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  GitBranch,
  Lightbulb,
  Briefcase,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { Avatar } from '@/components/atoms/Avatar/Avatar';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/config/routes';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { to: ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
  { to: ROUTES.REPOSITORIES, icon: GitBranch, label: 'Repositories' },
  { to: ROUTES.INSIGHTS, icon: Lightbulb, label: 'Insights' },
  { to: ROUTES.PORTFOLIO, icon: Briefcase, label: 'Portfolio' },
  { to: ROUTES.SETTINGS, icon: Settings, label: 'Settings' },
];

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { user } = useAuth();

  return (
    <aside
      className={clsx(
        'flex flex-col h-screen sticky top-0',
        'bg-white dark:bg-surface-900 border-r border-gray-200 dark:border-surface-700',
        'transition-all duration-200 ease-in-out flex-shrink-0',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 dark:border-surface-700 h-14">
        <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
          <Zap size={16} className="text-white" fill="white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-base text-gray-900 dark:text-white tracking-tight">
            DevSight
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-2 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium',
                'transition-all duration-100',
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-700 hover:text-gray-900 dark:hover:text-white'
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={20} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Area */}
      {user && (
        <div
          className={clsx(
            'px-3 py-3 border-t border-gray-100 dark:border-surface-700',
            'flex items-center gap-3 min-w-0'
          )}
        >
          <Avatar
            src={user.avatar_url}
            alt={user.name ?? user.login}
            size="sm"
          />
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.name ?? user.login}
              </p>
              <p className="text-xs text-gray-400 truncate font-mono">
                @{user.login}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className={clsx(
          'flex items-center justify-center w-full py-2.5',
          'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200',
          'border-t border-gray-100 dark:border-surface-700',
          'hover:bg-gray-50 dark:hover:bg-surface-700 transition-colors'
        )}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
};
