import { useAuth } from '@/contexts/AuthContext';
import { useInsights } from '@/hooks/useInsights';
import { InsightCard } from '@/components/molecules/InsightCard/InsightCard';
import { Spinner } from '@/components/atoms/Spinner/Spinner';
import { clsx } from 'clsx';
import { Lightbulb, Zap, TrendingUp, Target, Award } from 'lucide-react';
import type { InsightCategory } from '@/types/insights.types';

const categoryLabels: Record<InsightCategory, string> = {
  productivity: 'Productivity',
  consistency: 'Consistency',
  language: 'Languages',
  collaboration: 'Collaboration',
  momentum: 'Momentum',
  streak: 'Streaks',
};

const ScoreRing = ({ score, grade }: { score: number; grade: string }) => {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 112 112">
          <circle cx="56" cy="56" r={radius} fill="none" stroke="currentColor"
            className="text-gray-100 dark:text-surface-700" strokeWidth="8" />
          <circle cx="56" cy="56" r={radius} fill="none" stroke="currentColor"
            className="text-primary-500" strokeWidth="8"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{score}</span>
          <span className="text-xs text-gray-400">/ 100</span>
        </div>
      </div>
      <div className={clsx(
        'text-2xl font-black px-3 py-0.5 rounded-lg',
        grade === 'S' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
        grade === 'A' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
        grade === 'B' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
        'bg-gray-100 dark:bg-surface-700 text-gray-500'
      )}>
        {grade}
      </div>
    </div>
  );
};

const BreakdownBar = ({
  label, value, max = 25, color,
}: { label: string; value: number; max?: number; color: string }) => (
  <div>
    <div className="flex justify-between text-xs mb-1.5">
      <span className="text-gray-500 dark:text-gray-400 font-medium">{label}</span>
      <span className="font-semibold text-gray-900 dark:text-white">{value}<span className="text-gray-400">/{max}</span></span>
    </div>
    <div className="h-2 bg-gray-100 dark:bg-surface-700 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${(value / max) * 100}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

const InsightsPage = () => {
  const { user } = useAuth();
  const { data, isLoading } = useInsights(user?.login ?? '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16 text-gray-400">
        <Lightbulb size={40} className="mx-auto mb-3 opacity-40" />
        <p>No insights available yet. Connect your GitHub account.</p>
      </div>
    );
  }

  const { insights, score } = data;
  const categories = Array.from(new Set(insights.map(i => i.category)));

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Score card */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Ring */}
          <div className="flex-shrink-0">
            <ScoreRing score={score.total} grade={score.grade} />
          </div>

          {/* Breakdown */}
          <div className="flex-1 w-full space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={18} className="text-primary-500" />
              <h2 className="font-semibold text-gray-900 dark:text-white">Productivity Score</h2>
              <span className="text-xs text-gray-400 ml-auto">
                Top {100 - score.percentile}% of developers
              </span>
            </div>
            <BreakdownBar label="Consistency" value={score.breakdown.consistency} color="#6366F1" />
            <BreakdownBar label="Volume" value={score.breakdown.volume} color="#10B981" />
            <BreakdownBar label="Language Diversity" value={score.breakdown.diversity} color="#F59E0B" />
            <BreakdownBar label="Momentum" value={score.breakdown.momentum} color="#EF4444" />
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Current Streak', value: `${data.streak.current}d`, icon: Award, color: 'text-orange-500' },
          { label: 'Longest Streak', value: `${data.streak.longest}d`, icon: Target, color: 'text-amber-500' },
          { label: 'Weekly Trend', value: `${data.weeklyTrend > 0 ? '+' : ''}${data.weeklyTrend}%`, icon: TrendingUp, color: data.weeklyTrend >= 0 ? 'text-emerald-500' : 'text-red-500' },
          { label: 'Total Insights', value: `${insights.length}`, icon: Lightbulb, color: 'text-primary-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <Icon size={20} className={clsx('flex-shrink-0', color)} />
            <div>
              <div className="font-bold text-gray-900 dark:text-white">{value}</div>
              <div className="text-xs text-gray-400">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Insights grouped by category */}
      {categories.map(cat => {
        const catInsights = insights.filter(i => i.category === cat);
        return (
          <div key={cat} className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {categoryLabels[cat] ?? cat}
            </h3>
            {catInsights.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default InsightsPage;
