import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/atoms/Button/Button';
import { Github, ArrowRight } from 'lucide-react';

export const CTASection = () => {
  const { login, isAuthenticated } = useAuth();

  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="card p-12 bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 border-primary-100 dark:border-primary-800">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Start telling your developer story
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
            Connect your GitHub account in seconds. No plugin, no setup, no credit card.
          </p>
          {!isAuthenticated && (
            <Button
              onClick={login}
              size="lg"
              leftIcon={<Github size={20} />}
              rightIcon={<ArrowRight size={18} />}
            >
              Connect with GitHub — it's free
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
