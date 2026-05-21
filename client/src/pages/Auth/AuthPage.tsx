import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/atoms/Button/Button';
import { Github, Zap, Shield, BarChart3, Share2 } from 'lucide-react';
import { ROUTES } from '@/config/routes';

const AuthPage = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? ROUTES.DASHBOARD;

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
            <Zap size={20} className="text-white" fill="white" />
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">DevSight</span>
        </div>

        <div className="card p-8">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
            Connect your GitHub account
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8">
            Sign in with GitHub to unlock your analytics dashboard, contribution insights,
            and shareable portfolio.
          </p>

          <Button
            onClick={login}
            fullWidth
            size="lg"
            loading={isLoading}
            leftIcon={<Github size={20} />}
          >
            Continue with GitHub
          </Button>

          {/* Feature bullets */}
          <div className="mt-8 space-y-3">
            {[
              { icon: BarChart3, label: 'Interactive contribution analytics' },
              { icon: Share2, label: 'Shareable public portfolio page' },
              { icon: Shield, label: 'OAuth only — we never store your password' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <div className="w-7 h-7 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-primary-500" />
                </div>
                {label}
              </div>
            ))}
          </div>

          <p className="text-xs text-center text-gray-400 mt-8">
            We only request read-only access to public data.{' '}
            <a href="/privacy" className="text-primary-500 hover:underline">Privacy policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
