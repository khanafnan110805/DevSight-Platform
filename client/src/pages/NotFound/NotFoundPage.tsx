import { Link } from 'react-router-dom';
import { Button } from '@/components/atoms/Button/Button';
import { Home } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-gray-50 dark:bg-surface-900 px-6 text-center">
    <div className="text-8xl font-black text-gray-100 dark:text-surface-700 select-none">404</div>
    <div className="-mt-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page not found</h1>
      <p className="text-gray-400 text-sm max-w-sm">
        The page you're looking for doesn't exist, or you may not have permission to view it.
      </p>
    </div>
    <Button as={Link} to="/" leftIcon={<Home size={16} />}>
      Back to home
    </Button>
  </div>
);

export default NotFoundPage;
