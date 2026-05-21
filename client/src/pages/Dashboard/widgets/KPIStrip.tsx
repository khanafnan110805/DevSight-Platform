import { GitCommit, GitBranch, Flame, Star, Zap } from 'lucide-react';
import { StatCard } from '@/components/molecules/StatCard/StatCard';
import type { KPIStats } from '@/types/dashboard.types';

interface KPIStripProps {
  stats: KPIStats;
  isLoading?: boolean;
}

const SkeletonCard = () => (
  <div className="card p-5 flex flex-col gap-3">
    <div className="skeleton w-10 h-10 rounded-lg" />
    <div>
      <div className="skeleton h-7 w-20 rounded mb-2" />
      <div className="skeleton h-4 w-28 rounded" />
    </div>
  </div>
);

export const KPIStrip = ({ stats, isLoading }: KPIStripProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Commits"
        value={stats.totalCommits}
        icon={<GitCommit size={20} />}
        iconBg="bg-primary-50 dark:bg-primary-900/20 text-primary-500"
      />
      <StatCard
        label="Repositories"
        value={stats.totalRepos}
        icon={<GitBranch size={20} />}
        iconBg="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500"
      />
      <StatCard
        label="Current Streak"
        value={stats.currentStreak}
        suffix=" days"
        icon={<Flame size={20} />}
        iconBg="bg-orange-50 dark:bg-orange-900/20 text-orange-500"
        subLabel={`Best: ${stats.longestStreak} days`}
      />
      <StatCard
        label="Productivity Score"
        value={stats.productivityScore}
        suffix="/100"
        icon={<Zap size={20} />}
        iconBg="bg-amber-50 dark:bg-amber-900/20 text-amber-500"
      />
    </div>
  );
};
