import { Outlet, Link } from 'react-router-dom';
import { Zap, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/atoms/Button/Button';
import { ROUTES } from '@/config/routes';

export const PublicLayout = () => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { isAuthenticated, login } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-surface-900 flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-gray-100 dark:border-surface-700 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white tracking-tight">
              DevSight
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
            <Link to={ROUTES.FEATURES} className="hover:text-gray-900 dark:hover:text-white transition-colors">
              Features
            </Link>
            <Link to={ROUTES.PRICING} className="hover:text-gray-900 dark:hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="btn-ghost p-2" aria-label="Toggle theme">
              {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuthenticated ? (
              <Button as={Link} to={ROUTES.DASHBOARD} size="sm">
                Go to Dashboard
              </Button>
            ) : (
              <Button onClick={login} size="sm">
                Connect GitHub
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-surface-700 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-primary-400" />
            <span>DevSight © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-200 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-200 transition-colors">Terms</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 dark:hover:text-gray-200 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
