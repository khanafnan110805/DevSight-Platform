import { useState } from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/atoms/Button/Button';
import { Avatar } from '@/components/atoms/Avatar/Avatar';
import { clsx } from 'clsx';
import {
  User, Palette, Bell, Shield, Trash2, Sun, Moon, Monitor,
  LogOut, ExternalLink, Github,
} from 'lucide-react';

const settingsNav = [
  { to: '/settings/profile', label: 'Profile', icon: User },
  { to: '/settings/appearance', label: 'Appearance', icon: Palette },
  { to: '/settings/privacy', label: 'Privacy', icon: Shield },
  { to: '/settings/account', label: 'Account', icon: Trash2 },
];

// ── Sub-pages ──────────────────────────────────────────────────────────────

export const ProfileSettings = () => {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Profile</h2>
        <p className="text-sm text-gray-400">Your GitHub profile info (read-only — managed by GitHub)</p>
      </div>
      {user && (
        <div className="card p-5 flex items-center gap-4">
          <Avatar src={user.avatar_url} alt={user.login} size="lg" />
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">{user.name ?? user.login}</div>
            <div className="text-sm text-gray-400 font-mono">@{user.login}</div>
            <a href={`https://github.com/${user.login}`} target="_blank" rel="noopener noreferrer"
              className="text-xs text-primary-500 hover:text-primary-600 flex items-center gap-1 mt-1"
            >
              Edit on GitHub <ExternalLink size={10} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export const AppearanceSettings = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Appearance</h2>
        <p className="text-sm text-gray-400">Choose your preferred color theme</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {themes.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={clsx(
              'card p-5 flex flex-col items-center gap-3 transition-all duration-150',
              theme === value
                ? 'ring-2 ring-primary-500 border-primary-200 dark:border-primary-800'
                : 'hover:shadow-card-hover'
            )}
          >
            <Icon size={24} className={theme === value ? 'text-primary-500' : 'text-gray-400'} />
            <span className={clsx(
              'text-sm font-medium',
              theme === value ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'
            )}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const PrivacySettings = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Privacy</h2>
      <p className="text-sm text-gray-400">Control who can see your DevSight portfolio</p>
    </div>
    <div className="card p-5 space-y-4">
      {[
        { label: 'Public portfolio page', description: 'Allow anyone to view /u/username', defaultChecked: true },
        { label: 'Show contribution stats', description: 'Display heatmap and streak on public page', defaultChecked: true },
        { label: 'Show repository list', description: 'Display your top repositories publicly', defaultChecked: true },
      ].map(({ label, description, defaultChecked }) => (
        <label key={label} className="flex items-start gap-4 cursor-pointer">
          <input type="checkbox" defaultChecked={defaultChecked}
            className="mt-0.5 w-4 h-4 rounded border-gray-300 dark:border-surface-600 text-primary-500 focus:ring-primary-500"
          />
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{description}</div>
          </div>
        </label>
      ))}
    </div>
  </div>
);

export const AccountSettings = () => {
  const { logout } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Account</h2>
        <p className="text-sm text-gray-400">Manage your DevSight account</p>
      </div>

      {/* GitHub connection */}
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Github size={20} className="text-gray-700 dark:text-gray-300" />
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">GitHub OAuth</div>
              <div className="text-xs text-emerald-500">Connected</div>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={logout} leftIcon={<LogOut size={14} />}>
            Sign out
          </Button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="card p-5 border-red-200 dark:border-red-900/30">
        <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1">Danger Zone</h3>
        <p className="text-xs text-gray-400 mb-4">
          Deleting your account removes all DevSight data. Your GitHub data is unaffected.
        </p>
        {!confirmDelete ? (
          <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}
            leftIcon={<Trash2 size={14} />}
          >
            Delete account
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-red-600 dark:text-red-400">Are you sure?</span>
            <Button variant="danger" size="sm">Yes, delete</Button>
            <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>Cancel</Button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Settings shell ──────────────────────────────────────────────────────────

const SettingsPage = () => (
  <div className="max-w-3xl mx-auto flex gap-8 animate-fade-in">
    {/* Sidebar nav */}
    <aside className="w-44 flex-shrink-0">
      <nav className="space-y-0.5">
        {settingsNav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-surface-700'
              )
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>

    {/* Content */}
    <div className="flex-1 min-w-0">
      <Outlet />
    </div>
  </div>
);

export default SettingsPage;
