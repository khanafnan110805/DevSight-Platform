import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/atoms/Button/Button';
import { Github, ArrowRight, Zap } from 'lucide-react';

export const HeroSection = () => {
  const { login, isAuthenticated } = useAuth();

  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-32">
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-semibold rounded-full mb-8 border border-primary-200 dark:border-primary-800">
          <Zap size={12} fill="currentColor" />
          GitHub Analytics & Portfolio Intelligence
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
          Your GitHub story,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-400">
            beautifully told
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          DevSight transforms raw GitHub data into a compelling professional narrative — 
          interactive analytics dashboards, contribution insights, and a shareable portfolio 
          that recruiters actually want to see.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {isAuthenticated ? (
            <Button
              as="a"
              href="/dashboard"
              size="lg"
              rightIcon={<ArrowRight size={18} />}
            >
              Go to Dashboard
            </Button>
          ) : (
            <Button
              onClick={login}
              size="lg"
              leftIcon={<Github size={18} />}
              rightIcon={<ArrowRight size={18} />}
            >
              Connect with GitHub
            </Button>
          )}
          <span className="text-sm text-gray-400">
            Free · No credit card · OAuth only
          </span>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-8 md:gap-12 mt-16 pt-8 border-t border-gray-100 dark:border-surface-700">
          {[
            { value: '50k+', label: 'Developers' },
            { value: '2M+', label: 'Repos analyzed' },
            { value: '< 3s', label: 'Dashboard load' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
