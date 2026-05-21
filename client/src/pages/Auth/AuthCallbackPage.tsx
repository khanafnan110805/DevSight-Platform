import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/atoms/Spinner/Spinner';
import { ROUTES } from '@/config/routes';
import { API_URL } from '@/config/constants';

// This page is loaded after GitHub redirects back with ?code=...
// The code is sent to our API which exchanges it for a token and sets the session cookie.
const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      navigate(ROUTES.AUTH_LOGIN, { replace: true });
      return;
    }

    if (!code) {
      navigate(ROUTES.AUTH_LOGIN, { replace: true });
      return;
    }

    // The server-side redirect will have already set the cookie by the time
    // the browser lands here (the API handles the callback itself).
    // We just need to reload auth state and redirect.
    setTimeout(() => {
      window.location.href = ROUTES.DASHBOARD;
    }, 300);
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-surface-900">
      <Spinner size="lg" />
      <p className="text-sm text-gray-400">Completing sign in…</p>
    </div>
  );
};

export default AuthCallbackPage;
