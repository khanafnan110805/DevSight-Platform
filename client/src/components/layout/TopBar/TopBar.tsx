import { Sun, Moon, LogOut, ExternalLink } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/atoms/Button/Button';

interface TopBarProps {
  title?: string;
}

export const TopBar = ({ title }: TopBarProps) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-gray-200 dark:border-surface-700 bg-white dark:bg-surface-900 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {title && (
          <h1 className="text-base font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Public profile link */}
        {user && (
          <a
            href={`/u/${user.login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-xs"
          >
            <ExternalLink size={14} />
            Public profile
          </a>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="btn-ghost p-2"
          aria-label="Toggle theme"
        >
          {resolvedTheme === 'dark' ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )}
        </button>

        {/* Logout */}
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          leftIcon={<LogOut size={14} />}
        >
          Sign out
        </Button>
      </div>
    </header>
  );
};
